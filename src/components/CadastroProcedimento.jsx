import { useContext, useState, useEffect } from "react"
import Select from 'react-select'
import { FichaClinicaContext } from "../context/FichaClinicaContext"
import Toast from "./Toast"
import LoadingOverlay from "./LoadingOverlay"
import api from "../utils/Api"
import { useAuth } from "../auth/useAuth"
import { toDecimalNumeric, formatarMoedaBRL } from "../utils/mask"
import moment from "moment"

const CadastroProcedimento = ({ show, toogleShow, id_paciente, dadosProcedimento, insertUpdate }) => {

    const { getProcedimentoList } = useContext(FichaClinicaContext)
    const [procedimentoList, setProcedimentoList] = useState([])
    const [post, setPost] = useState({})
    const [showToast, setShowToast] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [facesDente, setFacesDente] = useState([])
    const [profissional, setProfissional] = useState()
    const [options, setOptions] = useState([])
    const { user } = useAuth()
    const id_empresa = user?.user?.foundUser.id_empresa

    useEffect(() => {
        listaProcedimento()
        getDentes()
        getProfissional()
    }, [])

    useEffect(() => {
        if (dadosProcedimento.id_procedimento || dadosProcedimento.dente) {
            setPost(dadosProcedimento)
        } else {
            setPost({
                face_dente: '',
                estado: 'A realizar',
                adicionado: moment(Date()).format('YYYY-MM-DD'),
                id_paciente: Number(id_paciente),
                preco: "R$ 0,00"
            })
        }
        getSetFacesDente(dadosProcedimento?.dente)
    }, [dadosProcedimento])

    const listaProcedimento = async () => {
        await api.get('procedimento_list')
            .then(response => {
                setProcedimentoList([...procedimentoList, ...response.data])
            })
            .catch(function (error) {
                console.error(error);
            })
    }

    const getSetFacesDente = async (dente) => {
        await api.get(`faceDente/${dente}`)
            .then(response => {
                setFacesDente([...response.data])
            })
            .catch(function (error) {
                console.error(error);
            })

    }

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

    const getDentes = async () => {
        await api.get('dentes')
            .then(response => {
                setOptions([...options, ...response.data])
            })
            .catch(function (error) {
                console.error(error);
            })
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
        fieldName == "id_procedimento_list" && setLabel("nome_procedimento", e.target.label)
        fieldName == "id_profissional" && setLabel("nome_profissional", e.target.label)

        setPost(existingValues => ({
            ...existingValues,
            [fieldName]: e.target.value,
        }))

    }

    const sendProcedimentoData = async () => {
        let dados = post
        dados.id_empresa = id_empresa
        setIsLoading(true)
        toogleShow()
        switch (insertUpdate) {
            case 'insert':
                await api.post('procedimento', dados)
                    .catch(e => {
                        alert(e)
                    })

            case 'update':
                await api.put('procedimento', dados)
                    .then(async function (response) {
                        if (response.status === 201) {
                        }
                    })
                    .catch(e => {
                        alert(e)
                    })
        }
        setPost({})
        await getProcedimentoList()
        setIsLoading(false)
        setShowToast(true)

    }

    const setLabel = (field, value) => {
        setPost((existingValues) => ({
            ...existingValues,
            [field]: value,
        }))
    }

    return (
        <>
            {!show
                ? <></>
                :
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
                                    onClick={toogleShow}>
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
                                            value={{ value: post.id_procedimento_list, label: post?.nome_procedimento }}
                                            onChange={(e) => {
                                                updateField({
                                                    target: {
                                                        name: 'id_procedimento_list',
                                                        value: e.value,
                                                        label: e.label
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
                                                    <input onChange={updateField} name={"face_dente" + data.face} defaultChecked={post.face_dente?.includes(data.face)} type="checkbox" className="w-4 h-4 rounded" />
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
                                            value={{ value: post.id_profissional, label: post?.nome_profissional }}
                                            onChange={(e) => {
                                                updateField({
                                                    target: {
                                                        name: 'id_profissional',
                                                        value: e.value,
                                                        label: e.label
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
                                                        value: toDecimalNumeric(e.target.value),
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
                                    onClick={toogleShow}
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

            <Toast
                message="Procedimento salvo com sucesso!"
                show={showToast}
                onClose={() => setShowToast(false)}
            />

            <LoadingOverlay isLoading={isLoading} />
        </>
    )
}

export default CadastroProcedimento