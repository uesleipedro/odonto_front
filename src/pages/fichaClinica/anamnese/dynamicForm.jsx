import { useEffect, useState } from "react"
import api from "../../../utils/Api"
import Swal from "sweetalert2"

const DynamicForm = () => {
  const [formData, setFormData] = useState({})
  const [formDy, setForm] = useState()

  useEffect(() => {
    getDynamicForm()
  }, [])

  const handleInputChange = (field_name, value) => {
    setFormData({
      ...formData,
      [field_name]: value,
    })
    console.log(formData)
  }

  const getDynamicForm = async () => {
    await api.get(`dynamicForm`, {
      params: {
        id_empresa: 13,
        id_form: 9
      }
    })
      .then(response => {
        console.log("response dynamic", response.data)
        setForm(response.data)
      })
      .catch(e => {
        Swal.fire('Erro ao obter o formulário')
      })
  }

  const handleSubmit = async () => {
    await api.post('dynamicForm/data', {
      form_id: 4,
      data: formData,
      id_empresa: 13
    })
      .then((response) => {
        Swal.fire('Formulário cadastrado com sucesso!')
      }).catch(e => {
        Swal.fire('Erro ao cadastrar formulário.')
      })
  }

  if (!formDy) return <></>

  return (
    <div className="m-5 p-5 rounded-lg shadow-lg">

      <p className="text-gray-600 font-bold">Inclusão de anamnese</p>
      <hr />
      <div className="w-full pl-6 mb-8 flex flex-row flex-wrap justify-between">

        <h2>{formDy[0]?.form_name}</h2>
        {formDy?.map((field, index) => (
          <div className="w-full">
            {field?.type === "boolean"
              ? (
                <div className="w-full md:w-1/2 pr-2 pt-3">
                  <input
                    className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary dark:focus:before:shadow-[3px_-1px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca]"
                    type="checkbox"
                    role="switch"
                    // checked={checkedItem(anamnese.hipertensao)}
                    onChange={(e) => handleInputChange(field?.field_name, e?.target?.checked)} />
                  <label
                    className="inline-block pl-[0.15rem] hover:cursor-pointer"
                    htmlFor="flexSwitchCheckDefault"
                  >{field?.field_name}</label>
                </div>
              )
              :
              (<div key={index} className="w-full md:w-1/2 pr-2 pt-3">
                <label className="text-gray-700 ">{field?.field_name}</label>
                <input
                  // value={anamnese.descricao_medicacoes}
                  type={field?.type}
                  onChange={(e) => handleInputChange(field?.field_name, e?.target?.value)}
                  className="form-input rounded-lg text-gray-600 w-full" />
              </div>)}
          </div>
        ))}

        <button onClick={handleSubmit}>Enviar</button>
      </div>
    </div>
  )
}

export default DynamicForm