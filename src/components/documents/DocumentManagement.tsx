import React, { useState } from 'react';
import { FolderKanban, Upload, FileText, Trash2, Download, Search, CheckCircle2, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { TeacherDocument } from '../../types';

export const DocumentManagement: React.FC = () => {
  const { teachers, updateTeachersList, selectedTeacherId, setSelectedTeacherId, user } = useAuth();
  const [search, setSearch] = useState('');
  const [fileType, setFileType] = useState<'Modul Ajar' | 'RPP' | 'Bahan Ajar' | 'Instrumen Asesmen' | 'Lainnya'>('Modul Ajar');
  const [deletingDoc, setDeletingDoc] = useState<TeacherDocument | null>(null);

  const isGuru = user?.role === 'Guru';

  // Find active teacher
  const currentTeacherId = isGuru && user?.teacherId ? user.teacherId : selectedTeacherId || teachers[0]?.id;
  const currentTeacher = teachers.find((t) => t.id === currentTeacherId) || teachers[0];

  const filteredTeachers = teachers.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase())
  );

  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentTeacher) return;

    const newDoc: TeacherDocument = {
      id: 'doc-' + Date.now(),
      name: file.name,
      type: fileType,
      fileUrl: '#',
      uploadDate: new Date().toISOString().split('T')[0],
      size: (file.size / 1024).toFixed(0) + ' KB',
    };

    const updated = teachers.map((t) => {
      if (t.id === currentTeacher.id) {
        return {
          ...t,
          documents: [...(t.documents || []), newDoc],
        };
      }
      return t;
    });

    updateTeachersList(updated);
  };

  const handleDeleteDoc = (doc: TeacherDocument) => {
    setDeletingDoc(doc);
  };

  const confirmDeleteDoc = () => {
    if (!currentTeacher || !deletingDoc) return;
    const updated = teachers.map((t) => {
      if (t.id === currentTeacher.id) {
        return {
          ...t,
          documents: t.documents.filter((d) => d.id !== deletingDoc.id),
        };
      }
      return t;
    });
    updateTeachersList(updated);
    setDeletingDoc(null);
  };

  const handleClearTeacherDocs = () => {
    if (!currentTeacher) return;
    if (window.confirm(`Hapus semua dokumen unggahan dari ${currentTeacher.name}?`)) {
      const updated = teachers.map((t) => {
        if (t.id === currentTeacher.id) {
          return { ...t, documents: [] };
        }
        return t;
      });
      updateTeachersList(updated);
    }
  };

  const handleClearAllTeachersDocs = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus SELURUH dokumen unggahan modul dari SEMUA guru?')) {
      const updated = teachers.map((t) => ({ ...t, documents: [] }));
      updateTeachersList(updated);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4 gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FolderKanban className="h-6 w-6 text-indigo-600" />
            Manajemen Dokumen Perangkat Pembelajaran
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Kelola Modul Ajar, RPP, Bahan Ajar, dan Instrumen Asesmen guru untuk kebutuhan telaah instrumen Pra-Observasi.
          </p>
        </div>

        {!isGuru && (
          <button
            type="button"
            onClick={handleClearAllTeachersDocs}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-1.5 text-xs font-semibold shadow-sm transition-colors shrink-0"
          >
            <Trash2 className="h-3.5 w-3.5" /> Hapus Semua Dokumen Guru
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left Column: Teacher Selector (only for Principal or if multi-teacher) */}
        {!isGuru && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:col-span-1 space-y-3">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Pilih Guru</h2>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari guru..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div className="space-y-1 max-h-[400px] overflow-y-auto pr-1">
              {filteredTeachers.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTeacherId(t.id)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    currentTeacher?.id === t.id
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  <div>
                    <div className="truncate">{t.name}</div>
                    <div className={`text-[10px] ${currentTeacher?.id === t.id ? 'text-indigo-200' : 'text-slate-500'}`}>
                      {t.subject} - {t.className}
                    </div>
                  </div>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      t.documents && t.documents.length > 0
                        ? currentTeacher?.id === t.id
                          ? 'bg-indigo-700 text-white'
                          : 'bg-emerald-100 text-emerald-800 font-bold'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {t.documents ? t.documents.length : 0} file
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Right Workspace: Selected Teacher's Document Vault */}
        <div className={`space-y-4 ${isGuru ? 'md:col-span-3' : 'md:col-span-2'}`}>
          {currentTeacher ? (
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <User className="h-4 w-4 text-indigo-600" />
                    Dokumen Perangkat: {currentTeacher.name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Mapel: {currentTeacher.subject} | Kelas: {currentTeacher.className} | NIP: {currentTeacher.nip}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value as any)}
                    className="px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-800"
                  >
                    <option value="Modul Ajar">Modul Ajar</option>
                    <option value="RPP">RPP</option>
                    <option value="Bahan Ajar">Bahan Ajar</option>
                    <option value="Instrumen Asesmen">Instrumen Asesmen</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>

                  <label className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors">
                    <Upload className="h-4 w-4" /> Unggah File
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={handleUploadFile}
                    />
                  </label>
                </div>
              </div>

              {/* List of uploaded documents */}
              {!currentTeacher.documents || currentTeacher.documents.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center bg-slate-50">
                  <FolderKanban className="mx-auto h-10 w-10 text-slate-300 mb-2" />
                  <p className="text-xs font-bold text-slate-700">Belum Ada Dokumen di-Upload</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Silakan unggah RPP atau Modul Ajar untuk mempermudah proses telaah pada instrumen Pra-Observasi.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {currentTeacher.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-start justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4 hover:border-indigo-200 hover:bg-white transition-all shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-indigo-100 p-2 text-indigo-700 shrink-0 mt-0.5">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div>
                          <span className="inline-block rounded bg-indigo-50 px-2 py-0.5 text-[9px] font-bold text-indigo-700 uppercase tracking-wider mb-1">
                            {doc.type}
                          </span>
                          <h3 className="text-xs font-bold text-slate-900 leading-snug break-all">{doc.name}</h3>
                          <p className="text-[10px] text-slate-400 mt-1">
                            Diunggah: {doc.uploadDate} • Ukuran: {doc.size || 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <button
                          onClick={() => alert(`Simulasi mengunduh file: ${doc.name}`)}
                          title="Unduh Dokumen"
                          className="rounded p-1 text-slate-500 hover:bg-slate-200 hover:text-indigo-600 transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDoc(doc)}
                          title="Hapus Dokumen"
                          className="rounded p-1 text-slate-400 hover:bg-rose-100 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-400">Silakan pilih guru terlebih dahulu.</div>
          )}
        </div>
      </div>

      {/* Delete Doc Modal */}
      {deletingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl border border-slate-100">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="rounded-full bg-rose-100 p-2.5">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Konfirmasi Hapus Dokumen</h3>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Apakah Anda yakin ingin menghapus dokumen <strong className="text-slate-900">{deletingDoc.name}</strong> ({deletingDoc.type})?
            </p>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingDoc(null)}
                className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={confirmDeleteDoc}
                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 shadow-sm transition-colors"
              >
                Ya, Hapus Dokumen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
