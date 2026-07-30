import React from 'react';
import { TrendingUp, Target, CheckCircle2, Award, ArrowUpRight, Printer } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { triggerPrint } from '../../utils/printHelper';

export const FollowUpEvaluation: React.FC = () => {
  const { teachers, schoolSettings, setActiveTab, setSelectedTeacherId } = useAuth();

  const handlePrintFollowUp = () => {
    triggerPrint('followup-document-card', `Tindak_Lanjut_Supervisi_${schoolSettings.schoolName}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-indigo-600" />
            Program Tindak Lanjut & Evaluasi Supervisi Akademik
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Program pembinaan terencana, monitoring ketercapaian target, dan matriks rencana aksi perbaikan pembelajaran.
          </p>
        </div>

        <button
          type="button"
          onClick={handlePrintFollowUp}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-semibold shadow-sm transition-colors"
        >
          <Printer className="h-4 w-4" /> Cetak Matriks Tindak Lanjut
        </button>
      </div>

      <div id="followup-document-card" className="space-y-6">
        {/* Kop Surat Header for Print */}
        <div className="hidden print:block text-center border-b-2 border-slate-900 pb-4 space-y-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">Pemerintah Kabupaten / Kota {schoolSettings.district}</h2>
          <h1 className="text-xl font-black uppercase text-slate-900 tracking-tight">{schoolSettings.schoolName}</h1>
          <p className="text-xs text-slate-600">{schoolSettings.address} — {schoolSettings.district}</p>
          <p className="text-[11px] font-semibold text-slate-500">
            PROGRAM TINDAK LANJUT & EVALUASI SUPERVISI AKADEMIK — TP {schoolSettings.academicYear} SEMESTER {schoolSettings.semester.toUpperCase()}
          </p>
        </div>

        {/* Program Pembinaan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wider">
              <Target className="h-4 w-4 text-indigo-600" /> Pembinaan Kategori Mandiri
            </div>
            <h3 className="text-sm font-bold text-slate-900">Komunitas Belajar (Kombel / MGMP)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Guru dengan predikat Sangat Baik diarahkan menjadi fasilitator berbagi praktik baik pada Komunitas Belajar sekolah.
            </p>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <Award className="h-4 w-4 text-amber-600" /> Pembinaan Pendampingan Klinis
            </div>
            <h3 className="text-sm font-bold text-slate-900">Workshop Asesmen & Modul Ajar</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Guru yang memerlukan peningkatan diferensiasi pembelajaran diberikan pendampingan khusus oleh Tim Kurikulum.
            </p>
          </div>

          <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Monitoring Evaluasi Capaian
            </div>
            <h3 className="text-sm font-bold text-slate-900">Supervisi Kelanjutan (Re-visit)</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pengamatan ulang dalam kurun 30 hari untuk memastikan kesepakatan tindak lanjut dieksekusi secara nyata di kelas.
            </p>
          </div>
        </div>

        {/* Action Plan Table per Teacher */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">
              Matriks Rencana Aksi Perbaikan Pembelajaran Guru
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse border border-slate-200">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-3 border-r border-slate-200">Nama Guru & Mapel</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">Hasil Evaluasi</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">Bentuk Program Pembinaan</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">Target Capaian Waktu</th>
                  <th className="py-2.5 px-3 border-r border-slate-200">Status Monitoring</th>
                  <th className="py-2.5 px-3 text-right no-print">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {teachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 border-r border-slate-200">
                      <div className="font-bold text-slate-900">{teacher.name}</div>
                      <div className="text-[11px] text-slate-500">{teacher.subject} - Kelas {teacher.className}</div>
                    </td>

                    <td className="py-3 px-3 border-r border-slate-200">
                      <span className="inline-flex rounded bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                        {teacher.status === 'Selesai' ? 'Tuntas Evaluasi' : 'Dalam Proses'}
                      </span>
                    </td>

                    <td className="py-3 px-3 border-r border-slate-200 text-slate-700 font-medium">
                      Penguatan Diferensiasi Pembelajaran & Asesmen Formatif
                    </td>

                    <td className="py-3 px-3 border-r border-slate-200 text-slate-600">30 Hari Kerja</td>

                    <td className="py-3 px-3 border-r border-slate-200">
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Terjadwal
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right no-print">
                      <button
                        onClick={() => {
                          setSelectedTeacherId(teacher.id);
                          setActiveTab('instruments');
                        }}
                        className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800 text-[11px]"
                      >
                        Buka Detil <ArrowUpRight className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Signatures for Print */}
          <div className="hidden print:grid pt-8 grid-cols-2 gap-8 text-xs text-center break-inside-avoid">
            <div>
              <p className="text-slate-500 mb-1">Mengetahui,</p>
              <p className="font-bold text-slate-900">Pengawas Pembina Sekolah</p>
              <div className="h-16"></div>
              <p className="font-bold text-slate-900 underline">{schoolSettings.supervisorName}</p>
              <p className="text-[11px] text-slate-500">NIP. {schoolSettings.supervisorNip}</p>
            </div>

            <div>
              <p className="text-slate-500 mb-1">{schoolSettings.district}, {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p className="font-bold text-slate-900">Kepala {schoolSettings.schoolName}</p>
              <div className="h-16"></div>
              <p className="font-bold text-slate-900 underline">{schoolSettings.principalName}</p>
              <p className="text-[11px] text-slate-500">NIP. {schoolSettings.principalNip}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

