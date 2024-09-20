import { useState } from "react"

const DynamicForm = ({ form }) => {
    const [formData, setFormData] = useState({});
  
    const handleInputChange = (name, value) => {
      setFormData({
        ...formData,
        [name]: value,
      });
    };
  
    const handleSubmit = async () => {
      // Submeter dados para a API ou salvar no banco de dados
      const response = await fetch(`/api/forms/${form.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        alert('Dados salvos com sucesso!');
      } else {
        alert('Erro ao salvar dados.');
      }
    };
  
    return (
      <div>
        <h2>{form.name}</h2>
        {form.fields.map((field, index) => (
          <div key={index}>
            <label>{field.name}</label>
            <input
              type={field.type}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
            />
          </div>
        ))}
        <button onClick={handleSubmit}>Enviar</button>
      </div>
    );
  }

  export default DynamicForm