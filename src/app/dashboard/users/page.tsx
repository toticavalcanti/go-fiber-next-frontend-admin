// src/app/(dashboard)/users/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/app/lib/api/fetch';
import Wrapper from '@/app/components/common/Wrapper';
import Paginator from '@/app/components/common/Paginator';
import { User } from '@/app/types/user';

interface UsersResponse {
  data: User[];
  meta: {
    last_page: number;
  };
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await api.get<UsersResponse>(`/users?page=${page}`);
        setUsers(data.data);
        setLastPage(data.meta.last_page);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    
    fetchUsers();
  }, [page]);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete<void>(`/users/${id}`);
        setUsers(users.filter((u) => u.id !== id));
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <Wrapper>
      <div className="btn-group mr-2">
        <Link 
          href="/dashboard/users/create" 
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
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.first_name} {user.first_name}</td>
                <td>{user.email}</td>
                <td>{user.role.name}</td>
                <td>
                  <div className="btn-group mr-2">
                    <Link 
                      href={`/dashboard/users/${user.id}/edit`}
                      className="btn btn-sm btn-outline-secondary"
                    >
                      Edit
                    </Link>
                    <button 
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleDelete(user.id)}
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

      <Paginator page={page} lastPage={lastPage} pageChanged={setPage} />
    </Wrapper>
  );
}