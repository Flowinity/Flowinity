cd server
git pull
yarn --frozen-lockfile
sequelize db:migrate
yarn build
cd frontend
yarn --frozen-lockfile
yarn build-prod
curl -X POST -H "Authorization: $TPU_API_KEY"  https://images.flowinity.com/api/v2/admin/restart
