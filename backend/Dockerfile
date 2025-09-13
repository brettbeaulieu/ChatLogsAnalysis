# Dockerfile for Django
FROM pytorch/pytorch:2.8.0-cuda12.8-cudnn9-runtime

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy the project files
COPY . /app/

# Expose the port Django will run on
EXPOSE 8000

# Start the Django server
CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
