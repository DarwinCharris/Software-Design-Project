# Usar una imagen base de Python
FROM python:3.9-slim

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar el archivo file.py al contenedor
COPY ./file.py /app/file.py

# Instalar las dependencias necesarias
RUN pip install flask docker
RUN pip install flask-cors

# Comando para ejecutar el archivo de Python
CMD ["python", "./file.py"]
