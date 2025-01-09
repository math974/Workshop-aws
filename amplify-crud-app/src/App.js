import React, { useState, useEffect } from "react";
import { getRecords, createRecord, updateRecord, deleteRecord } from "./services/api";

function App() {
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({ id: "", name: "", email: "" });
  const [isEditing, setIsEditing] = useState(false);

  // Charger les enregistrements au montage
  useEffect(() => {
    loadRecords();
  }, []);

  const loadRecords = async () => {
    const data = await getRecords();
    setRecords(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await updateRecord(formData);
    } else {
      await createRecord(formData);
    }
    setFormData({ id: "", name: "", email: "" });
    setIsEditing(false);
    loadRecords();
  };

  const handleEdit = (record) => {
    setFormData(record);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    await deleteRecord(id);
    loadRecords();
  };

  return (
    <div className="App">
      <h1>CRUD App</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
        <button type="submit">{isEditing ? "Update" : "Create"}</button>
      </form>
      <ul>
        {records.map((record) => (
          <li key={record.id}>
            {record.name} ({record.email})
            <button onClick={() => handleEdit(record)}>Edit</button>
            <button onClick={() => handleDelete(record.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
