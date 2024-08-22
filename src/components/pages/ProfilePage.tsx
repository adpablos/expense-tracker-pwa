/* eslint-disable import/no-named-as-default */
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { AppDispatch, RootState } from '../../store';
import { updateProfile } from '../../store/slices/authSlice';
import Button from '../common/Button';
import Input from '../common/Input';

const ProfilePage: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateProfile({ name, email }))
      .unwrap()
      .then(() => {
        // Manejar éxito, por ejemplo:
        console.log('Profile updated successfully');
      })
      .catch((error) => {
        // Manejar error, por ejemplo:
        console.error('Failed to update profile:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <Button type="submit">Update Profile</Button>
    </form>
  );
};

export default ProfilePage;
