// src/app/(dashboard)/profile/page.tsx
'use client';

import { SyntheticEvent, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/app/lib/store/configureStore';
import { api } from '@/app/lib/api/fetch';
import { updateUserSuccess } from '@/app/lib/store/actions/authActions';
import Wrapper from '@/app/components/common/Wrapper';
import { User } from '@/app/types/user';

interface UpdateUserResponse {
  data: User;
}

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.first_name);
      setLastName(user.last_name);
      setEmail(user.email);
    }
  }, [user]);

  const infoSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.put<UpdateUserResponse, {
        first_name: string;
        last_name: string;
        email: string;
      }>('/users/info', {
        first_name,
        last_name,
        email,
      });

      const updatedUser = response.data;

      dispatch(
        updateUserSuccess({
          user: updatedUser
        })
      );

      alert('User information updated successfully!');
    } catch (error) {
      console.error('Error updating user info:', error);
      alert('Failed to update user information.');
    } finally {
      setLoading(false);
    }
  };

  const passwordSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (password !== confirm_password) {
        alert('Passwords do not match.');
        setLoading(false);
        return;
      }

      await api.put<{ message: string }, {
        password: string;
        confirm_password: string;
      }>('/users/password', {
        password,
        confirm_password,
      });

      alert('Password updated successfully.');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <Wrapper>
      <h2>Account Information</h2>
      <hr />
      <form onSubmit={infoSubmit}>
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            className="form-control"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            className="form-control"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-outline-secondary mt-3" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>

      <h2 className="mt-4">Change Password</h2>
      <hr />
      <form onSubmit={passwordSubmit}>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password Confirm</label>
          <input
            type="password"
            className="form-control"
            value={confirm_password}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-outline-secondary mt-3" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </form>
    </Wrapper>
  );
}
