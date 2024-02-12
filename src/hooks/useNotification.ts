'use client'

import { Options } from '@tauri-apps/api/notification'
import { Notes, useAudio } from './useAudio';
import { useStrings } from './useStrings';

interface NotificationProps extends Options {}

export const useNotification = () => {
  const { playNotes } = useAudio()
  const { titles, bodies } = useStrings()

  const sendCustomNotification = async (options: NotificationProps) => {
    import('@tauri-apps/api').then((tauriApi) => {
      tauriApi.notification.sendNotification(options);
    })
  }

  const sendNotification = async (id: number) => {
    const options = getOptions(id);
    const notes = getNotes(id);

    if (options === undefined || notes === undefined) return

    import('@tauri-apps/api').then((tauriApi) => {
      tauriApi.notification.sendNotification(options);
    })

    playNotes(notes);
  }

  const getOptions = (id: number) => {
    let option: NotificationProps | undefined = undefined;

    switch(id) {
      case 0: option = { 
          title: titles('start'), 
          body: bodies('start') 
        }
        break;
      case 1: option = { 
          title: titles('focus_to_rest'), 
          body: bodies('focus_to_rest')
        }
        break;
      case 2: option = { 
          title: titles('rest_to_focus'), 
          body: bodies('rest_to_focus')
        }
        break;
      case 3: option = { 
          title: titles('end'), 
          body: bodies('end')
        }
        break;
      default: console.debug(`getOption não encontrou o id ${id}`);
    }

    return option;
  }

  const getNotes = (id: number) => {
    let notes: Array<keyof typeof Notes> | undefined = undefined;

    switch(id) {
      case 0: 
        notes = ['D4', 'C4'];
        break;
      case 1: 
        notes = ['C4', 'G4', 'C5'];
        break;
      case 2: 
        notes = ['C4', 'E4'];
        break;
      case 3: 
        notes = ['C4'];
        break;
      default: console.debug(`getNotes não encontrou o id ${id}`);
    }

    return notes;
  }

  const sendAudioNotification = async (notes : Array<keyof typeof Notes>) => {
    playNotes(notes);
  }

  return {
    sendCustomNotification,
    sendNotification,
    sendAudioNotification
  };
}