// An attribute to hide warnings for unused code.
#![allow(dead_code)]

use tokio::time::{interval, Duration};
use tauri::{Manager, AppHandle};
use crate::utils::env::var_bool;

pub async fn start(cycle: u32, app: AppHandle) {
  let skip_time: bool = var_bool("SKIP_TIME");
 
  let timer_duration: u64 = if skip_time {
    1
  } else {
    60
  };

  let mut interval: tokio::time::Interval = interval(Duration::from_secs(timer_duration));
  let mut counter: i32 = 0;

  loop {
    interval.tick().await;

    app.get_window("main").unwrap().emit("work", 25-counter).expect("Falha ao emitir evento 'update'.");
    
    counter = counter + 1;
    
    if counter == 26 {
      break;
    }
  }

  // Executar sem esperar
  tokio::spawn(rest(cycle, app.clone()));
}

pub async fn pause() {  
  println!("Pomodoro parado")
}

pub fn reset() {
  println!("Pomodoro redefinido")
}

async fn rest(cycle: u32, app: AppHandle) {
  let skip_time: bool = var_bool("SKIP_TIME");
 
  let timer_duration: u64 = if skip_time {
    1
  } else {
    60
  };

  let mut interval: tokio::time::Interval = interval(Duration::from_secs(timer_duration));
  let mut counter: u32 = 0;
  let rest_in_minutes: u32;
  let new_cycle: u32;

  if cycle == 4 {
    rest_in_minutes = 16;
    new_cycle = 1;
  } else {
    rest_in_minutes = 6;
    new_cycle = cycle + 1;
  }

  loop {
    interval.tick().await;

    app.get_window("main").unwrap().emit("rest", (rest_in_minutes-1)-counter).expect("Falha ao emitir evento 'rest'.");
    
    counter = counter + 1;
    
    if counter == rest_in_minutes {
      break;
    }
  }

  resume(new_cycle, app.clone());
}

fn resume(cycle: u32, app: AppHandle) {
  tokio::spawn(start(cycle, app.clone()));
}
