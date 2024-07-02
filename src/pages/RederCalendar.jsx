import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import ptBr from "@fullcalendar/core/locales/pt-br";
import moment from "moment";
import { useEffect, useState } from "react";
import api from "../utils/Api";
import ModalCadastroAgenda from "./modalCadastroAgenda";

const RenderCalendar = () => {
  const [events, setEvents] = useState([]);
  const [modal, setModal] = useState(false);
  const [paciente, setPaciente] = useState([]);
  const [agendamento, setAgendamento] = useState({
    id_empresa: 1,
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

    const getEvents = async () => {
      await api
        .get("agenda")
        .then((response) => {
          setEvents([events, ...response.data]);
        })
        .catch(function (error) {
          console.error(error);
        });
    };

    setTimeout(() => {
      getEvents();
    }, 500);
  }, []);

  const deleteAgendamento = () => {
    setAgendamento({
      id_empresa: 1,
      status: 3,
      dia_inteiro: false,
    })
  }

  const handleSelect = (info) => {
    deleteAgendamento()

    updateField({
      target: {
        name: "start_date_time",
        value: moment(info.startStr).format("YYYY-MM-DD hh:mm:ss"),
      },
    });
    updateField({
      target: {
        name: "end_date_time",
        value: moment(info.endStr).format("YYYY-MM-DD hh:mm:ss"),
      },
    });
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

  const eventClickAction = (data) => {
    setAgendamento(filterEventsById(events, data.event.id))
    setModal(true)

  }

  const toogleModal = () => {
    setModal(!modal)
  }

  return (
    <>
      <FullCalendar
        locales={[ptBr]}
        locale="pt-br"
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next,today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        selectable
        editable
        events={events}
        select={handleSelect}
        eventClick={eventClickAction}
      />

      {modal && (
        <ModalCadastroAgenda
          paciente={paciente}
          toogleModal={() => toogleModal()}
          agendamentoData={agendamento}

        />
      )}
    </>
  );
};

export default RenderCalendar;

