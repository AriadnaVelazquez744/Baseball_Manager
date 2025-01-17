// Baseball_Management/src/components/FormulariosCRUD/PitcherCRUD.jsx

import React from "react";
import BaseCRUD from "./BaseCRUD";

const PitcherCRUD = () => {
    const fields = [
        { name: "CI", label: "CI", type: "number", nullable: false },
        { name: "dominant_hand", label: "Mano Dominante", type: "number", nullable: false },
        { name: "No_games_won", label: "Juegos Ganados", type: "number", nullable: false },
        { name: "No_games_lost", label: "Juegos Perdidos", type: "number", nullable: false },
        { name: "running_average", label: "Promedio de Carreras", type: "number", nullable: false },
    ];
    const apiUrl = "http://127.0.0.1:8000/pitchers/";
    const initialFormValues = {
        CI: "",
        dominant_hand: "",
        No_games_won: "",
        No_games_lost: "",
        running_average: "",
    };

    return (
        <BaseCRUD
            apiUrl={apiUrl}
            fields={fields}
            title="Lanzadores"
            initialFormValues={initialFormValues}
        />
    );
};
export default PitcherCRUD;


