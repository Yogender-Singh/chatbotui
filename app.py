import requests

from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from main import main

app = Flask(__name__)
CORS(app)


@app.route("/query", methods=["POST", "GET"])
@cross_origin()
def get_response():
    query = request.get_json(force=True)
    print(query)
    response = main(query["message"])

    return jsonify([response])


if __name__ == "__main__":
    app.run(host="localhost", port=8503, debug=True)
