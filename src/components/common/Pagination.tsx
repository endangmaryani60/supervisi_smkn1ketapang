import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  label?: string;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  label = 'Guru',
  className = '',
}) => {
  if (totalPages <= 1) {
    if (totalItems !== undefined && totalItems > 0) {
      return (
        <div className={`text-xs text-slate-500 font-medium ${className}`}>
          Menampilkan <span className="font-bold text-slate-900">{totalItems}</span> {label}
        </div>
      );
    }
    return null;
  }

  // Calculate pages to show
  const getPageNumbers = (): (number | string)[] => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, '...', totalPages];
    }

    if (currentPage >= totalPages - 2) {
      return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const pages = getPageNumbers();

  const startItem = itemsPerPage && totalItems ? (currentPage - 1) * itemsPerPage + 1 : undefined;
  const endItem = itemsPerPage && totalItems ? Math.min(currentPage * itemsPerPage, totalItems) : undefined;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600 ${className}`}>
      {totalItems !== undefined ? (
        <div>
          Menampilkan{' '}
          {startItem && endItem ? (
            <>
              <span className="font-bold text-slate-900">{startItem}</span> -{' '}
              <span className="font-bold text-slate-900">{endItem}</span> dari{' '}
            </>
          ) : null}
          <span className="font-bold text-slate-900">{totalItems}</span> {label}
        </div>
      ) : (
        <div>
          Halaman <span className="font-bold text-slate-900">{currentPage}</span> dari {totalPages}
        </div>
      )}

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs text-slate-700 shadow-sm transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" /> Prev
        </button>

        {pages.map((p, index) => {
          if (typeof p === 'string') {
            return (
              <span key={`ellipsis-${index}`} className="px-1.5 py-1 text-slate-400 font-bold select-none">
                ...
              </span>
            );
          }

          const isActive = p === currentPage;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`min-w-[30px] h-[30px] px-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
                isActive
                  ? 'bg-slate-900 text-white shadow-slate-900/10'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          );
        })}

        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium text-xs text-slate-700 shadow-sm transition-colors"
        >
          Next <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};
