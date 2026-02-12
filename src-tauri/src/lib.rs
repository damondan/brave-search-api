#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

// src-tauri/src/lib.rs
#[tauri::command]
async fn search_brave(query: String) -> Result<String, String> {
    let client = reqwest::Client::new();
    let response = client
        .get("https://api.search.brave.com/res/v1/web/search")
        .query(&[("q", &query)])
        .header("Accept", "application/json")
        .header("X-Subscription-Token", std::env::var("BRAVE_API_KEY").unwrap())
        .send()
        .await
        .map_err(|e| e.to_string())?;
    
    response.text().await.map_err(|e| e.to_string())
}
