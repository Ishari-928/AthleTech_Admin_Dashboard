import React, { useState, useEffect } from 'react';
import Table from '../components/common/Table';
import CoachModal from '../components/modals/CoachModal';
import { getCoaches, createCoach, updateCoach, deleteCoach } from '../api/coach';
import { useAuth } from '../context/AuthContext';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';

const CoachDetails = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [coachToDelete, setCoachToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { user } = useAuth();

  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
  try {
    setLoading(true);
    const response = await getCoaches();
    const activeCoaches = response.data.filter(coach => coach.status === 'active');
    setCoaches(activeCoaches);
  } catch (error) {
    console.error('Error fetching coaches:', error);
    showSnackbar('Error fetching coaches', 'error');
  } finally {
    setLoading(false);
  }
};

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCreateCoach = async (formData) => {
    try {
      setLoading(true);
      await createCoach(formData);
      setModalOpen(false);
      fetchCoaches(); 
      showSnackbar('Coach created successfully');
    } catch (error) {
      console.error('Error creating coach:', error);
      showSnackbar(error.response?.data?.message || 'Error creating coach', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCoach = async (formData) => {
    try {
      setLoading(true);
      await updateCoach(editData.coach_id, formData);
      setModalOpen(false);
      setEditData(null);
      fetchCoaches(); // Refetch to get updated data
      showSnackbar('Coach updated successfully');
    } catch (error) {
      console.error('Error updating coach:', error);
      showSnackbar(error.response?.data?.message || 'Error updating coach', 'error');
    } finally {
      setLoading(false);
    }
  };

const handleDeleteCoach = async () => {
  try {
    setLoading(true);
    await deleteCoach(coachToDelete.coach_id); 
    
    setCoaches(prevCoaches => 
      prevCoaches.filter(coach => coach.coach_id !== coachToDelete.coach_id)
    );
    
    setDeleteConfirmOpen(false);
    setCoachToDelete(null);
    showSnackbar('Coach deleted successfully');
  } catch (error) {
    console.error('Error deleting coach:', error);
    showSnackbar(error.response?.data?.message || 'Error deleting coach', 'error');
  } finally {
    setLoading(false);
  }
};

  const openEditModal = (coach) => {
    setEditData(coach);
    setModalOpen(true);
  };

  const openDeleteConfirm = (coach) => {
    setCoachToDelete(coach);
    setDeleteConfirmOpen(true);
  };

  const columns = [
    {
      header: 'Profile',
      accessor: 'profile_image_url',
      cell: (value) => (
        <img
          src={value || '/default-avatar.png'}
          alt="Coach"
          className="h-12 w-12 object-cover rounded-full"
          onError={(e) => {
            e.target.src = '/default-avatar.png';
          }}
        />
      ),
    },
    { header: 'Coach Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
    { header: 'Mobile', accessor: 'contact_no' },
    {
      header: 'WhatsApp',
      accessor: 'whatsapp',
      cell: (value) => value || '-',
    },
    {
      header: 'Facebook',
      accessor: 'social_media',
      cell: (value) => value?.facebook || '-',
    },
    {
      header: 'Actions',
      accessor: 'coach_id',
      cell: (value, row) => (
        <div className="flex space-x-2">
          <IconButton
            size="small"
            onClick={() => openEditModal(row)}
            color="primary"
          >
            <Edit />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => openDeleteConfirm(row)}
            color="error"
            disabled={user?.role !== 'superadmin'}
          >
            <Delete />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Typography variant="h4" className="text-[#05041D]">
        Coaches Details
      </Typography>

      <Box className="bg-white rounded-lg shadow-sm p-6">
        <Box className="flex justify-between items-center mb-4">
          <Typography variant="h6" className="text-[#05041D]">
            Coaches List
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setModalOpen(true)}
            sx={{ bgcolor: '#FF5722', '&:hover': { bgcolor: '#E64A19' } }}
            disabled={!user || (user.role !== 'admin' && user.role !== 'superadmin')}
          >
            Add Coach
          </Button>
        </Box>

        {loading && coaches.length === 0 ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <Table columns={columns} data={coaches} />
        )}
      </Box>

      <CoachModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSubmit={editData ? handleUpdateCoach : handleCreateCoach}
        loading={loading}
        editData={editData}
      />

      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete {coachToDelete?.name}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteCoach} color="error" disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CoachDetails;