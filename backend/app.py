
from flask import Flask, request, json, jsonify
import sys
print("Python path:", sys.path) 
from flask_cors import CORS

import pickle as pkl
my_app = Flask(__name__)
CORS(my_app)
@my_app.route("/predict",methods=['POST'])
def predict_lin_ag():
    try:
        sps = ['setosa', 'versicolor', 'virginica']
        featureNamesForModel = ["sepalHeight","sepalWidth","petalHeight","petalWidth"]
        features = json.loads(request.form.get("features"))
        values = [[features[i] for i in featureNamesForModel]]
        with open('./model.pkl','rb') as f:
            model = pkl.load(f)
        result = sps[model.predict(values)[0]]
        return jsonify({
            "result":result,
            "status": 200
        })

    except Exception as e:
        return jsonify({
            "result":"",
            "status": 502
        })

if __name__ == "__main__":
    my_app.run(debug=True)