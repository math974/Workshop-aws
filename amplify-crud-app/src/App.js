import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Container, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { getRecords, createRecord, updateRecord, deleteRecord } from './services/api';

const queryClient = new QueryClient();

function App() {
  const [formData, setFormData] = useState({ id: '', name: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editRowId, setEditRowId] = useState(null);
  const [editedRowData, setEditedRowData] = useState({});

  // Fetching data using React Query
  const { data: records = [], isLoading, error } = useQuery({
    queryKey: ['records'],
    queryFn: async () => {
      const data = await getRecords();
      return data;
    },
  });

  // Setting up mutations
  const mutationCreate = useMutation({
    mutationFn: createRecord,
    onSuccess: () => queryClient.invalidateQueries(['records']),
  });

  const mutationUpdate = useMutation({
    mutationFn: updateRecord,
    onSuccess: () => queryClient.invalidateQueries(['records']),
  });

  const mutationDelete = useMutation({
    mutationFn: deleteRecord,
    onSuccess: () => queryClient.invalidateQueries(['records']),
  });

  const handleEditCell = (id, field, value) => {
    setEditedRowData((prevData) => ({
      ...prevData,
      [id]: { ...prevData[id], [field]: value },
    }));
  };

  const handleCellBlur = (id) => {

    const updatedData = editedRowData[id];

    if (updatedData) {
      const completeData = {
        id,
        name: updatedData.name || records.data.find(record => record[0] === id)[1],
        email: updatedData.email || records.data.find(record => record[0] === id)[2]
      };

      mutationUpdate.mutate(completeData);
      setEditRowId(null);
      setEditedRowData((prevData) => {
        const newData = { ...prevData };
        delete newData[id];
        return newData;
      });
    }
  };

  const handleDelete = (id) => {
    mutationDelete.mutate(id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Container>
      <h1>CRUD App with Editable Table</h1>
      <TableContainer component={Paper} style={{ marginTop: 20 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(records.data) ? (
              records.data.map((record) => (
                <TableRow key={record[0]}>
                  <TableCell>
                    {editRowId === record[0] ? (
                      <TextField
                        value={editedRowData[record[0]]?.name || record[1]}
                        onChange={(e) => handleEditCell(record[0], 'name', e.target.value)}
                        onBlur={() => handleCellBlur(record[0])}
                        autoFocus
                      />
                    ) : (
                      <span onClick={() => setEditRowId(record[0])}>{record[1]}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editRowId === record[0] ? (
                      <TextField
                        value={editedRowData[record[0]]?.email || record[2]}
                        onChange={(e) => handleEditCell(record[0], 'email', e.target.value)}
                        onBlur={() => handleCellBlur(record[0])}
                      />
                    ) : (
                      <span onClick={() => setEditRowId(record[0])}>{record[2]}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="outlined" color="secondary" onClick={() => handleDelete(record[0])}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>No records available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

function AppWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}

export default AppWrapper;
