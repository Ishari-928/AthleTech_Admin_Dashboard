import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  IconButton,
  Typography,
  CircularProgress
} from '@mui/material';
import { Close } from '@mui/icons-material';

const CoachModal = ({ open, onClose, onSubmit, loading, editData }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    whatsapp: '',
    contact_no: '',
    facebook: '',
    profile_image: null
  });

  const [imagePreview, setImagePreview] = useState(null);

  // Reset form when editData changes or modal opens/closes
  useEffect(() => {
    if (editData) {
      // Pre-fill form with existing data when editing
      setFormData({
        name: editData.name || '',
        description: editData.description || '',
        whatsapp: editData.whatsapp || '',
        contact_no: editData.contact_no || '',
        facebook: editData.social_media?.facebook || '',
        profile_image: null
      });
      setImagePreview(editData.profile_image_url || null);
    } else {
      // Reset form for new coach
      setFormData({
        name: '',
        description: '',
        whatsapp: '',
        contact_no: '',
        facebook: '',
        profile_image: null
      });
      setImagePreview(null);
    }
  }, [editData, open]); // Reset when editData changes or modal opens

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profile_image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null && formData[key] !== undefined) {
        submitData.append(key, formData[key]);
      }
    });

    // Add social media data
    const socialMedia = {
      facebook: formData.facebook
    };
    submitData.append('social_media', JSON.stringify(socialMedia));

    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {editData ? 'Edit Coach' : 'Add New Coach'}
          </Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={2}>
            <TextField
              name="name"
              label="Coach Name"
              value={formData.name}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
                name="facebook"
                label="Facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                fullWidth
                sx={{ mb: 2 }}
            />
          </Box>

          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mb={2}>
            <TextField
              name="contact_no"
              label="Mobile Number"
              value={formData.contact_no}
              onChange={handleInputChange}
              required
              fullWidth
            />
            <TextField
              name="whatsapp"
              label="WhatsApp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              fullWidth
            />
          </Box>

          <TextField
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleInputChange}
            required
            multiline
            rows={3}
            fullWidth
            sx={{ mb: 2 }}
          />

          <Box mb={2}>
            <Typography variant="body2" gutterBottom>
              Profile Image
            </Typography>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginBottom: '8px' }}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
              />
            )}
          </Box>

          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={onClose} variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ bgcolor: '#FF5722', '&:hover': { bgcolor: '#E64A19' } }}
            >
              {loading ? <CircularProgress size={24} /> : (editData ? 'Update' : 'Add Coach')}
            </Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CoachModal;