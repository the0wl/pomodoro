// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dotenv::dotenv;
use tauri_plugin_positioner::{Position, WindowExt};
use tauri::{CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu};

#[cfg(target_os = "macos")]
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial, NSVisualEffectState};

fn main() {
  dotenv().ok();

  let quit = CustomMenuItem::new("quit".to_string(), "Quit").accelerator("Cmd+Q");

  let tray_menu = SystemTrayMenu::new()
    .add_item(quit); // insert the menu items here
  
  tauri::Builder::default()
    .plugin(tauri_plugin_positioner::init())
    .system_tray(SystemTray::new().with_menu(tray_menu).with_tooltip("Pomodoro"))
    .setup(|app| {
      #[cfg(target_os = "macos")]
      app.set_activation_policy(tauri::ActivationPolicy::Accessory);

      app.listen_global("quit", | _ | {
        std::process::exit(0);
      });

      #[cfg(target_os = "macos")]
      {
        let window = app.get_window("main").unwrap();

        apply_vibrancy(
          &window, 
          NSVisualEffectMaterial::Popover, 
          Some(NSVisualEffectState::Active), 
          Some(6.0)
        ).expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");
      }

      Ok(())
    })
    .on_system_tray_event(|app, event| {
      tauri_plugin_positioner::on_tray_event(app, &event);
      match event {
        SystemTrayEvent::LeftClick {
          position: _,
          size: _,
          ..
        } => {
          let window = app.get_window("main").unwrap();

          let _ = window.move_window(Position::TrayCenter);

          if window.is_visible().unwrap() {
            window.hide().unwrap()
          } else {
            window.show().unwrap();
            window.set_focus().unwrap()
          }
        },
        SystemTrayEvent::MenuItemClick { id, .. } => {
          match id.as_str() {
            "quit" => {
              std::process::exit(0);
            }
            _ => {}
          }
        }
        _ => {}
      };
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
