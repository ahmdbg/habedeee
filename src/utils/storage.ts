import { BirthdayConfig, PresetTemplate } from '../types/birthday';

export const DEFAULT_CONFIG: BirthdayConfig = {
  recipientName: 'Nadhira Az-Zahra',
  recipientNickname: 'Nadhira',
  age: '24',
  senderName: 'Ahmad',
  senderRelation: 'Sahabat Terbaikmu',
  messageTitle: 'Selamat Ulang Tahun yang Penuh Berkah!',
  messageBody:
    'Di hari yang istimewa ini, semoga setiap doa baikmu dikabulkan, kesehatan senantiasa menyertai setiap langkahmu, dan kebahagiaan tak pernah pudar dari senyumanmu. Terima kasih sudah selalu menjadi pribadi yang penuh kehangatan, inspiratif, dan menghadirkan keceriaan bagi orang-orang di sekitarmu!',
  specialWishes: [
    'Panjang umur & senantiasa sehat walafiat',
    'Segala impian & cita-cita tercapai dengan gemilang',
    'Dikelilingi oleh orang-orang penuh cinta & kebaikan',
  ],
  theme: 'gold',
  musicAutoPlay: false,
  showCake: true,
  showFireworks: true,
  photoUrl: '',
  celebrationDate: 'Spesial Hari Ini',
};

export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'sahabat',
    label: 'Sahabat Sejati',
    title: 'Happy Birthday, Sahabat Terbaikku! 🌟',
    body:
      'Selamat bertambah usia! Terima kasih sudah melewati banyak tawa, cerita, dan perjuangan bersama. Semoga langkahmu ke depan semakin cemerlang, rezekimu melimpah, dan impian besarmu segera terwujud satu per satu. Tetap jadi dirimu yang luar biasa!',
    wishes: [
      'Karier dan bisnis melesat tinggi',
      'Kesehatan selalu terjaga prima',
      'Pertemanan kita langgeng selamanya',
    ],
    relation: 'Sahabat Terbaikmu',
    theme: 'gold',
  },
  {
    id: 'berkah',
    label: 'Doa Berkah & Islami',
    title: 'Barakallah Fii Umrik ✨',
    body:
      'Semoga dengan bertambahnya usia, Allah SWT senantiasa melimpahkan taufik, hidayah, keberkahan umur, serta melapangkan rezeki dan memudahkan segala urusanmu di dunia maupun di akhirat kelak.',
    wishes: [
      'Umur yang barokah dan bermanfaat',
      'Hati yang senantiasa lapang dan damai',
      'Keluarga yang sakinah dan penuh ridho Ilahi',
    ],
    relation: 'Yang Mendoakanmu Sepenuh Hati',
    theme: 'emerald',
  },
  {
    id: 'romantis',
    label: 'Pasangan / Tercinta',
    title: 'Selamat Ulang Tahun, Sayangku 💖',
    body:
      'Selamat ulang tahun untuk orang yang paling berharga dalam hidupku. Senyummu adalah alasan bahagiaku setiap hari. Terima kasih atas ketulusan dan cinta yang selalu kamu beri. Semoga hari-harimu selalu diwarnai kehangatan dan kebahagiaan abadi.',
    wishes: [
      'Selalu tersenyum bahagia setiap hari',
      'Kita bisa terus melangkah bersama selamanya',
      'Semua harapan indahmu menjadi kenyataan',
    ],
    relation: 'Dengan Cinta Sepenuh Hati',
    theme: 'rosegold',
  },
  {
    id: 'keluarga',
    label: 'Keluarga Tercinta',
    title: 'Selamat Hari Lahir Kebanggaan Kami 🎂',
    body:
      'Selamat ulang tahun! Kami sekeluarga selalu bersyukur dan bangga memilikimu. Doa kami tak pernah putus agar dirimu selalu dalam lindungan Tuhan Yang Maha Esa, dimudahkan jalannya, dan mencapai kesuksesan tertinggi.',
    wishes: [
      'Selalu dilindungi dan dijauhkan dari marabahaya',
      'Menjadi kebanggaan keluarga yang berbakti',
      'Diberkahi kesehatan dan kebahagiaan tak terhingga',
    ],
    relation: 'Keluarga Tercinta',
    theme: 'sapphire',
  },
];

const STORAGE_KEY = 'birthday_card_config_v1';

export function loadBirthdayConfig(): BirthdayConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;

  // 1. Check if there's encoded data in URL params (e.g., ?data=... or #data=...)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');
    if (dataParam) {
      const decoded = decodeURIComponent(escape(atob(dataParam)));
      const parsed = JSON.parse(decoded);
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch (err) {
    console.warn('Gagal membaca data dari URL params:', err);
  }

  // 2. Fallback to localStorage
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...DEFAULT_CONFIG, ...parsed };
    }
  } catch (err) {
    console.warn('Gagal membaca data dari localStorage:', err);
  }

  return DEFAULT_CONFIG;
}

export function saveBirthdayConfig(config: BirthdayConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Gagal menyimpan config ke localStorage:', err);
  }
}

export function generateShareableUrl(config: BirthdayConfig): string {
  if (typeof window === 'undefined') return '';
  try {
    const jsonStr = JSON.stringify(config);
    const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
    const baseUrl = `${window.location.origin}${window.location.pathname.replace(/\/admin\/?$/, '') || '/'}`;
    return `${baseUrl}?data=${encodeURIComponent(encoded)}`;
  } catch (err) {
    console.error('Gagal meng-encode shareable link:', err);
    return window.location.href;
  }
}
