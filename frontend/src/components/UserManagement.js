import React, { useEffect, useState } from 'react';
import { getUsers, updateUser, deleteUser } from '../services/api';
import './UserManagement.css';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users. Please try again.');
      }
    };

    fetchUsers();
  }, []);

  const handleAdminToggle = async (id, currentStatus) => {
    const newStatus = !currentStatus;
    try {
      await updateUser(id, { isAdmin: newStatus });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, isAdmin: newStatus } : user
        )
      );
      setFilteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, isAdmin: newStatus } : user
        )
      );
      alert(`User ${newStatus ? 'granted' : 'removed from'} admin status.`);
    } catch (err) {
      console.error('Error updating user admin status:', err);
      alert('Failed to update user admin status.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      setFilteredUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== id)
      );
      alert('User deleted successfully.');
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user.');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    const searchResults = users.filter((user) =>
      user.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredUsers(searchResults);
  };

  return (
    <div className="user-management">
      <div className="header-container">
        <h3 className="user-management-title">User Management</h3>
        <input
          type="text"
          className="search-input"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {error && <p className="error">{error}</p>}

      <table className="user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Admin Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td data-label="Name">{user.name}</td>
              <td data-label="Email">{user.email}</td>
              <td data-label="Admin Status">
                <button
                  className={`status-btn ${user.isAdmin ? 'btn-true' : 'btn-false'
                    }`}
                  onClick={() => handleAdminToggle(user._id, user.isAdmin)}
                >
                  {user.isAdmin ? 'True' : 'False'}
                </button>
              </td>
              <td data-label="Actions">
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
