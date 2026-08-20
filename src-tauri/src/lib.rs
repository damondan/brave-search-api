use dotenvy::dotenv;
use tauri_plugin_shell::init as shell_plugin;
use std::fs;
use tauri::{State, Manager, AppHandle};
use std::path::PathBuf;
use std::path::Path;
use std::process::{Command, Output};
use tempfile::tempdir;
use url::Url;

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
    println!("IN RUST SEARCH_BRAVE FUNCTION -> Received query: {}", query);

    let client = reqwest::Client::new();
    let key = env!("BRAVE_API_KEY");
    
    // Add Brave search operator directly into q
    let mut final_query = query;

    if let Some(l) = language {
        if !l.trim().is_empty() {
            final_query = format!("{} lang:{}", final_query, l);
        }
    }

    // Build query params dynamically
    let mut params: Vec<(&str, String)> = vec![("q", final_query)];

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

    if let Some(s) = safesearch {
        params.push(("safesearch", s));
    }

    if let Some(f) = freshness {
        println!("freshness is {}", f);
        params.push(("freshness", f));
    }

    if goggles == Some(true) {
        params.push(("goggles", "true".to_string()));
    }

    if fetch_metadata == Some(true) {
        params.push(("include_fetch_metadata", "true".to_string()));
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
    println!("Received query in search_news_brave: {}", query);
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

#[tauri::command(rename_all = "camelCase")]
async fn search_videos_brave(
    query: String,
    count: Option<i32>,
    offset: Option<i32>,
    country: Option<String>,
    language: Option<String>,
    safesearch: Option<String>,
    freshness: Option<String>,
    spellcheck: Option<bool>,
) -> Result<String, String> {
    println!("Received query in search_videos_brave: {}", query);
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
     if spellcheck == Some(true) {
        params.push(("spellcheck", "true".to_string()));
    }
    println!("Query params: {:?}", params);

    let response = client
        .get("https://api.search.brave.com/res/v1/videos/search")
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
async fn search_images_brave(
    query: String,
    count: Option<i32>,
    country: Option<String>,
    language: Option<String>,
    safesearch: Option<String>,
    spellcheck: Option<bool>,
) -> Result<String, String> {
    println!("Received query in search_images_brave: {}", query);
    let client = reqwest::Client::new();
    let key = std::env::var("BRAVE_API_KEY").expect("BRAVE_API_KEY not set");

    // Build query params dynamically
    let mut params: Vec<(&str, String)> = vec![("q", query)];
    
    if let Some(c) = count {
        if c > 0 && c <= 15 {
            params.push(("count", c.to_string()));
        }
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
     if spellcheck == Some(true) {
        params.push(("spellcheck", "true".to_string()));
    }
    println!("Query params: {:?}", params);

    let response = client
        .get("https://api.search.brave.com/res/v1/images/search")
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

#[tauri::command]
async fn transcribe_video_url(video_url: String) -> Result<String, String> {

eprintln!(
    "APP PATH = {}",
    std::env::var("PATH").unwrap_or_default()
);

eprintln!(
    "HOME = {}",
    std::env::var("HOME").unwrap_or_default()
);

    validate_video_url(&video_url)?;

    tauri::async_runtime::spawn_blocking(move || {
        transcribe_video_url_blocking(&video_url)
    })
    .await
    .map_err(|error| format!("Transcription task failed: {error}"))?
}

fn transcribe_video_url_blocking(video_url: &str) -> Result<String, String> {
    let temp_directory = tempdir()
        .map_err(|error| format!("Could not create temporary directory: {error}"))?;

    let working_directory = temp_directory.path();

    let output_template = working_directory.join("audio.%(ext)s");

    download_audio(video_url, &output_template)?;

    let audio_path = working_directory.join("audio.wav");

    if !audio_path.exists() {
        return Err(format!(
            "Expected audio file was not created: {}",
            audio_path.display()
        ));
    }

    transcribe_audio(&audio_path, working_directory)?;

    let transcript_path = working_directory.join("audio.txt");

    if !transcript_path.exists() {
        return Err(format!(
            "Expected transcript was not created: {}",
            transcript_path.display()
        ));
    }

    fs::read_to_string(&transcript_path)
        .map_err(|error| format!("Could not read transcript: {error}"))
}

fn download_audio(
    video_url: &str,
    output_template: &Path,
) -> Result<(), String> {
    let output = Command::new("/usr/local/bin/yt-dlp-linux")
        .arg("--ignore-config")
        .arg("--no-playlist")
        .arg("--extract-audio")
        .arg("--audio-format")
        .arg("wav")
        .arg("--output")
        .arg(output_template)
        .arg(video_url)
        .output()
        .map_err(|error| {
            format!("Could not start yt-dlp: {error}")
        })?;

    ensure_command_succeeded("yt-dlp", &output)
}

fn get_whisper_python_path() -> Result<PathBuf, String> {
    let home = std::env::var("HOME")
        .map_err(|_| "Could not determine HOME directory.".to_string())?;

    let python_path = PathBuf::from(home)
        .join(".pyenv")
        .join("versions")
        .join("whisper-py312")
        .join("bin")
        .join("python");

    if !python_path.exists() {
        return Err(format!(
            "Whisper Python environment was not found at {}",
            python_path.display()
        ));
    }

    Ok(python_path)
}

fn transcribe_audio(
    audio_path: &Path,
    output_directory: &Path,
) -> Result<(), String> {
    let python_path = get_whisper_python_path()?;

    let output = Command::new(&python_path)
        .env_remove("PYTHONHOME")
        .env_remove("PYTHONPATH")
        .arg("-m")
        .arg("whisper")
        .arg(audio_path)
        .arg("--model")
        .arg("turbo")
        .arg("--output_format")
        .arg("txt")
        .arg("--output_dir")
        .arg(output_directory)
        .arg("--verbose")
        .arg("False")
        .output()
        .map_err(|error| {
            format!(
                "Could not start Whisper using {}: {error}",
                python_path.display()
            )
        })?;

    ensure_command_succeeded("Whisper", &output)
}

fn ensure_command_succeeded(
    command_name: &str,
    output: &Output,
) -> Result<(), String> {
    if output.status.success() {
        return Ok(());
    }

    let stderr = String::from_utf8_lossy(&output.stderr);
    let stdout = String::from_utf8_lossy(&output.stdout);

    let details = if !stderr.trim().is_empty() {
        stderr.trim()
    } else if !stdout.trim().is_empty() {
        stdout.trim()
    } else {
        "No additional error details were returned."
    };

    Err(format!(
        "{command_name} failed with status {}:\n{details}",
        output.status
    ))
}

fn validate_video_url(video_url: &str) -> Result<(), String> {
    let parsed_url = Url::parse(video_url)
        .map_err(|_| "The entered value is not a valid URL.".to_string())?;

    match parsed_url.scheme() {
        "http" | "https" => Ok(()),
        _ => Err("Only HTTP and HTTPS URLs are supported.".to_string()),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  dotenv().ok();
  tauri::Builder::default()
  .plugin(shell_plugin())
  .plugin(tauri_plugin_dialog::init())
  .plugin(tauri_plugin_fs::init())
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
    .invoke_handler(tauri::generate_handler![search_brave,search_news_brave,search_videos_brave,search_images_brave,
        save_brave_data,load_brave_data,transcribe_video_url])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}



