'use client'

import { useEffect, useState } from 'react'

export const usePomodoro = () => {
  /*
    Controla o estado do pomodoro. Estados possíveis:
    0 - Nada está em execução
    1 - Foco
    2 - Descanso
    3 - Pausado
  */
  const [status, setStatus] = useState<number>(0);
  const [message, setMessage] = useState<String>("Inicie seu período produtivo");
  const [focusTime, setFocusTime] = useState<number>(25);
  const [restTime, setRestTime] = useState<number>(5);
  const [round, setRound] = useState<number>(1);

  useEffect(() => {
    if (status === 0) return

    let updateFocusInterval: number | NodeJS.Timeout = 0;
    let updateRestInterval: number | NodeJS.Timeout = 0;

    if (status === 1) {
      console.debug({
        file: 'usePomodoro.ts',
        name: '',
        isEffect: true,
        message: `Call to 'updateFocusInterval'. Current rest time equals to ${focusTime}`
      })

      updateFocusInterval = setInterval(() => {
        setFocusTime((prevTime) => prevTime - 1)
      }, 1000);
    } else if (status === 2) {
      console.debug({
        file: 'usePomodoro.ts',
        name: '',
        isEffect: true,
        message: `Call to 'updateRestInterval'. Current rest time equals to ${restTime}`
      })

      updateRestInterval = setInterval(() => {
        setRestTime((prevTime) => prevTime - 1)
      }, 1000);
    }

    return () => {
      clearInterval(updateFocusInterval);
      clearInterval(updateRestInterval);
    };
  }, [status, restTime, focusTime]);

  useEffect(() => {
    if (status !== 1) return
    
    if (focusTime === 0) {
      import('@tauri-apps/api').then((tauriApi) => {
        tauriApi.notification.sendNotification({
          title: `Hora de relaxar um pouco!`,
          body: `Inicie seu descanso de ${round < 4 ? "5" : "15"} minutos.`
        });
      })

      setRestTime(round < 4 ? 5 : 15); // Garante o valor inicial do tempo de descanso
      setStatus(2);
      
      runBeep('C4').then(() => {
        setTimeout(() => {
          runBeep('G4').then(() => {
            setTimeout(() => {
              runBeep('C5');
            }, 100);
          });
        }, 100);
      });
    } else {
      setMessage(`Continue focado por mais ${focusTime} minuto(s)`);
    }
  }, [status, focusTime, message, round])

  useEffect(() => {    
    if (status !== 2) return
    
    if (restTime === 0) {
      import('@tauri-apps/api').then((tauriApi) => {
        tauriApi.notification.sendNotification({
          title: round < 4
            ? "Volte ao foco com tudo!"
            : "Nossa nós trabalhamos muito bem juntos!",
          body: round < 4
            ? `Iniciando período de foco por 25 minutos.`
            : `Parabéns, voce terminou o seu pomodoro!`
        });
      })

      
      setFocusTime(25);

      if (round < 4) {
        setRound((prevRound) => prevRound + 1);
        setStatus(1);

        runBeep('C4').then(() => {
          setTimeout(() => {
            runBeep('E4')
          }, 100);
        });
      } else {
        setRound(1);
        setStatus(0);
        setRestTime(5);
        setMessage("Inicie seu período produtivo");
        runBeep('C4');
      }
    } else {
      setMessage(`Descanse por mais ${restTime} minuto(s)`);
    }
  }, [status, restTime, message, round])

  const start = async () => {
    setStatus(1);
    setMessage(`Continue focado por mais 25 minutos`);

    runBeep('D4').then(() => {
      setTimeout(() => {
        runBeep('C4')
      }, 100);
    });

    import('@tauri-apps/api').then((tauriApi) => {
      tauriApi.notification.sendNotification({
        title: "Pomodoro iniciado!",
        body: "Sua próxima pausa será em 25 minutos e terá a duração de 5 minutos."
      });
    })
  }

  const stop = async () => {
    setRound(1);
    setStatus(0);
    setFocusTime(25);
    setRestTime(5);
    setMessage("Inicie seu período produtivo");
    runBeep('C4');
  }

  const runBeep = async (note: keyof typeof notes) => {
    const notes = {
      C4: 261.63,
      D4: 293.66,
      E4: 329.63,
      F4: 349.23,
      G4: 392.00,
      A4: 440.00,
      B4: 493.88,
      C5: 523.25
    } as const;

    const audioCtx = new window.AudioContext();
    const oscillator = audioCtx.createOscillator();
    const contextGain = audioCtx.createGain();

    // Definir tipo de onda do oscilador e sua frequência (Hz)
    oscillator.type = 'sine'; // Tipo de onda (sine, square, sawtooth, triangle)
    oscillator.frequency.value = notes[note]; // Frequência em Hz

    // Conectar o oscilador ao destino (saída de áudio)
    oscillator.connect(contextGain);
    contextGain.connect(audioCtx.destination);

    // Iniciar o oscilador agora
    oscillator.start(0);

    // Parar o oscilador após 0.5 segundos
    // oscillator.stop(audioCtx.currentTime + 0.1);
    contextGain.gain.exponentialRampToValueAtTime(
      0.00001, audioCtx.currentTime + 1
    );
  }

  return {
    status,
    message,
    start,
    stop
  };
}