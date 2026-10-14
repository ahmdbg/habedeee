import { useState, ChangeEvent } from 'react';
import {
  Save,
  ArrowLeft,
  Sparkles,
  Share2,
  Check,
  RotateCcw,
  Upload,
  Trash2,
  Palette,
  Heart,
  Eye,
  Sliders,
} from 'lucide-react';
import { BirthdayConfig, ThemeId } from '../types/birthday';
import { PRESET_TEMPLATES, DEFAULT_CONFIG, saveBirthdayConfig, generateShareableUrl } from '../utils/storage';

interface AdminPanelProps {
  initialConfig: BirthdayConfig;
  onSave: (config: BirthdayConfig) => void;
  onNavigateToCard: () => void;
}

export function AdminPanel({ initialConfig, onSave, onNavigateToCard }: AdminPanelProps) {
  const [formData, setFormData] = useState<BirthdayConfig>(initialConfig);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleTextChange = (field: keyof BirthdayConfig, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWishChange = (index: number, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.specialWishes];
      updated[index] = value;
      return { ...prev, specialWishes: updated };
    });
  };

  const handleAddWish = () => {
    if (formData.specialWishes.length < 5) {
      setFormData((prev) => ({
        ...prev,
        specialWishes: [...prev.specialWishes, 'Harapan terbaik untuk masa depanmu'],
      }));
    }
  };

  const handleRemoveWish = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specialWishes: prev.specialWishes.filter((_, i) => i !== index),
    }));
  };

  const handleApplyPreset = (presetId: string) => {
    const preset = PRESET_TEMPLATES.find((p) => p.id === presetId);
    if (!preset) return;
    setFormData((prev) => ({
      ...prev,
      messageTitle: preset.title,
      messageBody: preset.body,
      specialWishes: [...preset.wishes],
      senderRelation: preset.relation,
      theme: preset.theme,
    }));
  };

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFormData((prev) => ({
            ...prev,
            photoUrl: event.target?.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      photoUrl: '',
    }));
  };

  const handleSave = () => {
    saveBirthdayConfig(formData);
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopyShareLink = () => {
    saveBirthdayConfig(formData);
    onSave(formData);
    const url = generateShareableUrl(formData);
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    });
  };

  const handleResetDefault = () => {
    if (window.confirm('Kembalikan semua pengaturan ke format contoh awal?')) {
      setFormData(DEFAULT_CONFIG);
      saveBirthdayConfig(DEFAULT_CONFIG);
      onSave(DEFAULT_CONFIG);
    }
  };

  const themes: Array<{ id: ThemeId; label: string; bgClass: string; borderClass: string }> = [
    { id: 'gold', label: 'Emas Kerajaan', bgClass: 'from-amber-500 to-yellow-600', borderClass: 'border-amber-400' },
    { id: 'midnight', label: 'Bintang Midnight', bgClass: 'from-sky-500 to-indigo-600', borderClass: 'border-sky-400' },
    { id: 'rosegold', label: 'Mawar Rose Gold', bgClass: 'from-rose-400 to-pink-600', borderClass: 'border-rose-400' },
    { id: 'sapphire', label: 'Safir Mewah', bgClass: 'from-blue-500 to-indigo-700', borderClass: 'border-blue-400' },
    { id: 'emerald', label: 'Zamrud Berkah', bgClass: 'from-emerald-500 to-teal-700', borderClass: 'border-emerald-400' },
  ];

  return (
    <div className="relative min-h-screen w-full bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 z-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateToCard}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700/80"
              title="Kembali ke Halaman Kartu Ucapan"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-400" />
                <h1 className="text-lg sm:text-xl font-bold font-serif text-white tracking-wide">
                  Panel Pengaturan Ucapan (Admin)
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                Atur penerima, pesan ucapan, nama pengirim, dan tema kartu
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4 text-sky-400" />
              <span>{showPreview ? 'Sembunyikan Pratinjau' : 'Lihat Pratinjau'}</span>
            </button>

            <button
              onClick={handleCopyShareLink}
              className="px-3.5 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 transition-all cursor-pointer flex items-center gap-1.5"
              title="Salin tautan unik untuk dibagikan langsung"
            >
              {copiedLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Tautan Disalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-amber-400" />
                  <span>Salin Link Siap Kirim</span>
                </>
              )}
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 text-slate-950" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Live Mini Preview Drawer (Optional) */}
        {showPreview && (
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
                <Sparkles className="w-4 h-4" />
                <span>Pratinjau Langsung Kartu Ucapan</span>
              </div>
              <button
                onClick={onNavigateToCard}
                className="text-xs text-sky-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Buka Layar Penuh</span>
                <ArrowLeft className="w-3 h-3 rotate-180" />
              </button>
            </div>

            <div className="p-6 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-4 max-w-xl mx-auto">
              <p className="text-xs uppercase tracking-widest text-amber-400">Selamat Ulang Tahun</p>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                {formData.recipientName || '(Nama Orang yang Berulang Tahun)'}
              </h2>
              {formData.age && (
                <p className="text-xs text-amber-300">Momen Ulang Tahun ke-{formData.age}</p>
              )}
              <div className="p-4 rounded-lg bg-slate-900/80 border border-slate-800/80 text-left">
                <h3 className="text-sm font-serif font-semibold text-amber-200 mb-2">
                  {formData.messageTitle}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {formData.messageBody}
                </p>
              </div>
              <div className="pt-2 text-xs text-slate-400 border-t border-slate-800 flex justify-between items-center">
                <span>Pengirim: <strong className="text-white">{formData.senderName || '(Nama Pengirim)'}</strong></span>
                <span className="text-amber-400/80">{formData.senderRelation}</span>
              </div>
            </div>
          </div>
        )}

        {/* Settings Grid Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Penerima & Pengirim (2 cols on large screen) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Section: Yang Berulang Tahun (Penerima) */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
                <Heart className="w-4 h-4 text-rose-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                  1. Orang yang Berulang Tahun (Penerima)
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Nama Lengkap / Nama di Kartu <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.recipientName}
                    onChange={(e) => handleTextChange('recipientName', e.target.value)}
                    placeholder="Contoh: Siti Rahmawati / Sarah"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-amber-400 focus:outline-none text-sm text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Nama Panggilan / Sapaan
                  </label>
                  <input
                    type="text"
                    value={formData.recipientNickname}
                    onChange={(e) => handleTextChange('recipientNickname', e.target.value)}
                    placeholder="Contoh: Rahma / Cantik"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-amber-400 focus:outline-none text-sm text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Usia / Umur yang Dirayakan (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.age}
                    onChange={(e) => handleTextChange('age', e.target.value)}
                    placeholder="Contoh: 25 (Boleh dikosongkan)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-amber-400 focus:outline-none text-sm text-white placeholder-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Keterangan Tanggal / Momen
                  </label>
                  <input
                    type="text"
                    value={formData.celebrationDate || ''}
                    onChange={(e) => handleTextChange('celebrationDate', e.target.value)}
                    placeholder="Contoh: 10 Oktober / Hari Istimewa"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-amber-400 focus:outline-none text-sm text-white placeholder-slate-500"
                  />
                </div>
              </div>

              {/* Photo Upload Option */}
              <div className="pt-2 border-t border-slate-800/80">
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Foto Orang yang Berulang Tahun (Opsional)
                </label>
                <div className="flex items-center gap-4">
                  {formData.photoUrl ? (
                    <div className="relative group w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400/80 shadow-md">
                      <img
                        src={formData.photoUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={handleRemovePhoto}
                        type="button"
                        className="absolute inset-0 bg-black/70 text-rose-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Hapus foto"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-950 border border-dashed border-slate-700 flex items-center justify-center text-slate-500">
                      <Upload className="w-5 h-5" />
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium cursor-pointer transition-colors border border-slate-700">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{formData.photoUrl ? 'Ganti Foto' : 'Unggah Foto'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[11px] text-slate-500">
                      Format JPG/PNG, tampil elegan dengan bingkai emas bulat
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Pesan & Doa Ucapan */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                    2. Pesan Ucapan & Untaian Doa
                  </h2>
                </div>

                {/* Preset Templates Quick Buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 mr-1">Template Cepat:</span>
                  {PRESET_TEMPLATES.map((tmpl) => (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => handleApplyPreset(tmpl.id)}
                      className="px-2.5 py-1 rounded-md text-[11px] bg-slate-800 hover:bg-amber-500/20 hover:text-amber-300 hover:border-amber-500/40 text-slate-300 border border-slate-700/60 transition-colors cursor-pointer"
                    >
                      {tmpl.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Judul Ucapan
                </label>
                <input
                  type="text"
                  value={formData.messageTitle}
                  onChange={(e) => handleTextChange('messageTitle', e.target.value)}
                  placeholder="Contoh: Selamat Ulang Tahun yang Penuh Berkah!"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-amber-400 focus:outline-none text-sm text-white"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-medium text-slate-300">
                    Isi Pesan / Doa Lengkap <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500">
                    {formData.messageBody.length} karakter
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={formData.messageBody}
                  onChange={(e) => handleTextChange('messageBody', e.target.value)}
                  placeholder="Tuliskan ucapan dan doa yang paling berkesan..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-amber-400 focus:outline-none text-sm text-white leading-relaxed placeholder-slate-500"
                />
              </div>

              {/* Special Wishes List */}
              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-medium text-slate-300">
                    Poin Harapan Spesial (Maksimal 5)
                  </label>
                  {formData.specialWishes.length < 5 && (
                    <button
                      type="button"
                      onClick={handleAddWish}
                      className="text-xs text-amber-400 hover:underline cursor-pointer"
                    >
                      + Tambah Harapan
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {formData.specialWishes.map((wish, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs text-amber-400 font-bold w-4">★</span>
                      <input
                        type="text"
                        value={wish}
                        onChange={(e) => handleWishChange(idx, e.target.value)}
                        placeholder={`Harapan ke-${idx + 1}`}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-white focus:border-amber-400 focus:outline-none"
                      />
                      {formData.specialWishes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveWish(idx)}
                          className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Hapus poin ini"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section: Identitas Pengirim (From) */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
                <span className="text-amber-400 font-serif font-bold text-sm">✍️</span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                  3. Pengirim Ucapan (From)
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Nama Pengirim <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.senderName}
                    onChange={(e) => handleTextChange('senderName', e.target.value)}
                    placeholder="Contoh: Ahmad"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-amber-400 focus:outline-none text-sm text-white"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Akan ditampilkan sebagai: <em>Dari: {formData.senderName || 'Ahmad'}</em>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Keterangan Hubungan / Peran
                  </label>
                  <input
                    type="text"
                    value={formData.senderRelation}
                    onChange={(e) => handleTextChange('senderRelation', e.target.value)}
                    placeholder="Contoh: Sahabat Terbaikmu / Dari Seluruh Teman Tim"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 focus:border-amber-400 focus:outline-none text-sm text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Visual & Efek Settings */}
          <div className="space-y-6">
            {/* Visual Theme Selection */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
                <Palette className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                  Tema & Nuansa Warna
                </h2>
              </div>

              <div className="space-y-2.5">
                {themes.map((theme) => {
                  const isSelected = formData.theme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => handleTextChange('theme', theme.id)}
                      className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? `bg-slate-800/90 ${theme.borderClass} shadow-lg ring-1 ring-amber-400/50`
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-4 h-4 rounded-full bg-gradient-to-r ${theme.bgClass} shadow-sm`}
                        />
                        <span className="text-xs font-medium text-slate-200">
                          {theme.label}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Effects Toggles */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">
                  Efek & Interaksi
                </h2>
              </div>

              <div className="space-y-3">
                {/* Cake Toggle */}
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                  <div>
                    <span className="text-xs font-medium text-slate-200 block">
                      🎂 Kue & Lilin Interaktif
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Bisa ditiup dan meledakkan confetti
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.showCake}
                    onChange={(e) => handleTextChange('showCake', e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </label>

                {/* Fireworks Toggle */}
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                  <div>
                    <span className="text-xs font-medium text-slate-200 block">
                      🎆 Animasi Kembang Api
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Luncuran kembang api di latar belakang
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.showFireworks}
                    onChange={(e) => handleTextChange('showFireworks', e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </label>

                {/* Music Autoplay Toggle */}
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors">
                  <div>
                    <span className="text-xs font-medium text-slate-200 block">
                      🎵 Melodi Selamat Ulang Tahun
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Putar melodi otomatis saat kartu dibuka
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.musicAutoPlay}
                    onChange={(e) => handleTextChange('musicAutoPlay', e.target.checked)}
                    className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* Quick Actions & Reset Card */}
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm space-y-3">
              <button
                onClick={handleSave}
                type="button"
                className="w-full py-3 rounded-xl font-semibold text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan Sekarang</span>
              </button>

              <button
                onClick={onNavigateToCard}
                type="button"
                className="w-full py-2.5 rounded-xl font-medium text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4 text-sky-400" />
                <span>Buka Halaman Kartu Utama</span>
              </button>

              <button
                onClick={handleResetDefault}
                type="button"
                className="w-full py-2 rounded-xl text-[11px] text-slate-500 hover:text-slate-300 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Kembalikan ke Contoh Bawaan</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
