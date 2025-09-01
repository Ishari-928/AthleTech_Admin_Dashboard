// pages/NewsUpdates.jsx
import React, { useState, useEffect } from 'react';
import Table from '../components/common/Table';
import CreateNewsModal from '../components/modals/CreateNewsModal';
import { getNewsUpdates, deleteNewsUpdate } from '../api/news';
import { useAuth } from '../context/AuthContext';

const NewsUpdates = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await getNewsUpdates();
      setNews(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch news');
    } finally {
      setLoading(false);
    }
  };

  const handleInactive = async (newsId) => {
    if (!window.confirm('Are you sure you want to mark this news as inactive?')) {
      return;
    }

    try {
      await deleteNewsUpdate(newsId);
      setNews(news.filter(item => item.news_id !== newsId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete news');
    }
  };

  const columns = [
    { header: 'Date', accessor: 'date' },
    { header: 'News Topic', accessor: 'news_topic' },
    { header: 'Description', accessor: 'news_description' },
    {
      header: 'Image',
      accessor: 'image',
      cell: (value) => value ? (
        <img
          src={value}
          alt="News"
          className="h-12 w-20 object-cover rounded"
        />
      ) : (
        <span className="text-gray-400">No image</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value) => (
        <span className={`px-2 py-1 rounded text-xs ${
          value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      ),
    },
    {
      header: 'Actions',
      accessor: 'news_id',
      cell: (value, row) => (
        <div className="flex space-x-2">
          {user?.role === 'superadmin' && row.status === 'active' && (
            <button 
              onClick={() => handleInactive(value)}
              className="text-red-600 hover:text-red-800"
            >
              Inactive
            </button>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#05041D]">News Updates</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <CreateNewsModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onNewsCreated={fetchNews}
      />

      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-[#05041D]">News List</h2>
            {user?.role === 'admin' || user?.role === 'superadmin' ? (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-[#FF5722] text-white px-4 py-2 rounded hover:bg-[#B33F18]"
              >
                Add New News
              </button>
            ) : null}
          </div>
          <Table columns={columns} data={news} />
        </div>
      </div>
    </div>
  );
};

export default NewsUpdates;