const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

export const getRecords = async () => {
  const response = await fetch(`${API_URL}/users`);
  return response.json();
};

export const createRecord = async (data) => {
  await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const updateRecord = async (data) => {
  await fetch(`${API_URL}/users/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const deleteRecord = async (id) => {
  await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
  });
};
