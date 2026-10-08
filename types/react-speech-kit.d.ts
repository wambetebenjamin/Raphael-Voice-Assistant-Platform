/**
 * Ambient types for react-speech-kit@3.0.0 (ships no TypeScript declarations).
 * Mirrors dist/useSpeechRecognition.js + dist/useSpeechSynthesis.js exactly.
 */
declare module "react-speech-kit" {
  export interface ListenOptions {
    lang?: string;
    interimResults?: boolean;
    continuous?: boolean;
    maxAlternatives?: number;
    grammars?: unknown;
  }

  export interface RecognitionOptions {
    onResult?: (transcript: string) => void;
    onEnd?: () => void;
    onError?: (event: { error: string }) => void;
  }

  export function useSpeechRecognition(options?: RecognitionOptions): {
    listen: (options?: ListenOptions) => void;
    listening: boolean;
    stop: () => void;
    supported: boolean;
  };

  export interface SpeakOptions {
    voice?: SpeechSynthesisVoice | null;
    text?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
  }

  export function useSpeechSynthesis(options?: { onEnd?: () => void }): {
    speak: (options?: SpeakOptions) => void;
    cancel: () => void;
    speaking: boolean;
    supported: boolean;
    voices: SpeechSynthesisVoice[];
  };
}
