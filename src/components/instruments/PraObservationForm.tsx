import React, { useState } from 'react';
import { Sparkles, Save, Check, X, FileText, Upload, CheckCircle2 } from 'lucide-react';
import { TELAAH_RPP_ITEMS, WAWANCARA_PRA_QUESTIONS } from '../../constants/instrumentData';
import { PraObservationData, TeacherData } from '../../types';
import { generateAIFeedback } from '../../services/aiService';

interface Props {
  data: PraObservationData;
  teacher: TeacherData;
  onSave: (updatedPra: PraObservationData) => void;
}

export const PraObservationForm: React.FC<Props> = ({ data, teacher, onSave }) => {
  const [formData, setFormData] = useState<PraObservationData>(data);
  const [generating, setGenerating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleTelaahToggle = (id: number, checked: boolean) => {
    setFormData({
      ...formData,
      telaahItems: {
        ...formData.telaahItems,
        [id]: {
          checked,
          note: formData.telaahItems[id]?.note || '',
        },
      },
    });
  };

  const handleTelaahNote = (id: number, note: string) => {
    setFormData({
      ...formData,
      telaahItems: {
        ...formData.telaahItems,
        [id]: {
          checked: formData.telaahItems[id]?.checked ?? true,
          note,
        },
      },
    });
  };

  const handleWawancaraChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      wawancara: {
        ...formData.wawancara,
        [key]: value,
      },
    });
  };

  const handleAIGenerate = async () => {
    setGenerating(true);
    const result = await generateAIFeedback(
      'pra',
      formData,
      teacher.name,
      teacher.subject,
      teacher.className
    );
    setGenerating(false);

    if (result) {
      setFormData({
        ...formData,
        kelebihan: result.kelebihan || formData.kelebihan,
        areaPengembangan: result.areaPengembangan || formData.areaPengembangan,
        rekomendasi: result.rekomendasi || formData.rekomendasi,
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {savedSuccess && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          Data Instrumen Pra-Observasi berhasil disimpan!
        </div>
      )}

      {/* RPP Document Attachment Section */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <FileText className="h-4 w-4 text-indigo-600" /> Dokumen RPP / Modul Ajar Terlampir
        </h3>

        {teacher.documents && teacher.documents.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {teacher.documents.map((doc) => (
              <div key={doc.id} className="flex items-center gap-2 rounded-lg bg-white border border-slate-200 p-2 text-xs">
                <FileText className="h-4 w-4 text-indigo-600" />
                <span className="font-semibold text-slate-800">{doc.name}</span>
                <span className="text-[10px] text-slate-400">({doc.type})</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-amber-700 italic">
            Belum ada dokumen perangkat pembelajaran yang diunggah oleh guru.
          </p>
        )}
      </div>

      {/* Part 1: Telaah Modul Ajar (20 Items) */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-2">
          <h2 className="text-sm font-bold text-slate-900"> Bagian 1: Telaah Modul Ajar / RPP (20 Komponen)</h2>
          <p className="text-xs text-slate-500">Evaluasi kelengkapan dan kualitas perencanaan pembelajaran.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-y border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
                <th className="py-2.5 px-3 w-10">No</th>
                <th className="py-2.5 px-3">Komponen & Indikator Pengamatan</th>
                <th className="py-2.5 px-3 w-28 text-center">Hasil (Ya/Tidak)</th>
                <th className="py-2.5 px-3">Catatan / Temuan Spesifik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {TELAAH_RPP_ITEMS.map((item) => {
                const checked = formData.telaahItems[item.id]?.checked ?? true;
                const note = formData.telaahItems[item.id]?.note || '';
                return (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-medium text-slate-500">{item.id}</td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900">{item.komponen}</div>
                      <div className="text-[11px] text-slate-500">{item.indikator}</div>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleTelaahToggle(item.id, true)}
                          className={`p-1.5 rounded transition-all ${
                            checked ? 'bg-emerald-600 text-white font-bold shadow-sm' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                          title="Sesuai (Ya)"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleTelaahToggle(item.id, false)}
                          className={`p-1.5 rounded transition-all ${
                            !checked ? 'bg-rose-600 text-white font-bold shadow-sm' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                          }`}
                          title="Belum Sesuai (Tidak)"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <input
                        type="text"
                        value={note}
                        onChange={(e) => handleTelaahNote(item.id, e.target.value)}
                        placeholder="Catatan temuan..."
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-600"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Part 2: Wawancara Pra-Observasi (6 Pertanyaan) */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-2">
          <h2 className="text-sm font-bold text-slate-900"> Bagian 2: Wawancara Pra-Observasi (6 Pertanyaan Esensial)</h2>
          <p className="text-xs text-slate-500">Pertanyaan lisan untuk menggali persepsi dan kesiapan guru sebelum mengajar.</p>
        </div>

        <div className="space-y-4 text-xs">
          {WAWANCARA_PRA_QUESTIONS.map((q) => (
            <div key={q.id} className="space-y-1">
              <label className="block font-semibold text-slate-800">{q.label}</label>
              <textarea
                rows={2}
                value={(formData.wawancara as any)[q.id] || ''}
                onChange={(e) => handleWawancaraChange(q.id, e.target.value)}
                placeholder="Jawaban dan penjelasan guru..."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Part 3: Catatan Tambahan & AI Analysis */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900"> Bagian 3: Kesimpulan & Rekomendasi Pra-Observasi</h2>
            <p className="text-xs text-slate-500">Catatan akhir telaah perangkat pembelajaran guru.</p>
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
            <label className="block font-semibold text-slate-800 mb-1">Kelebihan Perencanaan Pembelajaran:</label>
            <textarea
              rows={3}
              value={formData.kelebihan || ''}
              onChange={(e) => setFormData({ ...formData, kelebihan: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">Hal yang Perlu Ditingkatkan:</label>
            <textarea
              rows={3}
              value={formData.areaPengembangan || ''}
              onChange={(e) => setFormData({ ...formData, areaPengembangan: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">Rekomendasi & Revisi Sesuai Pembelajaran Mendalam:</label>
            <textarea
              rows={3}
              value={formData.rekomendasi || ''}
              onChange={(e) => setFormData({ ...formData, rekomendasi: e.target.value })}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-xs font-semibold shadow-sm transition-colors"
          >
            <Save className="h-4 w-4" /> Simpan Data Pra-Observasi
          </button>
        </div>
      </div>
    </form>
  );
};
