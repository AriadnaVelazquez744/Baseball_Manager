// Baseball_Management/src/components/BaseCRUD.jsx

import React, { useState, useEffect, useCallback } from "react";

const BaseCRUD = ({
  apiUrl,
  fields,
  title,
  initialFormValues,
}) => {
  const [data, setData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formValues, setFormValues] = useState(initialFormValues);

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        console.error("Error fetching data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [apiUrl]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormValues(initialFormValues);
  };

  const handleEdit = (item) => {
    const updatedFormValues = {};
    fields.forEach((field) => {
      updatedFormValues[field.name] =
        item[field.name] !== null ? item[field.name] : field.nullable ? "" : item[field.name];
    });

    setIsEditing(true);
    setCurrentItem(item);
    setFormValues(updatedFormValues);
  };

  const onSaveSuccess = () => {
    alert("Datos guardados correctamente");
  };

  const handleSave = async () => {
    // Asegurar que no haya barras adicionales en la URL
    const baseUrl = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
    const url = isEditing ? `${baseUrl}/${currentItem.id}/` : apiUrl;
    const method = isEditing ? "PUT" : "POST";
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (response.ok) {
        fetchItems();
        setIsEditing(false);
        setIsCreating(false);
        setCurrentItem(null);
        if (onSaveSuccess) onSaveSuccess();
      } else {
        console.error("Error saving data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este elemento?")) {
      try {
        const response = await fetch(`${apiUrl}${itemId}/`, {
          method: "DELETE",
        });
  
        if (response.ok) {
          fetchItems();
        } else {
          console.error("Error deleting item");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
  

  const handleCancel = () => {
    setIsEditing(false);
    setIsCreating(false);
    setCurrentItem(null);
  };

  return (
    <div className="base-crud-container">
      <h1>{title}</h1>

      {/* Lista de elementos */}
      <div className="item-list">
        <table>
          <thead>
            <tr>
            {fields
                .filter((field) => !field.hidden) // Filtrar campos no ocultos
                .map((field) => (
                  <th key={field.name}>{field.label}</th>
                ))}
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                {fields
                  .filter((field) => !field.hidden) // Filtrar campos no ocultos
                  .map((field) => (
                    <td key={field.name}>{item[field.name] || "N/A"}</td>
                  ))}
                <td>
                  <button onClick={() => handleEdit(item)}>Editar</button>
                  <button onClick={() => handleDelete(item.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Botones de acción */}
      <div className="actions">
        <button onClick={fetchItems}>Actualizar Lista</button>
        <button onClick={handleCreate}>Añadir Elemento</button>
      </div>

      {/* Formulario para crear o editar */}
      {(isCreating || isEditing) && (
        <div className="item-form">
          <h2>{isEditing ? "Editar" : "Crear"}</h2>
          {fields.map((field) => (
            <div className="form-group" key={field.name}>
              <label>{field.label}:</label>
              <input
                type={field.type === "password" && field.showPassword ? "text" : field.type}
                name={field.name}
                value={formValues[field.name] || ""}
                onChange={handleInputChange}
              />
              {field.type === "password" && field.toggleVisibility && (
                <button type="button" onClick={field.toggleVisibility}>
                  {field.showPassword ? "Ocultar" : "Mostrar"}
                </button>
              )}
            </div>
          ))}
          <div className="form-actions">
            <button onClick={handleSave}>Guardar</button>
            <button onClick={handleCancel}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BaseCRUD;

