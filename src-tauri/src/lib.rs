use dotenvy::dotenv;
use tauri_plugin_shell::init as shell_plugin;
use std::fs;
use tauri::{State, Manager, AppHandle};
use std::path::PathBuf;
use std::path::Path;

// src-tauri/src/lib.rs
// search_brave(query: String, extra_snippets: Option<bool>, country: Option<String>, 
//              language: Option<String>, safesearch: Option<String>, freshness: Option<String>,
//              goggles: Option<bool>, fetch_metadata: Option<bool>) -> Result<String, String>
#[tauri::command(rename_all = "camelCase")]
async fn search_brave(
    query: String,
    count: Option<i32>,
    offset: Option<i32>,
    extra_snippets: Option<bool>,
    country: Option<String>,
    language: Option<String>,
    safesearch: Option<String>,
    freshness: Option<String>,
    goggles: Option<bool>,
    fetch_metadata: Option<bool>,
) -> Result<String, String> {
    println!("Received query: {}", query);
    println!("extra_snippets value: {:?}", extra_snippets);
    let client = reqwest::Client::new();
    let key = std::env::var("BRAVE_API_KEY").expect("BRAVE_API_KEY not set");

    // Build query params dynamically
    let mut params: Vec<(&str, String)> = vec![("q", query)];
    
    if let Some(c) = count {
        if c > 0 && c <= 15 {
            params.push(("count", c.to_string()));
        }
    }
     if let Some(o) = offset {
        if o > 0 && o <= 9 {
            params.push(("offset", o.to_string()));
        }
    }
    if extra_snippets == Some(true) {
        params.push(("extra_snippets", "true".to_string()));
    }
    if let Some(c) = country {
        params.push(("country", c));
    }
    if let Some(l) = language {
        params.push(("search_lang", l));
    }
    if let Some(s) = safesearch {
        params.push(("safesearch", s));
    }
    if let Some(f) = freshness {
        print!("freshness is {}", f);
        params.push(("freshness", f));
    }
    if goggles == Some(true) {
        params.push(("goggles", "true".to_string()));
    }
    if fetch_metadata == Some(true) {
        params.push(("result_filter", "fetch_metadata".to_string()));
    }

    println!("Query params: {:?}", params);

    let response = client
        .get("https://api.search.brave.com/res/v1/web/search")
        .query(&params)
        .header("Accept", "application/json")
        .header("X-Subscription-Token", key)
        .send()
        .await
        .map_err(|e| e.to_string())?;
    
    let body = response.text().await.map_err(|e| e.to_string())?;
    
    //println!("Response: {}", body);
    
    Ok(body)
}

#[tauri::command(rename_all = "camelCase")]
async fn search_news_brave(
    query: String,
    count: Option<i32>,
    offset: Option<i32>,
    extra_snippets: Option<bool>,
    country: Option<String>,
    language: Option<String>,
    safesearch: Option<String>,
    freshness: Option<String>,
    goggles: Option<bool>,
    include_fetch_metadata: Option<bool>,
) -> Result<String, String> {
    println!("Received query: {}", query);
    println!("extra_snippets value: {:?}", extra_snippets);
    let client = reqwest::Client::new();
    let key = std::env::var("BRAVE_API_KEY").expect("BRAVE_API_KEY not set");

    // Build query params dynamically
    let mut params: Vec<(&str, String)> = vec![("q", query)];
    
    if let Some(c) = count {
        if c > 0 && c <= 15 {
            params.push(("count", c.to_string()));
        }
    }
     if let Some(o) = offset {
        if o > 0 && o <= 9 {
            params.push(("offset", o.to_string()));
        }
    }
    if extra_snippets == Some(true) {
        params.push(("extra_snippets", "true".to_string()));
    }
    if let Some(c) = country {
        params.push(("country", c));
    }
    if let Some(l) = language {
        params.push(("search_lang", l));
    }
    if let Some(s) = safesearch {
        params.push(("safesearch", s));
    }
    if let Some(f) = freshness {
        print!("freshness is {}", f);
        params.push(("freshness", f));
    }
    if goggles == Some(true) {
        params.push(("goggles", "true".to_string()));
    }
    if include_fetch_metadata == Some(true) {
        params.push(("result_filter", "include_fetch_metadata".to_string()));
    }

    println!("Query params: {:?}", params);

    let response = client
        .get("https://api.search.brave.com/res/v1/news/search")
        .query(&params)
        .header("Accept", "application/json")
        .header("X-Subscription-Token", key)
        .send()
        .await
        .map_err(|e| e.to_string())?;
    
    let body = response.text().await.map_err(|e| e.to_string())?;
    
    //println!("Response: {}", body);
    
    Ok(body)
}

//Persistence
// Save/load brave user data
fn get_brave_data_path(app_handle: &tauri::AppHandle) -> Result<PathBuf, String> {
    let app_dir = app_handle.path().app_data_dir()
        .map_err(|e| format!("Failed to get app brave dir: {}", e))?;
    fs::create_dir_all(&app_dir)
        .map_err(|e| format!("Failed to create app brave dir: {}", e))?;
    Ok(app_dir.join("brave_data.json"))
}

#[tauri::command]
async fn load_brave_data(app_handle: tauri::AppHandle) -> Result<String, String> {
    let brave_path = get_brave_data_path(&app_handle)?;
    
    if !brave_path.exists() {
        return Ok("{}".to_string()); // Return empty object if no file
    }
    
    fs::read_to_string(&brave_path)
        .map_err(|e| format!("Failed to read brave data: {}", e))
}

#[tauri::command]
async fn save_brave_data(data: String, app_handle: tauri::AppHandle) -> Result<(), String> {
    let brave_path = get_brave_data_path(&app_handle)?;
    
    fs::write(&brave_path, data)
        .map_err(|e| format!("Failed to write brave data: {}", e))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  dotenv().ok();
  tauri::Builder::default()
  .plugin(shell_plugin())
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
    .invoke_handler(tauri::generate_handler![search_brave,save_brave_data,load_brave_data])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}



