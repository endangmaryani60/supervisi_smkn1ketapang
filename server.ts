import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "SI SUPAK" });
  });

  // AI Analysis & Notes Generation Proxy
  app.post("/api/generate-ai", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({
          error: "API Key Gemini belum dikonfigurasi pada server.",
        });
      }

      const { stage, data, teacherName, subject, className } = req.body;

      const ai = new GoogleGenAI({ apiKey });

      let prompt = "";

      if (stage === "pra") {
        prompt = `
Sebagai Supervisor Akademik profesional (Kepala Sekolah/Pengawas) sesuai Kurikulum Nasional terbaru di Indonesia, berikan analisis ringkas dan konstruktif untuk tahap Pra-Observasi (Telaah Modul Ajar/RPP & Wawancara).
Guru: ${teacherName || "Guru"}
Mata Pelajaran: ${subject || "Mata Pelajaran"}
Kelas: ${className || "Kelas"}

Data Penilaian/Catatan Telaah Modul Ajar:
${JSON.stringify(data, null, 2)}

Tolong hasilkan respons dalam format JSON valid dengan struktur persis berikut:
{
  "kelebihan": "3-4 poin ringkas kelebihan perencanaan pembelajaran guru...",
  "areaPengembangan": "2-3 poin aspek yang perlu ditingkatkan sebelum observasi...",
  "rekomendasi": "Rekomendasi spesifik dan langkah konkret sesuai prinsip Pembelajaran Mendalam..."
}
HANYA berikan output JSON tanpa tanda markdown backtick.
        `;
      } else if (stage === "observasi") {
        prompt = `
Sebagai Supervisor Akademik profesional (Kepala Sekolah/Pengawas) di Indonesia, berikan evaluasi menyeluruh untuk tahap Observasi Kelas.
Guru: ${teacherName || "Guru"}
Mata Pelajaran: ${subject || "Mata Pelajaran"}
Kelas: ${className || "Kelas"}

Data Skor dan Catatan Observasi (Skala 1-4, Pembelajaran Mendalam, Kokurikuler, Asesmen, Refleksi):
${JSON.stringify(data, null, 2)}

Tolong hasilkan respons dalam format JSON valid dengan struktur persis berikut:
{
  "catatanSupervisor": "Ulasan komprehensif mengenai pelaksanaan pembelajaran di kelas...",
  "rekomendasi": "Rekomendasi perbaikan konkret untuk pertemuan selanjutnya...",
  "tindakLanjut": "Rencana tindak lanjut aksi nyata pendampingan atau pelatihan..."
}
HANYA berikan output JSON tanpa tanda markdown backtick.
        `;
      } else if (stage === "pasca") {
        prompt = `
Sebagai Supervisor Akademik profesional, rangkum diskusi Pasca-Observasi (Refleksi, Umpan Balik, dan Rencana Tindak Lanjut).
Guru: ${teacherName || "Guru"}
Mata Pelajaran: ${subject || "Mata Pelajaran"}

Data Refleksi Guru & Umpan Balik:
${JSON.stringify(data, null, 2)}

Tolong hasilkan respons dalam format JSON valid dengan struktur persis berikut:
{
  "catatanSupervisor": "Ringkasan apresiasi, aspek utama yang disoroti, dan motivasi...",
  "kesepakatanBersama": "Kesepakatan bersama antara Kepala Sekolah/Pengawas dan Guru untuk perbaikan pembelajaran mendatang..."
}
HANYA berikan output JSON tanpa tanda markdown backtick.
        `;
      } else {
        return res.status(400).json({ error: "Stage tidak valid." });
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const rawText = response.text || "";
      // Strip markdown code fences if present
      const cleanJsonStr = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanJsonStr);

      return res.json({ success: true, result: parsed });
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      return res.status(500).json({
        error: err.message || "Gagal menghasilkan analisis AI.",
      });
    }
  });

  // Vite Middleware for Dev
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SI SUPAK Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
