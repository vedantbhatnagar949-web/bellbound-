// SoundSynthesizer using Web Audio API
// Synthesizes procedural ambient BGM (Low Tempo & High Tempo) and peaceful harmonic tones > 440 Hz

class AudioEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.bgmGain = null;
        this.sfxGain = null;
        
        this.isMuted = false;
        this.currentTempoMode = 'low'; // 'low' or 'high'
        this.isBgmPlaying = false;
        
        this.bgmTimer = null;
        this.stepCount = 0;
        
        // Frequencies strictly > 440 Hz (Pentatonic / Peaceful Lydian scale in High Octaves)
        // E5 (659.25), F#5 (739.99), G#5 (830.61), B5 (987.77), C#6 (1108.73), E6 (1318.51), F#6 (1479.98)
        this.peacefulNotes = [523.25, 587.33, 659.25, 739.99, 830.61, 987.77, 1108.73, 1318.51, 1479.98, 1661.22];
        this.padNotes = [493.88, 523.25, 659.25, 739.99, 987.77];
    }

    init() {
        if (this.ctx) return;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;
        
        this.ctx = new AudioContextClass();
        
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
        
        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
        this.bgmGain.connect(this.masterGain);
        
        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);
        
        this.startDronePad();
        this.scheduleBgmLoop();
    }

    ensureContext() {
        if (!this.ctx) {
            this.init();
        } else if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    setTempoMode(mode) {
        if (this.currentTempoMode === mode) return;
        this.currentTempoMode = mode;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.scheduleBgmLoop();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.masterGain && this.ctx) {
            this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.3, this.ctx.currentTime);
        }
        return this.isMuted;
    }

    // Peaceful Drone Pad background (> 440 Hz)
    startDronePad() {
        if (!this.ctx) return;
        
        const padFrequencies = [523.25, 659.25, 739.99, 987.77]; // C5, E5, F#5, B5 (all > 440 Hz)
        padFrequencies.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const filter = this.ctx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

            // Subtle slow pitch drift for peaceful ambient warmth
            const lfo = this.ctx.createOscillator();
            const lfoGain = this.ctx.createGain();
            lfo.frequency.setValueAtTime(0.1 + idx * 0.05, this.ctx.currentTime);
            lfoGain.gain.setValueAtTime(1.5, this.ctx.currentTime);
            lfo.connect(osc.frequency);
            lfo.start();

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

            gain.gain.setValueAtTime(0.015, this.ctx.currentTime);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(this.bgmGain);

            osc.start();
        });
    }

    // Procedural peaceful melodic generator
    scheduleBgmLoop() {
        if (!this.ctx) return;
        
        const stepInterval = this.currentTempoMode === 'high' ? 350 : 900; // ms per note beat
        
        this.playMelodicStep();
        this.stepCount++;
        
        this.bgmTimer = setTimeout(() => {
            this.scheduleBgmLoop();
        }, stepInterval);
    }

    playMelodicStep() {
        if (this.isMuted || !this.ctx) return;

        // 70% chance to play a note for airy, peaceful, meditative music feel
        const shouldPlay = Math.random() < (this.currentTempoMode === 'high' ? 0.85 : 0.65);
        if (!shouldPlay) return;

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        // Pick frequency > 440 Hz
        const freqIndex = Math.floor(Math.random() * this.peacefulNotes.length);
        const freq = this.peacefulNotes[freqIndex];

        osc.type = Math.random() > 0.5 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1600, now);

        const duration = this.currentTempoMode === 'high' ? 0.6 : 1.8;

        // Envelope for soft bell/marimba like peaceful sound
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(0.08, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.bgmGain);

        osc.start(now);
        osc.stop(now + duration);
    }

    // High frequency peaceful chime effect for interactions
    playChime(freq = 880) {
        this.ensureContext();
        if (this.isMuted || !this.ctx) return;

        const safeFreq = Math.max(450, freq); // Ensure > 440 Hz
        const now = this.ctx.currentTime;
        
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(safeFreq, now);
        osc.frequency.exponentialRampToValueAtTime(safeFreq * 1.5, now + 0.3);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(now);
        osc.stop(now + 0.8);
    }
}

export const SoundEngine = new AudioEngine();
