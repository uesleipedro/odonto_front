import { useMemo } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import ptBr from "@fullcalendar/core/locales/pt-br"
import moment from "moment"
import Select from "react-select"
import { useEffect, useState } from "react"
import api from "../../utils/Api"
import ModalCadastroAgenda from "./modalCadastroAgenda"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useAuth } from "../../auth/useAuth"

const RenderCalendar = ({ events, updateEvents }) => {
  let { user } = useAuth()
  user = user?.user?.foundUser
  const [modal, setModal] = useState(false)
  const [paciente, setPaciente] = useState([])
  const [searchVal, setSearchVal] = useState({})
  const [insertUpdate, setInsertUpdate] = useState('')
  const payload = {
    id_empresa: user.id_empresa,
    status: 3,
    dia_inteiro: false,
  }
  const [agendamento, setAgendamento] = useState(payload)
  const [listaProfissionais, setListaProfissionais] = useState()

  useEffect(() => {
    const init = async () => {
      const { Modal, Ripple, Datepicker, Input, Datetimepicker, initTE } =
        await import("tw-elements")
      initTE({
        Modal,
        Ripple,
        Datepicker,
        Input,
        Datetimepicker,
      })
    }
    init()
  }, [])

  useEffect(() => {
    if(!user.acessa_todas_agendas){
      setSearchVal({
        value: user.id_user,
        label: ""
      })
      setListaProfissionais([{id_profissional: user.id_user, nome_profissional: user?.nome}])
      return
    }

    setSearchVal({
      value: 0,
      label: "Todos"
    })

    let arr = events
    arr.splice(0, 1)
    arr.unshift({ id_profissional: 0, nome_profissional: "Todos" })
    setListaProfissionais(arr)
  }, [events])

  const limparAgendamento = () => {
    setAgendamento(payload)
  }

  const setProfissional = (e) => {
    setSearchVal({
      value: e.id_profissional,
      label: e.nome_profissional
    })
  }

  const filteredEvents = useMemo(() => {
    if (searchVal.value === 0 || searchVal.value === undefined) {
      return events
    }

    return events.filter(dataItem => {
      return dataItem.id_profissional === searchVal?.value
    })
  }, [events, searchVal])

  const updateDataHora = async (agendamento) => {
    await api
      .put("agenda/updateDataHora", agendamento)
      .then(async function (response) {
        if (response.status === 201) {
          await updateEvents()
        }
      })
      .catch((e) => {
        console.error(e)
      })
  }

  const handleSelect = (info) => {
    limparAgendamento()

    updateField({
      target: {
        name: "start",
        value: moment(info.startStr).format("YYYY-MM-DD HH:mm"),
      },
    });
    updateField({
      target: {
        name: "end",
        value: moment(info.endStr).format("YYYY-MM-DD HH:mm"),
      },
    });
    setInsertUpdate('insert')
    setModal(true)
  }

  const updateField = (e) => {
    if (typeof e?.target?.name === "undefined") return

    const fieldName = e.target.name;
    setAgendamento((existingValues) => ({
      ...existingValues,
      [fieldName]: e.target.value,
    }))

  }

  const filterEventsById = (list, id) => {
    return list[list?.findIndex((obj) => obj?.id == id)];
  }

  const handleEventClick = async (data) => {
    const todosOsEventos = await events.flatMap(obj => obj.events);

    setAgendamento(filterEventsById(todosOsEventos, data.event.id))
    setInsertUpdate('update')
    setModal(true)
    await updateEvents()
  }

  const handleEventDrop = async (info) => {
    const { event } = info
    updateDataHora({
      id_agenda: info.event.id,
      start: moment(event.start).format("YYYY-MM-DD HH:mm"),
      end: moment(event.end).format("YYYY-MM-DD HH:mm")
    })
  }

  const toogleModal = () => {
    setModal(!modal)
  }

  const MySwal = withReactContent(Swal)
  const alteraData = (info) => {

    MySwal.fire({
      title: 'Atenção!',
      text: `O agendamento será alterado para \n 
              Início: (${moment(info.event.start).format('DD/MM/YYYY, HH:mm')}),  
              Final: (${moment(info.event.end).format('DD/MM/YYYY, HH:mm')})
            `,
      showDenyButton: true,
      confirmButtonText: 'Alterar',
      denyButtonText: `Cancelar`,
    }).then((result) => {
      if (result.isConfirmed) {
        handleEventDrop(info)
        Swal.fire('Alterado!', '', 'success')
      } else if (result.isDenied) {
        updateEvents()
        Swal.fire('Nenhuma alteração foi realizada', '', 'info')
      }
    })
  }

  const SelectProfissional = () => {
    return (
      <div className="m-3 w-full flex flex-wrapp flex-row justify-start">
        <div className="basis-2/4">
          <label for="paciente" className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Profissional
          </label>
          <Select
            styles={{
              menu: provided => ({ ...provided, zIndex: 9999 })
            }}
            name="profissional"
            id="profissional"
            getOptionLabel={option => option.nome_profissional}
            getOptionValue={option => option.id_profissional}
            options={listaProfissionais}
            value={{ id_profissional: searchVal?.value, nome_profissional: searchVal?.label }}
            placeholder="Profissional"
            onChange={(e) => setProfissional(e)}
          />
        </div>
        <div className="pl-2 pt-5">
          <button
            className="rounded-full bg-success w-10 h-10 text-white text-bold "
            onClick={() => {
              handleSelect({
                info: {
                  startStr: new Date,
                  endStr: new Date
                }
              })
            }
            }>+</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <SelectProfissional />
      <div className="z-0">
        <FullCalendar
          locales={[ptBr]}
          locale="pt-br"
          plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,today,next",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          selectable
          editable
          eventSources={filteredEvents}
          select={handleSelect}
          eventClick={handleEventClick}
          eventDrop={alteraData}
          eventResize={alteraData}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            meridiem: false,
            hour12: false
          }}
        />

        {modal && (
          <ModalCadastroAgenda
            paciente={paciente}
            toogleModal={() => toogleModal()}
            agendamentoData={agendamento}
            insertUpdate={insertUpdate}
            updateEvents={updateEvents}
          />

        )}
      </div>
    </div>
  )
}

export default RenderCalendar

