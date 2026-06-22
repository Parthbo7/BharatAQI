FROM python:3.10-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY scripts/objective_1/ /app/scripts/objective_1/
COPY data/ /app/data/

CMD ["python", "/app/scripts/objective_1/generate_results.py"]
