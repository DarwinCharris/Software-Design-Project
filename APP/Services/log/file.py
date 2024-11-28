from flask import Flask, jsonify
import requests, json
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

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=3007)
