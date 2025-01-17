// Baseball_Management/src/components/FormulariosCRUD/SeasonCRUD.jsx

import React from "react";
import BaseCRUD from "./BaseCRUD";

const SeasonCRUD = () => {
    const fields = [
        { name: "id", label: "ID", type: "number"},
    ];
    const apiUrl = "http://127.0.0.1:8000/seasons/";
    const initialFormValues = {
        id : "",
    };
    return (
        <BaseCRUD
          apiUrl={apiUrl}
          fields={fields}
          title="Roles"
          initialFormValues={initialFormValues}
        />
    );
};
export default SeasonCRUD;

