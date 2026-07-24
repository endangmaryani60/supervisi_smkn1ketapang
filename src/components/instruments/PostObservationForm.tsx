import React, { useState } from 'react';
import { Sparkles, Save, CheckCircle2 } from 'lucide-react';
import { PASCA_REFLEKSI_QUESTIONS, PASCA_UMPAN_BALIK_ASPEK, PASCA_TINDAK_LANJUT_ASPEK } from '../../constants/instrumentData';
import { PostObservationData, TeacherData } from '../../types';
import { generateAIFeedback } from '../../services/aiService';

interface Props {
  data: PostObservationData;
  teacher: TeacherData;
  onSave: (updatedPasca: PostObservationData) => void;
}

export const PostObservationForm: React.FC<Props> = ({ data, teacher, onSave }) => {
  const [formData, setFormData] = useState<PostObservationData>(data);
  const [generating, setGenerating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleRefleksiChange = (id: number, val: string) => {
    setFormData({
      ...formData,
      refleksiGuru: {
        ...formData.refleksiGuru,
        [id]: val,
      },
    });
  };

  const handleUmpanBalikChange = (id: number, field: 'apresiasi' | 'areaPengembangan', val: string) => {
    setFormData({
      ...formData,
      umpanBalik: {
        ...formData.umpanBalik,
        [id]: {
          ...formData.umpanBalik[id],
          [field]: val,
        },
      },
    });
  };

  const handleTindakLanjutChange = (id: number, field: 'tindakLanjut' | 'penanggungJawab' | 'waktu', val: string) => {
    setFormData({
      ...formData,
      rencanaTindakLanjut: {
        ...formData.rencanaTindakLanjut,
        [id]: {
          ...formData.rencanaTindakLanjut[id],
          [field]: val,
        },
      },
    });
  };

  const handleAIGenerate = async () => {
    setGenerating(true);
    const result = await generateAIFeedback(
      'pasca',
      formData,
      teacher.name,
      teacher.subject,
      teacher.className
    );
    setGenerating(false);

    if (result) {
      setFormData({
        ...formData,
        catatanSupervisor: result.catatanSupervisor || formData.catatanSupervisor,
        kesepakatanBersama: result.kesepakatanBersama || formData.kesepakatanBersama,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {savedSuccess && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Data Hasil Pasca-Observasi berhasil disimpan!
        </div>
      )}

      {/* Part A: Refleksi Guru */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-2">
          <h2 className="text-sm font-bold text-slate-900"> A. Refleksi Mandiri Guru Pasca-Observasi</h2>
          <p className="text-xs text-slate-500">Tanggapan reflektif guru setelah melaksanakan proses mengajar.</p>
        </div>

        <div className="space-y-4 text-xs">
          {PASCA_REFLEKSI_QUESTIONS.map((q) => (
            <div key={q.id} className="space-y-1">
              <label className="block font-semibold text-slate-800">{q.id}. {q.question}</label>
              <textarea
                rows={2}
                value={formData.refleksiGuru[q.id] || ''}
                onChange={(e) => handleRefleksiChange(q.id, e.target.value)}
                placeholder="Jawaban reflektif guru..."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Part B: Umpan Balik Supervisor */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-2">
          <h2 className="text-sm font-bold text-slate-900"> B. Umpan Balik Konstruktif Supervisor (5 Aspek)</h2>
          <p className="text-xs text-slate-500">Apresiasi kekuatan dan area yang perlu terus dikembangkan.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Aspek Pengamatan</th>
                <th className="py-2.5 px-3">Apresiasi (Kekuatan Utama)</th>
                <th className="py-2.5 px-3">Area Pengembangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {PASCA_UMPAN_BALIK_ASPEK.map((a) => {
                const item = formData.umpanBalik[a.id] || { apresiasi: '', areaPengembangan: '' };
                return (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{a.aspek}</td>
                    <td className="py-3 px-3">
                      <textarea
                        rows={2}
                        value={item.apresiasi}
                        onChange={(e) => handleUmpanBalikChange(a.id, 'apresiasi', e.target.value)}
                        placeholder="Poin apresiasi..."
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <textarea
                        rows={2}
                        value={item.areaPengembangan}
                        onChange={(e) => handleUmpanBalikChange(a.id, 'areaPengembangan', e.target.value)}
                        placeholder="Area pengembangan..."
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Part C: Rencana Tindak Lanjut */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-2">
          <h2 className="text-sm font-bold text-slate-900"> C. Rencana Tindak Lanjut (RTL)</h2>
          <p className="text-xs text-slate-500">Rencana aksi spesifik pasca-supervisi.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3">Aspek Tindak Lanjut</th>
                <th className="py-2.5 px-3">Aksi yang Disepakati</th>
                <th className="py-2.5 px-3 w-40">Penanggung Jawab</th>
                <th className="py-2.5 px-3 w-32">Waktu Pelaksanaan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {PASCA_TINDAK_LANJUT_ASPEK.map((a) => {
                const item = formData.rencanaTindakLanjut[a.id] || { tindakLanjut: '', penanggungJawab: '', waktu: '' };
                return (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-bold text-slate-900">{a.aspek}</td>
                    <td className="py-3 px-3">
                      <input
                        type="text"
                        value={item.tindakLanjut}
                        onChange={(e) => handleTindakLanjutChange(a.id, 'tindakLanjut', e.target.value)}
                        placeholder="Detail rencana aksi..."
                        className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="text"
                        value={item.penanggungJawab}
                        onChange={(e) => handleTindakLanjutChange(a.id, 'penanggungJawab', e.target.value)}
                        placeholder="PJ"
                        className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <input
                        type="text"
                        value={item.waktu}
                        onChange={(e) => handleTindakLanjutChange(a.id, 'waktu', e.target.value)}
                        placeholder="Waktu"
                        className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Part D: Supervisor Note & Mutual Agreement */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900"> D. Catatan Akhir & Kesepakatan Bersama</h2>
            <p className="text-xs text-slate-500">Kesimpulan hasil diskusi antara supervisor dan guru.</p>
          </div>

          <button
            type="button"
            onClick={handleAIGenerate}
            disabled={generating}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-3.5 py-1.5 text-xs font-bold shadow-sm transition-all"
          >
            <Sparkles className="h-4 w-4" />
            {generating ? 'Menganalisis...' : 'Generate dengan AI'}
          </button>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-800 mb-1">Catatan Akhir Supervisor:</label>
            <textarea
              rows={3}
              value={formData.catatanSupervisor || ''}
              onChange={(e) => setFormData({ ...formData, catatanSupervisor: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">Kesepakatan Bersama:</label>
            <textarea
              rows={3}
              value={formData.kesepakatanBersama || ''}
              onChange={(e) => setFormData({ ...formData, kesepakatanBersama: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-xs font-semibold shadow-sm transition-colors"
          >
            <Save className="h-4 w-4" /> Simpan Data Pasca-Observasi
          </button>
        </div>
      </div>
    </form>
  );
};
