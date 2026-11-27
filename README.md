# Nosploit Web

Public website + internal Staff Hub (RBAC). Next.js 14, Prisma, PostgreSQL (installed on the host), Auth.js (Discord + Roblox), Docker Compose + Caddy.

## Deploy on Ubuntu

### 1. Install Docker
```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER   # re-login afterwards
```

### 2. Install PostgreSQL on the host
```bash
sudo apt update && sudo apt install -y postgresql
sudo -u postgres psql <<'SQL'
CREATE USER nosploit WITH PASSWORD 'change-me';
CREATE DATABASE nosploit OWNER nosploit;
SQL
```
Let Docker containers reach it (default Docker bridge is `172.17.0.0/16`; Compose networks use `172.16.0.0/12`):
```bash
PGV=$(ls /etc/postgresql)
sudo sed -i "s/^#\?listen_addresses.*/listen_addresses = 'localhost,172.17.0.1'/" /etc/postgresql/$PGV/main/postgresql.conf
echo "host nosploit nosploit 172.16.0.0/12 scram-sha-256" | sudo tee -a /etc/postgresql/$PGV/main/pg_hba.conf
sudo systemctl restart postgresql
# keep 5432 closed to the internet
sudo ufw allow 80,443/tcp && sudo ufw allow OpenSSH && sudo ufw enable
```
Do not open port 5432 in the firewall.

### 3. Configure
```bash
cp .env.example .env && nano .env
```
Set `DOMAIN`, `NEXTAUTH_URL` (`https://your-domain`), `NEXTAUTH_SECRET` (`openssl rand -base64 32`), the DB password in `DATABASE_URL`, OAuth credentials, public links, and `INITIAL_CEO_DISCORD_ID` / `INITIAL_CEO_ROBLOX_ID`.

OAuth redirect URLs to register:
- Discord: `https://your-domain/api/auth/callback/discord`
- Roblox: `https://your-domain/api/auth/callback/roblox` (scopes: `openid`, `profile`)

### 4. Run
```bash
docker compose build
docker compose --profile tools run --rm migrate   # creates tables + seeds first CEO
docker compose up -d
```
Point your DNS A record to the server; Caddy issues HTTPS automatically.

### Update
```bash
git pull && docker compose build && docker compose --profile tools run --rm migrate && docker compose up -d
```

### Backups
```bash
sudo -u postgres pg_dump nosploit | gzip > nosploit-$(date +%F).sql.gz
```

## Roles
CEO, COO, CCO (executive, full access) · Director of Sales, Sales · Investigation · Director of Engineering, Developer. Only whitelisted users (added by an Executive in **Hub → Staff Access**) can sign in.

## Local development
```bash
npm install
npx prisma db push && npm run db:seed
npm run dev
npm test
```

## License verification API
`POST /api/v1/licenses/verify` (JSON). If `LICENSE_API_TOKEN` is set, send `Authorization: Bearer <token>`.
```json
{ "product": "default", "subjectType": "GROUP", "subjectId": "1234567", "key": "NSP-... (optional)" }
```
Response: `{ "valid": true, "status": "valid", "expiresAt": null }`. Other statuses: `not_found`, `key_mismatch`, `suspended`, `expired` (valid is `false`). Rate-limited to 60 req/min per IP. Licenses are created when the CEO approves a request; confirming a suspension request suspends all of the client's licenses, and a suspended client is also treated as invalid.
