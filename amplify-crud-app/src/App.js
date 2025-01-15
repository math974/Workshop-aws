import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Container, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { getRecords, createRecord, updateRecord, deleteRecord } from './services/api';

const queryClient = new QueryClient();

function App() {
  const [formData, setFormData] = useState({ id: '', name: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);

  // Fetching data using React Query
  const { data: records = [], isLoading, error } = useQuery({
    queryKey: ['records'],
    queryFn: async () => {
      const data = await getRecords();
      console.log("Fetched records:", data);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      mutationUpdate.mutate(formData);
    } else {
      mutationCreate.mutate(formData);
    }
    setFormData({ id: '', name: '', email: '' });
    setIsEditing(false);
  };

  const handleEdit = (record) => {
    setFormData(record);
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    mutationDelete.mutate(id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Container>
      <h1>CRUD App with MUI and React Query</h1>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={formData.name || ''}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          {isEditing ? 'Update' : 'Create'}
        </Button>
      </form>

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
                  <TableCell>{record[1]}</TableCell>
                  <TableCell>{record[2]}</TableCell>
                  <TableCell>
                    <Button variant="outlined" onClick={() => handleEdit(record)}>
                      Edit
                    </Button>
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

