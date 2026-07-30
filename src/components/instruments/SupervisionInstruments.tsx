import React, { useState } from 'react';
import { ClipboardCheck, User, Calendar, BookOpen, Layers, Printer } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getSessionByTeacherId, saveTeacherSession } from '../../services/storage';
import { PraObservationForm } from './PraObservationForm';
import { ObservationForm } from './ObservationForm';
import { PostObservationForm } from './PostObservationForm';
import { PraObservationData, ObservationData, PostObservationData } from '../../types';
import { triggerPrint } from '../../utils/printHelper';

export const SupervisionInstruments: React.FC = () => {
  const { teachers, selectedTeacherId, setSelectedTeacherId, schoolSettings, updateTeachersList, user } = useAuth();
  const [subTab, setSubTab] = useState<'pra' | 'obs' | 'pasca'>('pra');

  const isGuru = user?.role === 'Guru';
  const currentTeacherId = isGuru && user?.teacherId ? user.teacherId : selectedTeacherId || teachers[0]?.id;
  const currentTeacher = teachers.find((t) => t.id === currentTeacherId) || teachers[0];

  const session = currentTeacher ? getSessionByTeacherId(currentTeacher.id) : null;

  const handlePrintInstrument = () => {
    const tabName = subTab === 'pra' ? 'Pra_Observasi' : subTab === 'obs' ? 'Observasi_Kelas' : 'Pasca_Observasi';
    triggerPrint('active-instrument-form', `Instrumen_${tabName}_${currentTeacher?.name || 'Guru'}`);
  };

  if (!currentTeacher || !session) {
    return <div className="p-6 text-center text-slate-500">Silakan pilih guru sasaran supervisi.</div>;
  }

  // Handle header metadata updates
  const handleTeacherDateChange = (field: 'praDate' | 'obsDate' | 'pascaDate' | 'className', val: string) => {
    const updated = teachers.map((t) => {
      if (t.id === currentTeacher.id) {
        return { ...t, [field]: val };
      }
      return t;
    });
    updateTeachersList(updated);
  };

  const handleMateriPokokChange = (val: string) => {
    const updatedSession = { ...session, materiPokok: val };
    saveTeacherSession(currentTeacher.id, updatedSession);
  };

  const handleSavePra = (updatedPra: PraObservationData) => {
    const updatedSession = { ...session, pra: updatedPra, lastUpdated: new Date().toISOString() };
    saveTeacherSession(currentTeacher.id, updatedSession);
  };

  const handleSaveObs = (updatedObs: ObservationData) => {
    // Calculate final score
    let totalScore = 0;
    let count = 0;
    Object.values(updatedObs.scores).forEach((s) => {
      totalScore += s.score;
      count++;
    });

    // Convert 1-4 scale to 0-100 scale
    const rawScore = count > 0 ? Math.round((totalScore / (count * 4)) * 100) : 80;
    let predicate: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang' = 'Baik';
    if (rawScore >= 91) predicate = 'Sangat Baik';
    else if (rawScore >= 81) predicate = 'Baik';
    else if (rawScore >= 71) predicate = 'Cukup';
    else predicate = 'Kurang';

    const updatedSession = {
      ...session,
      obs: updatedObs,
      finalScore: rawScore,
      finalPredicate: predicate,
      lastUpdated: new Date().toISOString(),
    };
    saveTeacherSession(currentTeacher.id, updatedSession);

    // Update teacher status
    const updatedTeachers = teachers.map((t) => {
      if (t.id === currentTeacher.id) {
        return { ...t, status: 'Sedang Berjalan' as const };
      }
      return t;
    });
    updateTeachersList(updatedTeachers);
  };

  const handleSavePasca = (updatedPasca: PostObservationData) => {
    const updatedSession = { ...session, pasca: updatedPasca, lastUpdated: new Date().toISOString() };
    saveTeacherSession(currentTeacher.id, updatedSession);

    // Mark status as finished
    const updatedTeachers = teachers.map((t) => {
      if (t.id === currentTeacher.id) {
        return { ...t, status: 'Selesai' as const };
      }
      return t;
    });
    updateTeachersList(updatedTeachers);
  };

  return (
    <div className="space-y-6">
      {/* Header Panel Input */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between border-b border-slate-100 pb-3">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ClipboardCheck className="h-6 w-6 text-indigo-600" />
              Instrumen Digital Supervisi Akademik
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Formulir pengisian pra-observasi, observasi kelas, dan pasca-observasi secara terstruktur.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {!isGuru && (
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-slate-700">Pilih Guru:</label>
                <select
                  value={currentTeacher.id}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-indigo-900 focus:bg-white"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.subject})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="button"
              onClick={handlePrintInstrument}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 text-xs font-semibold shadow-sm transition-colors"
            >
              <Printer className="h-4 w-4" /> Cetak Form Instrumen
            </button>
          </div>
        </div>

        {/* Metadata Controls */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs">
          <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
            <span className="font-semibold text-slate-500 text-[10px] uppercase block">Guru Disupervisi</span>
            <div className="font-bold text-slate-900 mt-0.5 truncate">{currentTeacher.name}</div>
            <div className="text-[10px] text-slate-500">NIP: {currentTeacher.nip}</div>
          </div>

          <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
            <span className="font-semibold text-slate-500 text-[10px] uppercase block">Mata Pelajaran & Kelas</span>
            <div className="font-bold text-slate-900 mt-0.5">{currentTeacher.subject}</div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-[10px] text-slate-500">Kelas:</span>
              <input
                type="text"
                value={currentTeacher.className}
                onChange={(e) => handleTeacherDateChange('className', e.target.value)}
                className="px-1.5 py-0.5 bg-white border border-slate-300 rounded text-[11px] font-semibold text-indigo-700 w-16"
              />
            </div>
          </div>

          <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
            <span className="font-semibold text-slate-500 text-[10px] uppercase block">Tanggal Observasi Kelas</span>
            <input
              type="date"
              value={currentTeacher.obsDate}
              onChange={(e) => handleTeacherDateChange('obsDate', e.target.value)}
              className="mt-1 w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs font-bold text-slate-900"
            />
          </div>

          <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
            <span className="font-semibold text-slate-500 text-[10px] uppercase block">Semester & Tahun Pelajaran</span>
            <div className="font-bold text-slate-900 mt-0.5">Semester {schoolSettings.semester}</div>
            <div className="text-[10px] text-slate-500">TP {schoolSettings.academicYear}</div>
          </div>
        </div>

        {/* Materi Pokok Field */}
        <div className="pt-2">
          <label className="block text-xs font-bold text-slate-700 mb-1">Materi Pokok Pembelajaran Sesi Ini:</label>
          <input
            type="text"
            value={session.materiPokok || ''}
            onChange={(e) => handleMateriPokokChange(e.target.value)}
            placeholder="Contoh: Teks Laporan Hasil Observasi / Persamaan Kuadrat / Ekosistem"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:bg-white"
          />
        </div>
      </div>

      {/* Sub Tab Switcher */}
      <div className="flex border-b border-slate-200 bg-white rounded-xl p-1.5 shadow-sm gap-1">
        <button
          onClick={() => setSubTab('pra')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all text-center ${
            subTab === 'pra'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          1. Pra-Observasi (Telaah RPP & Wawancara)
        </button>

        <button
          onClick={() => setSubTab('obs')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all text-center ${
            subTab === 'obs'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          2. Observasi Kelas (Pengamatan Kunjungan)
        </button>

        <button
          onClick={() => setSubTab('pasca')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all text-center ${
            subTab === 'pasca'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          3. Pasca-Observasi (Refleksi & Umpan Balik)
        </button>
      </div>

      {/* Tab Contents */}
      <div id="active-instrument-form">
        {subTab === 'pra' && (
          <PraObservationForm
            data={session.pra}
            teacher={currentTeacher}
            onSave={handleSavePra}
          />
        )}

        {subTab === 'obs' && (
          <ObservationForm
            data={session.obs}
            teacher={currentTeacher}
            onSave={handleSaveObs}
          />
        )}

        {subTab === 'pasca' && (
          <PostObservationForm
            data={session.pasca}
            teacher={currentTeacher}
            onSave={handleSavePasca}
          />
        )}
      </div>
    </div>
  );
};
