import { SchoolSettings, TeacherData, UserAccount, SupervisionSession, TeacherDocument, DocumentType } from '../types';
import { TELAAH_RPP_ITEMS, WAWANCARA_PRA_QUESTIONS, OBSERVASI_CATEGORIES, PASCA_REFLEKSI_QUESTIONS, PASCA_UMPAN_BALIK_ASPEK, PASCA_TINDAK_LANJUT_ASPEK } from '../constants/instrumentData';

const KEYS = {
  SETTINGS: 'sisupak_school_settings_v6',
  ACCOUNTS: 'sisupak_user_accounts_v6',
  TEACHERS: 'sisupak_teachers_v6',
  SESSIONS: 'sisupak_supervision_sessions_v6',
  CURRENT_USER: 'sisupak_session_user_v6',
};

// SHA-256 Hash Helper
export async function hashPassword(password: string): Promise<string> {
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgUint8 = new TextEncoder().encode(password);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {
    console.warn('Crypto API fallback used');
  }
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return 'hashed_' + Math.abs(hash).toString(16);
}

// Initial Default School Settings
export const DEFAULT_SCHOOL_SETTINGS: SchoolSettings = {
  schoolName: 'SMK Negeri 1 Ketapang',
  principalName: 'ERINI, S.P., M.M.Pd.',
  principalNip: '19680824 200003 2 004',
  supervisorName: 'A.Rani, S.Pd.,MPd',
  supervisorNip: '19640321 199103 1 012',
  address: 'Jl. W. Monginsidi No. 40, Ketapang, Kalimantan Barat',
  district: 'Kabupaten Ketapang',
  academicYear: '2025/2026',
  semester: 'Ganjil',
  isSampleData: false,
};

// Official dataset of 93 teachers from SK Pembagian Tugas & Jadwal Supervisi SMKN 1 Ketapang
export const RAW_TEACHERS_DATA = [
  { no: 1, name: 'Erini, SP, M.MPd', nip: '19680824 200003 2 004', username: 'erini', subject: 'Kepala Sekolah', className: 'XII ATP', pangkatGolongan: 'Pembina, IV/a (Guru Madya)', supervisorName: 'A.Rani, S.Pd.,MPd', obsDate: '2026-02-15', praDate: '2026-02-12', pascaDate: '2026-02-18', status: 'Selesai' as const },
  { no: 2, name: 'M. Ajon, S.Pd', nip: '19700110 199702 1 003', username: 'majon', subject: 'Bahasa Inggris', className: 'X TKJ 1 / XII TKJ 1', pangkatGolongan: 'Pembina, IV/a (Guru Madya)', supervisorName: 'Erini, SP, M.MPd', obsDate: '2026-03-02', praDate: '2026-02-27', pascaDate: '2026-03-05', status: 'Sedang Berjalan' as const },
  { no: 3, name: 'Irawan, S.Pd', nip: '19700419 200003 1 003', username: 'irawan', subject: 'Dasar Program Keahlian AKL', className: 'XI AKL 1', pangkatGolongan: 'Pembina, IV/a (Guru Madya)', supervisorName: 'Erini, SP, M.MPd', obsDate: '2026-03-05', praDate: '2026-03-02', pascaDate: '2026-03-08', status: 'Sedang Berjalan' as const },
  { no: 4, name: 'Rosilawati, S.Pd', nip: '19670718 200012 2 002', username: 'rosilawati', subject: 'Akuntansi (Akuntansi Keuangan)', className: 'XI AKL 1', pangkatGolongan: 'Pembina, IV/a (Guru Madya)', supervisorName: 'Erini, SP, M.MPd', obsDate: '2026-02-12', praDate: '2026-02-09', pascaDate: '2026-02-15', status: 'Selesai' as const },
  { no: 5, name: 'Rayadi, S.Pd', nip: '19681030 200101 1 001', username: 'rayadi', subject: 'Kreativitas, Inovasi & Kewirausahaan', className: 'XI DPIB / XI AK 1', pangkatGolongan: 'Pembina, IV/a (Guru Madya)', supervisorName: 'Rosilawati, S.Pd', obsDate: '2026-02-10', praDate: '2026-02-07', pascaDate: '2026-02-13', status: 'Selesai' as const },
  { no: 6, name: 'Suryatina, SE', nip: '19730901 199503 2 004', username: 'suryatina', subject: 'Usaha Layanan Wisata', className: 'XI ULW', pangkatGolongan: 'Pembina, IV/a (Guru Madya)', supervisorName: 'Erini, SP, M.MPd', obsDate: '2026-02-23', praDate: '2026-02-20', pascaDate: '2026-02-26', status: 'Selesai' as const },
  { no: 7, name: 'Suryati, S.Pd', nip: '19770906 200212 2 004', username: 'suryati', subject: 'Matematika', className: 'XII TKJ 1 / XI BD 2', pangkatGolongan: 'Pembina, IV/a (Guru Madya)', supervisorName: 'Wiwin Wulandari, SE', obsDate: '2026-02-13', praDate: '2026-02-10', pascaDate: '2026-02-16', status: 'Selesai' as const },
  { no: 8, name: 'Hery Gunawan, S.Kom', nip: '19770426 200604 1 007', username: 'herygunawan', subject: 'Informatika & KKA', className: 'XI TKJ 1', pangkatGolongan: 'Pembina, IV/a (Guru Madya)', supervisorName: 'Vida Nourmalita, S.Pd', obsDate: '2026-03-09', praDate: '2026-03-06', pascaDate: '2026-03-12', status: 'Sedang Berjalan' as const },
  { no: 9, name: 'Ratnawati, S.Pd', nip: '19730103 200012 2 002', username: 'ratnawati', subject: 'Akuntansi Perusahaan', className: 'XI AK 2', pangkatGolongan: 'Penata Tk.I, III/d (Guru Muda)', supervisorName: 'Rosilawati, S.Pd', obsDate: '2026-02-12', praDate: '2026-02-09', pascaDate: '2026-02-15', status: 'Selesai' as const },
  { no: 10, name: 'Dyantika Puspitasari, S.Pd', nip: '19830117 200604 2 011', username: 'dyantikapuspitasari', subject: 'Bahasa Inggris & FB Service', className: 'XII PH 2', pangkatGolongan: 'Penata Tk.I, III/d (Guru Muda)', supervisorName: 'Syarifudin, S.Pd., M.B.A', obsDate: '2026-02-10', praDate: '2026-02-07', pascaDate: '2026-02-13', status: 'Selesai' as const },
  { no: 11, name: 'Wiwin Wulandari, SE', nip: '19751213 200701 2 018', username: 'wiwinwulandari', subject: 'Bisnis Digital', className: 'XII AKL 1', pangkatGolongan: 'Penata Tk.I, III/d (Guru Muda)', supervisorName: 'Endang Maryani, S.Pd', obsDate: '2026-02-27', praDate: '2026-02-24', pascaDate: '2026-03-02', status: 'Sedang Berjalan' as const },
  { no: 12, name: 'Sumanti, S.Pd', nip: '19760601 200604 2 034', username: 'sumanti', subject: 'Pelayanan BK/BP', className: 'X TKR 1', pangkatGolongan: 'Penata Tk.I, III/d (Guru Muda)', supervisorName: 'Endang Maryani, S.Pd', obsDate: '2026-02-26', praDate: '2026-02-23', pascaDate: '2026-03-01', status: 'Selesai' as const },
  { no: 13, name: 'Sumiyatun, S.Pd.Ing', nip: '19660802 199203 2 006', username: 'sumiyatun', subject: 'Bahasa Inggris', className: 'XI BDP 1', pangkatGolongan: 'Penata Tk.I, III/d (Guru Muda)', supervisorName: 'Vida Nourmalita, S.Pd', obsDate: '2026-03-09', praDate: '2026-03-06', pascaDate: '2026-03-12', status: 'Sedang Berjalan' as const },
  { no: 14, name: 'Endang Maryani, S.Pd', nip: '19861016 201001 2 013', username: 'endangmaryani', subject: 'Projek IPAS (Waka Kurikulum)', className: 'X Keperawatan', pangkatGolongan: 'Penata Tk.I, III/d (Guru Muda)', supervisorName: 'Erini, SP, M.MPd', obsDate: '2026-03-11', praDate: '2026-03-08', pascaDate: '2026-03-14', status: 'Sedang Berjalan' as const },
  { no: 15, name: 'Henny Mufizawati, S.Pd', nip: '19840127 200903 2 003', username: 'hennymufizawati', subject: 'Pendidikan Pancasila', className: 'XII BD 2', pangkatGolongan: 'Penata Tk.I, III/d (Guru Muda)', supervisorName: 'Endang Maryani, S.Pd', obsDate: '2026-02-26', praDate: '2026-02-23', pascaDate: '2026-03-01', status: 'Selesai' as const },
  { no: 16, name: 'Zuliah, S.Pd', nip: '19800728 200604 2 022', username: 'zuliah', subject: 'Pendidikan Pancasila', className: 'XI DKV 2', pangkatGolongan: 'Penata Tk.I, III/d (Guru Muda)', supervisorName: 'Yana Apriliya, S.ST.Par', obsDate: '2026-02-23', praDate: '2026-02-20', pascaDate: '2026-02-26', status: 'Selesai' as const },
  { no: 17, name: 'Arie Sumartini, ST', nip: '19800315 200604 2 013', username: 'ariesumartini', subject: 'Teknik Komputer & Jaringan', className: 'XI TKJ', pangkatGolongan: 'Penata, III/c (Guru Muda)', supervisorName: 'Syarifudin, S.Pd., M.B.A', obsDate: '2026-02-26', praDate: '2026-02-23', pascaDate: '2026-03-01', status: 'Selesai' as const },
  { no: 18, name: 'Sri Wahyuni, ST', nip: '19791107 200701 2 014', username: 'sriwahyuni', subject: 'Projek IPAS', className: 'X TKJ 1', pangkatGolongan: 'Penata, III/c (Guru Muda)', supervisorName: 'Arie Sumartini, ST', obsDate: '2026-02-11', praDate: '2026-02-08', pascaDate: '2026-02-14', status: 'Selesai' as const },
  { no: 19, name: 'Rochmad Basuki, S.Pd', nip: '19790812 200803 1 001', username: 'rochmadbasuki', subject: 'Penjasorkes (Waka Kesiswaan)', className: 'X TSM 1', pangkatGolongan: 'Penata, III/c (Guru Muda)', supervisorName: 'Syarifudin, S.Pd., M.B.A', obsDate: '2026-02-11', praDate: '2026-02-08', pascaDate: '2026-02-14', status: 'Selesai' as const },
  { no: 20, name: 'Syarifudin, S.Pd., M.B.A', nip: '19850622 200903 1 001', username: 'syarifudin', subject: 'Bahasa Inggris (Waka Humastri)', className: 'XII BDP 2', pangkatGolongan: 'Penata, III/c (Guru Muda)', supervisorName: 'Vida Nourmalita, S.Pd', obsDate: '2026-03-09', praDate: '2026-03-06', pascaDate: '2026-03-12', status: 'Sedang Berjalan' as const },
  { no: 21, name: 'Eni Purwaningsih, S.Pd', nip: '19770314 200604 2 019', username: 'enipurwaningsih', subject: 'Pendidikan Pancasila', className: 'XI LPKC 2', pangkatGolongan: 'Penata, III/c (Guru Muda)', supervisorName: 'Endang Maryani, S.Pd', obsDate: '2026-02-23', praDate: '2026-02-20', pascaDate: '2026-02-26', status: 'Selesai' as const },
  { no: 22, name: 'Syahranuddin Fadli, S.ST.Par', nip: '19840628 201001 1 011', username: 'syahranuddinfadli', subject: 'Perhotelan & Kuliner', className: 'XII PH 1', pangkatGolongan: 'Penata, III/c (Guru Muda)', supervisorName: 'Syarifudin, S.Pd., M.B.A', obsDate: '2026-02-10', praDate: '2026-02-07', pascaDate: '2026-02-13', status: 'Selesai' as const },
  { no: 23, name: 'Yulia Hartati, S.Pd', nip: '19820323 201001 2 008', username: 'yuliahartati', subject: 'Pelayanan BK/BP', className: 'X Farmasi', pangkatGolongan: 'Penata, III/c (Guru Muda)', supervisorName: 'Sumanti, S.Pd', obsDate: '2026-02-24', praDate: '2026-02-21', pascaDate: '2026-02-27', status: 'Selesai' as const },
  { no: 24, name: 'Ela Susiani, S.Pd', nip: '19821010 200801 2 023', username: 'elasusiani', subject: 'Manajemen Perkantoran', className: 'X AKL 1', pangkatGolongan: 'Penata, III/c (Guru Pertama)', supervisorName: 'Wiwin Wulandari, SE', obsDate: '2026-02-10', praDate: '2026-02-07', pascaDate: '2026-02-13', status: 'Selesai' as const },
  { no: 25, name: 'Yana Apriliya, S.ST.Par', nip: '19880416 201101 2 002', username: 'yanaapriliya', subject: 'Perhotelan & FO', className: 'XI TB 1', pangkatGolongan: 'Penata, III/c (Guru Pertama)', supervisorName: 'Suryatina, SE', obsDate: '2026-02-10', praDate: '2026-02-07', pascaDate: '2026-02-13', status: 'Selesai' as const },
  { no: 26, name: 'Vida Nourmalita, S.Pd', nip: '19870107 201001 2 003', username: 'vidanourmalita', subject: 'Bahasa Inggris (Waka Mutu)', className: 'X TKJ 2', pangkatGolongan: 'Penata Muda Tk.I, III/b (Guru Pertama)', supervisorName: 'Syarifudin, S.Pd., M.B.A', obsDate: '2026-03-04', praDate: '2026-03-01', pascaDate: '2026-03-07', status: 'Sedang Berjalan' as const },
  { no: 27, name: 'Pratiwi, S.Pd', nip: '19860430 200903 2 007', username: 'pratiwi1', subject: 'Matematika & Informatika', className: 'XI TKJ & DKV', pangkatGolongan: 'Penata Muda Tk.I, III/b (Guru Pertama)', supervisorName: 'Vida Nourmalita, S.Pd', obsDate: '2026-02-09', praDate: '2026-02-06', pascaDate: '2026-02-12', status: 'Selesai' as const },
  { no: 28, name: 'Rotua Silaen, S.Pd', nip: '19730213 200701 2 010', username: 'rotuasilaen', subject: 'Manajemen Perkantoran', className: 'XII MP 2', pangkatGolongan: 'Penata Muda, III/a (Guru Pertama)', supervisorName: 'Endang Maryani, S.Pd', obsDate: '2026-03-09', praDate: '2026-03-06', pascaDate: '2026-03-12', status: 'Sedang Berjalan' as const },
  { no: 29, name: 'Roci Anggraini, S.Kep., Ns', nip: '19900416 202221 2 022', username: 'rocianggraini', subject: 'Layanan Kesehatan', className: 'XI KPR 1', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Vida Nourmalita, S.Pd', obsDate: '2026-03-30', praDate: '2026-03-27', pascaDate: '2026-04-02', status: 'Belum' as const },
  { no: 30, name: 'Korawati Mujiastutik, S.Pd', nip: '19930806 202221 2 008', username: 'korawati', subject: 'TKJ & Administrasi Server', className: 'XI TKJ 2', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Arie Sumartini, ST', obsDate: '2026-02-11', praDate: '2026-02-08', pascaDate: '2026-02-14', status: 'Selesai' as const },
  { no: 31, name: 'Rizky Anggraini, S.Pd', nip: '19950129 202221 2 015', username: 'rizkyanggraini', subject: 'Dasar Program Keahlian AKL', className: 'XI AK3', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Rosilawati, S.Pd', obsDate: '2026-02-09', praDate: '2026-02-06', pascaDate: '2026-02-12', status: 'Selesai' as const },
  { no: 32, name: 'Andri Cahyadi, S.Tr.Par', nip: '19740205 202321 1 004', username: 'andricahyadi', subject: 'FB Service', className: 'XI PH 2', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Yana Apriliya, S.ST.Par', obsDate: '2026-03-02', praDate: '2026-02-27', pascaDate: '2026-03-05', status: 'Sedang Berjalan' as const },
  { no: 33, name: 'Ani Budiarti, S.Pd', nip: '19870401 202321 2 029', username: 'anibudiarti', subject: 'Matematika', className: 'XI LP3K', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Syahranuddin Fadli, S.ST.Par', obsDate: '2026-03-31', praDate: '2026-03-28', pascaDate: '2026-04-03', status: 'Belum' as const },
  { no: 34, name: 'Rachmad Syafril, S.Pd', nip: '19900707 202321 1 011', username: 'rachmadsyafril', subject: 'Komputer Akuntansi', className: 'XII AK 3', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Rosilawati, S.Pd', obsDate: '2026-02-12', praDate: '2026-02-09', pascaDate: '2026-02-15', status: 'Selesai' as const },
  { no: 35, name: 'Rasidi, M.Pd.I', nip: '19890403 202321 1 014', username: 'rasidi', subject: 'Pendidikan Agama Islam', className: 'X DKV 2', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Rochmad Basuki, S.Pd', obsDate: '2026-02-23', praDate: '2026-02-20', pascaDate: '2026-02-26', status: 'Selesai' as const },
  { no: 36, name: 'Mulyadi, S.Pd', nip: '19910622 202321 1 017', username: 'mulyadi', subject: 'Karya Desain & DKV', className: 'XII DKV 2', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Pratiwi, S.Pd', obsDate: '2026-02-12', praDate: '2026-02-09', pascaDate: '2026-02-15', status: 'Selesai' as const },
  { no: 37, name: 'Mahbub Susanto, S.Sos', nip: '19810813 202321 1 003', username: 'mahbubsusanto', subject: 'Manajemen Perkantoran', className: 'X MP 2', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Ella Susiani, S.Pd', obsDate: '2026-02-24', praDate: '2026-02-21', pascaDate: '2026-02-27', status: 'Selesai' as const },
  { no: 38, name: 'Yohanes Belmi Lesmana Putra, S.Pd', nip: '19911009 202321 1 013', username: 'yohanesbelmilesmanaputra', subject: 'Matematika', className: 'XII TKJ 2', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Endang Maryani, S.Pd', obsDate: '2026-02-26', praDate: '2026-02-23', pascaDate: '2026-03-01', status: 'Selesai' as const },
  { no: 39, name: 'Riana Br. Karo, S.Pd', nip: '19810918 202321 2 010', username: 'rianabrkaro', subject: 'Dasar Program Keahlian Pemasaran', className: 'X BD 1', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Wiwin Wulandari, SE', obsDate: '2026-02-23', praDate: '2026-02-20', pascaDate: '2026-02-26', status: 'Selesai' as const },
  { no: 40, name: 'Sri Sunarsih, SE', nip: '19860916 202421 2 024', username: 'srisunarsih', subject: 'Akuntansi & Digital Marketing', className: 'XII AKL 2', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Rosilawati, S.Pd', obsDate: '2026-02-09', praDate: '2026-02-06', pascaDate: '2026-02-12', status: 'Selesai' as const },
  { no: 41, name: 'Pratiwi, S.Pd', nip: '19880906 202421 2 032', username: 'pratiwi2', subject: 'Bahasa Inggris', className: 'XI ULW', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Ella Susiani, S.Pd', obsDate: '2026-02-24', praDate: '2026-02-21', pascaDate: '2026-02-27', status: 'Selesai' as const },
  { no: 42, name: 'Asih Sundari, SE', nip: '19890316 202421 2 030', username: 'asihsundari', subject: 'Akuntansi Keuangan', className: 'XII AK 2', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Rosilawati, S.Pd', obsDate: '2026-02-09', praDate: '2026-02-06', pascaDate: '2026-02-12', status: 'Selesai' as const },
  { no: 43, name: 'Siti Aisyah Ulumando, S.Pd', nip: '19880625 202421 2 028', username: 'sitiaisyahulumando', subject: 'Matematika', className: 'XI MP 2', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Ella Susiani, S.Pd', obsDate: '2026-02-24', praDate: '2026-02-21', pascaDate: '2026-02-27', status: 'Selesai' as const },
  { no: 44, name: 'Sumaryati, S.Pd', nip: '19880907 202421 2 037', username: 'sumaryati', subject: 'Bahasa Inggris', className: 'X ULW', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Suryatina, SE', obsDate: '2026-03-02', praDate: '2026-02-27', pascaDate: '2026-03-05', status: 'Sedang Berjalan' as const },
  { no: 45, name: 'Utin Asfarina, SE', nip: '19820320 202421 2 010', username: 'utinasfarina', subject: 'Akuntansi & Layanan Perbankan', className: 'XI LPB', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Rosilawati, S.Pd', obsDate: '2026-02-13', praDate: '2026-02-10', pascaDate: '2026-02-16', status: 'Selesai' as const },
  { no: 46, name: 'Erys Reanda, S.Pd', nip: '19900529 202421 1 017', username: 'erysreanda', subject: 'Penjasorkes (Waka Sarpras)', className: 'X TKR 1', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Rochmad Basuki, S.Pd', obsDate: '2026-02-10', praDate: '2026-02-07', pascaDate: '2026-02-13', status: 'Selesai' as const },
  { no: 47, name: 'Perliandi, S.Pd', nip: '19870106 202421 1 010', username: 'perliandi', subject: 'Bahasa Indonesia', className: 'X AK 2', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Vida Nourmalita, S.Pd', obsDate: '2026-03-06', praDate: '2026-03-03', pascaDate: '2026-03-09', status: 'Sedang Berjalan' as const },
  { no: 48, name: 'Delly Sasmita, S.Pd', nip: '19861225 202421 1 016', username: 'dellysasmita', subject: 'Penjasorkes', className: 'X PH 2', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Rochmad Basuki, S.Pd', obsDate: '2026-02-10', praDate: '2026-02-07', pascaDate: '2026-02-13', status: 'Selesai' as const },
  { no: 49, name: 'Sri Fhani Riska Putri, S.Pd', nip: '19911011 202421 2 043', username: 'srifhaniriskaputri', subject: 'Akuntansi Keuangan', className: 'XII AK 1', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Rosilawati, S.Pd', obsDate: '2026-02-10', praDate: '2026-02-07', pascaDate: '2026-02-13', status: 'Selesai' as const },
  { no: 50, name: 'Hella Cristi, S.Pd', nip: '19900804 202421 2 027', username: 'hellacristi', subject: 'Bahasa Indonesia', className: 'XI MP 1', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Erini, SP, M.MPd', obsDate: '2026-03-10', praDate: '2026-03-07', pascaDate: '2026-03-13', status: 'Sedang Berjalan' as const },
  { no: 51, name: 'Mutiah Wijayanti, S.Pd', nip: '19900322 202421 2 029', username: 'mutiahwijayanti', subject: 'Bahasa Inggris', className: 'X BD 2', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Vida Nourmalita, S.Pd', obsDate: '2026-02-24', praDate: '2026-02-21', pascaDate: '2026-02-27', status: 'Selesai' as const },
  { no: 52, name: 'Tika Sayyidah Sofia, S.Pd', nip: '19961010 202421 2 058', username: 'tikasayyidahsofia', subject: 'Matematika', className: 'X LPB', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Erini, SP, M.MPd', obsDate: '2026-03-02', praDate: '2026-02-27', pascaDate: '2026-03-05', status: 'Sedang Berjalan' as const },
  { no: 53, name: 'M. Aliyul Qurri, SH, M.Pd', nip: '19940706 202421 1 020', username: 'maliyulqurri', subject: 'Pendidikan Agama Islam', className: 'XII BDP 1', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Rochmad Basuki, S.Pd', obsDate: '2026-02-24', praDate: '2026-02-21', pascaDate: '2026-02-27', status: 'Selesai' as const },
  { no: 54, name: 'Eko Kurniawan, S.Pd', nip: '19941216 202421 1 016', username: 'ekokurniawan', subject: 'Dasar Program Keahlian DKV', className: 'XI DKV 1', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Pratiwi, S.Pd', obsDate: '2026-03-11', praDate: '2026-03-08', pascaDate: '2026-03-14', status: 'Sedang Berjalan' as const },
  { no: 55, name: 'Endang Dewi Lestari, S.Tr.Kep', nip: '19960719 202421 2 033', username: 'endangdewilestari', subject: 'Projek IPAS & Keperawatan', className: 'XI LPKC 1', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Roci Anggraini, S.Kep., Ns', obsDate: '2026-03-30', praDate: '2026-03-27', pascaDate: '2026-04-02', status: 'Belum' as const },
  { no: 56, name: 'Ali Nukarta, M.Pd', nip: '19911102 202421 1 019', username: 'alinukarta', subject: 'Bahasa Indonesia', className: 'X AK 1', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Erini, SP, M.MPd', obsDate: '2026-03-10', praDate: '2026-03-07', pascaDate: '2026-03-13', status: 'Sedang Berjalan' as const },
  { no: 57, name: 'Dian Purnama Rizki, S.Pd', nip: '19961126 202421 2 033', username: 'dianpurnamar', subject: 'Informatika & Kewirausahaan', className: 'XII DKV 1', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Pratiwi, S.Pd', obsDate: '2026-03-11', praDate: '2026-03-08', pascaDate: '2026-03-14', status: 'Sedang Berjalan' as const },
  { no: 58, name: 'Mariana Dita Safitri, S.Pd', nip: '19950319 202421 2 041', username: 'marianaditasafitri', subject: 'Sejarah', className: 'XI KUL', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Yana Apriliya, S.ST.Par', obsDate: '2026-02-25', praDate: '2026-02-22', pascaDate: '2026-02-28', status: 'Selesai' as const },
  { no: 59, name: 'Syahri Erpandi, S.Pd', nip: '19930317 202421 1 022', username: 'syahrierpandi', subject: 'Design Brief & Grafika', className: 'XI DKV 2', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Pratiwi, S.Pd', obsDate: '2026-03-11', praDate: '2026-03-08', pascaDate: '2026-03-14', status: 'Sedang Berjalan' as const },
  { no: 60, name: 'Sri Yuniarti Silaban, S.ST', nip: '19900603 202421 2 035', username: 'sriyuniartisilaban', subject: 'Layanan Perbankan', className: 'XII LPB', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Rosilawati, S.Pd', obsDate: '2026-02-10', praDate: '2026-02-07', pascaDate: '2026-02-13', status: 'Selesai' as const },
  { no: 61, name: 'Yuli Prihardiyono, S.IP', nip: '19950730 202421 1 012', username: 'yuliprihardiyono', subject: 'Manajemen Perkantoran', className: 'XI OTKP', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Ella Susiani, S.Pd', obsDate: '2026-02-24', praDate: '2026-02-21', pascaDate: '2026-02-27', status: 'Selesai' as const },
  { no: 62, name: 'Weldani, S.Pd.I', nip: '19860301 202421 1 018', username: 'weldani', subject: 'Pendidikan Agama Islam', className: 'X TKR 1', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Syarifudin, S.Pd., M.B.A', obsDate: '2026-03-31', praDate: '2026-03-28', pascaDate: '2026-04-03', status: 'Belum' as const },
  { no: 63, name: 'Ridho Pratama, S.Pd', nip: '19981015 202421 1 007', username: 'ridhopratama', subject: 'Konsentrasi Keahlian Kuliner', className: 'X KUL', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Syahranuddin Fadli, S.ST.Par', obsDate: '2026-03-30', praDate: '2026-03-27', pascaDate: '2026-04-02', status: 'Belum' as const },
  { no: 64, name: 'Esti Kholisa Hasanah, S.Pd', nip: '20000622 202421 2 007', username: 'estikholisahasanah', subject: 'Bahasa Indonesia', className: 'X PH 1', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Erini, SP, M.MPd', obsDate: '2026-03-05', praDate: '2026-03-02', pascaDate: '2026-03-08', status: 'Sedang Berjalan' as const },
  { no: 65, name: 'Nur Kamila, S.Sos', nip: '19980413 202421 2 026', username: 'nurkamila', subject: 'Pelayanan BK/BP', className: 'XII Semua Keahlian', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Sumanti, S.Pd', obsDate: '2026-02-23', praDate: '2026-02-20', pascaDate: '2026-02-26', status: 'Selesai' as const },
  { no: 66, name: 'Putri Sholehah Hasanah, S.Pd', nip: '20000622 202421 2 010', username: 'putrisholehahhasanah', subject: 'Matematika', className: 'XII LPKC', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Roci Anggraini, S.Kep., Ns', obsDate: '2026-03-02', praDate: '2026-02-27', pascaDate: '2026-03-05', status: 'Sedang Berjalan' as const },
  { no: 67, name: 'Sapuan Noor, S.Pd', nip: '19871201 202421 1 015', username: 'sapuannoor', subject: 'Bahasa Inggris', className: 'XII MP 1', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Syarifudin, S.Pd., M.B.A', obsDate: '2026-02-11', praDate: '2026-02-08', pascaDate: '2026-02-14', status: 'Selesai' as const },
  { no: 68, name: 'Setyawati, S.Kom', nip: '19890427 202421 2 027', username: 'setyawati', subject: 'Dasar Program Keahlian DKV', className: 'X DKV 1', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Pratiwi, S.Pd', obsDate: '2026-02-12', praDate: '2026-02-09', pascaDate: '2026-02-15', status: 'Selesai' as const },
  { no: 69, name: 'Aulia Amana Sari, S.Pd.I', nip: '19921015 202421 2 055', username: 'auliaamanasari', subject: 'Pendidikan Agama Islam', className: 'XII TKJ 1', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Arie Sumartini, ST', obsDate: '2026-02-11', praDate: '2026-02-08', pascaDate: '2026-02-14', status: 'Selesai' as const },
  { no: 70, name: 'Rosandhi Saputra, S.Pd', nip: '19870320 202421 1 010', username: 'rosandhisaputra', subject: 'Penjasorkes', className: 'XII TKR 2', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Rochmad Basuki, S.Pd', obsDate: '2026-02-12', praDate: '2026-02-09', pascaDate: '2026-02-15', status: 'Selesai' as const },
  { no: 71, name: 'Khumaedi, S.Pd.I', nip: '19810617 202421 1 009', username: 'khumaedi', subject: 'Pendidikan Agama Islam', className: 'XII TKJ 2', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Rochmad Basuki, S.Pd', obsDate: '2026-02-19', praDate: '2026-02-16', pascaDate: '2026-02-22', status: 'Selesai' as const },
  { no: 72, name: 'Sri Kurniawati, S.Si', nip: '19911007 202421 2 032', username: 'srikurniawati', subject: 'Projek IPAS & LPK3', className: 'XII LP3K', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Syahranuddin Fadli, S.ST.Par', obsDate: '2026-02-09', praDate: '2026-02-06', pascaDate: '2026-02-12', status: 'Selesai' as const },
  { no: 73, name: 'Nurul Ismi, S.Pd.I', nip: '19921231 202421 2 050', username: 'nurulismi', subject: 'Pendidikan Agama Islam', className: 'X AK 3', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Endang Maryani, S.Pd', obsDate: '2026-02-26', praDate: '2026-02-23', pascaDate: '2026-03-01', status: 'Selesai' as const },
  { no: 74, name: 'Genoveva Sonia, S.Pd', nip: '19990511 202421 2 025', username: 'genovevasonia', subject: 'Pemasaran & Bisnis Digital', className: 'XII BD 1', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Wiwin Wulandari, SE', obsDate: '2026-02-25', praDate: '2026-02-22', pascaDate: '2026-02-28', status: 'Selesai' as const },
  { no: 75, name: 'Rini Susilawati, S.Pd', nip: '19920306 202421 2 023', username: 'rinisusilawati', subject: 'Pendidikan Agama & TKJ', className: 'X TKJ 2', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Arie Sumartini, ST', obsDate: '2026-02-11', praDate: '2026-02-08', pascaDate: '2026-02-14', status: 'Selesai' as const },
  { no: 76, name: 'Novi Wahyuni, S.Pd', nip: '19920816 202521 2 047', username: 'noviwahyuni', subject: 'Bisnis Digital & Mandarin', className: 'XI TKR 1', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Suryatina, SE', obsDate: '2026-03-02', praDate: '2026-02-27', pascaDate: '2026-03-05', status: 'Sedang Berjalan' as const },
  { no: 77, name: 'Ety Aslinda, S.Pd', nip: '19950223 202521 2 041', username: 'etyaslinda', subject: 'Informatika & TKJ', className: 'XI TKJ 1', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Arie Sumartini, ST', obsDate: '2026-02-12', praDate: '2026-02-09', pascaDate: '2026-02-15', status: 'Selesai' as const },
  { no: 78, name: 'Sudjinartining, S.Pd', nip: '19720112 202221 2 004', username: 'sudjinartining', subject: 'Manajemen Perkantoran', className: 'X MP 1', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Ella Susiani, S.Pd', obsDate: '2026-02-24', praDate: '2026-02-21', pascaDate: '2026-02-27', status: 'Selesai' as const },
  { no: 79, name: 'Ramadhia Putri Utami, S.Tr.Keb', nip: '19960209 202521 2 035', username: 'ramadhiaputriutami', subject: 'Layanan Keperawatan', className: 'X LPKC 1', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Roci Anggraini, S.Kep., Ns', obsDate: '2026-03-03', praDate: '2026-02-28', pascaDate: '2026-03-06', status: 'Sedang Berjalan' as const },
  { no: 80, name: 'Suci Adelia Putri, S.Pd', nip: '19991210 202521 2 020', username: 'suciadeliaputri', subject: 'Seni Budaya', className: 'X PH', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Yana Apriliya, S.ST.Par', obsDate: '2026-03-02', praDate: '2026-02-27', pascaDate: '2026-03-05', status: 'Sedang Berjalan' as const },
  { no: 81, name: 'Hasiholan Sitompul, S.Pd.K', nip: '19850412 201101 1 002', username: 'hasiholansitompul', subject: 'Pendidikan Agama Kristen', className: 'X-XII Agama Kristen', pangkatGolongan: 'Pembina, IV/a (Guru Madya)', supervisorName: 'Ella Susiani, S.Pd', obsDate: '2026-02-24', praDate: '2026-02-21', pascaDate: '2026-02-27', status: 'Selesai' as const },
  { no: 82, name: 'Bong Sin Sang', nip: '19800510 200801 1 005', username: 'bongsinsang', subject: 'Pendidikan Agama / Bahasa Mandarin', className: 'X PH 1', pangkatGolongan: 'Penata, III/c (Guru Muda)', supervisorName: 'Ella Susiani, S.Pd', obsDate: '2026-02-24', praDate: '2026-02-21', pascaDate: '2026-02-27', status: 'Selesai' as const },
  { no: 83, name: 'Andriansen Hartanto', nip: '19880715 201201 1 003', username: 'andriansenhartanto', subject: 'Pendidikan Agama / TKJ', className: 'X TKJ 2', pangkatGolongan: 'Penata Muda Tk.I, III/b (Guru Pertama)', supervisorName: 'Ella Susiani, S.Pd', obsDate: '2026-02-24', praDate: '2026-02-21', pascaDate: '2026-02-27', status: 'Selesai' as const },
  { no: 84, name: 'Fransiska Siki, S.Pd', nip: '19900318 201402 2 001', username: 'fransiskasaki', subject: 'Pendidikan Agama / Seni Rupa', className: 'X DKV 1', pangkatGolongan: 'Penata Muda, III/a (Guru Pertama)', supervisorName: 'Ella Susiani, S.Pd', obsDate: '2026-02-24', praDate: '2026-02-21', pascaDate: '2026-02-27', status: 'Selesai' as const },
  { no: 85, name: 'Nurul Ridhi Utami, S.Pd., M.Pd', nip: '19890812 202221 2 011', username: 'nurulridhiutami', subject: 'K3 & Kuliner', className: 'XII KUL', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Syahranuddin Fadli, S.ST.Par', obsDate: '2026-02-09', praDate: '2026-02-06', pascaDate: '2026-02-12', status: 'Selesai' as const },
  { no: 86, name: 'apt. Farhanisa, S.Farm', nip: '19950914 202421 2 021', username: 'farhanisa', subject: 'Layanan Kefarmasian', className: 'X LPK3', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Roci Anggraini, S.Kep., Ns', obsDate: '2026-03-02', praDate: '2026-02-27', pascaDate: '2026-03-05', status: 'Sedang Berjalan' as const },
  { no: 87, name: 'Indah Oemardi Putri, S.Par., CGSP', nip: '19940618 202421 2 018', username: 'indahoemardiputri', subject: 'Usaha Layanan Wisata', className: 'XII ULW', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Suryatina, SE', obsDate: '2026-02-11', praDate: '2026-02-08', pascaDate: '2026-02-14', status: 'Selesai' as const },
  { no: 88, name: 'Cindy Anggraini, S.Pd', nip: '19970822 202421 2 019', username: 'cindyanggraini', subject: 'Bahasa Indonesia', className: 'XI BisDig 1', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Wiwin Wulandari, SE', obsDate: '2026-02-09', praDate: '2026-02-06', pascaDate: '2026-02-12', status: 'Selesai' as const },
  { no: 89, name: 'Neneng Gustiana, S.Pd', nip: '19930412 202421 2 015', username: 'nenenggustiana', subject: 'Sejarah', className: 'XII TKJ 1', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Yana Apriliya, S.ST.Par', obsDate: '2026-02-25', praDate: '2026-02-22', pascaDate: '2026-02-28', status: 'Selesai' as const },
  { no: 90, name: 'Jelisti Utami, S.Pd', nip: '19980516 202421 2 012', username: 'jelistiutami', subject: 'Pelayanan BK/BP', className: 'XI TSM 1', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Sumanti, S.Pd', obsDate: '2026-02-23', praDate: '2026-02-20', pascaDate: '2026-02-26', status: 'Selesai' as const },
  { no: 91, name: 'Arliana, S.Km', nip: '19920114 202421 2 022', username: 'arliana', subject: 'Projek IPAS', className: 'X LPKC 2', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Roci Anggraini, S.Kep., Ns', obsDate: '2026-03-02', praDate: '2026-02-27', pascaDate: '2026-03-05', status: 'Sedang Berjalan' as const },
  { no: 92, name: 'Supriyadi Sofian, S.E', nip: '19810310 202421 1 008', username: 'supriyadisofian', subject: 'Kewirausahaan & Management', className: 'XII AKL 1', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Ella Susiani, S.Pd', obsDate: '2026-02-24', praDate: '2026-02-21', pascaDate: '2026-02-27', status: 'Selesai' as const },
  { no: 93, name: 'Yoni Darmansyah, ST', nip: '19850920 202421 1 005', username: 'yonidarmansyah', subject: 'Dasar Program Keahlian TJKT', className: 'XI TITL 1', pangkatGolongan: 'Golongan IX (Guru Pertama)', supervisorName: 'Arie Sumartini, ST', obsDate: '2026-02-11', praDate: '2026-02-08', pascaDate: '2026-02-14', status: 'Selesai' as const },
];

// Generate Default Teachers List for SMKN 1 Ketapang with full official data
export const DEFAULT_TEACHERS: TeacherData[] = RAW_TEACHERS_DATA.map((t) => {
  return {
    id: `t-${t.no}`,
    name: t.name,
    nip: t.nip,
    subject: t.subject,
    className: t.className,
    pangkatGolongan: t.pangkatGolongan,
    supervisorName: t.supervisorName,
    praDate: t.praDate,
    obsDate: t.obsDate,
    pascaDate: t.pascaDate,
    status: t.status,
    documents: [],
  };
});

// Helper to create empty supervision session template for a teacher
export function createDefaultSession(teacherId: string): SupervisionSession {
  const telaahItems: Record<number, { checked: boolean; note: string }> = {};
  TELAAH_RPP_ITEMS.forEach((item) => {
    telaahItems[item.id] = { checked: item.id <= 16, note: '' };
  });

  const scores: Record<string, { score: number; evidence: string; note: string }> = {};
  OBSERVASI_CATEGORIES.forEach((cat) => {
    cat.items.forEach((item) => {
      scores[item.id] = { score: 3, evidence: 'Siswa antusias dan aktif berpartisipasi', note: '' };
    });
  });

  const refleksiGuru: Record<number, string> = {};
  PASCA_REFLEKSI_QUESTIONS.forEach((q) => {
    refleksiGuru[q.id] = 'Pembelajaran berlangsung lancar, murid bersemangat mengikuti instruksi.';
  });

  const umpanBalik: Record<number, { apresiasi: string; areaPengembangan: string }> = {};
  PASCA_UMPAN_BALIK_ASPEK.forEach((a) => {
    umpanBalik[a.id] = {
      apresiasi: 'Penguasaan kelas sangat kondusif dan komunikasi efektif.',
      areaPengembangan: 'Peningkatan porsi refleksi mandiri oleh peserta didik.',
    };
  });

  const rencanaTindakLanjut: Record<number, { tindakLanjut: string; penanggungJawab: string; waktu: string }> = {};
  PASCA_TINDAK_LANJUT_ASPEK.forEach((a) => {
    rencanaTindakLanjut[a.id] = {
      tindakLanjut: 'Mengikuti workshop penyusunan instrumen asesmen Kurikulum Nasional.',
      penanggungJawab: 'Guru & Tim Kurikulum',
      waktu: 'Bulan Depan',
    };
  });

  return {
    teacherId,
    academicYear: '2025/2026',
    semester: 'Ganjil',
    materiPokok: 'Implementasi Kurikulum Nasional & Pembelajaran Mendalam',
    pra: {
      materiPokok: 'Pendampingan Modul Ajar Kontekstual',
      telaahItems,
      wawancara: {
        tujuan: 'Murid mampu menganalisis konsep dasar dan keterampilan vokasi secara kritis.',
        strategi: 'Model Problem-Based Learning dengan metode praktik kelompok dan diskusi interaktif.',
        alatBahan: 'Modul Ajar, tayangan slide, peralatan bengkel/lab, dan LKPD.',
        metodePengukuran: 'Asesmen formatif awal, observasi praktik, dan penilaian laporan hasil kerja LKPD.',
        antisipasiTantangan: 'Membagi kelompok heterogen agar murid yang lebih paham dapat membantu rekannya.',
        fokusKompetensi: 'Keterampilan berpikir kritis dan kolaborasi murid dalam menyelesaikan tugas vokasi.',
      },
      kelebihan: 'Rancangan RPP/Modul Ajar sangat terstruktur, kontekstual, dan mengintegrasikan prinsip Pembelajaran Mendalam.',
      areaPengembangan: 'Diferensiasi proses dapat lebih dipertajam untuk murid dengan gaya belajar beragam.',
      rekomendasi: 'Pertahankan variasi media dan perjelas petunjuk pengerjaan LKPD.',
    },
    obs: {
      scores,
      catatanSupervisor: 'Guru tampil percaya diri, menguasai kelas dengan baik, serta mengimplementasikan Pembelajaran Mendalam secara konsisten.',
      rekomendasi: 'Tingkatkan alokasi waktu untuk tahap penutup agar refleksi murid lebih mendalam.',
      tindakLanjut: 'Berbagi praktik baik di komunitas belajar internal sekolah (MGMP SMK Negeri 1 Ketapang).',
    },
    pasca: {
      refleksiGuru,
      umpanBalik,
      rencanaTindakLanjut,
      catatanSupervisor: 'Secara keseluruhan proses supervisi dari pra hingga pasca-observasi berjalan sangat efektif dan produktif.',
      kesepakatanBersama: 'Disepakati untuk terus meningkatkan inovasi instrumen asesmen formatif dan literasi digital murid.',
    },
    finalScore: 88,
    finalPredicate: 'Baik',
    lastUpdated: new Date().toISOString().split('T')[0],
  };
}

// Generate all 94 accounts (1 Admin + 93 Teachers)
export async function initDefaultAccounts(): Promise<UserAccount[]> {
  const adminPassHash = await hashPassword('admin123');
  const initialGuruPassHash = await hashPassword('123456');

  const accounts: UserAccount[] = [
    {
      id: 'acc-admin',
      username: 'admin',
      passwordHash: adminPassHash,
      name: 'Erini, SP, M.MPd',
      nip: '19680824 200003 2 004',
      role: 'Kepala Sekolah',
      teacherId: 't-1',
      isActive: true,
      mustChangePassword: false,
      createdAt: new Date().toISOString(),
    },
  ];

  RAW_TEACHERS_DATA.forEach((t) => {
    // Teacher No 1 is Erini, SP, M.MPd (Kepala Sekolah)
    if (t.no === 1) {
      accounts.push({
        id: `acc-t-${t.no}`,
        username: t.username,
        passwordHash: adminPassHash,
        name: t.name,
        nip: t.nip,
        role: 'Kepala Sekolah',
        teacherId: `t-${t.no}`,
        isActive: true,
        mustChangePassword: false,
        createdAt: new Date().toISOString(),
      });
    } else {
      accounts.push({
        id: `acc-t-${t.no}`,
        username: t.username,
        passwordHash: initialGuruPassHash,
        name: t.name,
        nip: t.nip,
        role: 'Guru',
        teacherId: `t-${t.no}`,
        isActive: true,
        mustChangePassword: true,
        createdAt: new Date().toISOString(),
      });
    }
  });

  return accounts;
}

// STORAGE API
export function getSchoolSettings(): SchoolSettings {
  if (typeof window === 'undefined') return DEFAULT_SCHOOL_SETTINGS;
  const data = localStorage.getItem(KEYS.SETTINGS);
  if (!data) {
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(DEFAULT_SCHOOL_SETTINGS));
    return DEFAULT_SCHOOL_SETTINGS;
  }
  try {
    const parsed: SchoolSettings = JSON.parse(data);
    if (!parsed.supervisorName || parsed.supervisorName.includes('Siti Aminah')) {
      parsed.supervisorName = 'A.Rani, S.Pd.,MPd';
      parsed.supervisorNip = '19640321 199103 1 012';
      localStorage.setItem(KEYS.SETTINGS, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return DEFAULT_SCHOOL_SETTINGS;
  }
}

export function saveSchoolSettings(settings: SchoolSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}

export function getAccountsSync(): UserAccount[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(KEYS.ACCOUNTS);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function getAccounts(): Promise<UserAccount[]> {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(KEYS.ACCOUNTS);
  if (!data) {
    const defaults = await initDefaultAccounts();
    localStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(defaults));
    return defaults;
  }
  try {
    const parsed: UserAccount[] = JSON.parse(data);
    if (!parsed || parsed.length < 90) {
      const defaults = await initDefaultAccounts();
      localStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(defaults));
      return defaults;
    }
    return parsed;
  } catch {
    const defaults = await initDefaultAccounts();
    localStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(defaults));
    return defaults;
  }
}

export function saveAccounts(accounts: UserAccount[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.ACCOUNTS, JSON.stringify(accounts));
}

export function getTeachers(): TeacherData[] {
  if (typeof window === 'undefined') return DEFAULT_TEACHERS;
  const data = localStorage.getItem(KEYS.TEACHERS);
  if (!data) {
    localStorage.setItem(KEYS.TEACHERS, JSON.stringify(DEFAULT_TEACHERS));
    return DEFAULT_TEACHERS;
  }
  try {
    const parsed: TeacherData[] = JSON.parse(data);
    if (!parsed || parsed.length < 90) {
      localStorage.setItem(KEYS.TEACHERS, JSON.stringify(DEFAULT_TEACHERS));
      return DEFAULT_TEACHERS;
    }
    let modified = false;
    parsed.forEach((t) => {
      if (t.documents && t.documents.length > 0) {
        t.documents = [];
        modified = true;
      }
      if (t.supervisorName?.includes('Siti Aminah')) {
        t.supervisorName = 'A.Rani, S.Pd.,MPd';
        modified = true;
      }
    });
    if (modified) {
      localStorage.setItem(KEYS.TEACHERS, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return DEFAULT_TEACHERS;
  }
}

export function saveTeachers(teachers: TeacherData[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.TEACHERS, JSON.stringify(teachers));
}

export function getSessions(): Record<string, SupervisionSession> {
  if (typeof window === 'undefined') return {};
  const data = localStorage.getItem(KEYS.SESSIONS);
  if (!data) {
    const initialSessions: Record<string, SupervisionSession> = {};
    DEFAULT_TEACHERS.slice(0, 10).forEach((t) => {
      initialSessions[t.id] = createDefaultSession(t.id);
    });
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(initialSessions));
    return initialSessions;
  }
  try {
    return JSON.parse(data);
  } catch {
    return {};
  }
}

export function saveSessions(sessions: Record<string, SupervisionSession>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
}

export function getSessionByTeacherId(teacherId: string): SupervisionSession {
  const sessions = getSessions();
  if (sessions[teacherId]) return sessions[teacherId];
  const newSession = createDefaultSession(teacherId);
  sessions[teacherId] = newSession;
  saveSessions(sessions);
  return newSession;
}

export function saveTeacherSession(teacherId: string, session: SupervisionSession): void {
  const sessions = getSessions();
  sessions[teacherId] = session;
  saveSessions(sessions);
}

// Current Logged-in Session
export function getSessionUser(): UserAccount | null {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(KEYS.CURRENT_USER);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function setSessionUser(user: UserAccount | null): void {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem(KEYS.CURRENT_USER);
  } else {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  }
}
