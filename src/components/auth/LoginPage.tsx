import React, { useState } from 'react';
import { motion } from 'motion/react';
import { School, Lock, User, Eye, EyeOff, LogIn, CheckCircle2, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMsg('Mohon isi username/NIP dan password.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await login(username, password, rememberMe);
      if (!res.success) {
        setErrorMsg(res.message);
      }
    } catch (err) {
      console.error('Error during handleSubmit:', err);
      setErrorMsg('Terjadi kesalahan saat masuk. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FDFDFB] p-4 text-[#1A1A1A]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-4xl overflow-hidden rounded-xl bg-white border border-gray-200 shadow-sm md:grid md:grid-cols-5"
      >
        {/* Left Side: Branding / Banner */}
        <div className="bg-[#1A1A1A] p-8 text-white md:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0">
                <School className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 rounded bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-gray-200">
                  SI SUPER
                </div>
                <div className="text-[11px] font-bold text-gray-300 mt-1">SMK Negeri 1 Ketapang</div>
              </div>
            </div>
            <h1 className="serif-display mt-4 text-2xl font-bold tracking-tight text-white md:text-3xl leading-snug">
              Sistem Informasi Supervisi Akademik
            </h1>
            <p className="mt-3 text-xs text-gray-300 leading-relaxed">
              Platform Digital Supervisi Akademik Terintegrasi Kurikulum Nasional untuk Kepala Sekolah, Pengawas, dan Guru.
            </p>
          </div>

          <div className="mt-8 space-y-3 rounded-lg bg-white/5 p-4 border border-white/10">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Instrumen Digital Pra, Obs & Pasca</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Analisis & Rekomendasi Bantuan AI</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-gray-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>Laporan Resmi Cetak & Tanda Tangan</span>
            </div>
          </div>

          <div className="mt-6 text-[11px] text-gray-400 border-t border-white/10 pt-4">
            &copy; {new Date().getFullYear()} SI SUPER - Kurikulum Nasional
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="p-8 md:col-span-3 flex flex-col justify-center">
          <div className="mb-6">
            <h2 className="serif-display text-2xl font-bold text-[#1A1A1A]">Selamat Datang Kembali</h2>
            <p className="text-xs text-gray-500 mt-1">Silakan masuk menggunakan akun terdaftar Anda.</p>
          </div>

          {errorMsg && (
            <div className="mb-4 rounded bg-rose-50 border border-rose-200 p-3 text-xs font-medium text-rose-700">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                NIP / Username Guru
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan NIP Guru (contoh: 199208162025212047)"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-gray-300 rounded text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#1A1A1A] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-gray-300 rounded text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-[#1A1A1A] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#1A1A1A] focus:ring-0"
                />
                <span className="text-xs text-gray-600">Ingat Saya (Remember Me)</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 bg-[#1A1A1A] hover:bg-black text-white text-sm font-semibold rounded shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <LogIn className="h-4 w-4" />
              {submitting ? 'Memproses...' : 'Masuk ke Aplikasi'}
            </button>
          </form>

          {/* Keterangan Login Pertama Kali */}
          <div className="mt-6 pt-5 border-t border-slate-200">
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3.5 space-y-2 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Info className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Petunjuk Login Pertama Kali:</span>
              </div>
              <ul className="space-y-1.5 text-slate-600 pl-5 list-disc text-[11px]">
                <li>
                  <strong className="text-slate-800">Guru / Tenaga Pendidik:</strong> Username menggunakan{' '}
                  <strong className="text-slate-800">NIP</strong> (contoh:{' '}
                  <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-900">199208162025212047</code>), Password{' '}
                  <code className="bg-slate-200 px-1 py-0.5 rounded font-mono text-slate-900">123456</code>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

