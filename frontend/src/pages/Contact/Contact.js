import React, { useEffect, useState } from 'react';
import { getAdminUsers } from '../../services/api';
import './Contact.css';

function Contact() {
  const [adminUsers, setAdminUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminUsers = async () => {
      try {
        const users = await getAdminUsers();
        setAdminUsers(users);
      } catch (error) {
        console.error('Error fetching admin users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminUsers();
  }, []);

  if (loading) return <p>Loading admin users...</p>;

  return (
    <div className="contact">
      <h2 className="contact-title">Admin Contact List</h2>
      <ul className="contact-list">
        {adminUsers.map((user) => (
          <li key={user._id} className="contact-item">
            <h4>{user.name}</h4>
            <p>Email: {user.email}</p>
            
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Contact;
