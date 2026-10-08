/**
 * Shared microphone audio bus.
 * Started ONLY after an explicit user gesture (mic toggle / demo opt-in) and
 * used purely for visual feedback (waveform + EFFECT-01 sphere). The audio is
 * analysed locally in the browser and is NEVER uploaded to any server.
 */

type AudioBusState = {
  stream: MediaStream | null;
  analyser: AnalyserNode | null;
  context: AudioContext | null;
  data: Uint8Array<ArrayBuffer> | null;
};

const bus: AudioBusState = {
  stream: null,
  analyser: null,
  context: null,
  data: null,
};

export async function startAudioBus(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (bus.stream) return true;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const Ctor: typeof AudioContext =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return false;
    const context = new Ctor();
    const source = context.createMediaStreamSource(stream);
    const analyser = context.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.72;
    source.connect(analyser);
    bus.stream = stream;
    bus.context = context;
    bus.analyser = analyser;
    bus.data = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
    return true;
  } catch {
    return false; // permission denied → visuals fall back to CSS animation
  }
}

export function stopAudioBus() {
  bus.stream?.getTracks().forEach((t) => t.stop());
  bus.stream = null;
  bus.analyser = null;
  bus.data = null;
  void bus.context?.close().catch(() => undefined);
  bus.context = null;
}

/** 0..1 RMS-ish level of the microphone, computed locally. */
export function audioLevel(): number {
  if (!bus.analyser || !bus.data) return 0;
  bus.analyser.getByteFrequencyData(bus.data);
  let sum = 0;
  for (let i = 0; i < bus.data.length; i += 1) sum += bus.data[i];
  return Math.min(1, sum / bus.data.length / 128);
}

export function audioBusActive(): boolean {
  return Boolean(bus.stream && bus.stream.getTracks().some((t) => t.readyState === "live"));
}
