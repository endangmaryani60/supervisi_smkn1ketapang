import React, { useState } from 'react';
import { ShieldAlert, KeyRound, CheckCircle2, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { hashPassword, saveAccounts, setSessionUser } from '../../services/storage';

export const ForcePasswordChangeModal: React.FC = () => {
  const { user, accounts, reloadAccounts } = useAuth();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user || !user.mustChangePassword) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password baru minimal harus 6 karakter.');
      return;
    }

    if (newPassword === '123456') {
      setError('Password baru tidak boleh sama dengan password default (123456).');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setIsSubmitting(true);
    try {
      const passHash = await hashPassword(newPassword);

      const updatedAccounts = accounts.map((acc) => {
        if (acc.id === user.id) {
          return {
            ...acc,
            passwordHash: passHash,
            mustChangePassword: false,
          };
        }
        return acc;
      });

      saveAccounts(updatedAccounts);
      await reloadAccounts();

      const updatedUser = {
        ...user,
        passwordHash: passHash,
        mustChangePassword: false,
      };

      setSessionUser(updatedUser);
      // Force page state sync by reloading location
      window.location.reload();
    } catch (err) {
      setError('Gagal memperbarui password. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700 shrink-0">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Wajib Ganti Password</h2>
            <p className="text-xs text-slate-500">
              Pertama Kali Login — SMK Negeri 1 Ketapang
            </p>
          </div>
        </div>

        <div className="mt-4 text-xs text-slate-600 bg-amber-50 p-3 rounded-lg border border-amber-200 leading-relaxed">
          Sesuai kebijakan keamanan SI SUPER, Anda login menggunakan password default <strong>(123456)</strong>. Anda diwajibkan membuat password baru sebelum mengakses sistem.
        </div>

        {error && (
          <div className="mt-3 rounded-lg bg-rose-50 p-3 text-xs font-semibold text-rose-700 border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password Baru
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Masukkan password baru"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ulangi Password Baru
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ketik ulang password baru"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 text-xs shadow-md transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              'Memproses...'
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" /> Simpan Password Baru & Masuk
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
