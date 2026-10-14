import hasnaPhoto from '../assets/image/hasna.jpeg';

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

  // 5. Pengaturan Waktu Countdown
  unlockTargetTime: string; // Waktu web bisa dibuka: 15 Oktober 2026 pukul 20.00
}

export const BIRTHDAY_DATA: BirthdayData = {
  // --- 1. IDENTITAS PENERIMA ---
  recipientFullName: 'Hasna Nailah salsabila',
  recipientNickname: 'Hasnaaa',
  age: '19',
  celebrationDate: 'Hari Ulang Tahun',
  photoUrl: hasnaPhoto, // Foto profil penerima kartu

  // --- 2. UCAPAN & DOA ---
  messageTitle: 'Happy Birthday, Hasnaaa! 🌟🥳🎉',
  messageBody: `Barakallah fii umrik, Hasna! 🤍

Semoga Allah selalu menjaga langkahmu, melapangkan hatimu, menguatkanmu dalam setiap proses, dan memudahkan segala hal baik yang sedang kamu perjuangkan.

Selamat bertambah usia yaa, perempuan cantik yang satu ini wkwkwk 🫠🫰🏻

Semoga di umur yang baru ini, kamu selalu diberi kesehatan, kebahagiaan, kemudahan dalam setiap urusan, dan tentunya kelancaran dalam menjalani perkuliahan. Semoga apa yang sedang kamu usahakan sekarang maupun hal-hal yang masih kamu impikan nantinya bisa satu per satu tercapai. Aamiin 🤲🏻
Aku juga berharap semoga di umur yang baru ini kamu bisa menjadi pribadi yang semakin baik, semakin kuat menghadapi apa pun yang datang, dan tetap menjadi Hasna yang aku kenal selama ini. Kalau suatu saat nanti ada hari-hari yang terasa berat, semoga kamu selalu punya alasan untuk tetap tersenyum dan semangat lagi.

Oh iya, makasih yaa sudah hadir di hidupku sampai sejauh ini. Lucu juga kalau dipikir-pikir, kita yang dulu cuma saling suka sejak SMA, sekarang sudah sama-sama kuliah dan masih bisa saling cerita hampir setiap hari, meskipun sekarang kita ada di kota yang berbeda wkwkwk 😭
Aku nggak tahu ke depannya bakal seperti apa, tapi untuk sekarang aku senang bisa mengenal kamu lebih dekat, bisa berbagi cerita sama kamu, dan bisa punya seseorang seperti kamu untuk aku tunggu kabarnya setiap hari. 🥹

Sekali lagi, happy birthday, Hasna! Semoga hari ini jadi salah satu hari yang menyenangkan buat kamu. Jangan lupa bahagia, jangan terlalu keras sama diri sendiri, dan semoga hal-hal baik selalu menemukan jalan untuk datang ke kamu.
Semoga Allah memberikanmu banyak alasan untuk bersyukur dan kebahagiaan yang membawa berkah. Aamiin 🤲🏻

"BTW ini sebagian aku copas dari AI wkwk 😙😙"
`,

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

  // --- 6. TARGET WAKTU COUNTDOWN ---
  // Sebelum pukul 20.00 WIB tanggal 15 Oktober 2026, web terkunci dengan halaman hitung mundur
  unlockTargetTime: '2026-10-15T20:00:00+07:00',
};
