'use client'

import Caption from '@/components/caption'
import Divider from '@/components/divider'
import Headline from '@/components/headline'
import Body from '@/components/body'
import { emit, listen } from '@tauri-apps/api/event'
import { invoke } from '@tauri-apps/api/tauri'
import { useEffect, useState } from 'react'

export default function Home() {
  const [caption, setCaption] = useState<String>("Inicie seu período produtivo")

  useEffect(() => {
    // Definindo o ouvinte de eventos
    const workListener = listen('work', (event) => {
      setCaption(`Continue focado por mais ${event.payload as number} minutos`);
    });

    const restListener = listen('rest', (event) => {
      setCaption(`Descanse por ${event.payload as number} minutos`);
    });

    // Limpeza do ouvinte ao desmontar o componente
    return () => {
      workListener.then((unlistenFn) => unlistenFn());
      restListener.then((unlistenFn) => unlistenFn());
    };
  }, []);
  
  function emitQuit() {
    emit('quit')
  }

  function invokePomodoroStart() {
    invoke('pomodoro_start')
  }

  function invokePomodoroPause() {
    invoke('pomodoro_pause')
  }

  function invokePomodoroReset() {
    invoke('pomodoro_reset')
  }

  return (
    <main className="flex h-screen cursor-default select-none bg-transparent 
      flex-col p-3 font-main gap-2 border rounded-md border-white/25">

      <div className='flex flex-col'>
        <Headline text={"Pomodoro"} />
        <Caption text={caption}/>
      </div>

      <Divider />

      <div className='flex flex-col'>
        <button onClick={invokePomodoroStart} className='cursor-default text-left py-[1px]'>
          <Body text={"Iniciar pomodoro"}/>
        </button>

        <button onClick={invokePomodoroPause} className='cursor-default text-left py-[1px]'>
          <Body text={"Parar pomodoro"}/>
        </button>

        <button onClick={invokePomodoroReset} className='cursor-default text-left py-[1px]'>
          <Body text={"Redefinir pomodoro"}/>
        </button>
      </div>

      <Divider />

      <div className='flex flex-col'>
        <button onClick={emitQuit} className='cursor-default text-left py-[1px]'>
          <Body text={"Quit"}/>
        </button>
      </div>
    </main>
  );
}
