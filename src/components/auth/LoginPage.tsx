import React, { useState } from 'react';
import { motion } from 'motion/react';
import { School, Lock, User, Eye, EyeOff, LogIn, CheckCircle2, ShieldCheck, UserCheck } from 'lucide-react';
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

  const handleQuickLogin = async (usr: string, pass: string) => {
    setUsername(usr);
    setPassword(pass);
    setSubmitting(true);
    setErrorMsg('');
    try {
      const res = await login(usr, pass, true);
      if (!res.success) {
        setErrorMsg(res.message);
      }
    } catch (err) {
      console.error('Error during quick login:', err);
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
            <div className="inline-flex items-center gap-2 rounded bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-200">
              <School className="h-3.5 w-3.5" /> SI SUPAK
            </div>
            <h1 className="serif-display mt-6 text-2xl font-bold tracking-tight text-white md:text-3xl leading-snug">
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
            &copy; {new Date().getFullYear()} SI SUPAK - Kurikulum Nasional
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
                Username / NIP
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username atau NIP"
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

          {/* Quick Preset Buttons for Demo */}
          <div className="mt-8 border-t border-gray-200 pt-5">
            <p className="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-widest">
              Uji Coba Cepat (Akun Default):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'admin123')}
                className="flex items-center gap-2 p-2 rounded bg-slate-50 hover:bg-slate-100 border border-gray-200 text-left text-xs transition-colors"
              >
                <div className="p-1.5 bg-[#1A1A1A] text-white rounded">
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">Kepala Sekolah</div>
                  <div className="text-[10px] text-gray-500">admin / admin123</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('erini', '123456')}
                className="flex items-center gap-2 p-2 rounded bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-left text-xs transition-colors"
              >
                <div className="p-1.5 bg-emerald-800 text-white rounded">
                  <UserCheck className="h-3.5 w-3.5" />
                </div>
                <div>
                  <div className="font-semibold text-emerald-950">Guru (Contoh: Erini)</div>
                  <div className="text-[10px] text-emerald-700">erini / 123456</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

