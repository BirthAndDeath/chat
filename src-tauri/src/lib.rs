use chat_core::ChatMeassage;
use libp2p::futures::StreamExt;
use libp2p::{
    futures::io,
    gossipsub, mdns, noise,
    swarm::{self, NetworkBehaviour, SwarmEvent},
    tcp, yamux, Swarm,
};
use tauri::{Emitter, Manager};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn send(message: &str) -> bool {
    //chat_core::ChatCore::sendmessage(message.to_string());
    true
}
/*app_data_dir()		数据库、配置
app_local_data_dir()	缓存、日志
app_config_dir()		用户配置
temp_dir() */

use std::sync::Arc;
use tokio::sync::{mpsc, Mutex};

// 只存 Send + Sync 的数据
pub struct AppData {
    pub cmd_tx: mpsc::Sender<chat_core::ChatMeassage>,
    pub topic: String,
}
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let rt = tokio::runtime::Runtime::new().unwrap();

    let handle = rt.handle().clone();
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let apphandle = app.handle().clone();
            std::thread::spawn(move || {
                handle.block_on(async {
                    let local = tokio::task::LocalSet::new();
                    let _result_local = local.run_until(async {
                        // 创建通道用于这里 -> core 通信
                        let (cmd_tx, mut cmd_rx) = mpsc::channel::<chat_core::ChatMeassage>(100);

                        apphandle.manage(AppData {
                            cmd_tx: cmd_tx.clone(),
                            topic: "default".to_string(),
                        });

                        // ❗ Swarm 必须在 spawn_local 中（!Send）

                        let db_path = apphandle
                            .path()
                            .app_data_dir()
                            .expect("获取数据目录失败")
                            .join("database.db");

                        // 确保目录存在
                        if let Some(parent) = db_path.parent() {
                            std::fs::create_dir_all(parent).ok();
                        }

                        let cfg = chat_core::CoreConfig::new(
                            db_path.to_string_lossy().to_string(), // ✅ 转 String
                        );

                        let mut core = match chat_core::ChatCore::try_init(&cfg) {
                            Ok(c) => c,
                            Err(e) => {
                                eprintln!("Core 初始化失败: {}", e);
                                return;
                            }
                        };
                        let mut rx = core.rx_message.take().unwrap();
                        // 启动事件转发任务（多线程安全）
                        let app_handle_for_events = apphandle.clone();

                        // 主事件循环
                        loop {
                    tokio::select! {
                            // Swarm 网络事件
                            event = core.swarm.select_next_some() => {
                                chat_core::swarm_event(event, &mut core);
                            }
                            Some(msg) = rx.recv()=> {
                        app_handle_for_events.emit("chat-message", msg.data).ok();
                    }


                            /*// 处理前端命令
                            cmd = cmd_rx.recv() => {
                                match cmd {
                                    Some(ChatCommand::SendMessage(msg)) => {
                                        // 发送消息...
                                    }
                                    Some(ChatCommand::Shutdown) | None => break,
                                }
                            }*/



                            // 心跳
                            _ = tokio::time::sleep(std::time::Duration::from_millis(100)) => {}
                        }
                }


            
                    }).await;
                });
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![send])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
