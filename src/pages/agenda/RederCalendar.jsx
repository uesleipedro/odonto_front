import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import ptBr from "@fullcalendar/core/locales/pt-br"
import moment from "moment"
import { useEffect, useState } from "react"
import api from "../../utils/Api"
import ModalCadastroAgenda from "./modalCadastroAgenda"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { useAuth } from "../../auth/useAuth" 

const RenderCalendar = ({ events, updateEvents }) => {
  const { user } = useAuth()
  const id_empresa = user?.user?.foundUser.id_empresa
  const [modal, setModal] = useState(false);
  const [paciente, setPaciente] = useState([]);
  const [insertUpdate, setInsertUpdate] = useState('')
  const [agendamento, setAgendamento] = useState({
    id_empresa,
    status: 3,
    dia_inteiro: false,
  });

  useEffect(() => {
    const init = async () => {
      const { Modal, Ripple, Datepicker, Input, Datetimepicker, initTE } =
        await import("tw-elements");
      initTE({
        Modal,
        Ripple,
        Datepicker,
        Input,
        Datetimepicker,
      });
    };
    init();
  }, [])

  const limparAgendamento = () => {
    setAgendamento({
      id_empresa,
      status: 3,
      dia_inteiro: false,
    })
  }

  const updateDataHora = async (agendamento) => {
    await api
      .put("agenda/updateDataHora", agendamento)
      .then(async function (response) {
        if (response.status === 201) {
          await updateEvents()
        }
      })
      .catch((e) => {
        console.error(e);
      });
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
    setModal(true);
    info.jsEvent;
  };

  const updateField = (e) => {
    if (typeof e?.target?.name === "undefined") return;

    if (e.target.name === "dia_inteiro") {
      let check = e.target.checked ? true : false;

      setAgendamento((existingValues) => ({
        ...existingValues,
        ["dia_inteiro"]: check,
      }));

      return;
    }

    const fieldName = e.target.name;
    setAgendamento((existingValues) => ({
      ...existingValues,
      [fieldName]: e.target.value,
    }));

  };

  const filterEventsById = (list, id) => {
    return list[list.findIndex((obj) => obj.id == id)];
  }

  const eventClickAction = async (data) => {
    await setAgendamento(filterEventsById(events, data.event.id))
    await setInsertUpdate('update')
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

  return (
    <div>
      <FullCalendar
        locales={[ptBr]}
        locale="pt-br"
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,today,next",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        selectable
        editable
        // events={events}
        eventSources={[
          {
            events,
            color: '#7c3aed', // Cor da agenda de trabalho (azul)
            textColor: '#ffffff', // Cor do texto
          }
        ]}
        select={handleSelect}
        eventClick={eventClickAction}
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
  );
};

export default RenderCalendar;

