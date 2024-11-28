from flask import Flask, jsonify, request
import requests
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/write/<id>/<type>/<action>/')
def find(id, type, action):
    url = "https://fa-lg-lfaria.azurewebsites.net/api/writelogs"
    data = {
        "typeid": type,
        "id": id,
        "action": action,
        "details": ""
    }
    if action == "CREATE":
        data["details"] = "New person entry created."
    elif action == "UPDATE":
        data["details"] = "Person's data modified."
    elif action == "DELETE":
        data["details"] = "Person's data deleted."
    response = requests.post(url, data=data) 
    print("se hizo la escritura para", data["details"])

    return response.content

@app.route('/get-data', methods=['GET'])
def get_data():
    # Obtener parámetros, con valores predeterminados para los opcionales
    typeC = request.args.get('typeC', default=None, type=int)
    typeid = request.args.get('typeid', default=None, type=int)
    id = request.args.get('id', default=None, type=str)
    datei = request.args.get('datei', default=None, type=str)
    datef = request.args.get('datef', default=None, type=str)  # Corregir nombre de parámetro
    url="https://fa-lg-lfaria.azurewebsites.net/api/querylogs"
    
    # Verificar el valor de typeC y tomar acciones diferentes
    if typeC == 1:
        data = {
            "typeid": str(typeid)
        }
        response = requests.post(url, data=data)
    elif typeC == 2:
        data = {
             "id": id
        }
        response = requests.post(url, data=data)
    elif typeC == 3:
        data = {
            "from_date": datei
        }
        if datef is not None:  # Validar correctamente si datef tiene un valor
            data["to_date"] = datef
        response = requests.post(url, data=data)
    else:
        # Caso cuando typeC no es 1, 2 ni 3
        return jsonify({"error": "Invalid typeC value", "typeC": typeC})
    
    # Procesar la respuesta
    response_data = response.content.decode('utf-8')  # Decodificar el byte string a un string
    try:
        logs = json.loads(response_data)  # Convertir el string JSON a un objeto Python
        # Modificar el formato de los logs
        processed_logs = []
        for log in logs:
            # Crear una copia del log sin las keys 'PartitionKey' y 'RowKey', pero con 'time' extraído de 'RowKey'
            log_copy = {key: log[key] for key in log if key not in ['PartitionKey', 'RowKey']}
            # Extraer el 'time' de 'RowKey'
            log_copy['time'] = log['RowKey'].split('-', 1)[1]
            processed_logs.append(log_copy)
        
        return jsonify(processed_logs)  # Retornar los logs procesados como JSON

    except Exception as e:
        return jsonify({"error": str(e)})


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=3007)
