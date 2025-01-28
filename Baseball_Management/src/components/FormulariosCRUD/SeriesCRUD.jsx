// Baseball_Management/src/components/FormulariosCRUD/SeriesCRUD.jsx

import React, { useState, useEffect } from "react";
import BaseCRUD from "./BaseCRUD";

const SeriesCRUD = () => {

    const [seasons, setSeasons] = useState([]);

    const fetchSeasons = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/seasons/");
            if (response.ok) {
                const data = await response.json();
                setSeasons(data);
            }
        }catch (error) {
            console.error("Error obteniendo temporadas:", error);
        }
    };

    useEffect(() => {
        fetchSeasons();
    }, []);

    const fields = [
        { name: "name", label: "Nombre", type: "text", nullable: false },
        { name: "type", label: "Tipo de Serie", type: "text", nullable: false },
        { 
            name: "season", 
            label: "Temporada", 
            type: "select", 
            options: seasons.map((season) => ({ id: season.id, name: season.name})),
            nullable: false, 
        },
        { name: "init_date", label: "Fecha de Inicio", type: "date"},
        { name: "end_date", label: "Fecha de Final", type: "date"},
    ];
    const apiUrl = "http://127.0.0.1:8000/series/";
    const initialFormValues = {
        season: "",
        name: "",
        type: "",
        init_date: "",
        end_date: "",
    };

    return (
        <BaseCRUD
            apiUrl={apiUrl}
            fields={fields}
            title="Series"
            initialFormValues={initialFormValues}
        />
    );
};
export default SeriesCRUD;


