from flask import Flask, request
import autokeras
import json
import pandas as pd
import numpy as np
import pickle
from tensorflow.keras.models import load_model
import tensorflow as tf
from flask import jsonify



app = Flask(__name__)


@app.route('/train', methods=['POST'])
def train():
    # Auto Keras Regression

    from autokeras import TextRegressor
    text_reg = TextRegressor(overwrite=True, max_trials=1)
    reqInput = request.json
    
    df_train = pd.DataFrame()
    df_test = pd.DataFrame()

    features = ["SUMMARY"]
    lable = "STORY POINT ESTIMATE"
    
    for f in features:
        fset = {}
        farr = []
        for r in reqInput:
            farr.append(r[f])
        fset[f] = farr
    
    larr = []
    for r in reqInput:
        larr.append(r[lable])
    
    for f in features:
        df_train[f] = fset[f]

    df_test['lable'] = larr

    df_train_reindex = df_train.reindex(range(257), fill_value='')
    df_test_reindex = df_test.reindex(range(257), fill_value=0)


    trainX=df_train_reindex
    trainY=df_test_reindex


    x_train = np.array(trainX)
    y_train = np.array(trainY)

    text_reg.fit(x_train, y_train, epochs=50)
    model = text_reg.export_model()
    model.save('./models/spe_model.tf')

    return reqInput
    
@app.route('/test', methods=['POST'])
def test():
    # Auto Keras Regression

    reqInput = request.json
    
    loaded_model = load_model("./models/spe_model.tf")

    predicted_y = loaded_model.predict(tf.expand_dims(reqInput["SUMMARY"], -1))[0]
    
    print(predicted_y.round())

    response = {
        "PREDICTION_ESTIMATE": predicted_y.round().tolist()
    }

    print(response)
    return json.dumps(response)


@app.route('/')
def hello():
    return 'Hello, World!'

if __name__ == "__main__":
    app.run(debug=True)