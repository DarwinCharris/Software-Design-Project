from flask import Flask, jsonify
import requests, json, base64
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

@app.route('/findbyid/<id>')
def find(id):
    url = "https://fa-rd-lfaria.azurewebsites.net/api/getperson"
    res={}
    if not id.isdigit():
        res["status"]="false"
        res["type"]="Valor no es un número válido"
    elif len(id)<10 or len(id)>10:
        res["status"]="false"
        res["type"]="Longitud no válida"
    else:
        response = requests.get(url, params={"id": id})
        if response.content == b'User not found':
            res["status"]="NA"
            res["type"]="usuario no existe"
        else:
            data = json.loads(response.content.decode('utf-8'))
            keys_to_remove = ['PartitionKey', 'RowKey']
            data = {key: value for key, value in data.items() if key not in keys_to_remove}
            data['status'] = "true"
            return(jsonify(data))
    return(jsonify(res))

@app.route('/findall/')
def findall():
    url  = "https://fa-rd-lfaria.azurewebsites.net/api/getperson"    
    response = requests.get(url)
    return (response.content)   
        
if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=3003)