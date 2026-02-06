cd ./src-tauri/ && cargo cache --autoclean

npm cache clean
cargo clean
# 安装缓存管理器
#cargo install cargo-cache --locked
#cargo install cargo-machete
#cargo install cargo-vet 
#cargo install cargo-crev
# 查看占用
#cargo cache --info
#cargo cache --autoclean