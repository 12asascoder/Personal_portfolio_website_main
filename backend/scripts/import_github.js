/* One-time import of GitHub data to local JSON files - no live runtime calls */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

async function main() {
  const username = process.env.GITHUB_USERNAME;
  if (!username) {
    console.error('GITHUB_USERNAME missing in .env');
    process.exit(1);
  }
  const outDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  const headers = {};
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const profileResp = await fetch(`https://api.github.com/users/${username}`, { headers });
  const profile = await profileResp.json();
  fs.writeFileSync(path.join(outDir, 'github_profile.json'), JSON.stringify(profile, null, 2));

  const reposResp = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers });
  const repos = await reposResp.json();
  fs.writeFileSync(path.join(outDir, 'github_repos.json'), JSON.stringify(repos, null, 2));

  console.log('Imported GitHub profile and repos to backend/data/*.json');
}

main().catch(err => { console.error(err); process.exit(1); });


