FROM python:3.13

WORKDIR /app

RUN pip install uv

COPY pyproject.toml uv.lock .python-version ./

RUN uv sync 

COPY openapi.yaml .
COPY main.py .

EXPOSE 8000

CMD ["uv", "run", "--", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
