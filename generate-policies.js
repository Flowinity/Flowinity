const axios = require("axios")
const fs = require("fs")
const path = require("path")

const token = process.argv[2]

async function generatePolicy(id, outName) {
  const policy = await axios
    .get(`https://flowinity.com/api/v3/notes/${id}/download?type=html`, {
      headers: {
        Authorization: token
      }
    })
    .then(
      (res) =>
        (res.data += `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet"><style>
            :root {
            font-family: 'Inter', sans-serif;
            }
        </style>`)
    )

  fs.writeFileSync(
    path.join(__dirname, `./frontend/public/${outName}.html`),
    policy
  )
}

generatePolicy(116, "privacy")
generatePolicy(60, "terms")
