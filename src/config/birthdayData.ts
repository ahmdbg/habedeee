/**
 * ============================================================================
 * PENGATURAN DATA KARTU UCAPAN ULANG TAHUN
 * ============================================================================
 * Kamu bisa mengubah nama, teks ucapan, doa, dan pengaturan lainnya
 * secara manual langsung di file ini.
 */

export interface BirthdayData {
  // 1. Orang yang Berulang Tahun (Penerima)
  recipientFullName: string;
  recipientNickname: string;
  age: string;
  celebrationDate: string;
  photoUrl?: string; // Boleh diisi link foto atau dikosongkan

  // 2. Pesan Ucapan & Doa
  messageTitle: string;
  messageBody: string;
  specialWishes: string[];

  // 3. Pengirim Ucapan (From)
  senderName: string;
  senderRelation: string;

  // 4. Pengaturan Fitur & Efek
  musicAutoPlay: boolean;
  showCake: boolean;
  showFireworks: boolean;
}

export const BIRTHDAY_DATA: BirthdayData = {
  // --- 1. IDENTITAS PENERIMA ---
  recipientFullName: 'Hasna Nailah salsabila',
  recipientNickname: 'Hasnaaa',
  age: '19',
  celebrationDate: 'Hari Ulang Tahun',
  photoUrl: '../assets/image/hasna.jpeg', // Foto profil penerima kartu

  // --- 2. UCAPAN & DOA ---
  messageTitle: 'Happy Birthday, Hasnaaa! 🌟🥳🎉',
  messageBody: `Barakallah fii umrik, Hasna! 🤍

Semoga Allah selalu menjaga langkahmu, melapangkan hatimu, menguatkanmu dalam setiap proses, dan memudahkan segala hal baik yang sedang kamu perjuangkan.

Aku berdoa semoga hafalanmu selalu terjaga, ilmu yang kamu pelajari membawa manfaat, dan cita-cita yang kamu impikan bisa tercapai pada waktu terbaik menurut Allah.

Terima kasih sudah menjadi bagian dari cerita yang mengajarkanku banyak hal selama ini. Semoga kita selalu diberi kemampuan untuk menjaga diri, memperbaiki diri, dan tetap berjalan menuju tujuan yang baik.

Semoga Allah memberikanmu banyak alasan untuk bersyukur dan kebahagiaan yang membawa berkah. Aamiin 🤲🏻`,

  // --- 3. UNTAIAN DOA & HARAPAN SPESIAL ---
  specialWishes: [
    'Semoga kuliahnya dimudahkan yaa 🎓',
    'Sehat selaluu, jangan sampai sakitt 😊✨',
    'Semoga harapanmu (yang itu) bisa terkabul yaaa 🙂🙂',
    'Tetap semangattt pokoknya, biar bisa lanjut S2 😙🤍',
  ],

  // --- 4. IDENTITAS PENGIRIM ---
  senderName: 'Ahmad Hasan',
  senderRelation: 'Orang yang menyukaimu 🩵💙',

  // --- 5. FITUR TAMBAHAN ---
  musicAutoPlay: true,  // Putar melodi otomatis saat kartu dibuka
  showCake: true,       // Tampilkan kue & lilin interaktif
  showFireworks: true,  // Tampilkan animasi kembang api di latar belakang
};
