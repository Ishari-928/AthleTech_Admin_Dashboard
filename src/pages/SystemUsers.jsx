import React, { useState, useEffect } from "react";
import Table from "../components/common/Table";
import CreateAdmin from "../components/modals/CreateAdminModal";
import api from "../api/api";
import { useAuth } from "../context/AuthContext";
import { cancelAdmin } from "../api/admins";

const SystemUsers = () => {

    const { user } = useAuth(); 
    const [showModal, setShowModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/v1/admins");
      const data = res.data.data;

      const formatted = data.map((u) => ({
        id: u.admin_id,
        fullName: u.name,
        email: u.email,
        contact: u.contact_no,
        role: u.user_role,
        isBlocked: !u.is_active,
      }));

      setUsers(formatted);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCancelUser = async (userId) => {
    try {
      console.log("Canceling user with ID:", userId);
      await cancelAdmin(userId);
      alert("User canceled successfully");
      fetchUsers(); 
    } catch (err) {
      console.log("Error in canceling user", err);
      alert(err?.response?.data?.message || "Error canceling user");
    }
  };

  const columns = [
    { header: "Full Name", accessor: "fullName" },
    { header: "Email", accessor: "email" },
    { header: "Contact Number", accessor: "contact" },
    { header: "User Role", accessor: "role" },
    ...(user?.role === "superadmin"
    ? [{
        header: "Actions",
        accessor: "actions",
        cell: (_, row) => (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!row.isBlocked) handleCancelUser(row.id);
            }}
            className={`px-3 py-1 rounded-md text-sm font-medium 
              ${row.isBlocked ? "bg-gray-400 text-white cursor-not-allowed" : "bg-red-600 hover:bg-red-700 text-white"}`}
            disabled={row.isBlocked}
          >
            {row.isBlocked ? "Canceled" : "Cancel User"}
          </button>
        ),
      }]
    : []),
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-medium text-[#05041D]">
              System Users
            </h2>
            {user?.role === "superadmin" && (
            <button 
                onClick={() => setShowModal(true)}
                className="text-white font-bold px-4 py-2 rounded bg-gradient-to-r from-[#05041D] to-[#FF5722] hover:from-[#FF5722] hover:to-[#B33F18] transition duration-300"
            >
              + Add New System User
            </button>
            )}
          </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <Table columns={columns} data={users} />
            )}
        </div>

       

      {showModal && (
        <CreateAdmin
          onClose={() => setShowModal(false)}
          onSuccess={fetchUsers}   
        />
      )}

    </div>
    
  );
};

export default SystemUsers;
