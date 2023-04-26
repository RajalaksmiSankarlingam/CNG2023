from flask import Flask, request
import autokeras
import json
import pandas as pd
import numpy as np
import pickle
from tensorflow.keras.models import load_model
import tensorflow as tf
from flask import jsonify
import pickle 
import string
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.linear_model import LogisticRegression

app = Flask(__name__)


def process_string(input_str):
    # removing punct
    input_str = input_str.translate(str.maketrans('', '', string.punctuation))
    input_str = input_str.lower()
    return input_str


def prepare_test_dateaset(features, reqInput ):
    df_test = pd.DataFrame()
    for f in features:
        fset = {}
        farr = []
        for r in reqInput:
            farr.append(process_string(r[f]))
        fset[f] = farr
    
    for f in features:
        df_test[f] = fset[f]

    df_test_reindex = df_test.reindex()
    testX = df_test_reindex
    x_test = np.array(testX)
    return x_test



def prepare_train_dataset(features, label, reqInput, feature_defaults):
    
    df_train = pd.DataFrame()
    df_test = pd.DataFrame()
    for f in features:
        fset = {}
        farr = []
        for r in reqInput:
            farr.append(process_string(r[f]))
        fset[f] = farr
    
    larr = []
    for r in reqInput:
        larr.append(r[label])
    
    for f in features:
        df_train[f] = fset[f]

    df_test['label'] = larr

    if(len(df_train) < 20):
        df_train_reindex = df_train.reindex(range(20), fill_value='')
        df_test_reindex = df_test.reindex(range(20), fill_value=feature_defaults[label])
    else:
        df_train_reindex = df_train.reindex()
        df_test_reindex = df_test.reindex()

    metadata = {
        "labels" : sorted(df_test_reindex['label'].unique())
    }

    with open('label_metadata.pkl', 'wb') as f:
        pickle.dump(metadata, f)


    trainX=df_train_reindex
    trainY=df_test_reindex

    x_train = np.array(trainX)
    y_train = np.array(trainY)

    return x_train, y_train

@app.route('/train', methods=['POST'])
def train():
    # Auto Keras Regression

    # Training Story Point estimate
    from autokeras import TextRegressor
    import autokeras as ak

    feature_defaults = {
        "STORY POINT ESTIMATE": 0,
        "ASSIGNEE": '',

    }

    text_reg = TextRegressor(overwrite=True, max_trials=1)
    reqInput = request.json

    features = ["SUMMARY"]
    label = "STORY POINT ESTIMATE"

    x_train, y_train = prepare_train_dataset(features,label,reqInput, feature_defaults  )

    text_reg.fit(x_train, y_train, epochs=70, batch_size=10 )
    model = text_reg.export_model()
    model.save('./models/spe_model.tf')

    # Training Assignee estimate

    features = ["SUMMARY"]
    label = "ASSIGNEE"

    x_train, y_train = prepare_train_dataset(features,label,reqInput,feature_defaults  )

    print(y_train)
    
    clf = ak.TextClassifier(
        overwrite=True, max_trials=1
    )

    clf.fit(x_train, y_train, epochs=70, batch_size=10 )
    model = clf.export_model()
    model.save('./models/assignee_model.tf')


    # Assignee LR Model
    X = x_train.reshape(x_train.shape[0])
    y = y_train.reshape(y_train.shape[0])
    print("X.shape::::")
    print(X.shape)
    print(y.shape)
    cv = CountVectorizer()
    X_train_cv = cv.fit_transform(X)
    lr = LogisticRegression()
    lr.fit(X_train_cv, y)
    pickle.dump(lr, open("./models/lr.sav", 'wb'))
    pickle.dump(cv, open("./models/lr_countVect.sav", 'wb'))
    return "Trained Successfully"

@app.route('/predict_assignee', methods=['POST'])
def predict_assignee():

    model = request.json["model"]

    predicted_class = []
    
    reqInput = request.json["data"]

    print(reqInput)

    x_test = prepare_test_dateaset(['SUMMARY'], reqInput)

    if(model == "assignee_model.tf"):
        loaded_model = load_model("./models/assignee_model.tf")
        predicted_y = loaded_model.predict(tf.expand_dims(x_test, -1))
        

        with open('label_metadata.pkl', 'rb') as f:
            label_classes = pickle.load(f)

        for i in predicted_y:
            predicted_class.append(label_classes["labels"][i.argmax(axis=-1)])

        print(label_classes)

    elif model == "lr.sav":
        loaded_model = pickle.load(open("./models/lr.sav", 'rb'))
        loaded_cv_model = pickle.load(open("./models/lr_countVect.sav", 'rb'))

        # Assignee LR Model
        x = x_test.reshape(x_test.shape[0])

        x_test_cv = loaded_cv_model.transform(x)

        # generate predictions
        predictions = loaded_model.predict(x_test_cv)
        predicted_class = predictions.tolist()
        print(predicted_class)
        
        
        print(predictions)


    response = {
        "DATA_PREDICTION": predicted_class
    }

    print(response)

   
    return json.dumps(response)


@app.route('/predict_spe', methods=['POST'])
def predict_spe():
    # Auto Keras Regression

    reqInput = request.json["data"]

    loaded_model = load_model("./models/spe_model.tf")

    x_test = prepare_test_dateaset(['SUMMARY'], reqInput)

    predicted_y = loaded_model.predict(tf.expand_dims(x_test, -1))

    predicted_class = []

    for i in predicted_y:
        print(i)
        predicted_class.append(i[0].round().tolist())


    response = {
        "DATA_PREDICTION": predicted_class
    }

    print(predicted_class)

    return json.dumps(response)   


@app.route('/')
def hello():
    return 'Hello, World!'

if __name__ == "__main__":
    app.run(debug=True)