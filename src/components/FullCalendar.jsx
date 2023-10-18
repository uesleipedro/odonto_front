import React, { useRef, useEffect, useState } from 'react';
import { Calendar } from '@fullcalendar/core';
import ptBr from '@fullcalendar/core/locales/pt-br';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import Swal from 'sweetalert2'
import api from '../utils/Api';
import Cookies from "js-cookie"


const FullCalendar = () => {

    const calendarRef = useRef(null);
    const [paciente, setPaciente] = useState([])
    const [token, setToken] = useState(Cookies.get("token"))
    const [options, setOptions] = useState('')


    const authHeader = () => {
        return {
            headers: {
                Authorization: "Bearer " + token,
            },
        };
    };

    const handleGetPacientList = async () => {
        await api.get('paciente', authHeader()
        )
            .then(response => {
                setPaciente([...response.data])
            })
            .catch(function (error) {
                console.error(error);
            })
    }

    useEffect(() => {
        // setToken(Cookies.get("user") ? JSON.parse(?.token) : null)
    })

    useEffect(() => {
        console.log(token)
        handleGetPacientList()
    }, [token])

    useEffect(() => {

    }, [paciente])

    useEffect(() => {

        const calendar = new Calendar(calendarRef.current, {
            locales: [ptBr],
            locale: 'pt-br',
            plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
            initialView: 'dayGridMonth',
            selectable: true,
            headerToolbar: {
                left: "prev,next,today",
                center: "title",
                right: "dayGridMonth,timeGridDay"
            },
            navLinks: true, // can click day/week names to navigate views
            selectable: true,
            selectMirror: true,
            editable: true,
            dayMaxEvents: true,

            // //Create new event
            select: async function (arg) {
                Swal.fire({
                    html: `
                    <input id="nome" name="nome" class="swal2-input" placeholder="Nome" />
                    <select name="cars" id="cars" class="swal2-input" >
                        ${paciente.map((data) => (
                        `<option value="">${data.nome}</option>`
                    ))}        
                    </select>`,
                    //icon: "info",
                    showCancelButton: true,
                    buttonsStyling: true,
                    confirmButtonText: "Criar agenda",
                    cancelButtonText: "Cancelar",
                }).then(function (result) {
                    if (result.value) {
                        let title = document.getElementById('nome').value;
                        if (title) {
                            calendar.addEvent({
                                title: title,
                                start: arg.start,
                                end: arg.end,
                                allDay: arg.allDay
                            })

                            const data = {
                                id_empresa: 1,
                                id_paciente: 1,
                                id_profissional: 1,
                                obs: "asdf",
                                id_metodo_pagamento: 1,
                                total_pagamento_servico: 100.0,
                                desconto: 10.0,
                                status: 1
                            }
                        }
                        calendar.unselect()
                    } else if (result.dismiss === "cancel") {
                        Swal.fire({
                            text: "Nenhuma alteração foi realizada",
                            icon: "error",
                            buttonsStyling: true,
                            confirmButtonText: "Ok",
                        });
                    }
                });
            },

            // // Delete event
            // eventClick: async function (arg) {

            //     const { value: formValues } = await Swal.fire({
            //         title: 'Multiple inputs',
            //         html:
            //             '<input id="swal-input1" class="swal2-input">' +
            //             '<input id="swal-input2" class="swal2-input">',
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
            events: [
                {
                    title: 'Antônio',
                    date: '2023-10-28',
                    extendedProps: {
                        department: 'BioChemistry'
                    },
                    description: 'Lecture'
                },
                { title: 'Eduardo', date: '2023-10-09' },
                { title: 'Maria', date: '2023-10-09' },
                { title: 'Estevam', date: '2023-10-09' }
            ]
        });

        calendar.render();
    }, [paciente]);

    return (
        <div ref={calendarRef}></div>
    );
};

export default FullCalendar;