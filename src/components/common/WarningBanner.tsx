import React from 'react';
import { AlertTriangle, ArrowRight, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const WarningBanner: React.FC = () => {
  const { schoolSettings, setActiveTab, user } = useAuth();

  if (!schoolSettings.isSampleData || user?.role !== 'Kepala Sekolah') {
    return null;
  }

  return (
    <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 shadow-sm transition-all duration-200">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-lg bg-amber-200/80 p-2 text-amber-800">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-amber-900">Perhatian: Data Identitas Sekolah</h4>
            <p className="text-sm text-amber-800">
              Identitas sekolah masih menggunakan data contoh. Silakan perbarui Nama Sekolah, Kepala Sekolah, dan Pengawas agar dokumen resmi terbit secara akurat.
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('school-settings')}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          <Settings className="h-4 w-4" />
          Isi Identitas Sekarang
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
