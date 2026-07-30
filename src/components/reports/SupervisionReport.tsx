import React, { useState } from 'react';
import { FileSpreadsheet, Printer, Award, CheckCircle2, User, Layers, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getSessionByTeacherId } from '../../services/storage';
import { triggerPrint, openPrintWindow } from '../../utils/printHelper';

export const SupervisionReport: React.FC = () => {
  const { teachers, selectedTeacherId, setSelectedTeacherId, schoolSettings, user } = useAuth();
  const [reportType, setReportType] = useState<'individual' | 'recap'>('individual');

  const isGuru = user?.role === 'Guru';
  const currentTeacherId = isGuru && user?.teacherId ? user.teacherId : selectedTeacherId || teachers[0]?.id;
  const currentTeacher = teachers.find((t) => t.id === currentTeacherId) || teachers[0];

  const session = currentTeacher ? getSessionByTeacherId(currentTeacher.id) : null;

  const handlePrintIndividual = () => {
    triggerPrint('report-document-card', `Laporan_Supervisi_${currentTeacher?.name || 'Guru'}`);
  };

  const handlePrintRecap = () => {
    triggerPrint('report-recap-card', `Rekapitulasi_Laporan_Supervisi_${schoolSettings.schoolName}`);
  };

  if (!currentTeacher || !session) {
    return <div className="p-6 text-center text-slate-500">Silakan pilih guru untuk melihat laporan supervisi.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="h-6 w-6 text-indigo-600" />
            Laporan Resmi Hasil Supervisi Akademik
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Format laporan formal siap cetak mencakup analisis temuan, skor akhir, dan rekomendasi tindak lanjut.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isGuru && (
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setReportType('individual')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  reportType === 'individual'
                    ? 'bg-white text-indigo-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Laporan Per Guru
              </button>
              <button
                onClick={() => setReportType('recap')}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  reportType === 'recap'
                    ? 'bg-white text-indigo-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Rekapitulasi Sekolah
              </button>
            </div>
          )}

          {!isGuru && reportType === 'individual' && (
            <select
              value={currentTeacher.id}
              onChange={(e) => setSelectedTeacherId(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
            >
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.subject})
                </option>
              ))}
            </select>
          )}

          {reportType === 'individual' ? (
            <button
              type="button"
              onClick={handlePrintIndividual}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-semibold shadow-sm transition-colors"
            >
              <Printer className="h-4 w-4" /> Cetak Laporan Formal
            </button>
          ) : (
            <button
              type="button"
              onClick={handlePrintRecap}
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-semibold shadow-sm transition-colors"
            >
              <Printer className="h-4 w-4" /> Cetak Rekapitulasi
            </button>
          )}
        </div>
      </div>

      {reportType === 'individual' ? (
        /* Printable Individual Report Card */
        <div
          id="report-document-card"
          className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6 text-slate-900 font-sans print:shadow-none print:border-none print:p-0"
        >
          {/* Kop Surat Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4 relative">
            <div className="space-y-1">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">Pemerintah Kabupaten / Kota {schoolSettings.district}</h2>
              <h1 className="text-xl font-black uppercase text-slate-900 tracking-tight">{schoolSettings.schoolName}</h1>
              <p className="text-xs text-slate-600">{schoolSettings.address} — {schoolSettings.district}</p>
              <p className="text-[11px] font-semibold text-slate-500">
                LAPORAN HASIL SUPERVISI AKADEMIK (SI SUPER) — TP {schoolSettings.academicYear} SEMESTER {schoolSettings.semester.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Title */}
          <div className="text-center">
            <h3 className="text-base font-bold uppercase underline">LEMBAR HASIL EVALUASI & REKOMENDASI SUPERVISI</h3>
            <p className="text-xs text-slate-500">Nomor Berkas: SUPER/{schoolSettings.academicYear.replace('/', '')}/{currentTeacher.id.toUpperCase()}</p>
          </div>

          {/* Identitas Guru & Sekolah */}
          <div className="grid grid-cols-2 gap-4 text-xs border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <div className="space-y-1.5">
              <div className="flex">
                <span className="w-36 font-semibold text-slate-600">Nama Guru:</span>
                <span className="font-bold text-slate-900">{currentTeacher.name}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-slate-600">NIP:</span>
                <span className="text-slate-800">{currentTeacher.nip || '-'}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-slate-600">Pangkat / Golongan:</span>
                <span className="text-slate-800">{currentTeacher.pangkatGolongan || '-'}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex">
                <span className="w-36 font-semibold text-slate-600">Mata Pelajaran:</span>
                <span className="font-bold text-slate-900">{currentTeacher.subject}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-slate-600">Kelas & Materi:</span>
                <span className="text-slate-800">Kelas {currentTeacher.className} — {session.materiPokok || 'Materi Pokok'}</span>
              </div>
              <div className="flex">
                <span className="w-36 font-semibold text-slate-600">Tanggal Observasi:</span>
                <span className="font-bold text-indigo-800">{currentTeacher.obsDate || '-'}</span>
              </div>
            </div>
          </div>

          {/* Score & Predicate Badge */}
          <div className="flex items-center justify-between rounded-xl bg-indigo-50 border border-indigo-100 p-4">
            <div>
              <span className="text-xs font-semibold uppercase text-indigo-900 tracking-wider">Capaian Nilai Akhir Observasi Kelas</span>
              <div className="text-xs text-indigo-700 mt-0.5">Berdasarkan akumulasi rubrik instrumen Pembelajaran Mendalam & Asesmen</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-3xl font-black text-indigo-950">
                  {session.finalScore !== undefined && session.finalScore !== null ? session.finalScore : '-'}
                </div>
                <div className="text-[10px] text-indigo-700 uppercase font-bold">Skala 100</div>
              </div>
              <span className={`rounded-xl px-3.5 py-1.5 text-xs font-extrabold shadow-sm ${
                session.finalPredicate ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-600 font-semibold'
              }`}>
                {session.finalPredicate || 'Belum Dinilai'}
              </span>
            </div>
          </div>

          {/* Section 1: Pra-Observasi Summary */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 uppercase text-[11px] tracking-wider text-indigo-900">
              I. Analisis Perencanaan Pembelajaran (Pra-Observasi)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <strong className="text-slate-800 block mb-1">Kelebihan Perencanaan:</strong>
                <p className="text-slate-700 leading-relaxed">{session.pra.kelebihan || 'Perencanaan terstruktur dengan baik.'}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                <strong className="text-slate-800 block mb-1">Hal yang Perlu Ditingkatkan:</strong>
                <p className="text-slate-700 leading-relaxed">{session.pra.areaPengembangan || 'Peningkatan aspek diferensiasi.'}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Observasi Kelas Summary */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 uppercase text-[11px] tracking-wider text-indigo-900">
              II. Temuan Observasi Pelaksanaan Pembelajaran Mendalam
            </h4>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-2">
              <div>
                <strong className="text-slate-800 block">Catatan Evaluasi Supervisor:</strong>
                <p className="text-slate-700 leading-relaxed">{session.obs.catatanSupervisor || 'Pembelajaran berlangsung efektif.'}</p>
              </div>
              <div>
                <strong className="text-slate-800 block">Rekomendasi Perbaikan Spesifik:</strong>
                <p className="text-slate-700 leading-relaxed">{session.obs.rekomendasi || 'Pertahankan kreativitas media pembelajaran.'}</p>
              </div>
            </div>
          </div>

          {/* Section 3: Pasca-Observasi & Kesepakatan */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 uppercase text-[11px] tracking-wider text-indigo-900">
              III. Kesepakatan Tindak Lanjut & Komitmen Perbaikan
            </h4>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <p className="text-slate-700 leading-relaxed font-medium">{session.pasca.kesepakatanBersama || 'Disepakati untuk terus meningkatkan inovasi instrumen asesmen formatif.'}</p>
            </div>
          </div>

          {/* Signatures Section */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-xs text-center break-inside-avoid">
            <div>
              <p className="text-slate-500 mb-1">Guru yang Disupervisi,</p>
              <div className="h-16"></div>
              <p className="font-bold text-slate-900 underline">{currentTeacher.name}</p>
              <p className="text-[11px] text-slate-500">NIP. {currentTeacher.nip || '-'}</p>
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
      ) : (
        /* Printable Recap Card */
        <div
          id="report-recap-card"
          className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-6 text-slate-900 font-sans print:shadow-none print:border-none print:p-0"
        >
          {/* Kop Surat Header */}
          <div className="text-center border-b-2 border-slate-900 pb-4 relative">
            <div className="space-y-1">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-600">Pemerintah Kabupaten / Kota {schoolSettings.district}</h2>
              <h1 className="text-xl font-black uppercase text-slate-900 tracking-tight">{schoolSettings.schoolName}</h1>
              <p className="text-xs text-slate-600">{schoolSettings.address} — {schoolSettings.district}</p>
              <p className="text-[11px] font-semibold text-slate-500">
                REKAPITULASI LAPORAN HASIL SUPERVISI AKADEMIK GURU — TP {schoolSettings.academicYear} SEMESTER {schoolSettings.semester.toUpperCase()}
              </p>
            </div>
          </div>

          <div className="text-center">
            <h3 className="text-base font-bold uppercase underline">DAFTAR REKAPITULASI CAPAIAN SUPERVISI AKADEMIK</h3>
            <p className="text-xs text-slate-500">Tahun Pelajaran {schoolSettings.academicYear} | Semester {schoolSettings.semester}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse border border-slate-300">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-800 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3 border-r border-slate-300 text-center w-10">No</th>
                  <th className="py-2.5 px-3 border-r border-slate-300">Nama Guru & NIP</th>
                  <th className="py-2.5 px-3 border-r border-slate-300">Mata Pelajaran</th>
                  <th className="py-2.5 px-3 border-r border-slate-300">Kelas</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 text-center">Tgl Observasi</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 text-center">Nilai Akhir</th>
                  <th className="py-2.5 px-3 border-r border-slate-300 text-center">Predikat</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {teachers.map((t, idx) => {
                  const s = getSessionByTeacherId(t.id);
                  const isCurrent = t.id === currentTeacher.id;
                  return (
                    <tr
                      key={t.id}
                      className={`transition-colors ${
                        isCurrent
                          ? 'bg-amber-50 font-bold border-l-4 border-l-amber-600'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-2.5 px-3 border-r border-slate-200 text-center font-semibold text-slate-600">{idx + 1}</td>
                      <td className="py-2.5 px-3 border-r border-slate-200">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-slate-900">{t.name}</span>
                          {isCurrent && (
                            <span className="no-print inline-block px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 text-[9px] font-extrabold">
                              Guru Terpilih
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-500 font-normal">NIP: {t.nip || '-'}</div>
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 font-medium">{t.subject}</td>
                      <td className="py-2.5 px-3 border-r border-slate-200 font-semibold">{t.className}</td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-center">{t.obsDate || '-'}</td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-center font-black text-slate-900">
                        {s?.finalScore !== undefined && s?.finalScore !== null ? s.finalScore : '-'}
                      </td>
                      <td className="py-2.5 px-3 border-r border-slate-200 text-center font-bold text-slate-600">
                        {s?.finalPredicate || '-'}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Signatures Section */}
          <div className="pt-8 grid grid-cols-2 gap-8 text-xs text-center break-inside-avoid">
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
      )}
    </div>
  );
};
