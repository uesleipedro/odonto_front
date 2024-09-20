import { useState } from 'react'

const FormBuilder = () => {
  const [formName, setFormName] = useState('');
  const [fields, setFields] = useState([{ name: '', type: 'text' }])

  const addField = () => {
    setFields([...fields, { name: '', type: 'text' }])
  }

  const handleFieldChange = (index, key, value) => {
    const updatedFields = [...fields];
    updatedFields[index][key] = value;
    setFields(updatedFields);
  };

  const handleSubmit = async () => {
    // Envia os dados do formulário para a API
    const response = await fetch('/api/forms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        formName,
        fields,
      }),
    });

    if (response.ok) {
      // Limpa o formulário
      setFormName('');
      setFields([{ name: '', type: 'text' }]);
      alert('Formulário cadastrado com sucesso!');
    } else {
      alert('Erro ao cadastrar formulário.');
    }
  };

  return (
    <div>
      <h2>Cadastrar Formulário</h2>
      <input
        type="text"
        placeholder="Nome do Formulário"
        value={formName}
        onChange={(e) => setFormName(e.target.value)}
      />
      <button onClick={addField}>Adicionar Campo</button>
      {fields.map((field, index) => (
        <div key={index}>
          <input
            type="text"
            placeholder="Nome do Campo"
            value={field.name}
            onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
          />
          <select
            value={field.type}
            onChange={(e) => handleFieldChange(index, 'type', e.target.value)}
          >
            <option value="text">Texto</option>
            <option value="number">Número</option>
            <option value="email">Email</option>
            <option value="date">Data</option>
          </select>
        </div>
      ))}
      <button onClick={handleSubmit}>Salvar Formulário</button>
    </div>
  );
};

export default FormBuilder