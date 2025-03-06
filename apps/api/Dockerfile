FROM python:3.13

WORKDIR /app

RUN pip install uv

COPY . .

RUN uv sync

EXPOSE 8001

CMD ["uv", "run", "gunicorn", "firetrack.wsgi", "--bind", "0.0.0.0:8001"]
