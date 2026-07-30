import React, { useState } from 'react';
import { UserPlus, KeyRound, Shield, UserCheck, Trash2, CheckCircle2, XCircle, Search } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserAccount, UserRole } from '../../types';
import { hashPassword, saveAccounts } from '../../services/storage';

export const AccountManagement: React.FC = () => {
  const { accounts, reloadAccounts, teachers } = useAuth();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedAcc, setSelectedAcc] = useState<UserAccount | null>(null);
  const [deletingAcc, setDeletingAcc] = useState<UserAccount | null>(null);

  // Add form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [nip, setNip] = useState('');
  const [role, setRole] = useState<UserRole>('Guru');
  const [teacherId, setTeacherId] = useState('');

  // Change password form state
  const [newPassword, setNewPassword] = useState('');

  const filteredAccounts = accounts.filter(
    (a) =>
      a.username.toLowerCase().includes(search.toLowerCase()) ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.nip.includes(search)
  );

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !name) return;

    const passHash = await hashPassword(password);
    const newAcc: UserAccount = {
      id: 'acc-' + Date.now(),
      username: username.trim(),
      passwordHash: passHash,
      name: name.trim(),
      nip: nip.trim(),
      role,
      teacherId: role === 'Guru' ? teacherId : undefined,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    const updated = [...accounts, newAcc];
    saveAccounts(updated);
    await reloadAccounts();

    setShowAddModal(false);
    setUsername('');
    setPassword('');
    setName('');
    setNip('');
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAcc || !newPassword) return;

    const passHash = await hashPassword(newPassword);
    const updated = accounts.map((a) => {
      if (a.id === selectedAcc.id) {
        return { ...a, passwordHash: passHash };
      }
      return a;
    });

    saveAccounts(updated);
    await reloadAccounts();

    setShowPasswordModal(false);
    setNewPassword('');
    setSelectedAcc(null);
  };

  const toggleActive = async (acc: UserAccount) => {
    const updated = accounts.map((a) => {
      if (a.id === acc.id) {
        return { ...a, isActive: !a.isActive };
      }
      return a;
    });
    saveAccounts(updated);
    await reloadAccounts();
  };

  const handleDelete = (acc: UserAccount) => {
    setDeletingAcc(acc);
  };

  const confirmDeleteAccount = async () => {
    if (!deletingAcc) return;
    const updated = accounts.filter((a) => a.id !== deletingAcc.id);
    saveAccounts(updated);
    await reloadAccounts();
    setDeletingAcc(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-indigo-600" />
            Manajemen Akun Pengguna & Hak Akses
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Buat akun baru, atur ulang password, aktifkan/nonaktifkan, dan kelola peran Kepala Sekolah dan Guru.
          </p>
        </div>

        <button
          onClick={() => {
            setShowAddModal(true);
            if (teachers.length > 0) setTeacherId(teachers[0].id);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors"
        >
          <UserPlus className="h-4 w-4" /> Buat Akun Pengguna Baru
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari berdasarkan username, nama, atau NIP..."
          className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600"
        />
      </div>

      {/* Accounts Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Nama & NIP</th>
              <th className="py-3 px-4">Username</th>
              <th className="py-3 px-4">Role Akses</th>
              <th className="py-3 px-4">Status Akun</th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredAccounts.map((acc) => (
              <tr key={acc.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-slate-900">{acc.name}</div>
                  <div className="text-[11px] text-slate-500">NIP: {acc.nip || '-'}</div>
                </td>

                <td className="py-3.5 px-4 font-mono font-medium text-slate-800">{acc.username}</td>

                <td className="py-3.5 px-4">
                  {acc.role === 'Kepala Sekolah' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2.5 py-0.5 text-[10px] font-bold text-indigo-800">
                      <Shield className="h-3 w-3 text-indigo-600" /> Kepala Sekolah
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      <UserCheck className="h-3 w-3 text-emerald-600" /> Guru
                    </span>
                  )}
                </td>

                <td className="py-3.5 px-4">
                  {acc.isActive ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Aktif
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-rose-600 font-semibold">
                      <XCircle className="h-3.5 w-3.5 text-rose-500" /> Nonaktif
                    </span>
                  )}
                </td>

                <td className="py-3.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedAcc(acc);
                        setShowPasswordModal(true);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded"
                    >
                      <KeyRound className="h-3 w-3" /> Password
                    </button>

                    <button
                      onClick={() => toggleActive(acc)}
                      className={`text-[11px] font-medium px-2 py-1 rounded ${
                        acc.isActive
                          ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                          : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                      }`}
                    >
                      {acc.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                    </button>

                    {acc.username !== 'admin' && (
                      <button
                        onClick={() => handleDelete(acc)}
                        title="Hapus Akun"
                        className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-2">
              Buat Akun Pengguna Baru
            </h2>

            <form onSubmit={handleCreateAccount} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">NIP / Username Login</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan NIP Guru (contoh: 198504152010011005)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password untuk akun ini"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Pengguna</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkap"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">NIP (Opsional)</label>
                <input
                  type="text"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  placeholder="NIP"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Role Pengguna</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                >
                  <option value="Guru">Guru</option>
                  <option value="Kepala Sekolah">Kepala Sekolah</option>
                </select>
              </div>

              {role === 'Guru' && teachers.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hubungkan ke Data Guru</label>
                  <select
                    value={teacherId}
                    onChange={(e) => {
                      setTeacherId(e.target.value);
                      const t = teachers.find((x) => x.id === e.target.value);
                      if (t) {
                        setName(t.name);
                        setNip(t.nip);
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.subject} - {t.className})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  Buat Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && selectedAcc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-base font-bold text-slate-900 mb-2">Ubah Password Akun</h2>
            <p className="text-xs text-slate-500 mb-4">Pengguna: {selectedAcc.name} ({selectedAcc.username})</p>

            <form onSubmit={handleChangePassword} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password Baru</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Masukkan password baru"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  Simpan Password Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Account Modal */}
      {deletingAcc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-100">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="rounded-full bg-rose-100 p-2.5">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Konfirmasi Hapus Akun</h3>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Apakah Anda yakin ingin menghapus akun <strong className="text-slate-900">{deletingAcc.name}</strong> ({deletingAcc.username})? 
              <br />
              <span className="text-rose-600 font-medium">Pengguna dengan akun ini tidak akan dapat login lagi ke sistem.</span>
            </p>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingAcc(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteAccount}
                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 shadow-sm transition-colors"
              >
                Ya, Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
