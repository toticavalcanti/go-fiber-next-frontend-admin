// src/app/(dashboard)/roles/create/page.tsx
'use client';

import { SyntheticEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/lib/api/fetch';
import Wrapper from '@/app/components/common/Wrapper';
import { Permission } from '@/app/types/permission';

export default function CreateRolePage() {
  const router = useRouter();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [name, setName] = useState('');

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const data = await api.get<Permission[]>('/permissions');
        setPermissions(data);
      } catch (error) {
        console.error('Error fetching permissions:', error);
      }
    };

    fetchPermissions();
  }, []);

  const togglePermission = (id: number) => {
    setSelected(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    
    try {
      await api.post<void, {
        name: string;
        permissions: number[];
      }>('/roles', {
        name,
        permissions: selected
      });

      router.push('/dashboard/roles');
    } catch (error) {
      console.error('Error creating role:', error);
    }
  };

  return (
    <Wrapper>
      <form onSubmit={handleSubmit}>
        <div className="form-group row">
          <label htmlFor="name" className="col-sm-2 col-form-label">Name</label>
          <div className="col-sm-10">
            <input
              type="text" 
              className="form-control" 
              name="name" 
              id="name"
              onChange={e => setName(e.target.value)}
            />
          </div>
        </div>
        
        <div className="mb-3 row">
          <label className="col-sm-2 col-form-label">Permissions</label>
          <div className="col-sm-10">
            {permissions.map((permission) => (
              <div className="form-check form-check-inline col-3" key={permission.id}>
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  value={permission.id}
                  checked={selected.includes(permission.id)}
                  onChange={() => togglePermission(permission.id)}
                />
                <label className="form-check-label">{permission.name}</label>
              </div>
            ))}
          </div>
        </div>
        <button className="btn btn-outline-secondary">Save</button>
      </form>
    </Wrapper>
  );
}