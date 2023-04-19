from flask import Flask, request

app = Flask(__name__)


@app.route('/train', methods=['POST'])
def train():
    json = request.json
    return json
    

@app.route('/')
def hello():
    return 'Hello, World!'

if __name__ == "__main__":
    app.run(debug=True)