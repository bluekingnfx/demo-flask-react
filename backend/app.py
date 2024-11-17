
from flask import Flask, request, json, jsonify
import sqlite3 as sql
import typing as ty
from flask_cors import CORS

import pickle as pkl
my_app = Flask(__name__)
CORS(my_app)


#Get data and show to frontend

def insert_to_db(data: ty.Dict[str,any]) -> bool:
    try:
        con = sql.connect("./iris.db")
        cursor = con.cursor()
        placeholders = ",".join(["?" for _ in data])
        query = f"""
        INSERT INTO iris ({','.join(data.keys())}) VALUES ({placeholders})
        """
        cursor.execute(query,tuple(data.values()))
        con.commit()
        con.close()
        return True
    except Exception as e:
        print(f"Database error: {e}")
        return False

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

        data = {i:values[0][ind] for ind,i in enumerate(featureNamesForModel)}
        data["species"] = result
        inserted = insert_to_db(data)
        if inserted:
            return jsonify({
            "result":result,
            "status": 200
            })
        else: 
            raise Exception("Not inserted")

    except Exception as e:
        print(e)
        return jsonify({
            "result":"",
            "status": 502
        })

if __name__ == "__main__":
    my_app.run(debug=True)