import React, { useRef, useEffect, useState } from "react";
import { Calendar } from "@fullcalendar/core";
import ptBr from "@fullcalendar/core/locales/pt-br";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import api from "../utils/Api";
import Cookies from "js-cookie";
import Select from "react-select";
import moment from "moment";

const FullCalendar = () => {
  const calendarRef = useRef(null);
  const [paciente, setPaciente] = useState([]);
  const [token, setToken] = useState(Cookies.get("token"));
  const [modal, setModal] = useState(false);
  const [options, setOptions] = useState([]);
  const [agenda, setAgenda] = useState([]);
  const [agendamento, setAgendamento] = useState({
    id_empresa: 1,
    status: 3,
    dia_inteiro: false,
  });

  const authHeader = () => {
    return {
      headers: {
        Authorization: "Bearer " + token,
      },
    };
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

  const sendAgendaData = () => {
    api
      .post("agenda", agendamento)
      .then(function (response) {
        if (response.status === 201) {
          alert("Salvo com sucesso");
          setModal(false);
        }
      })
      .catch((e) => {
        alert(e);
      });
  };

  // useEffect(() => {
  const getAgenda = async () => {
    
    await api
      .get("agenda")
      .then((response) => {
        //setAgenda([...agenda, ...response.data])

        let temp = response.data.map((e) => {
          return {
            title: e.descricao,
            start: moment(e.start_date_time).format("YYYY-MM-DDThh:mm:ss"),
            end: moment(e.end_date_time).format("YYYY-MM-DDThh:mm:ss"),
            allDay: false,
          };
        });
        
        setAgenda(temp);
        // return temp
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  //     getAgenda()
  // }, []);

  useEffect(() => {
    let testet = [];
    paciente.map((x) => {
      // return x.nome
      testet.push({ value: x.id_paciente, label: x.nome });
    });
    setOptions([...testet]);
    
  }, [paciente]);

  const handleGetPacientList = async () => {
    await api
      .get("paciente")
      .then((response) => {
        
        setPaciente([...response.data]);

        // let testet = []
        // paciente.map(x => {
        //     // return x.nome
        //     testet.push({ value: x.id_paciente, label: x.nome })
        // })
        // setOptions([...testet])
        // 
      })
      .catch(function (error) {
        console.error(error);
      });
  };

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

    const calendar = new Calendar(calendarRef.current, {
      locales: [ptBr],
      locale: "pt-br",
      plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
      initialView: "timeGridWeek",
      selectable: true,
      headerToolbar: {
        left: "prev,next,today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      navLinks: true, // can click day/week names to navigate views
      selectable: true,
      selectMirror: true,
      editable: true,
      dayMaxEvents: true,

      events: getAgenda(),
      

      // dateClick: function (info) {
      //     alert('Clicked on: ' + info.dateStr);
      //     alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
      //     alert('Current view: ' + info.view.type);
      //     // change the day's background color just for fun
      //     info.dayEl.style.backgroundColor = 'red';

      // },

      // //Create new event
      select: async function (info) {
        updateField({
          target: {
            name: "start_date_time",
            value: moment(info.startStr).format("DD MM YYYY, h:mm:ss a"),
          },
        });
        updateField({
          target: {
            name: "end_date_time",
            value: moment(info.endStr).format("DD MM YYYY, h:mm:ss a"),
          },
        });
        setModal(true);
        handleGetPacientList();
        info.jsEvent;
      },



      // // Delete event
      // eventClick: async function (arg) {

      //     const { value: formValues } = await Swal.fire({
      //         title: 'Multiple inputs',
      //         html:
      //             '<input id="swal-input1" className="swal2-input">' +
      //             '<input id="swal-input2" className="swal2-input">',
      //         focusConfirm: false,
      //         preConfirm: () => {
      //             return [
      //                 document.getElementById('swal-input1').value,
      //                 document.getElementById('swal-input2').value
      //             ]
      //         }
      //     })

      //     if (formValues) {
      //         Swal.fire(JSON.stringify(formValues))
      //     }

      //     // Swal.fire({
      //     //     text: "Are you sure you want to delete this event?",
      //     //     icon: "warning",
      //     //     showCancelButton: true,
      //     //     buttonsStyling: false,
      //     //     confirmButtonText: "Yes, delete it!",
      //     //     cancelButtonText: "No, return",
      //     //     customClass: {
      //     //         confirmButton: "btn btn-primary",
      //     //         cancelButton: "btn btn-active-light"
      //     //     }
      //     // }).then(function (result) {
      //     //     if (result.value) {
      //     //         arg.event.remove()
      //     //     } else if (result.dismiss === "cancel") {
      //     //         Swal.fire({
      //     //             text: "Event was not deleted!.",
      //     //             icon: "error",
      //     //             buttonsStyling: false,
      //     //             confirmButtonText: "Ok, got it!",
      //     //             customClass: {
      //     //                 confirmButton: "btn btn-primary",
      //     //             }
      //     //         });
      //     //     }
      //     // });
      // },

      eventTimeFormat: {
        // like '14:30:00'
        hour: "2-digit",
        minute: "2-digit",
        // second: '0-digit',
        meridiem: false,
      },
    });
    setTimeout(() => {
      agenda.map((e) => {
        
        calendar.addEvent({
          title: e.title,
          start: new Date(e.start),
          end: new Date(e.end),
          allDay: false,
        });
      });

      calendar.render();
    }, 1000);
  }, [paciente]);

  return (
    <>
      <div ref={calendarRef}></div>
      {modal && (
        <div
          data-te-modal-init
          className="fixed left-0 top-0 z-[1055] block h-full w-full overflow-y-auto overflow-x-hidden outline-none bg-black/[.8]"
          id="exampleModalVarying"
          tabindex="-1"
          aria-labelledby="exampleModalVaryingLabel"
        >
          <div
            data-te-modal-dialog-ref
            className=" pointer-events-none relative w-auto opacity-100 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:my-7 min-[576px]:max-w-[500px]"
          >
            <div className=" block min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600">
              <div className="bg-purple-600 flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                <h5
                  className="text-white text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200"
                  id="exampleModalVaryingLabel"
                >
                  Editar Evento
                </h5>
                <button
                  type="button"
                  className="text-white box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                  data-te-modal-dismiss
                  aria-label="Close"
                  onClick={() => setModal(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <div className="relative flex-auto p-4" data-te-modal-body-ref>
                <form>
                  <div className="mb-3">
                    <Select
                      name="paciente"
                      options={options}
                      placeholder="Paciente"
                      onChange={(e) => {
                        updateField({
                          target: {
                            name: "id_paciente",
                            value: e.value,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="mb-3 flex flex-row items-center justify-center gap-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-300">
                      Status
                    </h3>
                    <ul
                      className="items-center w-full text-sm font-medium text-gray-900 bg-white  rounded-lg sm:flex"
                      name="status"
                      onChange={updateField}
                    >
                      <li className="w-full">
                        <div className="flex items-center pl-3">
                          <input
                            id="status1"
                            type="radio"
                            value="1"
                            name="status"
                            className="w-4 h-4"
                          />
                          <label
                            for="status1"
                            className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            Confirmado{" "}
                          </label>
                        </div>
                      </li>
                      <li className="w-full">
                        <div className="flex items-center pl-3">
                          <input
                            id="status2"
                            type="radio"
                            value="2"
                            name="status"
                            className="w-4 h-4"
                          />
                          <label
                            for="status2"
                            className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            Cancelado
                          </label>
                        </div>
                      </li>
                      <li className="w-full">
                        <div className="flex items-center pl-3">
                          <input
                            id="status3"
                            checked="checked"
                            type="radio"
                            value="3"
                            name="status"
                            className="w-4 h-4"
                          />
                          <label
                            for="status3"
                            className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                          >
                            Pendente
                          </label>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="relative m-0 -mr-0.5 block w-full flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none"
                      name="descricao"
                      id="recipient-name"
                      placeholder="Evento"
                      onChange={updateField}
                    />
                  </div>
                  <div className="mb-3">
                    <Select
                      options={options}
                      placeholder="Dentista"
                      name="dentista"
                      onChange={(e) => {
                        updateField({
                          target: {
                            name: "id_profissional",
                            value: e.value,
                          },
                        });
                      }}
                    />
                  </div>
                  <div className="mb-3 flex flex-row gap-1">
                    <div
                      class="relative mb-3"
                      data-te-date-timepicker-init
                      data-te-input-wrapper-init
                    >
                      <input
                        type="text"
                        class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear"
                        id="form1"
                        value={agendamento.start_date_time}
                        name="start_date_time"
                        onChange={updateField}
                      />
                      <label
                        for="form1"
                        class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                      >
                        Data e hora início
                      </label>
                    </div>

                    <div
                      class="relative mb-3"
                      data-te-date-timepicker-init
                      data-te-input-wrapper-init
                    >
                      <input
                        type="text"
                        class="peer block min-h-[auto] w-full rounded border-0 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear"
                        id="form2"
                        name="end_date_time"
                        value={agendamento.end_date_time}
                        onChange={updateField}
                      />
                      <label
                        for="form2"
                        class="pointer-events-none absolute left-3 top-0 mb-0 max-w-[90%] origin-[0_0] truncate pt-[0.37rem] leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:-translate-y-[0.9rem] peer-focus:scale-[0.8] peer-focus:text-primary peer-data-[te-input-state-active]:-translate-y-[0.9rem] peer-data-[te-input-state-active]:scale-[0.8] motion-reduce:transition-none dark:text-neutral-200 dark:peer-focus:text-primary"
                      >
                        Data e hora final
                      </label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center mb-4">
                      <input
                        onChange={updateField}
                        name="dia_inteiro"
                        id="default-checkbox"
                        type="checkbox"
                        value=""
                        className="w-4 h-4 rounded"
                      />
                      <label
                        for="default-checkbox"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Dia inteiro
                      </label>
                    </div>
                  </div>
                  <div className="mb-3">
                    <textarea
                      className="relative m-0 -mr-0.5 block w-full flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-400 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                      id="message-text"
                      placeholder="Observações"
                      onChange={updateField}
                      name="obs"
                    ></textarea>
                  </div>
                </form>
              </div>
              <div className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                <button
                  type="button"
                  className="inline-block rounded bg-purple-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                  data-te-modal-dismiss
                  data-te-ripple-init
                  data-te-ripple-color="light"
                  onClick={() => setModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="ml-1 inline-block rounded bg-purple-600 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                  data-te-ripple-init
                  data-te-ripple-color="light"
                  onClick={sendAgendaData}
                >
                  Salvar Agendamento
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FullCalendar;

