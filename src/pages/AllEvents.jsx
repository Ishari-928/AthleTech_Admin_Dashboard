import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddEvent from '../components/modals/AddEvent';
import api from '../api/api';

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('role');
    console.log('User role from localStorage:', role);
    
    if (role) {
      setUserRole(role);
    }
    
    fetchEvents();
  }, []);

 const fetchEvents = async () => {
  try {
    setLoading(true);
    
    const currentUserRole = localStorage.getItem('role') || userRole;
    console.log('Fetching events with role:', currentUserRole);
    
    if (currentUserRole === 'superadmin') {
      const response = await api.get('/api/v1/events/admin/all');
      console.log('Admin events response:', response.data);
      setEvents(response.data.data || []);
    } else {
      const response = await api.get('/api/v1/events/active');
      console.log('Active events response:', response.data);
      setEvents(response.data.data || []);
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    setEvents([]);
    toast.error('Failed to fetch events');
  } finally {
    setLoading(false);
  }
};

  const handleStatusToggle = async (eventId, currentStatus) => {
    try {
      const response = await api.patch(`/api/v1/events/${eventId}/toggle-status`);

      if (response.data.success) {
        toast.success(response.data.message);
        setEvents(events.map(event => 
          event.event_id === eventId 
            ? { ...event, status: response.data.data.status }
            : event
        ));
      }
    } catch (error) {
      console.error('Error toggling event status:', error);
      if (error.response?.status === 403) {
        toast.error('Access denied. Only super admins can perform this action.');
      } else {
        toast.error('Failed to update event status');
      }
    }
  };

  const handleEventCreated = () => {
    setShowModal(false);
    fetchEvents();
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading events...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Events List</h1>
        
       
        
        {userRole === 'superadmin' && (
          <button
            onClick={() => setShowModal(true)}
            className="text-white font-bold px-4 py-2 rounded bg-gradient-to-r from-[#05041D] to-[#FF5722] hover:from-[#FF5722] hover:to-[#B33F18] transition duration-300"
          >
            <span className="mr-2">+</span> Add New Event
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Event Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.length === 0 ? (
              <tr>
                <td colSpan="2" className="px-6 py-4 text-center text-gray-500">
                  No events available
                </td>
              </tr>
            ) : (
              events.map((event) => (
                <tr key={event.event_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {event.event_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {userRole === 'superadmin' ? (
                      <button
                        onClick={() => handleStatusToggle(event.event_id, event.status)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          event.status === 'active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        }`}
                      >
                        {event.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          event.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {event.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <AddEvent
          onClose={() => setShowModal(false)}
          onEventCreated={handleEventCreated}
        />
      )}
    </div>
  );
};

export default AllEvents;