import { useState, useEffect, useCallback } from "react";

export const useCRUD = (apiUrl, fields, initialFormValues) => {
  const [data, setData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const fetchItems = useCallback(async () => {
    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
        let items = await response.json();
        if (sortConfig.key) {
          items = items.sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
              return sortConfig.direction === "ascending" ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
              return sortConfig.direction === "ascending" ? 1 : -1;
            }
            return 0;
          });
        }
        setData(items);
        setCurrentPage(1); // Reinicia a la primera página después de cargar
      } else {
        console.error("Error fetching data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }, [apiUrl, sortConfig]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedData(data.slice(startIndex, endIndex));
  }, [data, currentPage, itemsPerPage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormValues(initialFormValues);
    setFormErrors({});
  };

  const handleEdit = (item) => {
    const updatedFormValues = {};
    fields.forEach((field) => {
      updatedFormValues[field.name] =
        item[field.name] !== null
          ? item[field.name]
          : field.nullable
          ? ""
          : item[field.name];
    });
    setIsEditing(true);
    setCurrentItem(item);
    setFormValues(updatedFormValues);
    setFormErrors({});
  };

  const handleSave = async () => {
    const baseUrl = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
    const url = isEditing ? `${baseUrl}/${currentItem.id}/` : apiUrl;
    const method = isEditing ? "PUT" : "POST";
    const filteredFormValues = Object.fromEntries(
      Object.entries(formValues).filter(
        ([key]) =>
          !fields.find((field) => field.name === key && field.autoGenerated)
      )
    );
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filteredFormValues),
      });
      if (response.ok) {
        fetchItems();
        setIsEditing(false);
        setIsCreating(false);
        setCurrentItem(null);
        setFormErrors({});
      } else if (response.status === 400) {
        const errorData = await response.json();
        setFormErrors(errorData);
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
        const response = await fetch(`${apiUrl}${itemId}/`, { method: "DELETE" });
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
    setFormErrors({});
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const goToPage = (page) => setCurrentPage(page);

  return {
    paginatedData,
    data,
    totalPages,
    currentPage,
    form: { values: formValues, errors: formErrors, isEditing, isCreating },
    actions: {
      fetchItems,
      handleCreate,
      handleEdit,
      handleSave,
      handleDelete,
      handleCancel,
      handleInputChange,
      handleSort,
      goToPage,
    },
    sortConfig,
  };
};
