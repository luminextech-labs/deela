FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY ./backend ./app/

# Expose port
EXPOSE 8000

# Run the app - Railway uses PORT env var
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]