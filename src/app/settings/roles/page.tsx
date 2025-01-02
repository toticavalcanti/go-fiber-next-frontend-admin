// src/app/(dashboard)/roles/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/app/lib/api/fetch';
import Wrapper from '@/app/components/common/Wrapper';
import { Role } from '@/app/types/role';

export default function RolesPage() {
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

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await api.delete<void>(`/roles/${id}`);
        setRoles(roles.filter((r) => r.id !== id));
      } catch (error) {
        console.error('Error deleting role:', error);
      }
    }
  };

  return (
    <Wrapper>
      <div className="btn-group mr-2">
        <Link 
          href="/dashboard/roles/create" 
          className="btn btn-sm mt-2 btn-outline-secondary"
        >
          Add
        </Link>
      </div>
      
      <div className="table-responsive">
        <table className="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role.id}>
                <td>{role.id}</td>
                <td>{role.name}</td>
                <td>
                  <div className="btn-group">
                    <Link 
                      href={`/dashboard/roles/${role.id}/edit`}
                      className="btn btn-sm btn-outline-secondary"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleDelete(role.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Wrapper>
  );
}