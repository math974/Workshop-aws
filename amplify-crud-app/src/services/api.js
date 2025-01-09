const API_URL = "https://your-api-gateway-url.amazonaws.com/prod";

export const getRecords = async () => {
  const response = await fetch(`${API_URL}/records`);
  return response.json();
};

export const createRecord = async (data) => {
  await fetch(`${API_URL}/records`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const updateRecord = async (data) => {
  await fetch(`${API_URL}/records/${data.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
};

export const deleteRecord = async (id) => {
  await fetch(`${API_URL}/records/${id}`, {
    method: "DELETE",
  });
};
