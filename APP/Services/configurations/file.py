from flask import Flask, jsonify, request
import docker
import requests
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

@app.route('/check')
def check_container_status():
    client = docker.from_env()
    try:
        container = client.containers.get("app-read-1")
        status = container.status
        return jsonify({"container_name": "app-read-1", "status": status}), 200
    except docker.errors.NotFound:
        return jsonify({"error": "Container 'app-read-1' not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/turn/<status>')
def turn_container(status):
    client = docker.from_env()
    container_name = "app-read-1"
    
    try:
        container = client.containers.get(container_name)
        if status == "on":
            if container.status != "running":
                container.start()
                return jsonify({"message": f"Container '{container_name}' started successfully"}), 200
            else:
                return jsonify({"message": f"Container '{container_name}' is already running"}), 200
        elif status == "off":
            if container.status != "exited":
                container.stop()
                return jsonify({"message": f"Container '{container_name}' stopped successfully"}), 200
            else:
                return jsonify({"message": f"Container '{container_name}' is already stopped"}), 200
        else:
            return jsonify({"error": "Invalid status. Use 'on' or 'off'."}), 400
    except docker.errors.NotFound:
        return jsonify({"error": f"Container '{container_name}' not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True, port=3006)