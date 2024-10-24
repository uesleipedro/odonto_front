import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import Select from 'react-select'
import { useRouter } from 'next/router'
import api from '../../../../utils/Api'
import { useAuth } from '../../../../auth/useAuth'

const FormBuilder = () => {
  const router = useRouter()
  const { id_form } = router.query
  const [formName, setFormName] = useState('');
  const [fields, setFields] = useState([{ name: '', type: 'text' }])
  const { user } = useAuth()
  const id_empresa = user?.user?.foundUser?.id_empresa
  const options = [
    { value: 'text', label: 'Texto' },
    { value: 'boolean', label: 'Binário' }
  ]

  useEffect(() => {
    getDynamicForm()
  }, [id_form])

  const addField = () => {
    setFields([...fields, { name: '', type: 'text' }])
  }

  const getDynamicForm = async () => {
    await api.get(`dynamicForm`, {
      params: {
        id_empresa: 13,
        id_form: id_form
      }
    })
      .then(response => {
        console.log("response dynamic", response.data)
        setFields(response.data)
        setFormName(response?.data[0]?.form_name)
      })
      .catch(e => {
        Swal.fire('Erro ao obter o formulário')
        console.error(e.message)
      })
  }

  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...fields]
    updatedFields[index][key] = value
    setFields(updatedFields)
  }

  const handleSubmit = async () => {
    await api.post('dynamicForm', {
      formName,
      fields,
      id_empresa
    }).then((response) => {
      setFormName('')
      setFields([{ name: '', type: 'text' }])
      Swal.fire('Formulário cadastrado com sucesso!')
    }).catch(e => {
      Swal.fire('Erro ao cadastrar formulário.')
    })
  }

  return (
    <div className="m-5 p-5 rounded-lg shadow-lg">

      <p className="text-gray-600 font-bold">Cadastrar Formulário</p>
      <hr />

      <div className="w-full md:w-3/5 pr-2 pt-3">
        <label className="text-gray-700 ">Nome do Formulário</label>
        <input
          type="text"
          value={formName}
          onChange={(e) => setFormName(e.target.value)}
          className="form-input rounded-lg text-gray-600 w-full placeholder-gray-300"
          placeholder="Nome do Formulário" />
      </div>
      <hr className="mt-5" />

      {fields.map((field, index) => (
        <div
          className="grid grid-cols-12 gap-4"
          key={index}>
          <div className="col-span-8">
            <label className="text-gray-700 ">Nome do Campo</label>
            <input
              type="text"
              value={field.field_name}
              onChange={(e) => handleFieldChange(index, 'field_name', e.target.value)}
              className="form-input rounded-lg text-gray-600 w-full placeholder-gray-300"
              placeholder="Nome do Campo" />
          </div>

          <div className="col-span-4 h-full">
            <label className="text-gray-700 ">Tipo</label>
            <Select
              options={options}
              value={{ value: field.type, label: options.find(opt => opt.value === field.type).label }}
              placeholder="Tipo"
              onChange={(e) => handleFieldChange(index, 'type', e.value)}
            />
          </div>


        </div>

      ))}
      <div className="flex justify-end gap-3">
        <button
          onClick={addField}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-5">
          Adicionar Campo
        </button>

        <button
          onClick={handleSubmit}
          className="bg-success-600 hover:bg-success-700 text-white font-bold py-2 px-4 rounded-full mt-5">
          Salvar Formulário
        </button>
      </div>
    </div>
  )
}

export default FormBuilder