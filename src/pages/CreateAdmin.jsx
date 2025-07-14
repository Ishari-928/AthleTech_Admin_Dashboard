import React, { useState } from 'react';

const CreateAdmin = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    contact_number: '',
    role: 'admin',
    image_url: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    await fetch("http://localhost:8080/api/v1/admin_auth/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(form),
    });
    alert("Admin created!");
  };

  return (
    <div className="p-4">
      <h2>Create New Admin</h2>
      <input name="username" placeholder="Name" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <input name="password" placeholder="Password" onChange={handleChange} />
      <input name="contact_number" placeholder="Contact" onChange={handleChange} />
      <select name="role" onChange={handleChange}>
        <option value="admin">Admin</option>
        <option value="superadmin">Super Admin</option>
      </select>
      <input name="image_url" placeholder="Image URL" onChange={handleChange} />
      <button onClick={handleSubmit}>Create</button>
    </div>
  );
};

export default CreateAdmin;
