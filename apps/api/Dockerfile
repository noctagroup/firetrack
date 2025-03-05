FROM python:3.13

WORKDIR /app

RUN pip install uv

COPY pyproject.toml uv.lock .python-version readme.md ./

COPY ./src ./src

RUN uv sync 

EXPOSE 8000

WORKDIR /app/src/firetrack

CMD ["uv", "run", "--", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]
