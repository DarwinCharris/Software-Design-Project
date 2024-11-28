from flask import Flask, jsonify, request
import requests, base64, os
from flask_cors import CORS
from validate_data import validate, transform

app = Flask(__name__)
CORS(app)

@app.route("/validate/", methods=["POST"])
def val():
    data=request.get_json()
    res={}
    url = "https://fa-rd-lfaria.azurewebsites.net/api/getperson"
    response = requests.get(url, params={"id": data["id"]})
    if response.content == b'User not found':
        
        res["status"]="False"
        res["err_doc"]="Persona no existe"  
    else:
        if(len(data)==1):
            res["status"]="NONE"
        else:
            res = validate(data)
    return jsonify(res)

@app.route("/update/", methods=["POST"])
def update():
    data = request.get_json()  # Obtener los datos JSON
    res = {}
    # Verificar si se ha recibido una foto
    if "foto" in data:
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

            # Preparar los datos para la solicitud PUT
            url = "https://fa-up-lfaria.azurewebsites.net/api/updateperson"
            
            # Eliminar la clave 'foto' de los datos antes de enviarlos
            data.pop("foto", None)
            
            # Preparamos los datos, si necesitas hacer un procesamiento similar a 'parse_data'
            post_data = data  # Aquí puedes aplicar parse_data() si lo necesitas
            print(post_data)
            # Enviar la solicitud PUT con los datos y la imagen
            with open("temp_image.jpg", "rb") as img:
                files = {"imageUrl": img} 
                response = requests.put(url, data=post_data, files=files)
                res["status"] = "ok"
            os.remove(temp_filename)

    else:
        # Si no hay foto, solo enviamos los datos sin archivo
        print("Se manda sin foto")
        url = "https://fa-up-lfaria.azurewebsites.net/api/updateperson"
        response = requests.put(url, data=data)
        res["status"] = "ok"
    return jsonify(res)

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=3004)
