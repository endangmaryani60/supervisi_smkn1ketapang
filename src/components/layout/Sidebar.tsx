import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FolderKanban,
  BookOpen,
  ClipboardCheck,
  FileSpreadsheet,
  TrendingUp,
  Settings,
  User,
  PanelLeftClose,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { NavigationTab } from '../../types';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.FC<{ className?: string }>;
  section?: 'main' | 'bottom';
}

export const Sidebar: React.FC = () => {
  const { user, activeTab, setActiveTab, isMobileMenuOpen, setIsMobileMenuOpen } = useAuth();

  if (!user) return null;

  const isPrincipal = user.role === 'Kepala Sekolah';

  const principalNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard Eksekutif', icon: LayoutDashboard },
    { id: 'program', label: 'Program Supervisi', icon: BookOpen },
    { id: 'teacher-data', label: 'Data Guru', icon: Users },
    { id: 'teacher-accounts', label: 'Manajemen Akun', icon: UserPlus },
    { id: 'documents', label: 'Dokumen Perangkat', icon: FolderKanban },
    { id: 'instruments', label: 'Instrumen Supervisi', icon: ClipboardCheck },
    { id: 'report', label: 'Laporan Hasil', icon: FileSpreadsheet },
    { id: 'followup', label: 'Tindak Lanjut & Evaluasi', icon: TrendingUp },
    { id: 'school-settings', label: 'Pengaturan Sekolah', icon: Settings, section: 'bottom' },
  ];

  const teacherNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard Guru', icon: LayoutDashboard },
    { id: 'profile', label: 'Profil Saya', icon: User },
    { id: 'documents', label: 'Upload Perangkat', icon: FolderKanban },
    { id: 'program', label: 'Program & Jadwal', icon: BookOpen },
    { id: 'instruments', label: 'Instrumen & Refleksi', icon: ClipboardCheck },
    { id: 'report', label: 'Laporan Saya', icon: FileSpreadsheet },
  ];

  const navItems = isPrincipal ? principalNavItems : teacherNavItems;

  const mainItems = navItems.filter((i) => i.section !== 'bottom');
  const bottomItems = navItems.filter((i) => i.section === 'bottom');

  const renderNavContent = (isMobile = false) => (
    <div className="flex h-full flex-col justify-between">
      <div className="space-y-6">
        {/* Header Branding & Minimize Button */}
        <div className="flex items-center justify-between p-3 pb-2 border-b border-gray-100">
          <div>
            <h1 className="serif-display text-2xl font-bold tracking-tighter text-[#1A1A1A]">SI SUPER</h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-0.5 font-semibold">
              Sistem Informasi Supervisi
            </p>
          </div>
          {isMobile && (
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1.5 text-xs font-bold transition-colors"
              title="Minimize Navigasi"
            >
              <PanelLeftClose className="h-4 w-4 text-indigo-600" />
              <span className="text-[11px]">Minimize</span>
            </button>
          )}
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            {isPrincipal ? 'Menu Utama' : 'Menu Guru'}
          </div>
          {mainItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`sidebar-item w-full p-3 flex items-center space-x-3 text-left text-xs transition-all ${
                  isActive
                    ? 'active text-[#1A1A1A]'
                    : 'text-gray-500 hover:text-[#1A1A1A] hover:bg-gray-50'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#1A1A1A]' : 'text-gray-400'}`} />
                <span className="truncate font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom section */}
      <div className="space-y-3 pt-3 border-t border-gray-100">
        {bottomItems.length > 0 && (
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Sistem
            </div>
            {bottomItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`sidebar-item w-full p-3 flex items-center space-x-3 text-left text-xs transition-all ${
                    isActive
                      ? 'active text-[#1A1A1A]'
                      : 'text-gray-500 hover:text-[#1A1A1A] hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#1A1A1A]' : 'text-gray-400'}`} />
                  <span className="truncate font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {isMobile && (
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-full flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 py-2.5 text-xs font-bold text-slate-700 shadow-sm transition-colors"
          >
            <PanelLeftClose className="h-4 w-4 text-indigo-600" /> Sembunyikan Navigasi
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 flex-col justify-between border-r border-gray-200 bg-white p-4 shrink-0">
        {renderNavContent(false)}
      </aside>

      {/* Mobile Drawer Navigation with Minimize Feature */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <aside className="relative flex w-72 max-w-[85vw] flex-col justify-between border-r border-gray-200 bg-white p-4 shadow-2xl z-50">
            {renderNavContent(true)}
          </aside>
        </div>
      )}
    </>
  );
};

