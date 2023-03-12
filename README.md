![img](https://i.troplo.com/i/ee408d1b4760.png)
# TPU/TroploPrivateUploader
TPU is the next generation of image hosting servers written in Vue and TypeScript.

### Do not redistribute.


## System Requirements
- Node.js 16.0.0 or newer
- 2GB of RAM or more (1GB per core recommended)
- 4GB of disk space or more
- 2 CPU cores or more (4 recommended)
- MariaDB server
- Redis server (only works with UNIX-like systems)
- Linux, BSD, MacOS, UNIX-like (Windows is not supported, MacOS/BSD is not tested but should work)

## Scripts
- `yarn build` - Build TPU.
- `yarn serve` - Start TPU in development mode.
- `yarn serve-cluster` - Start TPU in development cluster mode.
- `yarn start` - Start TPU in production mode and build.

#### Do not restart TPU via `pm2` or `systemd` if you are using the `serve-cluster` script in production.<br><br>This can be done in the admin panel or via a POST request to /api/v2/admin/restart.
#### Having a single CPU core will cause TPU to be temporarily unavailable when restarting.