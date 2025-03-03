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
