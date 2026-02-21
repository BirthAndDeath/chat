use crate::CoreConfig;
use std::sync::OnceLock;
use tracing_appender::non_blocking::WorkerGuard;
use tracing_subscriber::{EnvFilter, fmt};

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

            // 从配置构建 filter
            let env_filter = if let Ok(env_filter) = EnvFilter::try_from_default_env() {
                env_filter
            } else {
                let default_level = cfg.log_level.as_deref().unwrap_or("info");
                EnvFilter::try_new(default_level)
                    .unwrap_or_else(|_| EnvFilter::try_new("info").unwrap())
            };

            fmt()
                .with_writer(non_blocking)
                .with_env_filter(env_filter)
                .init();

            tracing::info!(
                log_level = %cfg.log_level.as_deref().unwrap_or("info"),
                log_path = %path.display(),
                "Logger initialized"
            );

            guard
        });
    } else {
        // 没有文件路径，不初始化
        #[cfg(debug_assertions)]
        {
            // 在调试模式下如果有环境变量，则初始化一个简单的控制台日志
            if let Ok(env_filter) = EnvFilter::try_from_default_env() {
                fmt().with_env_filter(env_filter).init();
                tracing::info!("Console logger initialized");
            } else {
                // 没有环境变量，不进行日志初始化
            };
        }
    }

    Ok(())
}
