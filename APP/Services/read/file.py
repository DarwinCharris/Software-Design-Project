from flask import Flask, jsonify, request
import requests
app = Flask(__name__)

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
        
        
if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=3003)