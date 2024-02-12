'use client'

import Caption from '@/components/caption'
import Divider from '@/components/divider'
import Headline from '@/components/headline'
import Body from '@/components/body'
import { emit } from '@tauri-apps/api/event'
import { useEffect, useState } from 'react'
import { usePomodoro } from '@/hooks/usePomodoro'

export default function Home() {
  const [platform, setPlatform] = useState<String>("");
  const { status, message, start, stop } = usePomodoro();

  useEffect(() => {
    // A importação dinâmica é feita dentro de um useEffect para garantir que 
    // ela ocorra no lado do cliente

    import('@tauri-apps/api/window').then((tauriWindow) => {
      const handleBlur = () => {
        tauriWindow.appWindow.hide();
      };

      window.addEventListener('blur', handleBlur);

      return () => window.removeEventListener('blur', handleBlur);
    });
  }, []);

  useEffect(() => {
    import('@tauri-apps/api').then((tauriApi) => {
      const getPlatform = async () => {
        try {
          setPlatform(await tauriApi.os.platform());  
        } catch (error) {
          setPlatform("browser");
        }
      };

      getPlatform();
    })
  }, [platform]);
  
  function emitQuit() {
    emit('quit')
  }

  return (
    <main className={`
      flex cursor-default select-none 
      flex-col font-main gap-2 border rounded-md border-white/25
      ${platform === 'darwin' ? 'h-screen py-[1px] bg-transparent' : ''}
      ${platform === 'win32' ? 'bg-[#292A2D] py-[6px]' : ''}
      ${platform === 'browser' ? 'bg-[#292A2D] py-[6px] h-[162px] w-[254px]' : ''}
    `}>

      <div className='flex flex-col pt-1 px-3'>
        <Headline text={`Pomodoro`} />
        <Caption text={`${message}`}/>
      </div>

      <Divider />

      <div className='flex flex-col'>
        <button onClick={start} className={`
          cursor-default text-left px-3
          ${platform === 'darwin' ? 'py-[1px]' : ''}
          ${platform === ('win32' || 'browser') ? 'hover:bg-[#3F4042] py-[4px]' : ''}
        `}>
          <Body text={"Iniciar pomodoro"}/>
        </button>

        <button onClick={stop} className={`
          cursor-default text-left px-3
          ${platform === 'darwin' ? 'py-[1px]' : ''}
          ${platform === ('win32' || 'browser') ? 'hover:bg-[#3F4042] py-[4px]' : ''}
        `}>
          <Body text={"Parar pomodoro"}/>
        </button>
      </div>

      <Divider />

      <div className='flex flex-col'>
        <button onClick={emitQuit} className={`
          cursor-default text-left p-3
          ${platform === 'darwin' ? 'py-[1px]' : ''}
          ${platform === ('win32' || 'browser') ? 'hover:bg-[#3F4042] py-[4px]' : ''}
        `}>
          <Body text={"Sair"}/>
        </button>
      </div>
    </main>
  );
}
