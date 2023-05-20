![TroploPrivateUploader Banner](https://i.troplo.com/i/9ea16d8ab178.png)
![TPU Features](https://i.troplo.com/i/086834402e31.png)

# TPU/TroploPrivateUploader

TPU is the next generation image hosting server written in Vue and TypeScript.

TPU is intended to be an out of the way image hosting server for everyone else, thus it doesn't have features you'd regularly find in other ShareX servers, such as rich OpenGraph embeds. But instead has unique features like Insights, and Collections.

Additionally, TPU has only recently become an open source project, so documentation and resources are lacking initially, but will improve over time.
## Don't want to host your own server?

You can use the official public instance of TPU at [https://privateuploader.com](https://privateuploader.com) (also
known as [https://images.flowinity.com](https://images.flowinity.com)).

<details>
  <summary><h2>Screenshots (Click to expand)</h2></summary>

View the full collection on [TPU](https://privateuploader.com/collections/2736179e19078284d9a5a4c1241289db7f777b180fed932b88162bbb2ec00ef1).

![Gallery](https://i.troplo.com/i/d68241bda319.png)
![Collection Page](https://i.troplo.com/i/a1fb3e1af098.png)
![User Profile](https://i.troplo.com/i/4d0adcf1c4a4.png)
![Insights](https://i.troplo.com/i/ab6170f5d976.png)
</details>

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

- Node.js 18.0.0 or newer (NodeJS 18 is necessary for structuredClone, no polyfills are built-in)
- 2GB of RAM or more (RAM usage is dependent on the number of threads TPU uses)
- 4GB of disk space or more (for core server, database, and frontend files)
- 64-bit x86 or ARM processor, 1 CPU core or more (4 recommended)
- MariaDB server (MySQL won't work, Sequelize dialect "mysql" does not support JSON)
- Redis server with RedisJSON plugin (only works with UNIX-like systems)
- Linux, other UNIX-based like macOS (Microsoft Windows is not officially supported)
- Tesseract OCR (with English language support) for OCR features

# Setting Up
These instructions assume you're using a standard Linux system with systemd, these instructions will differ depending on what init system you use.
<details>
  <summary><h2>Docker w/ docker-compose (Quickest method)</h2></summary>

1. Clone the Docker-specific repo: `git clone https://github.com/PrivateUploader/docker-compose privateuploader`
2. Change directory into repo: `cd privateuploader`
3. Create the container (change the environment variables to your liking): `MYSQL_DATABASE=privateuploader MYSQL_USER=privateuploader MYSQL_PASSWORD=CHANGE_ME MYSQL_ROOT_PASSWORD=CHANGE_ME docker-compose up -d`
4. Follow the setup wizard on http://localhost:34582
5. You must change the MariaDB server hostname to `mariadb` and the redis hostname to `redis` in the setup wizard. (seen below):
      ![Setup Wizard](https://i.troplo.com/i/87987421cfa1.png)
      ![Setup Wizard](https://i.troplo.com/i/582d2fd8d1a7.png)
</details>

<details>
  <summary><h2>Manual Setup</h2></summary>

1. Create TPU user and group: `useradd -m tpu`
2. Install MariaDB and Redis (with the RedisJSON plugin) on your server.
3. Login as the TPU user: `su tpu`
4. Change directory into TPU home directory: `cd`
5. Clone the repository: `git clone https://github.com/Troplo/PrivateUploader private-uploader`
6. Change directory into the repository: `cd private-uploader`
7. Install dependencies: `yarn install`
8. Create systemd service files for TPU with `cp tpu.service /etc/systemd/system/tpu.service`
9. Modify the systemd service file (use nano, vim, etc), replace all instances of `CHANGE_ME` with your own values. Do not run TPU as root user and use the user created earlier.
10. Start TPU and start on boot with `systemctl enable tpu --now`
11. Follow the setup wizard on http://localhost:34582 and configure NGINX web server.
</details>

<details>
  <summary><h2>NGINX Configuration</h2></summary>

1. TPU includes an example NGINX configuration file, you can find it at `nginx.conf` in either of the Docker or primary TPU repositories.
2. Copy it to your NGINX configuration directory: `cp nginx.conf /etc/nginx/conf.d/tpu.conf` (this folder can differ between distributions, it could be `/etc/nginx/sites-available`, if so, symlink it to `/etc/nginx/sites-enabled`).
3. Modify the NGINX configuration file (use nano, vim, etc), replace all instances of `CHANGE_ME` with your own values.
4. Test the NGINX configuration: `nginx -t`
5. If the test is successful, reload NGINX: `systemctl restart nginx`
</details>
## Scripts

- `yarn build` - Build TPU.
- `yarn serve` - Start TPU in development mode.
- `yarn serve-cluster` - Start TPU in development cluster mode.
- `yarn start` - Start TPU in production mode and build (cluster mode).

Even if you only have 1 CPU core/thread, you should still use `start` in production as it will support the `TPU_RESTART`
process command and will automatically scale if you add more CPU cores/threads.

#### Do not restart TPU via `pm2` or `systemd` if you are using the `serve-cluster` script in production.<br><br>This can be done in the admin panel or via a POST request to /api/v3/admin/restart (administrator account required, can be automated with "admin.ci" API scope).

#### Having a single CPU core will cause TPU to be temporarily unavailable when restarting.


## Contributors
[![All Contributors](https://img.shields.io/github/all-contributors/Troplo/PrivateUploader?color=ee8449&style=flat-square)](#contributors)


<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->
