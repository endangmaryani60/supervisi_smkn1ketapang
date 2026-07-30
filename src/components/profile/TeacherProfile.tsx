import React, { useState } from 'react';
import { User, KeyRound, CheckCircle2, ShieldCheck, School } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { hashPassword, saveAccounts } from '../../services/storage';

export const TeacherProfile: React.FC = () => {
  const { user, teachers, schoolSettings, reloadAccounts, accounts } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const teacherRecord = teachers.find(
    (t) => t.id === user?.teacherId || t.nip.replace(/\s+/g, '') === user?.nip.replace(/\s+/g, '')
  ) || teachers[0];

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Konfirmasi password baru tidak cocok.' });
      return;
    }

    const passHash = await hashPassword(newPassword);
    const updated = accounts.map((a) => {
      if (a.id === user?.id) {
        return { ...a, passwordHash: passHash };
      }
      return a;
    });

    saveAccounts(updated);
    await reloadAccounts();

    setMessage({ type: 'success', text: 'Password berhasil diperbarui!' });
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <User className="h-6 w-6 text-indigo-600" />
          Profil Saya & Keamanan Akun
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Informasi identitas mengajar dan ubah password akun pribadi.
        </p>
      </div>

      {message && (
        <div
          className={`rounded-xl p-4 text-xs font-semibold flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <CheckCircle2 className="h-4 w-4" />
          {message.text}
        </div>
      )}

      {/* Profile Details Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
          <School className="h-4 w-4 text-indigo-600" /> Detail Identitas Guru
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Nama Lengkap</span>
            <span className="font-bold text-slate-900 text-sm">{teacherRecord?.name || user?.name}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">NIP</span>
            <span className="font-bold text-slate-900 text-sm">{teacherRecord?.nip || user?.nip || '-'}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Mata Pelajaran</span>
            <span className="font-bold text-indigo-800 text-sm">{teacherRecord?.subject || '-'}</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-slate-500 block text-[10px] uppercase font-semibold">Kelas & Sekolah</span>
            <span className="font-bold text-slate-900 text-sm">Kelas {teacherRecord?.className} — {schoolSettings.schoolName}</span>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
          <KeyRound className="h-4 w-4 text-indigo-600" /> Ubah Password Akun
        </h2>

        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Password Baru</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Masukkan password baru"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Konfirmasi Password Baru</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ketik ulang password baru"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-semibold shadow-sm transition-colors"
          >
            <ShieldCheck className="h-4 w-4" /> Perbarui Password
          </button>
        </form>
      </div>
    </div>
  );
};
