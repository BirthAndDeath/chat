use crate::CoreConfig;
use std::sync::Once;
use std::sync::OnceLock;
use tracing_appender::non_blocking::WorkerGuard;
use tracing_subscriber::EnvFilter;
static LOGGER_GUARD: OnceLock<WorkerGuard> = OnceLock::new();
/// 初始化日志，路径为空(NONE)则不记录日志
pub async fn init_logger(cfg: &CoreConfig) -> anyhow::Result<()> {
    if let Some(path) = &cfg.path_to_log {
        LOGGER_GUARD.get_or_init(|| {
            std::fs::create_dir_all(path).expect("Failed to create log directory");

            let file = std::fs::OpenOptions::new()
                .create(true)
                .append(true)
                .open(path.join("app.log"))
                .expect("Failed to open log file");

            let (non_blocking, guard) = tracing_appender::non_blocking(file);

            tracing_subscriber::fmt()
                .with_writer(non_blocking)
                .with_ansi(false)
                .init();

            tracing::info!("Logger initialized successfully");

            guard // 返回 guard 存入 OnceLock
        });
    }

    Ok(())
}
