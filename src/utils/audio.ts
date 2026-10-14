/**
 * Web Audio API synthesizer for celebratory chimes, fireworks audio, and candle blowing.
 * Pure native audio synthesis with zero external MP3 dependencies.
 */

class BirthdayAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isMelodyPlaying: boolean = false;
  private melodyTimeouts: number[] = [];

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopMelody();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public getIsPlaying(): boolean {
    return this.isMelodyPlaying;
  }

  /**
   * Play a music-box/chime bell note with rich harmonics
   */
  public playChimeNote(freq: number, duration: number = 0.8, volume: number = 0.15) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      // Add soft octave harmonic for celesta/music-box chime sparkle
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(freq * 2, now);

      gainNode.gain.setValueAtTime(0.0001, now);
      gainNode.gain.linearRampToValueAtTime(volume, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + duration);
      osc2.stop(now + duration);
    } catch {
      // Ignore audio interruptions
    }
  }

  /**
   * Play realistic firework launch and explosion
   */
  public playFireworkPop(pitch: number = 1) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      // White noise buffer for explosion crackle
      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800 * pitch, now);
      filter.Q.setValueAtTime(3, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

      // Low sub rumble
      const sub = ctx.createOscillator();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(140 * pitch, now);
      sub.frequency.exponentialRampToValueAtTime(40, now + 0.2);

      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.1, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      sub.connect(subGain);
      subGain.connect(ctx.destination);

      noise.start(now);
      sub.start(now);
      noise.stop(now + 0.25);
      sub.stop(now + 0.2);
    } catch {
      // Ignore
    }
  }

  /**
   * Candle blow sound (gentle air breeze and extinguish)
   */
  public playCandleBlow() {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.45;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.linearRampToValueAtTime(300, now + 0.45);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.06);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.45);
    } catch {
      // Ignore
    }
  }

  /**
   * Play the classic "Happy Birthday" melody in chime/celesta tones
   */
  public startMelody(onEnd?: () => void) {
    if (this.isMelodyPlaying) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    this.stopMelody();
    this.isMelodyPlaying = true;

    // Frequencies (C4 scale)
    const C4 = 261.63;
    const D4 = 293.66;
    const E4 = 329.63;
    const F4 = 349.23;
    const G4 = 392.00;
    const A4 = 440.00;
    const B4 = 493.88;
    const C5 = 523.25;
    const Bb4 = 466.16;

    // Happy birthday melody notes & durations (in seconds)
    // "Happy Birthday to You"
    const notes: Array<{ note: number; dur: number; delay: number }> = [
      // Hap-py birth-day to you
      { note: C4, dur: 0.35, delay: 0 },
      { note: C4, dur: 0.35, delay: 0.4 },
      { note: D4, dur: 0.7, delay: 0.8 },
      { note: C4, dur: 0.7, delay: 1.55 },
      { note: F4, dur: 0.7, delay: 2.3 },
      { note: E4, dur: 1.1, delay: 3.05 },

      // Hap-py birth-day to you
      { note: C4, dur: 0.35, delay: 4.4 },
      { note: C4, dur: 0.35, delay: 4.8 },
      { note: D4, dur: 0.7, delay: 5.2 },
      { note: C4, dur: 0.7, delay: 5.95 },
      { note: G4, dur: 0.7, delay: 6.7 },
      { note: F4, dur: 1.1, delay: 7.45 },

      // Hap-py birth-day dear [Friend]
      { note: C4, dur: 0.35, delay: 8.8 },
      { note: C4, dur: 0.35, delay: 9.2 },
      { note: C5, dur: 0.7, delay: 9.6 },
      { note: A4, dur: 0.7, delay: 10.35 },
      { note: F4, dur: 0.7, delay: 11.1 },
      { note: E4, dur: 0.7, delay: 11.85 },
      { note: D4, dur: 1.1, delay: 12.6 },

      // Hap-py birth-day to you
      { note: Bb4, dur: 0.35, delay: 13.9 },
      { note: Bb4, dur: 0.35, delay: 14.3 },
      { note: A4, dur: 0.7, delay: 14.7 },
      { note: F4, dur: 0.7, delay: 15.45 },
      { note: G4, dur: 0.7, delay: 16.2 },
      { note: F4, dur: 1.8, delay: 16.95 },
    ];

    notes.forEach((item) => {
      const timeoutId = window.setTimeout(() => {
        if (this.isMelodyPlaying && !this.isMuted) {
          this.playChimeNote(item.note, item.dur, 0.12);
        }
      }, item.delay * 1000);
      this.melodyTimeouts.push(timeoutId);
    });

    const totalDuration = 19.5 * 1000;
    const endTimeout = window.setTimeout(() => {
      this.isMelodyPlaying = false;
      if (onEnd) onEnd();
    }, totalDuration);
    this.melodyTimeouts.push(endTimeout);
  }

  public stopMelody() {
    this.melodyTimeouts.forEach((id) => clearTimeout(id));
    this.melodyTimeouts = [];
    this.isMelodyPlaying = false;
  }
}

export const audioEngine = new BirthdayAudioEngine();
