import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = ({ userId, userType, onBack }) => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    phone: '',
    department: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [userId]); // Add userId as dependency
  

  const fetchProfile = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/users/profile/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:4000/api/users/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
    setLoading(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <button onClick={onBack} className="back-btn">← Back to Dashboard</button>
        <h2>Profile Information</h2>
      </div>

      <div className="profile-card">
        <form onSubmit={handleUpdateProfile}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={profile.username}
              disabled
              className="disabled-input"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={profile.email || ''}
              onChange={(e) => setProfile({...profile, email: e.target.value})}
              disabled={!isEditing}
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={profile.phone || ''}
              onChange={(e) => setProfile({...profile, phone: e.target.value})}
              disabled={!isEditing}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              value={profile.department || ''}
              onChange={(e) => setProfile({...profile, department: e.target.value})}
              disabled={!isEditing}
              placeholder="Enter your department"
            />
          </div>

          <div className="profile-actions">
            {!isEditing ? (
              <button type="button" onClick={() => setIsEditing(true)} className="edit-btn">
                Edit Profile
              </button>
            ) : (
              <>
                <button type="submit" disabled={loading} className="save-btn">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn">
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
