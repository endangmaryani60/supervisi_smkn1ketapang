import { ObsItemCategory, TelaahItem } from '../types';

export const TELAAH_RPP_ITEMS: TelaahItem[] = [
  { id: 1, komponen: 'Identitas Modul / RPP', indikator: 'Memuat nama sekolah, alokasi waktu, mata pelajaran, kelas, dan fase' },
  { id: 2, komponen: 'Capaian Pembelajaran (CP)', indikator: 'Capaian Pembelajaran sesuai dengan fase dan elemen Kurikulum Nasional' },
  { id: 3, komponen: 'Tujuan Pembelajaran (TP)', indikator: 'Tujuan pembelajaran dirumuskan secara rinci, terukur, dan mencakup ABCD' },
  { id: 4, komponen: 'Alur Tujuan Pembelajaran (ATP)', indikator: 'Alur susunan materi sistematis dan logis berjenjang' },
  { id: 5, komponen: 'Pemahaman Bermakna', indikator: 'Manfaat materi dalam kehidupan nyata peserta didik terdefinisi jelas' },
  { id: 6, komponen: 'Pertanyaan Pemantik', indikator: 'Pertanyaan merangsang rasa ingin tahu dan berpikir kritis murid' },
  { id: 7, komponen: 'Profil/Dimensi Kokurikuler', indikator: 'Mengintegrasikan nilai-nilai karakter dan penguatan Kokurikuler' },
  { id: 8, komponen: 'Target Peserta Didik', indikator: 'Mengidentifikasi kebutuhan belajar murid (reguler, kesulitan, atau pencapaian tinggi)' },
  { id: 9, komponen: 'Model & Metode Pembelajaran', indikator: 'Menggunakan pendekatan interaktif, Pembelajaran Mendalam, dan kontekstual' },
  { id: 10, komponen: 'Media & Alat Pembelajaran', indikator: 'Media konkret, digital, atau lingkungan sekitar disiapkan dengan tepat' },
  { id: 11, komponen: 'Bahan Ajar & Sumber Belajar', indikator: 'Materi bacaan, tautan, atau modul pendukung yang relevan' },
  { id: 12, komponen: 'Apersepsi & Kegiatan Pembuka', indikator: 'Pengondisian awal kelas, motivasi, dan pengait materi sebelumnya' },
  { id: 13, komponen: 'Pembelajaran Berdiferensiasi', indikator: 'Memfasilitasi diferensiasi konten, proses, atau produk murid' },
  { id: 14, komponen: 'Pendekatan Pembelajaran Mendalam', indikator: 'Mendorong pemahaman konsep secara kritis, analitis, dan bermakna' },
  { id: 15, komponen: 'Kegiatan Penutup & Refleksi', indikator: 'Merangkum, mengevaluasi, dan merefleksikan pemahaman murid' },
  { id: 16, komponen: 'Asesmen Awal (Awal Pembelajaran)', indikator: 'Instrumen diagnosis kesiapan belajar dan pengetahuan awal murid' },
  { id: 17, komponen: 'Asesmen Formatif (Proses)', indikator: 'Instrumen penilaian saat proses belajar berjalan' },
  { id: 18, komponen: 'Asesmen Sumatif (Akhir)', indikator: 'Instrumen pengujian ketercapaian tujuan pembelajaran' },
  { id: 19, komponen: 'Pengayaan & Remedial', indikator: 'Rencana pendampingan khusus untuk murid belum tuntas dan tantangan pengayaan' },
  { id: 20, komponen: 'Lembar Kerja Murid (LKM/LKPD)', indikator: 'LKPD dirancang menarik, menantang, dan memandu pemahaman murid' },
];

export const WAWANCARA_PRA_QUESTIONS = [
  { id: 'tujuan', label: '1. Apakah tujuan pembelajaran yang ingin dicapai pada sesi observasi ini?' },
  { id: 'strategi', label: '2. Strategi atau pendekatan pembelajaran apa yang akan Anda gunakan?' },
  { id: 'alatBahan', label: '3. Alat, media, dan bahan ajar apa saja yang telah Anda persiapkan?' },
  { id: 'metodePengukuran', label: '4. Bagaimana Anda mengukur ketercapaian pemahaman murid selama dan sesudah pembelajaran?' },
  { id: 'antisipasiTantangan', label: '5. Tantangan apa yang mungkin muncul di kelas dan bagaimana rencana antisipasi Anda?' },
  { id: 'fokusKompetensi', label: '6. Fokus kompetensi atau aspek spesifik mana yang ingin Anda amati bersama supervisor?' },
];

export const OBSERVASI_CATEGORIES: ObsItemCategory[] = [
  {
    id: 'perencanaan',
    title: 'A. Perencanaan Pembelajaran',
    items: [
      { id: 'p1', label: 'Kesesuaian Modul Ajar/RPP', description: 'Guru melaksanakan pembelajaran sesuai alur dalam rancangan pembelajaran' },
      { id: 'p2', label: 'Kesiapan Perangkat & Media', description: 'Kesiapan bahan ajar, media pembelajaran, dan lembar kerja peserta didik' },
    ],
  },
  {
    id: 'pembelajaranMendalam',
    title: 'B. Pelaksanaan - Pembelajaran Mendalam',
    items: [
      { id: 'pm1', label: 'Keselarasan Konsep & Materi', description: 'Penyampaian materi mendalam, akurat, dan merangsang nalar kritis murid' },
      { id: 'pm2', label: 'Aktivasi Berpikir Kritis & Analitis', description: 'Mengajukan pertanyaan pemantik dan studi kasus nyata yang menantang murid' },
      { id: 'pm3', label: 'Pembelajaran Berdiferensiasi', description: 'Mengakomodasi ragam minat, kecepatan belajar, dan kesiapan murid' },
      { id: 'pm4', label: 'Eksplorasi & Kolaborasi Aktif', description: 'Murid aktif berdiskusi, bereksperimen, atau menyelesaikan tantangan bersama' },
    ],
  },
  {
    id: 'pengelolaan',
    title: 'C. Pengelolaan Kelas & Suasana Belajar',
    items: [
      { id: 'pk1', label: 'Lingkungan Belajar Positif & Inklusif', description: 'Menciptakan ruang kelas yang aman, saling menghargai, dan responsif' },
      { id: 'pk2', label: 'Pengoperasian & Manajemen Waktu', description: 'Alokasi waktu efektif, transisi antar kegiatan berjalan lancar' },
    ],
  },
  {
    id: 'kokurikuler',
    title: 'D. Penguatan Kokurikuler',
    items: [
      { id: 'kk1', label: 'Integrasi Karakter & Etika', description: 'Menanamkan dimensi kewarganegaraan, kemandirian, dan gotong royong' },
      { id: 'kk2', label: 'Penguatan Literasi & Numerasi', description: 'Memfasilitasi kecakapan membaca, mengolah data, dan penalaran' },
    ],
  },
  {
    id: 'asesmen',
    title: 'E. Asesmen & Evaluasi Pembelajaran',
    items: [
      { id: 'as1', label: 'Umpan Balik Langsung (Formatif)', description: 'Memberikan tanggapan dan penguatan positif saat murid mengerjakan tugas' },
      { id: 'as2', label: 'Asesmen Hasil & Pemahaman Murid', description: 'Memeriksa tingkat pencapaian tujuan pembelajaran secara adil' },
    ],
  },
  {
    id: 'refleksi',
    title: 'F. Refleksi Pembelajaran di Kelas',
    items: [
      { id: 'rf1', label: 'Pemberian Ruang Refleksi Murid', description: 'Membimbing murid menyimpulkan dan menyadari apa yang telah dipelajari' },
    ],
  },
];

export const PASCA_REFLEKSI_QUESTIONS = [
  { id: 1, question: 'Bagaimana perasaan Anda setelah melaksanakan proses pembelajaran di kelas hari ini?' },
  { id: 2, question: 'Apakah seluruh alur pembelajaran berjalan sesuai dengan rancangan Modul Ajar/RPP yang disiapkan?' },
  { id: 3, question: 'Menurut Anda, sejauh mana tujuan pembelajaran telah tercapai oleh murid?' },
  { id: 4, question: 'Apa saja tantangan atau hambatan utama yang Anda hadapi saat mengelola kelas tadi?' },
  { id: 5, question: 'Apa hal paling positif yang Anda rasa berhasil dilakukan dan patut dipertahankan?' },
];

export const PASCA_UMPAN_BALIK_ASPEK = [
  { id: 1, aspek: 'Perencanaan Pembelajaran' },
  { id: 2, aspek: 'Pembelajaran Mendalam' },
  { id: 3, aspek: 'Pengelolaan Kelas' },
  { id: 4, aspek: 'Asesmen & Evaluasi' },
  { id: 5, aspek: 'Refleksi Guru' },
];

export const PASCA_TINDAK_LANJUT_ASPEK = [
  { id: 1, aspek: 'Pengembangan Modul Ajar / Pembelajaran Mendalam' },
  { id: 2, aspek: 'Variasi Strategi / Media Pembelajaran' },
  { id: 3, aspek: 'Peningkatan Manajemen Suasana Kelas' },
  { id: 4, aspek: 'Penguatan Instrumen Asesmen Formatif' },
  { id: 5, aspek: 'Pelatihan / Komunitas Belajar (KKG/MGMP)' },
];
