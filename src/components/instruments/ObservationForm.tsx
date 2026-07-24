import React, { useState } from 'react';
import { Sparkles, Save, CheckCircle2 } from 'lucide-react';
import { OBSERVASI_CATEGORIES } from '../../constants/instrumentData';
import { ObservationData, TeacherData } from '../../types';
import { generateAIFeedback } from '../../services/aiService';

interface Props {
  data: ObservationData;
  teacher: TeacherData;
  onSave: (updatedObs: ObservationData) => void;
}

export const ObservationForm: React.FC<Props> = ({ data, teacher, onSave }) => {
  const [formData, setFormData] = useState<ObservationData>(data);
  const [generating, setGenerating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleScoreChange = (itemId: string, score: number) => {
    setFormData({
      ...formData,
      scores: {
        ...formData.scores,
        [itemId]: {
          ...formData.scores[itemId],
          score,
        },
      },
    });
  };

  const handleEvidenceChange = (itemId: string, evidence: string) => {
    setFormData({
      ...formData,
      scores: {
        ...formData.scores,
        [itemId]: {
          ...formData.scores[itemId],
          evidence,
        },
      },
    });
  };

  const handleAIGenerate = async () => {
    setGenerating(true);
    const result = await generateAIFeedback(
      'observasi',
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
        rekomendasi: result.rekomendasi || formData.rekomendasi,
        tindakLanjut: result.tindakLanjut || formData.tindakLanjut,
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
          Data Lembar Observasi Kelas berhasil disimpan!
        </div>
      )}

      {/* Categories Grid */}
      {OBSERVASI_CATEGORIES.map((cat) => (
        <div key={cat.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            {cat.title}
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
                  <th className="py-2.5 px-3">Indikator Pengamatan</th>
                  <th className="py-2.5 px-3 w-40 text-center">Skor (1–4)</th>
                  <th className="py-2.5 px-3">Bukti Pembelajaran & Catatan Pengamat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {cat.items.map((item) => {
                  const currentScore = formData.scores[item.id]?.score || 3;
                  const currentEvidence = formData.scores[item.id]?.evidence || '';

                  return (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{item.label}</div>
                        <div className="text-[11px] text-slate-500">{item.description}</div>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {[1, 2, 3, 4].map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => handleScoreChange(item.id, s)}
                              className={`h-7 w-7 rounded-lg text-xs font-bold transition-all ${
                                currentScore === s
                                  ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {currentScore === 4
                            ? 'Sangat Baik'
                            : currentScore === 3
                            ? 'Baik'
                            : currentScore === 2
                            ? 'Cukup'
                            : 'Kurang'}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <textarea
                          rows={2}
                          value={currentEvidence}
                          onChange={(e) => handleEvidenceChange(item.id, e.target.value)}
                          placeholder="Fakta / bukti teramati di kelas..."
                          className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Supervisor Notes & AI Generator */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Catatan Supervisor & Rencana Pembinaan</h2>
            <p className="text-xs text-slate-500">Rangkuman hasil observasi dan rekomendasi perbaikan.</p>
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
            <label className="block font-semibold text-slate-800 mb-1">Catatan Pengamat / Supervisor:</label>
            <textarea
              rows={3}
              value={formData.catatanSupervisor || ''}
              onChange={(e) => setFormData({ ...formData, catatanSupervisor: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">Rekomendasi Perbaikan Pembelajaran:</label>
            <textarea
              rows={3}
              value={formData.rekomendasi || ''}
              onChange={(e) => setFormData({ ...formData, rekomendasi: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">Aksi Tindak Lanjut:</label>
            <textarea
              rows={2}
              value={formData.tindakLanjut || ''}
              onChange={(e) => setFormData({ ...formData, tindakLanjut: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-xs font-semibold shadow-sm transition-colors"
          >
            <Save className="h-4 w-4" /> Simpan Hasil Observasi Kelas
          </button>
        </div>
      </div>
    </form>
  );
};
