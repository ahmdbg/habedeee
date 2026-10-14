export type ThemeId = 'gold' | 'midnight' | 'rosegold' | 'sapphire' | 'emerald';

export interface BirthdayConfig {
  recipientName: string;
  recipientNickname: string;
  age: string;
  senderName: string;
  senderRelation: string;
  messageTitle: string;
  messageBody: string;
  specialWishes: string[];
  theme: ThemeId;
  musicAutoPlay: boolean;
  showCake: boolean;
  showFireworks: boolean;
  photoUrl?: string;
  celebrationDate?: string;
}

export interface PresetTemplate {
  id: string;
  label: string;
  title: string;
  body: string;
  wishes: string[];
  relation: string;
  theme: ThemeId;
}
