// src/app/(dashboard)/users/create/page.tsx
'use client';

import { SyntheticEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/lib/api/fetch';
import Wrapper from '@/app/components/common/Wrapper';
import { Role } from '@/app/types/role';

export default function CreateUserPage() {
  const router = useRouter();
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role_id, setRoleId] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const data = await api.get<Role[]>('/roles');
        setRoles(data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };
    
    fetchRoles();
  }, []);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      await api.post<void, {
        first_name: string;
        last_name: string;
        email: string;
        role_id: number;
      }>('/users', {
        first_name,
        last_name,
        email,
        role_id: parseInt(role_id)
      });

      router.push('/dashboard/users');
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <Wrapper>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="mb-3">
            <label>First Name</label>
            <input 
              className="form-control" 
              onChange={e => setFirstName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Last Name</label>
            <input 
              className="form-control" 
              onChange={e => setLastName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input 
              className="form-control" 
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Role</label>
            <select 
              className="form-control"
              onChange={e => setRoleId(e.target.value)}
            >
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-outline-secondary">Save</button>
        </div>
      </form>
    </Wrapper>
  );
}