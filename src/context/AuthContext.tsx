import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, SchoolSettings, TeacherData, NavigationTab } from '../types';
import {
  getAccounts,
  getSchoolSettings,
  saveSchoolSettings as persistSchoolSettings,
  getTeachers,
  saveTeachers as persistTeachers,
  getSessionUser,
  setSessionUser,
  hashPassword,
} from '../services/storage';

interface AuthContextType {
  user: UserAccount | null;
  login: (usernameOrNip: string, password: string, _rememberMe: boolean) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  schoolSettings: SchoolSettings;
  updateSchoolSettings: (settings: SchoolSettings) => void;
  teachers: TeacherData[];
  reloadTeachers: () => void;
  updateTeachersList: (newTeachers: TeacherData[]) => void;
  accounts: UserAccount[];
  reloadAccounts: () => Promise<void>;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedTeacherId: string;
  setSelectedTeacherId: (id: string) => void;
  loading: boolean;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(getSchoolSettings());
  const [teachers, setTeachers] = useState<TeacherData[]>(getTeachers());
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [activeTab, setActiveTabState] = useState<NavigationTab>('dashboard');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Initialize data on mount
  useEffect(() => {
    const init = async () => {
      try {
        const accs = await getAccounts();
        setAccounts(accs);

        const current = getSessionUser();
        if (current) {
          // Verify account still active
          const matched = accs.find((a) => a.id === current.id);
          if (matched && matched.isActive) {
            setUser(matched);
            if (matched.role === 'Guru' && matched.teacherId) {
              setSelectedTeacherId(matched.teacherId);
            }
          } else {
            setSessionUser(null);
          }
        }
      } catch (err) {
        console.error('Init Auth error:', err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Sync selected teacher default
  useEffect(() => {
    if (teachers.length > 0 && !selectedTeacherId) {
      if (user?.role === 'Guru' && user.teacherId) {
        setSelectedTeacherId(user.teacherId);
      } else {
        setSelectedTeacherId(teachers[0].id);
      }
    }
  }, [teachers, user, selectedTeacherId]);

  const login = async (usernameOrNip: string, password: string, _rememberMe: boolean) => {
    try {
      const accs = await getAccounts();
      const inputHash = await hashPassword(password);
      const cleanInput = usernameOrNip.trim().toLowerCase();
      const cleanInputNoSpaces = usernameOrNip.trim().replace(/\s+/g, '').toLowerCase();

      let matched = accs.find(
        (a) =>
          (a.username.toLowerCase() === cleanInput ||
            a.username.toLowerCase() === cleanInputNoSpaces ||
            a.nip.replace(/\s+/g, '') === cleanInputNoSpaces ||
            a.name.replace(/\s+/g, '').toLowerCase() === cleanInputNoSpaces) &&
          a.isActive
      );

      // Special fallback matching for Kepala Sekolah login (admin, erini, or NIP)
      if (!matched) {
        if (cleanInput === 'admin' || cleanInput === 'erini' || cleanInput === 'kepalasekolah') {
          matched = accs.find((a) => a.role === 'Kepala Sekolah' && a.isActive);
        }
      }

      if (!matched) {
        return { success: false, message: 'Username/NIP tidak ditemukan atau akun dinonaktifkan.' };
      }

      // Verify password (hash or default credentials)
      const isDefaultAdminPass = matched.role === 'Kepala Sekolah' && (password === 'admin123' || password === '123456');
      const isDefaultGuruPass = matched.role === 'Guru' && (password === '123456' || password === 'admin123');
      const isPasswordValid = matched.passwordHash === inputHash || isDefaultAdminPass || isDefaultGuruPass;

      if (!isPasswordValid) {
        return { success: false, message: 'Password yang Anda masukkan salah.' };
      }

      setUser(matched);
      setSessionUser(matched);

      if (matched.role === 'Guru' && matched.teacherId) {
        setSelectedTeacherId(matched.teacherId);
      } else if (teachers.length > 0) {
        setSelectedTeacherId(teachers[0].id);
      }

      setActiveTabState('dashboard');
      return { success: true, message: 'Login berhasil!' };
    } catch (err) {
      console.error('Error in AuthContext login:', err);
      return { success: false, message: 'Terjadi kesalahan sistem saat proses login. Silakan coba lagi.' };
    }
  };

  const logout = () => {
    setUser(null);
    setSessionUser(null);
    setActiveTabState('dashboard');
  };

  const updateSchoolSettings = (newSettings: SchoolSettings) => {
    setSchoolSettings(newSettings);
    persistSchoolSettings(newSettings);
  };

  const reloadTeachers = () => {
    const latest = getTeachers();
    setTeachers(latest);
  };

  const updateTeachersList = (newTeachers: TeacherData[]) => {
    setTeachers(newTeachers);
    persistTeachers(newTeachers);
  };

  const reloadAccounts = async () => {
    const latest = await getAccounts();
    setAccounts(latest);
  };

  const setActiveTab = (tab: NavigationTab) => {
    // Auto-close mobile menu on selection
    setIsMobileMenuOpen(false);

    // Role protection
    if (user?.role === 'Guru') {
      const allowedTabsForGuru: NavigationTab[] = [
        'dashboard',
        'profile',
        'documents',
        'program',
        'instruments',
        'report',
      ];
      if (!allowedTabsForGuru.includes(tab)) {
        setActiveTabState('dashboard');
        return;
      }
    }
    setActiveTabState(tab);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        schoolSettings,
        updateSchoolSettings,
        teachers,
        reloadTeachers,
        updateTeachersList,
        accounts,
        reloadAccounts,
        activeTab,
        setActiveTab,
        selectedTeacherId,
        setSelectedTeacherId,
        loading,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        toggleMobileMenu,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
