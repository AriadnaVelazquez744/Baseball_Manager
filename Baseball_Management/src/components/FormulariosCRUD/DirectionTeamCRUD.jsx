// Baseball_Management/src/components/FormulariosCRUD/DirectionTeamCRUD.jsx

import React from "react";
import BaseCRUD from "./BaseCRUD";

const DirectionTeamCRUD = () => {
    const fields = [
        { name: "id", label: "ID", type: "number", autoGenerated: true },
        { name: "Team_id", label: "Equipo ID", type: "number", nullable: false },
    ];
    const apiUrl = "http://127.0.0.1:8000/direction-teams/";
    const initialFormValues = {
        id: "",
        Team_id: "",
    };

    return (
        <BaseCRUD
            apiUrl={apiUrl}
            fields={fields}
            title="Equipos de Dirección"
            initialFormValues={initialFormValues}
        />
    );
};
export default DirectionTeamCRUD;


