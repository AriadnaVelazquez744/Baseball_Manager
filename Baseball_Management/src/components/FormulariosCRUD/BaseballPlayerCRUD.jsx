// Baseball_Management/src/components/FormulariosCRUD/BaseballPlayerCRUD.jsx

import React, { useState, useEffect } from "react";
import BaseCRUD from "./BaseCRUD";

const BaseballPlayerCRUD = () => {

    const [persons, setPerson] = useState([]);

    // Función para obtener los nombres de las personas
    const fetchPerson = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/persons/");
            if (response.ok) {
                const data = await response.json();
                setPerson(data);
            }
        } catch (error) {
            console.error("Error obteniendo personas", error);
        }
    }

    useEffect(() => {
        fetchPerson();
    }, []);

    const fields = [
        { name: "id", label: "ID", type: "number", autoGenerated: true },
        { 
            name: "P_id", 
            label: "Persona", 
            type: "select", 
            nullable: false,
            options: persons.map((person) => ({id: person.id, name: `${person.name} ${person.lastname}`})),
        },
        { name: "batting_average", label: "Promedio de Bateo", type: "number", nullable: false },
        { name: "years_of_experience", label: "Años de Experiencia", type: "number", nullable: false },
        { 
            name: "pitcher", 
            label: "Lanzador", 
            type: "select", 
            hidden: true,
            autoGenerated: true,
            nullable: true,
        },
    ];

    const apiUrl = "http://127.0.0.1:8000/baseball-players/";
    const initialFormValues = {
        id: "",
        P_id: "",
        batting_average: "",
        years_of_experience: "",
        pitcher: "",
    };

    return (
        <BaseCRUD
            apiUrl={apiUrl}
            fields={fields}
            title="Jugadores"
            initialFormValues={initialFormValues}
        />
    );
};
export default BaseballPlayerCRUD;


