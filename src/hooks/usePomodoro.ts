'use client'

import { useEffect, useState } from 'react'
import { useNotification } from './useNotification';

enum Status { STAND_BY, FOCUS, REST, PAUSED }

export const usePomodoro = () => {
  const { sendNotification, sendAudioNotification } = useNotification()
  const [status, setStatus] = useState<Status>(Status.STAND_BY);
  const [message, setMessage] = useState<String>("Inicie seu período produtivo");
  const [focusTime, setFocusTime] = useState<number>(25);
  const [restTime, setRestTime] = useState<number>(5);
  const [round, setRound] = useState<number>(1);

  useEffect(() => {
    if (status === Status.STAND_BY) return

    let updateFocusInterval: number | NodeJS.Timeout = 0;
    let updateRestInterval: number | NodeJS.Timeout = 0;

    if (status === Status.FOCUS) {
      updateFocusInterval = setInterval(
        () => setFocusTime((prevTime) => prevTime - 1), 
        60 * 1000
      );
    } else if (status === Status.REST) {
      updateRestInterval = setInterval(
        () => setRestTime((prevTime) => prevTime - 1), 
        60 * 1000
      );
    }

    return () => {
      clearInterval(updateFocusInterval);
      clearInterval(updateRestInterval);
    };
  }, [status, restTime, focusTime]);

  useEffect(() => {
    if (status !== Status.FOCUS) return

    const timerHasFinished = () => focusTime === 0;

    if (timerHasFinished()) {
      sendNotification(1);
      setRestTime(round < 4 ? 5 : 15);
      setStatus(Status.REST);
      return
    } 
    
    setMessage(`Continue focado por mais ${focusTime} minuto(s)`);
  }, [ status, focusTime, message, round, sendNotification ])

  useEffect(() => {   
    if (status !== Status.REST) return

    const timerHasFinished = () => restTime === 0;
    
    if (timerHasFinished()) {
      const lastRound = round === 4;

      sendNotification(lastRound ? 3 : 2);
      resetTimers();
      setStatus(lastRound ? Status.STAND_BY : Status.FOCUS);

      if (lastRound) {
        setMessage("Inicie seu período produtivo");
        setRound(1);
      } else {
        setRound((prevRound) => prevRound + 1);
      }

      return 
    } 
    
    setMessage(`Descanse por mais ${restTime} minuto(s)`);
  }, [ status, restTime, message, round, sendNotification ])

  const start = async () => {
    setMessage(`Continue focado por mais ${focusTime} minuto(s)`);
    setStatus(Status.FOCUS);
    sendNotification(0);
  }

  const stop = async () => {
    setMessage("Inicie seu período produtivo");
    setRound(1);
    setStatus(Status.STAND_BY);
    resetTimers();
    sendAudioNotification(['C4']);
  }

  const resetTimers = () => {
    setFocusTime(25);
    setRestTime(5);
  }

  return { status, message, start, stop };
}