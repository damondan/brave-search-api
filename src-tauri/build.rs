fn main() {
    dotenvy::from_filename(".env.production")
        .expect("Could not load src-tauri/.env.production");

    let brave_api_key = std::env::var("BRAVE_API_KEY")
        .expect("BRAVE_API_KEY is missing from src-tauri/.env.production");

    println!("cargo:rustc-env=BRAVE_API_KEY={brave_api_key}");

    println!("cargo:rerun-if-changed=.env.production");

    tauri_build::build();
}
