'use client'

export enum Notes {
  C4 = 261.63,
  D4 = 293.66,
  E4 = 329.63,
  F4 = 349.23,
  G4 = 392.00,
  A4 = 440.00,
  B4 = 493.88,
  C5 = 523.25
};

export const useAudio = () => {
  const playNotes = async (notes : Array<keyof typeof Notes>) => {
    for(const note of notes) {
      const audioCtx = new window.AudioContext();
      const oscillator = audioCtx.createOscillator();
      const contextGain = audioCtx.createGain();

      // Definir tipo de onda do oscilador e sua frequência (Hz)
      oscillator.type = 'sine';
      oscillator.frequency.value = Notes[note]; 

      // Conectar o oscilador ao destino (saída de áudio)
      oscillator.connect(contextGain);
      contextGain.connect(audioCtx.destination);

      // Iniciar o oscilador agora
      oscillator.start(0);

      // Define um ganho de 0.00001 para parar o oscilador em 1 segundo
      contextGain.gain.exponentialRampToValueAtTime(
        0.00001, audioCtx.currentTime + 1
      );

      await new Promise(resolve => setTimeout(resolve, 100));
    };
  }

  return {
    playNotes
  };
}