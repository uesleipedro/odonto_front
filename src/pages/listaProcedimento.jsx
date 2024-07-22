import React, { useEffect, useState, useContext } from "react"
import { FaTrashAlt } from "react-icons/fa"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import api from "../utils/Api"
import { useAuth } from "../auth/useAuth"
import { FichaClinicaContext } from "../context/FichaClinicaContext"
import { moneyMask, toDecimalNumeric, formatarMoedaBRL } from "../utils/mask"
import moment from 'moment'
import Select from 'react-select'
import { useRouter } from 'next/router'
import Toast from '../components/Toast'
import LoadingOverlay from '../components/LoadingOverlay'

const ListaProcedimento = ({ id_paciente }) => {
    const router = useRouter()
    const { procedimento, loading, getProcedimentoList } = useContext(FichaClinicaContext)
    const [procedimentoList, setProcedimentoList] = useState([])
    const [facesDente, setFacesDente] = useState([])
    const [toggleInsertUpdate, setToggleInsertUpdate] = useState('insert')
    const [preco, setPreco] = useState("0")
    const [modal, setModal] = useState(false)
    const [post, setPost] = useState({})
    const [options, setOptions] = useState([])
    const [showToast, setShowToast] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { user } = useAuth()
    const id_empresa = user?.user?.foundUser.id_empresa
    const [profissional, setProfissional] = useState([
        {
            value: 1,
            label: "Dr. Roberto"
        },
        {
            value: 2,
            label: "Dra. Marcela"
        }
    ])

    useEffect(() => {
        const getDentes = async () => {
            await api.get('dentes')
                .then(response => {
                    setOptions([...options, ...response.data])
                })
                .catch(function (error) {
                    console.error(error);
                })
        }

        listaProcedimento()
        getDentes()
        getSetFacesDente(post?.dente)
    }, [])

    const listaProcedimento = async () => {
        await api.get('procedimento_list')
            .then(response => {
                setProcedimentoList([...procedimentoList, ...response.data])
            })
            .catch(function (error) {
                console.error(error);
            })
    }

    const getSetFacesDente = (dente) => {
        api.get(`faceDente/${dente}`)
            .then(response => {
                setFacesDente([...response.data])
            })
            .catch(function (error) {
                console.error(error);
            })

    }

    const updateProcedimento = async (id_procedimento) => {
        let procedimentoFiltrado = procedimento.filter(dataItem => dataItem.id_procedimento === id_procedimento)
        setPost(procedimentoFiltrado[0])
        getSetFacesDente(procedimentoFiltrado[0]?.dente)
        setModal(true)
        getProcedimentoList()
    }

    const updateField = e => {

        if (typeof e?.target?.name === 'undefined')
            return

        let fieldName = e.target.name
        if (fieldName.slice(0, -1) === "face_dente") {
            let faces = post.face_dente
            let face = fieldName.slice(-1)
            const { name, checked } = event.target;

            checked ? faces += face : faces = faces.replace(face, '');
            setPost(prevState => ({
                ...prevState,
                ["face_dente"]: faces,
            }));

            return
        }

        if (e.target.name === "preco") {
            let preco = String(e.target.value).replace("R$ ", "").replace(",", ".");

            setPost(existingValues => ({
                ...existingValues,
                ...{ ["preco"]: parseFloat(e.target.value) },
            }))
        }

        setPost(existingValues => ({
            ...existingValues,
            [fieldName]: e.target.value,
        }))
    }


    const handleDeleteProcedimento = async (id_procedimento) => {
        await api.delete(`procedimento/${id_procedimento}`)
            .then(response => {
                if (response.status === 204)
                    return
            })
            .catch(error => {
                console.error(error);
            })
        await getProcedimentoList()
    }

    const sendProcedimentoData = async () => {
        let dados = post
        dados.preco = Number(toDecimalNumeric(post.preco))
        dados.id_empresa = id_empresa

        switch (toggleInsertUpdate) {
            case 'insert':
                api.post('procedimento', dados)
                    .catch(e => {
                        alert(e)
                    })

            case 'update':
                api.put('procedimento', dados)
                    .then(async function (response) {
                        if (response.status === 201) {
                        }
                    })
                    .catch(e => {
                        alert(e)
                    })
        }
        setModal(false)
        setIsLoading(true)
        await getProcedimentoList()
        setIsLoading(false)
        setShowToast(true)

    }

    const getLabelSelect = (arr, id) => {
        if (!arr || !id) return

        let a = arr.filter(dataItem => dataItem.value === id)
        console.log('filter:', a)
        return a[0].label
    }


    const MySwal = withReactContent(Swal)
    const showSwalWithLink = (id_procedimento) => {
        MySwal.fire({
            title: 'Deseja realmente excluir?',
            showDenyButton: true,
            confirmButtonText: 'Excluir',
            denyButtonText: `Cancelar`,
        }).then((result) => {
            if (result.isConfirmed) {
                handleDeleteProcedimento(id_procedimento)
                Swal.fire('Excluído!', '', 'success')
            } else if (result.isDenied) {
                Swal.fire('Nenhuma alteração foi realizada', '', 'info')
            }
        })
    }


    return (
        <div className=" p-5  rounded-lg shadow-lg">
            <div className="mb-5 flex flex-row flex-wrap w-full justify-between items-center">
                <button onClick={() => {
                    setPost({
                        face_dente: '',
                        estado: 'A realizar',
                        adicionado: moment(Date()).format('YYYY-MM-DD'),
                        id_paciente: Number(id_paciente),
                        preco: "R$ 0,00"
                    })
                    setToggleInsertUpdate('insert')
                    setModal(true)
                }} className="bg-purple-800 hover:bg-purple-500 rounded-lg p-2 text-white font-bold">
                    Novo procedimento
                </button>

            </div>

            <div className="flex flex-col">
                <div className="-m-1.5 overflow-x-auto">
                    <div className="p-1.5 min-w-full inline-block align-middle">
                        <div className="border rounded-lg shadow overflow-hidden">
                            <table className="min-w-full">
                                <thead className="bg-purple-800 dark:bg-purple-700">
                                    <tr className="text-white text-left font-medium">
                                        <th scope="col" className="px-6 py-3">Adicionado</th>
                                        <th scope="col" className="px-6 py-3 ">Dente</th>
                                        <th scope="col" className="px-6 py-3">Status</th>
                                        <th scope="col" className="px-6 py-3">Procedimento</th>
                                        <th scope="col" className="px-6 py-3">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {loading ? <p>Loading...</p> : procedimento?.map((data) => (
                                        <tr key={data.id_procedimento} className="cursor-pointer">
                                            <td onClick={() => {
                                                setToggleInsertUpdate('update')
                                                updateProcedimento(data.id_procedimento)
                                            }}
                                                className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{moment(data.adicionado).format('DD/MM/YYYY')}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data.dente}{data.face_dente}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data.estado}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-900 font-bold">{data.procedimento}</td>
                                            <td className="flex flex-row gap-3 px-6 py-4 whitespace-nowrap text-right text-md font-medium">
                                                <a className="text-purple-800 hover:text-purple-900" href="#"
                                                    onClick={() => showSwalWithLink(data.id_procedimento)}
                                                >
                                                    <FaTrashAlt />
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <Toast
                    message="Procedimento salvo com sucesso!"
                    show={showToast}
                    onClose={() => setShowToast(false)}
                />

                <LoadingOverlay isLoading={isLoading} />
            </div>
            {modal &&
                <div
                    data-te-modal-init
                    className="fixed left-0 top-0 z-[1055] block h-full w-full overflow-y-auto overflow-x-hidden outline-none bg-black/[.8]"
                    id="exampleModalVarying"
                    tabindex="-1"
                    aria-labelledby="exampleModalVaryingLabel"
                >
                    <div
                        data-te-modal-dialog-ref
                        className=" pointer-events-none relative w-auto opacity-100 transition-all duration-300 ease-in-out min-[576px]:mx-auto min-[576px]:my-7 min-[576px]:max-w-[500px]">
                        <div
                            className=" block min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600">
                            <div
                                className="bg-purple-600 flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
                                <h5
                                    className="text-white text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200"
                                    id="exampleModalVaryingLabel">
                                    Procedimento
                                </h5>
                                <button
                                    type="button"
                                    className="text-white box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
                                    data-te-modal-dismiss
                                    aria-label="Close"
                                    onClick={() => setModal(false)}>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="currentColor"
                                        className="h-6 w-6">
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <div className="relative flex-auto p-4" data-te-modal-body-ref>
                                <form>
                                    <div className="mb-3">
                                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Procedimento</h3>
                                        <Select
                                            name="id_procedimento_list"
                                            options={procedimentoList}
                                            placeholder="Procedimento"
                                            value={{ value: post.id_procedimento_list, label: getLabelSelect(procedimentoList, post.id_procedimento_list) }}
                                            onChange={(e) => {
                                                updateField({
                                                    target: {
                                                        name: 'id_procedimento_list',
                                                        value: e.value
                                                    }
                                                })
                                            }}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Dente</h3>
                                        <Select
                                            options={options}
                                            placeholder="Dente"
                                            name="dente"
                                            value={{ value: post.dente, label: post.dente }}
                                            onChange={(e) => {
                                                updateField({
                                                    target: {
                                                        name: 'dente',
                                                        value: e.value
                                                    }
                                                })
                                                getSetFacesDente(e.value)
                                            }}
                                        />
                                    </div>

                                    <div className="mb-3 flex flex-row text-bold gap-2">
                                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Faces do dente</h3>
                                        <div className="flex flex-row items-center mb-4 gap-5">

                                            {facesDente.map((data) => (
                                                < div className="flex items-center gap-1 " >
                                                    <label for="default-checkbox" className="ml-2 text-sm font-medium text-gray-900 text-bold dark:text-gray-300">{data.face}</label>
                                                    <input onChange={updateField} name={"face_dente" + data.face} defaultChecked={post.face_dente.includes(data.face)} type="checkbox" className="w-4 h-4 rounded" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="mb-3 flex flex-row items-center justify-center gap-2">
                                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Estado</h3>
                                        <ul className="items-center w-full text-sm font-medium text-gray-900 bg-white  rounded-lg sm:flex"
                                            name="estado"
                                            onChange={updateField}
                                        >
                                            <li className="w-full">
                                                <div className="flex items-center pl-3">
                                                    <input
                                                        id="estado1"
                                                        type="radio"
                                                        value="Pré-existente"
                                                        checked={post?.estado == "Pré-existente" ? 'checked' : ''}
                                                        name="estado"
                                                        className="w-4 h-4"
                                                    />
                                                    <label for="estado1" className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Pré-existente </label>
                                                </div>
                                            </li>
                                            <li className="w-full">
                                                <div className="flex items-center pl-3">
                                                    <input
                                                        id="estado2"
                                                        type="radio"
                                                        value="Realizado"
                                                        checked={post?.estado == "Realizado" ? 'checked' : ''}
                                                        name="estado"
                                                        className="w-4 h-4"
                                                    />
                                                    <label for="estado2" className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Realizado</label>
                                                </div>
                                            </li>
                                            <li className="w-full">
                                                <div className="flex items-center pl-3">
                                                    <input
                                                        id="estado3"
                                                        type="radio"
                                                        value="A realizar"
                                                        checked={post?.estado == "A realizar" ? 'checked' : ''}
                                                        name="estado"
                                                        className="w-4 h-4"
                                                    />
                                                    <label for="estado3" className="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">A realizar</label>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="mb-3">
                                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Observação</h3>
                                        <textarea
                                            className="relative m-0 -mr-0.5 block w-full flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-400 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                                            id="message-text"
                                            onChange={updateField}
                                            name="observacao"
                                            value={post.observacao}
                                        ></textarea>
                                    </div>

                                    <div className="mb-3">
                                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Profissional</h3>
                                        <Select
                                            options={profissional}
                                            placeholder="Profissional"
                                            name="profissional"
                                            value={{ value: post.id_profissional, label: getLabelSelect(profissional, post.id_profissional) }}
                                            onChange={(e) => {
                                                updateField({
                                                    target: {
                                                        name: 'id_profissional',
                                                        value: e.value
                                                    }
                                                })
                                            }}
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-900">Preço</h3>
                                        <input
                                            type="text"
                                            className="relative m-0 -mr-0.5 block w-full flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-400 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"
                                            id="message-text"
                                            value={formatarMoedaBRL(post?.preco)}
                                            onChange={(e) => {
                                                updateField({
                                                    target: {
                                                        name: "preco",
                                                        value: moneyMask(e.target.value),
                                                    },
                                                });
                                            }}
                                            name="preco"
                                        />
                                    </div>
                                </form>
                            </div>
                            <div
                                className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md border-t-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">

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
                                    onClick={sendProcedimentoData}
                                >
                                    Salvar Procedimento
                                </button>
                            </div>
                        </div>
                    </div>
                </div >}
        </div >
    )
}

export default ListaProcedimento
