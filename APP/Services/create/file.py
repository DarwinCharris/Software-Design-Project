from flask import Flask, jsonify, request
import requests
from validate_data import validate, parse_data
from flask_cors import CORS
import os
import base64
app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return "¡Hola! Esta es una aplicación Flask ejecutándose en el puerto 3002."

@app.route("/create/", methods=["POST"])
def create():
    url = "https://fa-rd-lfaria.azurewebsites.net/api/getperson"
    data=request.get_json()
    res = validate(data)
    if res["status"] == "True":
        #Ver si está en la bd
        response = requests.get(url, params={"id": data["id"]})
        if response.content == b'User not found':
            pass
        else:
            res["status"]="False"
            res["id"]="Documento ya registrado"
    return jsonify(res)

@app.route("/toponimia/<name>")
def topo(name):
    url = "https://fa-tp-lfaria.azurewebsites.net/api/toponimia"
    
    # Realiza la solicitud a la API externa
    response = requests.get(url, params={"firstname": name})
    
    # Decodifica el contenido desde bytes a string
    try:
        decoded_content = response.content.decode('utf-8')
    except UnicodeDecodeError:
        return jsonify({"error": "Error al decodificar la respuesta de la API externa"}), 500
    
    # Crea el diccionario para la respuesta JSON
    res = {"result": decoded_content.strip()}  # .strip() elimina espacios innecesarios
    
    # Retorna el JSON serializado
    return jsonify(res)

@app.route("/insert/", methods=["POST"])
def insert():
    data=request.get_json()
# Decodificar la imagen de base64
    foto_base64 = data.get("foto")
    if foto_base64:
        # Eliminar el encabezado de base64 si está presente (por ejemplo, "data:image/jpeg;base64,")
        foto_base64 = foto_base64.split(",")[1]
        # Decodificar la imagen
        foto_bytes = base64.b64decode(foto_base64)

        # Guardar la imagen temporalmente
        temp_filename = "temp_image.jpg"
        with open(temp_filename, "wb") as f:
            f.write(foto_bytes)

        # Preparar los datos para la solicitud POST
        url = "https://fa-cr-lfaria.azurewebsites.net/api/create"
        post_data = parse_data(data)

        # Enviar la solicitud POST con la imagen
        with open(temp_filename, "rb") as img:
            files = {"imageUrl": img}
            response = requests.post(url, data=post_data, files=files)

        # Eliminar el archivo temporal
        os.remove(temp_filename)

        # Responder con la respuesta de la otra API
        return response.text
if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=3002)