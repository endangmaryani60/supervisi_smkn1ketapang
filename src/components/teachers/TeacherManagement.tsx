import React, { useState } from 'react';
import { Users, UserPlus, Search, Edit2, Trash2, Upload, FileText, Calendar, CheckCircle2, Filter } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TeacherData, TeacherDocument } from '../../types';
import { Pagination } from '../common/Pagination';

export const TeacherManagement: React.FC = () => {
  const { teachers, updateTeachersList, selectedTeacherId, setSelectedTeacherId, setActiveTab } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Selesai' | 'Sedang Berjalan' | 'Belum'>('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // 5 Guru per halaman

  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<TeacherData | null>(null);
  const [deletingTeacher, setDeletingTeacher] = useState<TeacherData | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [nip, setNip] = useState('');
  const [subject, setSubject] = useState('');
  const [className, setClassName] = useState('');
  const [pangkatGolongan, setPangkatGolongan] = useState('');
  const [praDate, setPraDate] = useState('');
  const [obsDate, setObsDate] = useState('');
  const [pascaDate, setPascaDate] = useState('');
  const [status, setStatus] = useState<'Belum' | 'Sedang Berjalan' | 'Selesai'>('Belum');

  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.nip.includes(search) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.className.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'Semua' || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage) || 1;
  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as any);
    setCurrentPage(1);
  };

  const openAddModal = () => {
    setEditingTeacher(null);
    setName('');
    setNip('');
    setSubject('');
    setClassName('');
    setPangkatGolongan('');
    setPraDate('');
    setObsDate('');
    setPascaDate('');
    setStatus('Belum');
    setShowModal(true);
  };

  const openEditModal = (teacher: TeacherData) => {
    setEditingTeacher(teacher);
    setName(teacher.name);
    setNip(teacher.nip);
    setSubject(teacher.subject);
    setClassName(teacher.className);
    setPangkatGolongan(teacher.pangkatGolongan || '');
    setPraDate(teacher.praDate || '');
    setObsDate(teacher.obsDate || '');
    setPascaDate(teacher.pascaDate || '');
    setStatus(teacher.status);
    setShowModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !subject || !className) return;

    if (editingTeacher) {
      const updatedList = teachers.map((t) => {
        if (t.id === editingTeacher.id) {
          return {
            ...t,
            name,
            nip,
            subject,
            className,
            pangkatGolongan,
            praDate,
            obsDate,
            pascaDate,
            status,
          };
        }
        return t;
      });
      updateTeachersList(updatedList);
    } else {
      const newTeacher: TeacherData = {
        id: 't-' + Date.now(),
        name,
        nip,
        subject,
        className,
        pangkatGolongan,
        praDate,
        obsDate,
        pascaDate,
        status,
        documents: [],
      };
      updateTeachersList([...teachers, newTeacher]);
    }

    setShowModal(false);
  };

  const handleDelete = (teacher: TeacherData) => {
    setDeletingTeacher(teacher);
  };

  const confirmDeleteTeacher = () => {
    if (!deletingTeacher) return;
    const updatedList = teachers.filter((t) => t.id !== deletingTeacher.id);
    updateTeachersList(updatedList);
    if (selectedTeacherId === deletingTeacher.id) {
      setSelectedTeacherId(updatedList[0]?.id || '');
    }
    setDeletingTeacher(null);
  };

  const handleQuickUpload = (teacher: TeacherData, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newDoc: TeacherDocument = {
      id: 'doc-' + Date.now(),
      name: file.name,
      type: file.name.toLowerCase().includes('rpp') ? 'RPP' : 'Modul Ajar',
      fileUrl: '#',
      uploadDate: new Date().toISOString().split('T')[0],
      size: (file.size / 1024).toFixed(0) + ' KB',
    };

    const updatedList = teachers.map((t) => {
      if (t.id === teacher.id) {
        return {
          ...t,
          documents: [...(t.documents || []), newDoc],
        };
      }
      return t;
    });

    updateTeachersList(updatedList);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="h-6 w-6 text-indigo-600" />
            Manajemen Data Guru Disupervisi
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola data guru sasaran, alokasi mata pelajaran, kelas, serta jadwal supervisi tahap Pra, Observasi, dan Pasca.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors"
        >
          <UserPlus className="h-4 w-4" /> Tambah Guru Baru
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-md flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Cari berdasarkan nama, NIP, mapel, atau kelas..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          />
        </div>

        <div className="relative inline-flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="py-2 pl-2.5 pr-8 text-xs bg-white border border-slate-300 rounded-lg font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-600"
          >
            <option value="Semua">Semua Status Supervisi</option>
            <option value="Selesai">Selesai Supervisi</option>
            <option value="Sedang Berjalan">Sedang Berlangsung</option>
            <option value="Belum">Belum Supervisi</option>
          </select>
        </div>
      </div>

      {/* Teacher Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Guru & NIP</th>
              <th className="py-3 px-4">Mapel & Kelas</th>
              <th className="py-3 px-4">Jadwal Supervisi (Pra, Obs, Pasca)</th>
              <th className="py-3 px-4">Perangkat Pembelajaran</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredTeachers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  Tidak ada data guru yang cocok.
                </td>
              </tr>
            ) : (
              paginatedTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{teacher.name}</div>
                    <div className="text-[11px] text-slate-500">NIP: {teacher.nip || '-'}</div>
                    <div className="text-[10px] text-slate-400">{teacher.pangkatGolongan || ''}</div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{teacher.subject}</div>
                    <div className="text-[11px] text-indigo-600 font-medium">Kelas {teacher.className}</div>
                  </td>

                  <td className="py-3.5 px-4 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 w-8">PRA:</span>
                      <span className="font-medium text-slate-700">{teacher.praDate || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-indigo-600 w-8">OBS:</span>
                      <span className="font-bold text-indigo-900">{teacher.obsDate || '-'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 w-8">PASCA:</span>
                      <span className="font-medium text-slate-700">{teacher.pascaDate || '-'}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {teacher.documents && teacher.documents.length > 0 ? (
                      <div className="space-y-1">
                        {teacher.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700 font-medium mr-1"
                          >
                            <FileText className="h-3 w-3 text-indigo-600" /> {doc.name}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[11px] text-amber-600 italic">Belum ada file</span>
                    )}

                    <div className="mt-1">
                      <label className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer">
                        <Upload className="h-3 w-3" /> Unggah File
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          className="hidden"
                          onChange={(e) => handleQuickUpload(teacher, e)}
                        />
                      </label>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {teacher.status === 'Selesai' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-800">
                        <CheckCircle2 className="h-3 w-3" /> Selesai
                      </span>
                    )}
                    {teacher.status === 'Sedang Berjalan' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-semibold text-amber-800">
                        Berjalan
                      </span>
                    )}
                    {teacher.status === 'Belum' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-semibold text-rose-800">
                        Belum
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => openEditModal(teacher)}
                        title="Edit Data Guru & Jadwal"
                        className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedTeacherId(teacher.id);
                          setActiveTab('instruments');
                        }}
                        title="Buka Instrumen Supervisi"
                        className="rounded p-1 text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <FileText className="h-4 w-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(teacher)}
                        title="Hapus Data Guru"
                        className="rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar for Teacher Management */}
      {filteredTeachers.length > 0 && (
        <div className="p-3 bg-white rounded-lg border border-slate-200">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredTeachers.length}
            itemsPerPage={itemsPerPage}
            label="Guru"
          />
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
              {editingTeacher ? 'Edit Data & Jadwal Supervisi Guru' : 'Tambah Data Guru Baru'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap Guru (dengan Gelar)</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso, S.Pd."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NIP Guru</label>
                  <input
                    type="text"
                    value={nip}
                    onChange={(e) => setNip(e.target.value)}
                    placeholder="19850415 201001 1 005"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pangkat / Golongan</label>
                  <input
                    type="text"
                    value={pangkatGolongan}
                    onChange={(e) => setPangkatGolongan(e.target.value)}
                    placeholder="Penata Muda / III-a"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mata Pelajaran</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Bahasa Indonesia"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas yang Diampu</label>
                  <input
                    type="text"
                    required
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="VII-A"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  />
                </div>
              </div>

              {/* Jadwal Supervisi Section */}
              <div className="rounded-lg bg-indigo-50/50 p-3 border border-indigo-100 space-y-3">
                <span className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-indigo-600" /> Alokasi Tanggal Jadwal Supervisi
                </span>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Pra-Observasi</label>
                    <input
                      type="date"
                      value={praDate}
                      onChange={(e) => setPraDate(e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-indigo-900 mb-1">Observasi Kelas</label>
                    <input
                      type="date"
                      value={obsDate}
                      onChange={(e) => setObsDate(e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-indigo-400 rounded text-xs text-indigo-950 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-700 mb-1">Pasca-Observasi</label>
                    <input
                      type="date"
                      value={pascaDate}
                      onChange={(e) => setPascaDate(e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status Progres Supervisi</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                >
                  <option value="Belum">Belum Supervisi</option>
                  <option value="Sedang Berjalan">Sedang Berjalan</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  {editingTeacher ? 'Simpan Perubahan' : 'Tambah Guru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deletingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-100">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="rounded-full bg-rose-100 p-2.5">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Konfirmasi Hapus Data Guru</h3>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Apakah Anda yakin ingin menghapus data guru <strong className="text-slate-900">{deletingTeacher.name}</strong> (NIP: {deletingTeacher.nip || '-'})? 
              <br />
              <span className="text-rose-600 font-medium">Tindakan ini tidak dapat dibatalkan. Seluruh berkas dan jadwal supervisi terkait juga akan dihapus.</span>
            </p>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingTeacher(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteTeacher}
                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 shadow-sm transition-colors"
              >
                Ya, Hapus Data Guru
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
