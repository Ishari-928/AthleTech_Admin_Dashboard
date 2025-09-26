import React, {useState} from "react";
import api from "../../api/api";

const CreateAdmin = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact_no: "",
    user_role: "admin",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/v1/admins", form);
      alert(res.data.message); 
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div
        className="rounded-lg p-6 w-full max-w-md"
        style={{
          background: 'linear-gradient(135deg, #05041D 0%, #FF5722 100%)',
        }}
      >
        <h1 className="text-3xl font-bold mb-4 text-[#FFFFFF] text-center">
          Create New System User
        </h1>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-m font-medium text-gray-200 mb-1">
             Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-m font-medium text-gray-200 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-m font-medium text-gray-200 mb-1">
              Contact Number
            </label>
            <input
              type="text"
              name="contact_no"
              placeholder="Contact Number"
              value={form.contact_no}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-m font-medium text-gray-200 mb-1">
              Select User Role
            </label>
            <select
              name="user_role"
              value={form.user_role}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#FF5722]"
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
          

          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded font-bold text-gray-200 hover:bg-[#B33F18]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#FF5722] text-white font-bold rounded hover:bg-[#B33F18]"
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default CreateAdmin;
