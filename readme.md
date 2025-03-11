# firetrack

## como rodar o projeto?

### api

pré-requisitos:

- UV: <https://docs.astral.sh/uv/getting-started/installation/>
- Docker Engine: <https://docs.docker.com/engine/install/>

```sh
docker compose up -d
cd apps/api
uv sync
uv venv
source .venv/bin/activate
uv run uvicorn --reload firetrack.main:app
```

### web

pré-requisitos:

- NVM: <https://github.com/nvm-sh/nvm?tab=readme-ov-file#install--update-script>

```sh
cd apps/www
nvm install
nvm use
npm install
npm run dev
```

## como fazer o deploy?

### rodar a máquina na digital ocean

1. provisionar a máquina

2. instalar o metrics agent <https://docs.digitalocean.com/products/monitoring/how-to/install-agent/>

3. instalar o docker engine <https://docs.docker.com/engine/install/ubuntu/> e o postinstall também <https://docs.docker.com/engine/install/linux-postinstall/>

4. subir o nginx

> NOTA FUNDAMENTAL: se você estiver subindo pela primeira vez, precisa comentar todos os `server { listen 443 ssl ... }` dentro de `devops/nginx/*.conf`

```sh
docker compose --file compose.prod.yaml up --detach nginx

docker compose --file compose.prod.yaml run --rm --entrypoint certbot \
    certbot certonly --webroot -w /var/www/certbot \
    --detach app.firetrack.nocta-software-dsm.com \
    --email joaovitorcprocopio@gmail.com --agree-tos --no-eff-email

docker compose --file compose.prod.yaml run --rm --entrypoint certbot \
    certbot certonly --webroot -w /var/www/certbot \
    --detach api.firetrack.nocta-software-dsm.com \
    --email joaovitorcprocopio@gmail.com --agree-tos --no-eff-email

docker compose --file compose.prod.yaml run --rm --entrypoint certbot \
    certbot certonly --webroot -w /var/www/certbot \
    --detach docs.firetrack.nocta-software-dsm.com \
    --email joaovitorcprocopio@gmail.com --agree-tos --no-eff-email

docker compose --file compose.prod.yaml up --detach --build
```

### limpar a máquina

tome **extremo cuidado** ao limpar os **volumes**, por que pode deletar todos os dados dentro do banco.

```sh
docker system prune --all --force
docker volume prune --all --force
```
