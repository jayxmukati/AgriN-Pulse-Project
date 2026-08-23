FROM python:3.11-slim

WORKDIR /app

# Install system dependencies required for psycopg2 and others
RUN apt-get update && apt-get install -y \
    gcc \
    libpq-dev \
    ffmpeg \
    libsndfile1 \
    wget \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Download a generic ONNX model as a placeholder for the vision service
RUN wget https://github.com/onnx/models/raw/main/validated/vision/classification/mobilenet/model/mobilenetv2-7.onnx -O /app/model.onnx

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
