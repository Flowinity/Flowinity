cd server
git pull
yarn --frozen-lockfile
sequelize db:migrate
yarn build
curl -X POST -H "Authorization: $TPU_API_KEY"  https://images.flowinity.com/api/v2/admin/restart
cd frontend
yarn --frozen-lockfile
yarn build-prod