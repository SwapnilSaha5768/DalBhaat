import React, { useEffect, useState } from 'react';
import { getUsers, updateUser, deleteUser } from '../../services/api';
import { useToast } from '../../context/ToastContext';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    // ... (fetchUsers logic unchanged)
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
      showToast(`User ${newStatus ? 'granted' : 'removed from'} admin status.`, 'success');
    } catch (err) {
      console.error('Error updating user admin status:', err);
      showToast('Failed to update user admin status.', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      setFilteredUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== id)
      );
      showToast('User deleted successfully.', 'success');
    } catch (err) {
      console.error('Error deleting user:', err);
      showToast('Failed to delete user.', 'error');
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h3 className="text-xl font-bold text-gray-800">User Management</h3>
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 text-sm text-center border-b border-red-100">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:hidden p-4">
        {filteredUsers.map((user) => (
          <div key={user._id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="font-medium text-gray-900">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
              <button
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${user.isAdmin
                  ? 'bg-green-100 text-green-800 hover:bg-green-200'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                onClick={() => handleAdminToggle(user._id, user.isAdmin)}
              >
                {user.isAdmin ? 'Admin' : 'User'}
              </button>
            </div>

            <div className="flex justify-end pt-2 border-t border-gray-100">
              <button
                className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-xs font-medium hover:bg-red-100 transition-colors w-full"
                onClick={() => handleDelete(user._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-8">
            No users found matching your search.
          </div>
        )}
      </div>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4 text-center">Admin Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${user.isAdmin
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    onClick={() => handleAdminToggle(user._id, user.isAdmin)}
                  >
                    {user.isAdmin ? 'Admin' : 'User'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    className="px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-xs font-medium hover:bg-red-100 transition-colors"
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center text-gray-500 text-sm">
                  No users found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserManagement;
