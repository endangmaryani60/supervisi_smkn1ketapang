export type UserRole = 'Kepala Sekolah' | 'Guru';

export interface UserAccount {
  id: string;
  username: string;
  passwordHash: string;
  name: string;
  nip: string;
  role: UserRole;
  teacherId?: string;
  isActive: boolean;
  mustChangePassword?: boolean;
  createdAt: string;
}

export interface SchoolSettings {
  schoolName: string;
  principalName: string;
  principalNip: string;
  supervisorName: string;
  supervisorNip: string;
  address: string;
  district: string;
  academicYear: string;
  semester: 'Ganjil' | 'Genap';
  isSampleData: boolean;
  logoUrl?: string;
}

export type DocumentType =
  | 'Modul Ajar'
  | 'ATP'
  | 'CP'
  | 'Bahan Ajar'
  | 'Media Pembelajaran'
  | 'LKPD'
  | 'Asesmen'
  | 'RPP'
  | 'Lainnya';

export interface TeacherDocument {
  id: string;
  name: string;
  type: DocumentType;
  fileUrl: string;
  uploadDate: string;
  size?: string;
}

export interface TeacherData {
  id: string;
  name: string;
  nip: string;
  subject: string;
  className: string;
  pangkatGolongan?: string;
  supervisorName?: string;
  praDate: string;
  obsDate: string;
  pascaDate: string;
  documents: TeacherDocument[];
  status: 'Belum' | 'Sedang Berjalan' | 'Selesai';
  accountId?: string;
}

export interface TelaahItem {
  id: number;
  komponen: string;
  indikator: string;
}

export interface PraObservationData {
  materiPokok: string;
  telaahItems: Record<number, { checked: boolean; note: string }>;
  wawancara: {
    tujuan: string;
    strategi: string;
    alatBahan: string;
    metodePengukuran: string;
    antisipasiTantangan: string;
    fokusKompetensi: string;
  };
  kelebihan: string;
  areaPengembangan: string;
  rekomendasi: string;
  selectedDocId?: string;
}

export interface ObsItemCategory {
  id: string;
  title: string;
  items: {
    id: string;
    label: string;
    description: string;
  }[];
}

export interface ObservationData {
  scores: Record<string, { score: number; evidence: string; note: string }>;
  catatanSupervisor: string;
  rekomendasi: string;
  tindakLanjut: string;
}

export interface PostObservationData {
  refleksiGuru: Record<number, string>;
  umpanBalik: Record<number, { apresiasi: string; areaPengembangan: string }>;
  rencanaTindakLanjut: Record<number, { tindakLanjut: string; penanggungJawab: string; waktu: string }>;
  catatanSupervisor: string;
  kesepakatanBersama: string;
}

export interface SupervisionSession {
  teacherId: string;
  semester: string;
  academicYear: string;
  materiPokok?: string;
  pra: PraObservationData;
  obs: ObservationData;
  pasca: PostObservationData;
  finalScore?: number;
  finalPredicate?: 'Sangat Baik' | 'Baik' | 'Cukup' | 'Kurang';
  lastUpdated: string;
}

export type NavigationTab =
  | 'dashboard'
  | 'school-settings'
  | 'teacher-data'
  | 'teacher-accounts'
  | 'documents'
  | 'program'
  | 'instruments'
  | 'report'
  | 'followup'
  | 'profile';
