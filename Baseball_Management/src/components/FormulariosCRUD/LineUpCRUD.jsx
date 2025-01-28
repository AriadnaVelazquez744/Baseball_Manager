// Baseball_Management/src/components/FormulariosCRUD.jsx

import React, { useState, useEffect } from "react";
import BaseCRUD from "./BaseCRUD";

const LineUpCRUD = () => {

    const [teams, setTeams] = useState([]);

    // Obtener los equipos
    const fetchTeams = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/teams/");
            if (response.ok) {
                const data = await response.json();
                setTeams(data.map(team => ({ id: team.id, name: team.name })));
            }
        } catch (error) {
            console.error("Error fetching teams:", error);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const fields = [
        { name: "id", label: "ID", type: "number", nullable: false, autoGenerated: true },
        { 
            name: "team_id", 
            label: "Equipo", 
            type: "select", 
            options: teams 
        },
    ];
    
    const apiUrl = "http://127.0.0.1:8000/lineups/";
    const initialFormValues = {
        id: "",
        team_id: "",
    };

    return (
        <BaseCRUD
            apiUrl={apiUrl}
            fields={fields}
            title="Alineaciones"
            initialFormValues={initialFormValues}
        />
    );
};
export default LineUpCRUD;


