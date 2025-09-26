import React from 'react';
import { Dialog, DialogContent, Typography, Button, Box } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom';

const SuccessModal = ({ open, onClose }) => {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent
        sx={{
          textAlign: 'center',
          p: 4,
          borderRadius: 4,
        }}
      >
        <CheckCircleOutlineIcon sx={{ fontSize: 60, color: '#ff5722' }} />
        <Typography variant="h5" mt={2} fontWeight="bold" color="#ff5722">
          SUCCESS
        </Typography>
        <Typography variant="body1" mt={2} fontWeight="bold">
          Thank you for your request. We are working hard to find the best service and deals for you.
        </Typography>
        <Box mt={4}>
          <Button
            variant="contained"
            onClick={() => {
              onClose();      
              navigate('/');  
            }}
            sx={{ backgroundColor: '#ff5722', '&:hover': { backgroundColor: '#f4511e' } }}
          >
            OK !
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SuccessModal;
