#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use fantastical::Fantastical;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn generate_guild_name() -> String {
  return Fantastical::new().party.guild();
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![generate_guild_name])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
