# vm

1. provisionar a máquina

2. instalar o metrics agent <https://docs.digitalocean.com/products/monitoring/how-to/install-agent/>

3. instalar o docker engine <https://docs.docker.com/engine/install/ubuntu/> e o postinstall também <https://docs.docker.com/engine/install/linux-postinstall/>

4. rodar o nginx e o certbot

se por acaso você estiver subindo pela primeira vez, precisa comentar todos os `server { listen 443 ssl ... }` dentro de `devops/nginx/conf.d/default.conf`

```sh
docker compose up -d nginx

docker compose run --rm --entrypoint certbot \
    certbot certonly --webroot -w /var/www/certbot \
    -d app.firetrack.nocta-software-dsm.com \
    --email joaovitorcprocopio@gmail.com --agree-tos --no-eff-email

docker compose run --rm --entrypoint certbot \
    certbot certonly --webroot -w /var/www/certbot \
    -d api.firetrack.nocta-software-dsm.com \
    --email joaovitorcprocopio@gmail.com --agree-tos --no-eff-email

docker compose run --rm --entrypoint certbot \
    certbot certonly --webroot -w /var/www/certbot \
    -d docs.firetrack.nocta-software-dsm.com \
    --email joaovitorcprocopio@gmail.com --agree-tos --no-eff-email
```
