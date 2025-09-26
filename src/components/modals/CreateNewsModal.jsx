import React, { useState } from 'react';
import { createNewsUpdate } from "../../api/news";
import { useAuth } from '../../context/AuthContext';

const CreateNewsModal = ({ isOpen, onClose, onNewsCreated }) => {
  const [formData, setFormData] = useState({
    news_topic: '',
    news_description: '',
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('news_topic', formData.news_topic);
      formDataToSend.append('news_description', formData.news_description);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      await createNewsUpdate(formDataToSend);
      onNewsCreated();
      onClose();
      setFormData({
        news_topic: '',
        news_description: '',
        image: null,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create news');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <h2 className="text-xl font-bold text-[#05041D] mb-4">Create News</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">News Topic</label>
            <input
              type="text"
              name="news_topic"
              value={formData.news_topic}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="news_description"
              value={formData.news_description}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-[#FF5722]"
              accept="image/*"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#FF5722] text-white rounded hover:bg-[#B33F18] disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create News'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewsModal;