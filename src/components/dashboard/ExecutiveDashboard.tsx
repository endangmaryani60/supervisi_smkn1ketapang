import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  ArrowRight,
  FileText,
  UserPlus,
  ClipboardList,
  Search,
  Filter,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { WarningBanner } from '../common/WarningBanner';
import { Pagination } from '../common/Pagination';

export const ExecutiveDashboard: React.FC = () => {
  const { teachers, schoolSettings, setActiveTab, setSelectedTeacherId } = useAuth();

  const totalTeachers = teachers.length;
  const completed = teachers.filter((t) => t.status === 'Selesai').length;
  const inProgress = teachers.filter((t) => t.status === 'Sedang Berjalan').length;
  const pending = teachers.filter((t) => t.status === 'Belum').length;

  const percentageCompleted = totalTeachers > 0 ? Math.round((completed / totalTeachers) * 100) : 0;

  // 1. Missing Documents Pagination (5 per page)
  const teachersMissingDocs = teachers.filter((t) => !t.documents || t.documents.length === 0);
  const [missingDocsPage, setMissingDocsPage] = useState(1);
  const docsPerPage = 5;
  const totalMissingDocsPages = Math.ceil(teachersMissingDocs.length / docsPerPage) || 1;
  const paginatedMissingDocs = teachersMissingDocs.slice(
    (missingDocsPage - 1) * docsPerPage,
    missingDocsPage * docsPerPage
  );

  // 2. Agenda Search, Status Filter & Pagination (5 per page)
  const [agendaSearch, setAgendaSearch] = useState('');
  const [agendaStatusFilter, setAgendaStatusFilter] = useState<'Semua' | 'Selesai' | 'Sedang Berjalan' | 'Belum'>('Semua');
  const [agendaPage, setAgendaPage] = useState(1);
  const agendaPerPage = 5;

  const filteredAgendaTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(agendaSearch.toLowerCase()) ||
      t.subject.toLowerCase().includes(agendaSearch.toLowerCase()) ||
      t.className.toLowerCase().includes(agendaSearch.toLowerCase()) ||
      t.nip.includes(agendaSearch);

    const matchesStatus = agendaStatusFilter === 'Semua' || t.status === agendaStatusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalAgendaPages = Math.ceil(filteredAgendaTeachers.length / agendaPerPage) || 1;
  const paginatedAgenda = filteredAgendaTeachers.slice(
    (agendaPage - 1) * agendaPerPage,
    agendaPage * agendaPerPage
  );

  const handleAgendaSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgendaSearch(e.target.value);
    setAgendaPage(1);
  };

  const handleAgendaStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAgendaStatusFilter(e.target.value as any);
    setAgendaPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Warning Box if using default sample school identity */}
      <WarningBanner />

      {/* Header Banner */}
      <div className="rounded-xl bg-[#1A1A1A] p-6 text-white shadow-sm border border-gray-800">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-indigo-200">
              <TrendingUp className="h-3.5 w-3.5 text-indigo-300" /> Executive Dashboard SI SUPER
            </div>
            <h1 className="serif-display mt-2 text-2xl font-bold tracking-tight text-white md:text-3xl">
              Supervisi Akademik {schoolSettings.schoolName}
            </h1>
            <p className="mt-1 text-xs text-gray-300">
              Pengawas: <span className="font-semibold text-white">{schoolSettings.supervisorName}</span> | Kepala Sekolah: <span className="font-semibold text-white">{schoolSettings.principalName}</span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveTab('teacher-data')}
              className="inline-flex items-center gap-2 rounded-md bg-white/10 hover:bg-white/20 px-3.5 py-2 text-xs font-semibold text-white transition-colors border border-white/20"
            >
              <UserPlus className="h-4 w-4" /> Kelola Data Guru
            </button>
            <button
              onClick={() => setActiveTab('instruments')}
              className="inline-flex items-center gap-2 rounded-md bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 text-xs font-semibold text-white transition-colors shadow-sm"
            >
              <ClipboardList className="h-4 w-4" /> Mulai Supervisi
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Teachers */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="stat-card rounded-lg p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Guru</span>
            <div className="rounded-md bg-slate-100 p-2 text-slate-800">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="serif-display mt-2 text-3xl font-bold text-[#1A1A1A]">{totalTeachers}</div>
          <p className="mt-1 text-xs text-gray-500">Guru sasaran supervisi semester ini</p>
        </motion.div>

        {/* Completed */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="stat-card rounded-lg p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Selesai</span>
            <div className="rounded-md bg-emerald-100 p-2 text-emerald-800">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="serif-display mt-2 text-3xl font-bold text-emerald-950">{completed}</div>
          <p className="mt-1 text-xs text-emerald-700 font-medium">Laporan akhir telah disahkan</p>
        </motion.div>

        {/* In Progress */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="stat-card rounded-lg p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-widest">Sedang Berjalan</span>
            <div className="rounded-md bg-amber-100 p-2 text-amber-800">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="serif-display mt-2 text-3xl font-bold text-amber-950">{inProgress}</div>
          <p className="mt-1 text-xs text-amber-700 font-medium">Dalam tahap Pra/Obs/Pasca</p>
        </motion.div>

        {/* Pending */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="stat-card rounded-lg p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-rose-800 uppercase tracking-widest">Belum Supervisi</span>
            <div className="rounded-md bg-rose-100 p-2 text-rose-800">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="serif-display mt-2 text-3xl font-bold text-rose-950">{pending}</div>
          <p className="mt-1 text-xs text-rose-700 font-medium">Perlu penjadwalan observasi</p>
        </motion.div>
      </div>

      {/* Progress & Notification Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Progress Chart Card */}
        <div className="stat-card rounded-lg p-5 lg:col-span-1">
          <h3 className="serif-display text-base font-bold text-[#1A1A1A] mb-1">Capaian Progres Supervisi</h3>
          <p className="text-xs text-gray-500 mb-4">Persentase guru yang telah menyelesaikan seluruh tahapan.</p>

          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative flex h-36 w-36 items-center justify-center rounded-full bg-slate-50 border-8 border-slate-200">
              <div className="text-center">
                <span className="serif-display text-3xl font-bold text-[#1A1A1A]">{percentageCompleted}%</span>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tuntas</p>
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-2 border-t border-gray-100 pt-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-600 inline-block"></span> Selesai
              </span>
              <span className="font-bold text-[#1A1A1A]">{completed} Guru</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500 inline-block"></span> Sedang Berjalan
              </span>
              <span className="font-bold text-[#1A1A1A]">{inProgress} Guru</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500 inline-block"></span> Belum
              </span>
              <span className="font-bold text-[#1A1A1A]">{pending} Guru</span>
            </div>
          </div>
        </div>

        {/* Missing Devices Alert Box */}
        <div className="stat-card rounded-lg p-5 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="rounded bg-amber-100 p-1.5 text-amber-800">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="serif-display text-base font-bold text-[#1A1A1A]">Notifikasi Perangkat Belum Lengkap</h3>
                  <p className="text-xs text-gray-500">Guru yang belum mengunggah RPP / Modul Ajar di sistem.</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('documents')}
                className="text-xs font-semibold text-slate-800 hover:text-black flex items-center gap-1"
              >
                Ke Dokumen <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {teachersMissingDocs.length === 0 ? (
              <div className="rounded-md bg-emerald-50 border border-emerald-200 p-4 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600 mb-1" />
                <p className="text-xs font-bold text-emerald-900">Seluruh Guru Telah Mengunggah Perangkat!</p>
                <p className="text-[11px] text-emerald-700">Semua Modul Ajar/RPP telah siap untuk ditelaah pada instrumen Pra-Observasi.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {paginatedMissingDocs.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="flex items-center justify-between rounded-md bg-slate-50 border border-gray-200 p-2.5 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{teacher.name}</div>
                      <div className="text-[11px] text-gray-500">
                        Mapel: {teacher.subject} | Kelas: {teacher.className}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedTeacherId(teacher.id);
                        setActiveTab('documents');
                      }}
                      className="rounded bg-amber-800 hover:bg-amber-900 text-white px-2.5 py-1 text-[11px] font-medium transition-colors shrink-0"
                    >
                      Unggah Perangkat
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {teachersMissingDocs.length > 0 ? (
              <Pagination
                currentPage={missingDocsPage}
                totalPages={totalMissingDocsPages}
                onPageChange={setMissingDocsPage}
                totalItems={teachersMissingDocs.length}
                itemsPerPage={docsPerPage}
                label="Guru"
                className="w-full sm:w-auto"
              />
            ) : (
              <span>Tahun Pelajaran: {schoolSettings.academicYear} ({schoolSettings.semester})</span>
            )}

            <button onClick={() => setActiveTab('program')} className="font-semibold text-slate-900 hover:underline text-[11px] shrink-0">
              Lihat Program & Jadwal Lengkap &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Agenda Table with Search, Filter & Pagination */}
      <div className="stat-card rounded-lg p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-[#1A1A1A]" />
            <h3 className="serif-display text-base font-bold text-[#1A1A1A]">Agenda Kegiatan Supervisi Terdekat</h3>
          </div>

          {/* Search & Status Filter Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative min-w-[200px] flex-1 sm:flex-initial">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={agendaSearch}
                onChange={handleAgendaSearchChange}
                placeholder="Cari nama guru / mapel..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            {/* Status Filter */}
            <div className="relative inline-flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-slate-500" />
              <select
                value={agendaStatusFilter}
                onChange={handleAgendaStatusChange}
                className="py-1.5 pl-2 pr-7 text-xs bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="Semua">Semua Status Supervisi</option>
                <option value="Selesai">Selesai Supervisi</option>
                <option value="Sedang Berjalan">Sedang Berlangsung</option>
                <option value="Belum">Belum Supervisi</option>
              </select>
            </div>
          </div>
        </div>

        {filteredAgendaTeachers.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            Tidak ada data guru yang sesuai dengan pencarian atau filter status yang dipilih.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-y border-gray-200 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                    <th className="py-2.5 px-3">Nama Guru & Mapel</th>
                    <th className="py-2.5 px-3">Kelas</th>
                    <th className="py-2.5 px-3">Pra-Observasi</th>
                    <th className="py-2.5 px-3">Observasi Kelas</th>
                    <th className="py-2.5 px-3">Pasca-Observasi</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedAgenda.map((teacher) => (
                    <tr key={teacher.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{teacher.name}</div>
                        <div className="text-[11px] text-gray-500">{teacher.subject}</div>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-700">{teacher.className}</td>
                      <td className="py-3 px-3 text-gray-600">{teacher.praDate || '-'}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{teacher.obsDate || '-'}</td>
                      <td className="py-3 px-3 text-gray-600">{teacher.pascaDate || '-'}</td>
                      <td className="py-3 px-3">
                        {teacher.status === 'Selesai' && (
                          <span className="inline-flex rounded bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                            Selesai Supervisi
                          </span>
                        )}
                        {teacher.status === 'Sedang Berjalan' && (
                          <span className="inline-flex rounded bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                            Sedang Berlangsung
                          </span>
                        )}
                        {teacher.status === 'Belum' && (
                          <span className="inline-flex rounded bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-800">
                            Belum Supervisi
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedTeacherId(teacher.id);
                            setActiveTab('instruments');
                          }}
                          className="inline-flex items-center gap-1 rounded bg-slate-900 hover:bg-black text-white px-2.5 py-1 font-medium text-[11px] transition-colors shrink-0"
                        >
                          <FileText className="h-3 w-3" /> Buka Instrumen
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls for Agenda (5 per page) */}
            <div className="pt-3 border-t border-slate-100">
              <Pagination
                currentPage={agendaPage}
                totalPages={totalAgendaPages}
                onPageChange={setAgendaPage}
                totalItems={filteredAgendaTeachers.length}
                itemsPerPage={agendaPerPage}
                label="Guru"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

