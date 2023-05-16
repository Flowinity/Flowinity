![TroploPrivateUploader Banner](https://i.troplo.com/i/9ea16d8ab178.png)
![TPU Features](https://i.troplo.com/i/086834402e31.png)
# TPU/TroploPrivateUploader
TPU is the next generation image hosting server written in Vue and TypeScript.

## Don't want to host your own server?
You can use the official public instance of TPU at [https://privateuploader.com](https://privateuploader.com) (also known as [https://images.flowinity.com](https://images.flowinity.com)).

## Features
- **Gallery**, where all your uploaded files live.
- **Collections**, which can be shared with multiple users. 
- **AutoCollects**, create custom rules to automatically add items into collections. 
- **Workspaces**, create quick notes/documents inside PrivateUploader. 
- **Insights**, see reports about how, and when you use PrivateUploader. 
- **Communications**, the built-in messaging platform to communicate with other users. 
- **Scoped API keys** for additional security. 
- **Scoped passwords**, set custom passwords with different API permissions. 
- **ShareX, and Sharenix support** (built-in client export).

## System Requirements
- Node.js 16.0.0 or newer
- 2GB of RAM or more (768MB-1GB per core recommended)
- 4GB of disk space or more (for core server, database, and frontend files)
- 64-bit x86 or ARM processor, 1 CPU core or more (4 recommended)
- MariaDB server (MySQL won't work, Sequelize dialect "mysql" does not support JSON)
- Redis server with RedisJSON plugin (only works with UNIX-like systems)
- Linux, other UNIX-based like macOS (Microsoft Windows is not officially supported)
- Tesseract OCR (with English language support) for OCR features
## Scripts
- `yarn build` - Build TPU.
- `yarn serve` - Start TPU in development mode.
- `yarn serve-cluster` - Start TPU in development cluster mode.
- `yarn start` - Start TPU in production mode and build (cluster mode).

Even if you only have 1 CPU core/thread, you should still use `start` in production as it will support the `TPU_RESTART` process command and will automatically scale if you add more CPU cores/threads.
#### Do not restart TPU via `pm2` or `systemd` if you are using the `serve-cluster` script in production.<br><br>This can be done in the admin panel or via a POST request to /api/v3/admin/restart (administrator account required, can be automated with "admin.ci" API scope).
#### Having a single CPU core will cause TPU to be temporarily unavailable when restarting.
