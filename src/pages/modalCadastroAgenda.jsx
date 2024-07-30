import { useState, useEffect } from 'react'
import Select from "react-select"
import moment from "moment"
import api from '../utils/Api'
import DatePicker from 'react-datepicker'
import { registerLocale, setDefaultLocale } from 'react-datepicker'
import { ptBR } from 'date-fns/locale'
import Swal from 'sweetalert2'
import { useAuth } from '../auth/useAuth'
import withReactContent from 'sweetalert2-react-content'
import 'react-datepicker/dist/react-datepicker.css'

const ModalCadastroAgenda = ({ toogleModal, agendamentoData, insertUpdate, updateEvents }) => {
    const [options, setOptions] = useState([])
    const [paciente, setPaciente] = useState([])
    const [agendamento, setAgendamento] = useState(agendamentoData)
    const [startDate, setStartDate] = useState(moment(agendamentoData?.start).toDate())
    const [endDate, setEndDate] = useState(moment(agendamentoData?.end).toDate())
    const { user } = useAuth()
    const id_empresa = user?.user?.foundUser?.id_empresa
    const [profissional, setProfissional] = useState()

    useEffect(() => {
        let opt = []
        paciente.map((x) => {
            opt.push({ value: x?.id_paciente, label: x.nome });
        });
        setOptions([...opt]);
    }, [paciente]);

    useEffect(() => {
        registerLocale('ptBR', ptBR)
        setDefaultLocale('ptBR')
        handleGetPacientList()
        getProfissional()
    }, [])

    const getProfissional = async () => {
        await api
            .get(`user/empresa/${id_empresa}`)
            .then((response) => {
                setProfissional([...response.data])
            })
            .catch(function (error) {
                console.error(error)
            })
    }

    const changeDate = (date) => {
        date.target.name == "start"
            ? setStartDate(date.target.value)
            : setEndDate(date.target.value)
        updateField(date)
    }

    const updateField = (e) => {
        if (typeof e?.target?.name === "undefined") return
        const fieldName = e.target.name;

        if (fieldName == "start" || fieldName == "end") {
            setAgendamento((existingValues) => ({
                ...existingValues,
                [fieldName]: moment(e.target.value).format("YYYY-MM-DD HH:mm"),
            }));

            return
        }

        fieldName == "id_paciente" && setLabel("nome", e.target.label)
        fieldName == "id_profissional" && setLabel("nome_profissional", e.target.label)

        setAgendamento((existingValues) => ({
            ...existingValues,
            [fieldName]: e.target.value,
        }))
    }

    const setLabel = (field, value) => {
        setAgendamento((existingValues) => ({
            ...existingValues,
            [field]: value,
        }))
    }

    const sendAgendaData = async () => {
        if (insertUpdate == "insert")
            await insertAgenda()
        else if (insertUpdate == "update")
            await updateAgenda()

        updateEvents()
    }

    const insertAgenda = async () => {
        agendamento.id_empresa = id_empresa
        await api
            .post("agenda", agendamento)
            .then(async function (response) {
                if (response.status === 201) {
                    toogleModal()
                }
            })
            .catch((e) => {
                alert(e);
            });
    }

    const updateAgenda = async () => {
        await api
            .put("agenda", agendamento)
            .then(function (response) {
                if (response.status === 201) {
                    alert("Salvo com sucesso")
                    toogleModal()
                }
            })
            .catch((e) => {
                console.error(e)
            });
    }

    const deleteAgendamento = async (id_agenda) => {
        await api.delete(`agenda/${id_agenda}`)
            .then(response => {
                if (response.status === 204) {
                    toogleModal()
                    updateEvents()
                    return
                }
            })
            .catch(error => {
                console.error(error)
            })
    }

    const handleGetPacientList = async () => {
        let id = id_empresa
        await api
            .get(`paciente/${id}`)
            .then((response) => {
                setPaciente([...response.data])
            })
            .catch(function (error) {
                console.error(error)
            })
    }

    const MySwal = withReactContent(Swal)
    const showSwalWithLink = (id_agenda) => {
        MySwal.fire({
            title: 'Deseja realmente excluir?',
            showDenyButton: true,
            confirmButtonText: 'Excluir',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                deleteAgendamento(id_agenda)
                Swal.fire('Excluído!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Nenhuma alteração foi realizada', '', 'info')
            }
        })
    }

    return (
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
                            onClick={toogleModal}
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
                                <label for="paciente" className="text-sm font-medium text-gray-500 dark:text-gray-300">
                                    Paciente
                                </label>
                                <Select
                                    name="paciente"
                                    id="paciente"
                                    options={options}
                                    value={{ value: agendamento?.id_paciente, label: agendamento?.nome }}
                                    placeholder="Paciente"
                                    onChange={(e) => {
                                        updateField({
                                            target: {
                                                name: "id_paciente",
                                                value: e.value,
                                                label: e.label
                                            },
                                        });
                                    }}
                                />
                            </div>
                            <div className="mb-3 flex flex-row items-center justify-center gap-2">
                                <label for="status" className="text-sm font-medium text-gray-500 dark:text-gray-300">
                                    Status
                                </label>
                                <ul
                                    className="items-center w-full text-sm font-medium text-gray-900 bg-white  rounded-lg sm:flex"
                                    name="status"
                                    onChange={updateField}
                                    id="status"
                                >
                                    <li className="w-full">
                                        <div className="flex items-center pl-3">
                                            <input
                                                id="status1"
                                                checked={agendamento?.status == 1 ? 'checked' : ''}
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
                                                checked={agendamento?.status == 2 ? 'checked' : ''}
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
                                                checked={agendamento?.status == 3 ? 'checked' : ''}
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
                                <label for="descricao" className="text-sm font-medium text-gray-500 dark:text-gray-300">
                                    Evento
                                </label>
                                <input
                                    type="text"
                                    className="relative m-0 -mr-0.5 block w-full flex-auto rounded border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none"
                                    name="descricao"
                                    value={agendamento?.descricao}
                                    id="descricao"
                                    placeholder="Evento"
                                    onChange={updateField}
                                />
                            </div>
                            <div className="mb-3">
                                <label for="profissional" className="text-sm font-medium text-gray-500 dark:text-gray-300">
                                    Profissional
                                </label>
                                <Select
                                    options={profissional}
                                    placeholder="Profissional"
                                    name="profissional"
                                    id="profissional"
                                    value={{ value: agendamento?.id_profissional, label: agendamento?.nome_profissional }}
                                    onChange={(e) => {
                                        updateField({
                                            target: {
                                                name: "id_profissional",
                                                value: e.value,
                                                label: e.label
                                            },
                                        });
                                    }}
                                />
                            </div>
                            <div className="mb-3 flex flex-row gap-1">
                                <div
                                    class=""
                                    data-te-date-timepicker-init
                                    data-te-input-wrapper-init
                                >
                                    <label
                                        for="start"
                                        className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-300"
                                    >
                                        Data e hora início
                                    </label>
                                    <DatePicker
                                        selected={startDate}
                                        name="start"
                                        id="start"
                                        onChange={(e) =>
                                            changeDate(
                                                {
                                                    target: {
                                                        value: e,
                                                        name: 'start'
                                                    }
                                                }
                                            )}
                                        timeIntervals={15}
                                        showTimeSelect
                                        dateFormat="dd/MM/YYYY HH:mm"
                                        // locale="ptBR"
                                        dateFormat={["Pp", "P"]}
                                    />
                                </div>

                                <div
                                    className="relative mb-3"
                                    data-te-date-timepicker-init
                                    data-te-input-wrapper-init
                                >
                                    <label
                                        for="end"
                                        className="ml-2 text-sm font-medium text-gray-500 dark:text-gray-300"
                                    >
                                        Data e hora final
                                    </label>
                                    <DatePicker
                                        selected={endDate}
                                        name="end"
                                        id="end"
                                        onChange={(e) =>
                                            changeDate(
                                                {
                                                    target: {
                                                        value: e,
                                                        name: 'end'
                                                    }
                                                }
                                            )}
                                        showTimeSelect
                                        timeIntervals={15}
                                        dateFormat="dd/MM/YYYY HH:mm"
                                        // locale="ptBR"
                                        dateFormat={["Pp", "P"]}
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label for="message-text" className="text-sm font-medium text-gray-500 dark:text-gray-300">
                                    Observação
                                </label>
                                <textarea
                                    className="relative m-0 -mr-0.5 block w-full flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-400 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                                    id="message-text"
                                    value={agendamento?.obs}
                                    placeholder="Observações"
                                    onChange={updateField}
                                    name="obs"
                                ></textarea>
                            </div>
                        </form>
                    </div>
                    <div className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                        {agendamento?.id &&
                            <button
                                type="button"
                                className="inline-block rounded bg-red-500 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white transition duration-150 ease-in-out hover:bg-red-accent-100 focus:bg-red-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
                                data-te-modal-dismiss
                                data-te-ripple-init
                                data-te-ripple-color="light"
                                onClick={() => showSwalWithLink(agendamento?.id)}
                            >
                                Excluir
                            </button>
                        }
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
    )
}

export default ModalCadastroAgenda
