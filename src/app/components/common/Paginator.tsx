// src/app/components/common/Paginator.tsx
'use client';

interface PaginatorProps {
  page: number;
  lastPage: number;
  pageChanged: (page: number) => void;
}

export default function Paginator({ page, lastPage, pageChanged }: PaginatorProps) {
  const next = () => {
    if (page < lastPage) {
      pageChanged(page + 1);
    }
  };

  const prev = () => {
    if (page >= 1) {
      pageChanged(page - 1);
    }
  };

  return (
    <nav>
      <ul className="pagination">
        <li className="page-item">
          <button className="page-link" onClick={prev}>
            Previous
          </button>
        </li>
        <li className="page-item">
          <button className="page-link" onClick={next}>
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}