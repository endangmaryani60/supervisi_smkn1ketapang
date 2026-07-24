import React, { useState } from 'react';
import { Settings, Save, School, User, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SchoolSettings as SchoolSettingsType } from '../../types';

export const SchoolSettings: React.FC = () => {
  const { schoolSettings, updateSchoolSettings } = useAuth();
  const [formData, setFormData] = useState<SchoolSettingsType>(schoolSettings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SchoolSettingsType = {
      ...formData,
      isSampleData: false, // Mark as customized so warning box disappears!
    };
    updateSchoolSettings(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="h-6 w-6 text-indigo-600" />
            Pengaturan Identitas Sekolah & Supervisor
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Data identitas ini akan otomatis digunakan pada kop surat, instrumen, dan tanda tangan seluruh laporan resmi.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Pengaturan sekolah berhasil disimpan! Data telah diperbarui di seluruh instrumen dan laporan.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Identitas Sekolah */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <School className="h-4 w-4 text-indigo-600" /> Identitas Satuan Pendidikan
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Nama Satuan Pendidikan / Sekolah</label>
              <input
                type="text"
                required
                value={formData.schoolName}
                onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                placeholder="Contoh: SMP Negeri 1 Unggul"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Alamat Sekolah</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Jl. Pendidikan No. 45"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Kabupaten / Kota</label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                placeholder="Kota Nusantara"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Tahun Pelajaran</label>
              <input
                type="text"
                required
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                placeholder="2025/2026"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Semester</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value as 'Ganjil' | 'Genap' })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="Ganjil">Ganjil</option>
                <option value="Genap">Genap</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pejabat & Supervisor */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
            <User className="h-4 w-4 text-indigo-600" /> Penanggung Jawab & Supervisor
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Nama Kepala Sekolah (Supervisor Utama)</label>
              <input
                type="text"
                required
                value={formData.principalName}
                onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                placeholder="Drs. H. Ahmad Dahlan, M.Pd."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">NIP Kepala Sekolah</label>
              <input
                type="text"
                required
                value={formData.principalNip}
                onChange={(e) => setFormData({ ...formData, principalNip: e.target.value })}
                placeholder="19750101 199803 1 002"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Nama Pengawas Pembina Sekolah</label>
              <input
                type="text"
                required
                value={formData.supervisorName}
                onChange={(e) => setFormData({ ...formData, supervisorName: e.target.value })}
                placeholder="A.Rani, S.Pd.,MPd"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">NIP Pengawas Sekolah</label>
              <input
                type="text"
                required
                value={formData.supervisorNip}
                onChange={(e) => setFormData({ ...formData, supervisorNip: e.target.value })}
                placeholder="19640321 199103 1 012"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <Save className="h-4 w-4" /> Simpan Pengaturan Sekolah
          </button>
        </div>
      </form>
    </div>
  );
};
