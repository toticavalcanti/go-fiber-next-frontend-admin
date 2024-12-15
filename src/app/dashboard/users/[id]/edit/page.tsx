// src/app/(dashboard)/users/[id]/edit/page.tsx
'use client';

import { SyntheticEvent, useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { api } from '@/app/lib/api/fetch';
import Wrapper from '@/app/components/common/Wrapper';
import { Role } from '@/app/types/role';
import { User } from '@/app/types/user';

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [role_id, setRoleId] = useState('');
  const [roles, setRoles] = useState<Role[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesData, userData] = await Promise.all([
          api.get<Role[]>('/roles'),
          api.get<User>(`/users/${id}`)
        ]);

        setRoles(rolesData);
        setFirstName(userData.first_name);
        setLastName(userData.last_name);
        setEmail(userData.email);
        setRoleId(userData.role.id.toString());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      await api.put<void, {
        first_name: string;
        last_name: string;
        email: string;
        role_id: number;
      }>(`/users/${id}`, {
        first_name,
        last_name,
        email,
        role_id: parseInt(role_id)
      });

      router.push('/dashboard/users');
    } catch (error) {
      console.error('Error updating user:', error);
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
              value={first_name}
              onChange={e => setFirstName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Last Name</label>
            <input 
              className="form-control"
              value={last_name}
              onChange={e => setLastName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input 
              className="form-control"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label>Role</label>
            <select 
              className="form-control"
              value={role_id}
              onChange={e => setRoleId(e.target.value)}
            >
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