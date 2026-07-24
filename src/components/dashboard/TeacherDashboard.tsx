import React from 'react';
import { motion } from 'motion/react';
import {
  UserCheck,
  Calendar,
  FileText,
  Upload,
  CheckCircle2,
  Clock,
  AlertCircle,
  Award,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getSessionByTeacherId } from '../../services/storage';

export const TeacherDashboard: React.FC = () => {
  const { user, teachers, schoolSettings, setActiveTab } = useAuth();

  // Find teacher record matching user
  const teacherRecord = teachers.find(
    (t) => t.id === user?.teacherId || t.nip.replace(/\s+/g, '') === user?.nip.replace(/\s+/g, '')
  ) || teachers[0];

  const session = teacherRecord ? getSessionByTeacherId(teacherRecord.id) : null;

  if (!teacherRecord) {
    return (
      <div className="p-6 text-center text-slate-600">
        Data guru belum terhubung dengan akun ini.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-xl bg-[#1A1A1A] p-6 text-white shadow-sm border border-gray-800">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-300">
              <UserCheck className="h-3.5 w-3.5 text-emerald-300" /> Dashboard Guru
            </div>
            <h1 className="serif-display mt-2 text-2xl font-bold tracking-tight text-white md:text-3xl">
              Selamat Datang, {teacherRecord.name}
            </h1>
            <p className="mt-1 text-xs text-gray-300">
              Mata Pelajaran: <span className="font-semibold text-white">{teacherRecord.subject}</span> | Kelas: <span className="font-semibold text-white">{teacherRecord.className}</span> | {schoolSettings.schoolName}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('documents')}
              className="inline-flex items-center gap-2 rounded-md bg-white/10 hover:bg-white/20 px-3.5 py-2 text-xs font-semibold text-white transition-colors border border-white/20"
            >
              <Upload className="h-4 w-4" /> Unggah Modul Ajar/RPP
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className="inline-flex items-center gap-2 rounded-md bg-emerald-700 hover:bg-emerald-800 px-3.5 py-2 text-xs font-semibold text-white transition-colors shadow-sm"
            >
              <FileText className="h-4 w-4" /> Lihat Laporan Saya
            </button>
          </div>
        </div>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Status Supervisi */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="stat-card rounded-lg p-5"
        >
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status Supervisi</span>
          <div className="mt-3 flex items-center gap-2">
            {teacherRecord.status === 'Selesai' && (
              <span className="inline-flex items-center gap-1.5 rounded bg-emerald-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Selesai
              </span>
            )}
            {teacherRecord.status === 'Sedang Berjalan' && (
              <span className="inline-flex items-center gap-1.5 rounded bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-800">
                <Clock className="h-3.5 w-3.5 text-amber-600" /> Sedang Berjalan
              </span>
            )}
            {teacherRecord.status === 'Belum' && (
              <span className="inline-flex items-center gap-1.5 rounded bg-rose-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-rose-800">
                <AlertCircle className="h-3.5 w-3.5 text-rose-600" /> Belum Supervisi
              </span>
            )}
          </div>
          <p className="mt-2 text-xs text-gray-500">Tahun Pelajaran {schoolSettings.academicYear}</p>
        </motion.div>

        {/* Skor & Predikat Akhir */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="stat-card rounded-lg p-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-widest">Nilai Akhir</span>
            <Award className="h-4 w-4 text-indigo-700" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="serif-display text-3xl font-bold text-[#1A1A1A]">
              {session?.finalScore || '-'}
            </span>
            {session?.finalPredicate && (
              <span className="rounded bg-[#1A1A1A] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                {session.finalPredicate}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-gray-500">Skala Penilaian 0–100</p>
        </motion.div>

        {/* Status Perangkat Pembelajaran */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="stat-card rounded-lg p-5"
        >
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Dokumen Perangkat</span>
          <div className="serif-display mt-2 text-2xl font-bold text-[#1A1A1A]">
            {teacherRecord.documents ? teacherRecord.documents.length : 0} File
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {teacherRecord.documents && teacherRecord.documents.length > 0
              ? 'Telah diunggah di sistem'
              : 'Belum ada RPP/Modul Ajar'}
          </p>
        </motion.div>

        {/* Supervisor / Penilai */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="stat-card rounded-lg p-5"
        >
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Supervisor Akademik</span>
          <div className="mt-2 font-bold text-slate-900 text-sm truncate">{schoolSettings.principalName}</div>
          <p className="mt-1 text-xs text-gray-500">Kepala {schoolSettings.schoolName}</p>
        </motion.div>
      </div>

      {/* Jadwal Supervisi & Catatan Kepala Sekolah */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Schedule Box */}
        <div className="stat-card rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
            <Calendar className="h-5 w-5 text-[#1A1A1A]" />
            <h3 className="serif-display text-base font-bold text-[#1A1A1A]">Jadwal Tahapan Supervisi Anda</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-md bg-slate-50 p-3 text-xs border border-gray-200">
              <div>
                <span className="font-bold text-slate-900 block">1. Pra-Observasi (Telaah Modul Ajar)</span>
                <span className="text-gray-500">Wawancara kesiapan & analisis dokumen RPP/MA</span>
              </div>
              <span className="font-semibold text-slate-800 bg-white px-2.5 py-1 rounded border border-gray-200">
                {teacherRecord.praDate || 'Belum diatur'}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-md bg-emerald-50/70 p-3 text-xs border border-emerald-200">
              <div>
                <span className="font-bold text-emerald-950 block">2. Observasi Kelas (Kunjungan Kelas)</span>
                <span className="text-emerald-700">Pengamatan langsung pelaksanaan Pembelajaran Mendalam</span>
              </div>
              <span className="font-semibold text-emerald-800 bg-white px-2.5 py-1 rounded border border-emerald-200">
                {teacherRecord.obsDate || 'Belum diatur'}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-md bg-slate-50 p-3 text-xs border border-gray-200">
              <div>
                <span className="font-bold text-slate-900 block">3. Pasca-Observasi (Refleksi & Umpan Balik)</span>
                <span className="text-gray-500">Diskusi hasil pengamatan & kesepakatan tindak lanjut</span>
              </div>
              <span className="font-semibold text-slate-800 bg-white px-2.5 py-1 rounded border border-gray-200">
                {teacherRecord.pascaDate || 'Belum diatur'}
              </span>
            </div>
          </div>
        </div>

        {/* Principal Feedback Notes */}
        <div className="stat-card rounded-lg p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3 border-b border-gray-100 pb-3">
              <MessageSquare className="h-5 w-5 text-[#1A1A1A]" />
              <h3 className="serif-display text-base font-bold text-[#1A1A1A]">Catatan & Umpan Balik Kepala Sekolah</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="rounded-md bg-slate-50 p-3 border border-gray-200">
                <span className="font-semibold text-slate-900 block mb-1">Catatan Observasi:</span>
                <p className="text-gray-700 italic">
                  "{session?.obs?.catatanSupervisor || 'Belum ada catatan supervisor untuk sesi ini.'}"
                </p>
              </div>

              <div className="rounded-md bg-emerald-50/50 p-3 border border-emerald-100">
                <span className="font-semibold text-emerald-900 block mb-1">Rekomendasi Perbaikan:</span>
                <p className="text-gray-700">
                  {session?.obs?.rekomendasi || 'Belum ada rekomendasi khusus.'}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 text-right">
            <button
              onClick={() => setActiveTab('instruments')}
              className="text-xs font-semibold text-slate-900 hover:underline"
            >
              Isi Refleksi Mandiri Saya &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

