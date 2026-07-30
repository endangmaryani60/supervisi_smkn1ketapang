import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, CheckCircle2, Target, ShieldCheck, Printer, Search, Filter, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { triggerPrint } from '../../utils/printHelper';
import { Pagination } from '../common/Pagination';

export const SupervisionProgram: React.FC = () => {
  const { schoolSettings, teachers, setActiveTab, selectedTeacherId, setSelectedTeacherId, user } = useAuth();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Selesai' | 'Sedang Berjalan' | 'Belum'>('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Requirement: 4 guru per halaman

  const isGuru = user?.role === 'Guru';
  const relevantTeacherId = (isGuru && user?.teacherId)
    ? user.teacherId
    : (selectedTeacherId || teachers[0]?.id || '');

  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.className.toLowerCase().includes(search.toLowerCase()) ||
      t.nip.includes(search);

    const matchesStatus = statusFilter === 'Semua' || t.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage) || 1;
  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Jump automatically to the page containing the active teacher
  const jumpToTeacherPage = (teacherId: string) => {
    if (!teacherId) return;
    const idx = filteredTeachers.findIndex((t) => t.id === teacherId);
    if (idx !== -1) {
      const page = Math.floor(idx / itemsPerPage) + 1;
      setCurrentPage(page);
    }
  };

  useEffect(() => {
    if (relevantTeacherId) {
      jumpToTeacherPage(relevantTeacherId);
    }
  }, [relevantTeacherId, search, statusFilter]);

  const handleSelectTeacher = (teacherId: string) => {
    setSelectedTeacherId(teacherId);
    jumpToTeacherPage(teacherId);
  };

  const handlePrintProgram = () => {
    if (relevantTeacherId) {
      jumpToTeacherPage(relevantTeacherId);
    }
    setTimeout(() => {
      triggerPrint('program-document-card', `Program_Supervisi_${schoolSettings.schoolName}`);
    }, 150);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as any);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Printable Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="serif-display text-2xl font-bold text-[#1A1A1A] flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-[#1A1A1A]" />
            Program Supervisi Akademik {schoolSettings.schoolName}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Tahun Pelajaran {schoolSettings.academicYear} — Semester {schoolSettings.semester}
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrintProgram}
          className="inline-flex items-center gap-2 rounded border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-800 hover:bg-gray-50 shadow-sm transition-colors"
        >
          <Printer className="h-4 w-4" /> Cetak Program Formal
        </button>
      </div>

      <div id="program-document-card" className="space-y-6">
        {/* Kop Surat Program Header */}
        <div className="hidden print:block text-center border-b-2 border-slate-900 pb-4 relative">
          <div className="space-y-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">Pemerintah Kabupaten / Kota {schoolSettings.district}</h2>
            <h1 className="text-xl font-black uppercase text-slate-900 tracking-tight">{schoolSettings.schoolName}</h1>
            <p className="text-xs text-slate-600">{schoolSettings.address} — {schoolSettings.district}</p>
            <p className="text-[11px] font-semibold text-slate-500">
              DOKUMEN PROGRAM DOKUMEN SUPERVISI AKADEMIK (SI SUPER) — TP {schoolSettings.academicYear} SEMESTER {schoolSettings.semester.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Narrative Section: Latar Belakang & Tujuan */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="stat-card rounded-lg p-5 space-y-3">
            <h2 className="serif-display text-base font-bold text-[#1A1A1A] flex items-center gap-2 border-b border-gray-100 pb-2">
              <Target className="h-4 w-4 text-[#1A1A1A]" /> Latar Belakang & Tujuan Strategis
            </h2>
            <div className="text-xs text-gray-600 leading-relaxed space-y-2">
              <p>
                Supervisi Akademik merupakan salah satu tugas pokok Kepala Sekolah dan Pengawas Pembina dalam rangka penjaminan mutu serta peningkatan kualitas pembelajaran di sekolah.
              </p>
              <p>
                Seiring dengan kebijakan Kurikulum Nasional terbaru, supervisi tidak lagi bersifat penilaian administratif normatif semata, melainkan berfokus pada pendampingan klinis untuk mengoptimalkan <strong className="text-slate-900">Pembelajaran Mendalam</strong> dan penguatan karakter <strong className="text-slate-900">Kokurikuler</strong> murid.
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-800 font-medium pt-1">
                <li>Meningkatkan kompetensi pedagogik dan profesionalisme guru.</li>
                <li>Memastikan keselarasan perencanaan, pelaksanaan, dan asesmen.</li>
                <li>Memberikan umpan balik konstruktif dan rekomendasi konkret.</li>
              </ul>
            </div>
          </div>

          <div className="stat-card rounded-lg p-5 space-y-3">
            <h2 className="serif-display text-base font-bold text-[#1A1A1A] flex items-center gap-2 border-b border-gray-100 pb-2">
              <ShieldCheck className="h-4 w-4 text-[#1A1A1A]" /> Teknik & Metode Supervisi
            </h2>
            <div className="text-xs text-gray-600 leading-relaxed space-y-2.5">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Studi Dokumen & Pra-Observasi:</strong>
                  Penelaahan Modul Ajar/RPP (20 komponen) serta wawancara kesiapan belajar.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Observasi Kelas (Kunjungan Kelas):</strong>
                  Pengamatan langsung implementasi Pembelajaran Mendalam, pengelolaan kelas, dan asesmen formatif.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block">Pasca-Observasi & Pendampingan:</strong>
                  Diskusi reflektif, pemberian umpan balik konstruktif, dan kesepakatan rencana tindak lanjut.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Synchronized Schedule Table */}
        <div className="stat-card rounded-lg p-5 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div>
              <h2 className="serif-display text-base font-bold text-[#1A1A1A] flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#1A1A1A]" />
                Tabel Jadwal Sistematis Pelaksanaan Supervisi Akademik
              </h2>
              <p className="text-xs text-gray-500">
                Jadwal ini tersinkronisasi otomatis dari menu Data Guru dan Pengaturan Sekolah.
              </p>
            </div>

            {/* Search, Teacher Jump & Status Filter Controls */}
            <div className="flex flex-wrap items-center gap-2 no-print">
              <div className="relative inline-flex items-center gap-1">
                <UserCheck className="h-3.5 w-3.5 text-indigo-600" />
                <select
                  value={relevantTeacherId}
                  onChange={(e) => handleSelectTeacher(e.target.value)}
                  className="py-1.5 pl-2 pr-7 text-xs bg-amber-50 border border-amber-300 rounded-lg font-bold text-amber-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  title="Pilih Guru untuk Lompat ke Halamannya"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.subject})
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative min-w-[180px] flex-1 sm:flex-initial">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Cari guru / mapel / NIP..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <div className="relative inline-flex items-center gap-1">
                <Filter className="h-3.5 w-3.5 text-slate-500" />
                <select
                  value={statusFilter}
                  onChange={handleStatusChange}
                  className="py-1.5 pl-2 pr-7 text-xs bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="Semua">Semua Status</option>
                  <option value="Selesai">Selesai Supervisi</option>
                  <option value="Sedang Berjalan">Sedang Berlangsung</option>
                  <option value="Belum">Belum Supervisi</option>
                </select>
              </div>
            </div>
          </div>

          {filteredTeachers.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-xs">
              Belum ada data guru yang sesuai dengan kata kunci pencarian atau filter status.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse border border-slate-200">
                  <thead>
                    <tr className="bg-slate-50 border-y border-gray-200 text-gray-500 font-bold uppercase tracking-widest text-[10px]">
                      <th className="py-2.5 px-3 border-r border-slate-200">No</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">Nama Guru & NIP</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">Mata Pelajaran</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">Kelas</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">Pra-Observasi</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">Observasi Kelas</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">Pasca-Observasi</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">Supervisor</th>
                      <th className="py-2.5 px-3 border-r border-slate-200">Status</th>
                      <th className="py-2.5 px-3 text-right no-print">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedTeachers.map((teacher, idx) => {
                      const absoluteIndex = (currentPage - 1) * itemsPerPage + idx + 1;
                      const isRelevantTeacher = teacher.id === relevantTeacherId;
                      return (
                        <tr
                          key={teacher.id}
                          id={`teacher-row-${teacher.id}`}
                          className={`transition-colors ${
                            isRelevantTeacher
                              ? 'bg-amber-50/90 font-bold border-l-4 border-l-amber-600'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <td className="py-3 px-3 border-r border-slate-200 font-medium text-gray-500">{absoluteIndex}</td>
                          <td className="py-3 px-3 border-r border-slate-200">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-slate-900">{teacher.name}</span>
                              {isRelevantTeacher && (
                                <span className="no-print inline-flex items-center gap-0.5 rounded bg-amber-200 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-900">
                                  <UserCheck className="h-2.5 w-2.5" /> Terpilih
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-gray-500 font-normal">NIP: {teacher.nip || '-'}</div>
                          </td>
                          <td className="py-3 px-3 border-r border-slate-200 font-medium text-slate-800">{teacher.subject}</td>
                          <td className="py-3 px-3 border-r border-slate-200 font-semibold text-slate-900">{teacher.className}</td>
                          <td className="py-3 px-3 border-r border-slate-200 text-gray-700">{teacher.praDate || '-'}</td>
                          <td className="py-3 px-3 border-r border-slate-200 font-bold text-slate-900">{teacher.obsDate || '-'}</td>
                          <td className="py-3 px-3 border-r border-slate-200 text-gray-700">{teacher.pascaDate || '-'}</td>
                          <td className="py-3 px-3 border-r border-slate-200">
                            <div className="font-semibold text-slate-900">{schoolSettings.principalName}</div>
                            <div className="text-[10px] text-gray-500">Kepala Sekolah</div>
                          </td>
                          <td className="py-3 px-3 border-r border-slate-200">
                            {teacher.status === 'Selesai' && (
                              <span className="inline-flex rounded bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                                Selesai
                              </span>
                            )}
                            {teacher.status === 'Sedang Berjalan' && (
                              <span className="inline-flex rounded bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                                Sedang Berjalan
                              </span>
                            )}
                            {teacher.status === 'Belum' && (
                              <span className="inline-flex rounded bg-rose-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-800">
                                Belum
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right no-print">
                            <button
                              onClick={() => {
                                setSelectedTeacherId(teacher.id);
                                setActiveTab('instruments');
                              }}
                              className="rounded bg-[#1A1A1A] hover:bg-black text-white px-2.5 py-1 text-[11px] font-medium"
                            >
                              Instrumen
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Bar (4 items per page) */}
              <div className="pt-3 border-t border-slate-100 no-print">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={filteredTeachers.length}
                  itemsPerPage={itemsPerPage}
                  label="Guru"
                />
              </div>
            </>
          )}

          {/* Signature Box */}
          <div className="pt-6 border-t border-gray-200 grid grid-cols-2 gap-8 text-xs text-center break-inside-avoid">
            <div>
              <p className="text-gray-500 mb-1">Mengetahui,</p>
              <p className="font-bold text-slate-900">Pengawas Pembina Sekolah</p>
              <div className="h-16"></div>
              <p className="font-bold text-slate-900 underline">{schoolSettings.supervisorName}</p>
              <p className="text-[11px] text-gray-500">NIP. {schoolSettings.supervisorNip}</p>
            </div>

            <div>
              <p className="text-gray-500 mb-1">{schoolSettings.district}, {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="font-bold text-slate-900">Kepala {schoolSettings.schoolName}</p>
              <div className="h-16"></div>
              <p className="font-bold text-slate-900 underline">{schoolSettings.principalName}</p>
              <p className="text-[11px] text-gray-500">NIP. {schoolSettings.principalNip}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

