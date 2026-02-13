use dotenvy::dotenv;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  dotenv().ok();
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
    .invoke_handler(tauri::generate_handler![search_brave])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

// src-tauri/src/lib.rs
#[tauri::command]
async fn search_brave(query: String) -> Result<String, String> {
  println!("Received query: {}", query);
    let client = reqwest::Client::new();
    let key = std::env::var("BRAVE_API_KEY").expect("BRAVE_API_KEY not set");

    let response = client
        .get("https://api.search.brave.com/res/v1/web/search")
        .query(&[("q", &query)])
        .header("Accept", "application/json")
        .header("X-Subscription-Token", key)
        .send()
        .await
        .map_err(|e| e.to_string())?;
    
     
    let body = response.text().await.map_err(|e| e.to_string())?;
    
    println!("Response: {}", body);  // Print the JSON response
    
    Ok(body)
}
