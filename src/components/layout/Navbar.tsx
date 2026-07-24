import React from 'react';
import { LogOut, Shield, User, School, Calendar, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, logout, schoolSettings, isMobileMenuOpen, toggleMobileMenu } = useAuth();

  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white/95 px-3 md:px-8 backdrop-blur-md">
      {/* Left: Mobile Nav Toggle & School Title */}
      <div className="flex items-center gap-2.5">
        {/* Mobile Toggle & Minimize Button */}
        <button
          type="button"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? 'Minimize Navigasi' : 'Buka Navigasi'}
          className="md:hidden flex items-center gap-1.5 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 px-2.5 py-1.5 text-xs font-bold shadow-sm transition-colors"
        >
          {isMobileMenuOpen ? (
            <>
              <PanelLeftClose className="h-4 w-4 text-indigo-600" />
              <span className="text-[11px]">Minimize</span>
            </>
          ) : (
            <>
              <Menu className="h-4 w-4 text-slate-700" />
              <span className="text-[11px]">Menu</span>
            </>
          )}
        </button>

        <div className="flex h-9 w-9 md:h-10 md:w-10 items-center justify-center rounded-lg bg-[#1A1A1A] text-white shadow-sm shrink-0">
          <School className="h-4 w-4 md:h-5 md:w-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="serif-display font-bold tracking-tight text-slate-900 text-sm md:text-lg">SI SUPAK</span>
            <span className="hidden md:inline-block text-xs text-gray-300">|</span>
            <span className="hidden md:inline-block text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded uppercase tracking-wider">
              {schoolSettings.schoolName}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] md:text-[11px] text-gray-500 mt-0.5">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3 text-gray-400" />
              TP {schoolSettings.academicYear} — Sem {schoolSettings.semester}
            </span>
          </div>
        </div>
      </div>

      {/* Right: User Profile & Role Badge & Logout */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-xs font-semibold text-slate-900">{user.name}</span>
          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">NIP: {user.nip || '-'}</span>
        </div>

        {/* Role Badge */}
        {user.role === 'Kepala Sekolah' ? (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            <Shield className="h-3 w-3 text-indigo-300" />
            <span className="hidden xs:inline">Kepala Sekolah</span>
            <span className="xs:hidden">KS</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-800 border border-emerald-200">
            <User className="h-3 w-3 text-emerald-600" />
            <span>Guru</span>
          </span>
        )}

        <button
          onClick={logout}
          title="Keluar dari Aplikasi"
          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 focus:outline-none"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

