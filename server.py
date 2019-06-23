import nexmo

from bottle import get, post, run, template, request
import json


APPLICATION_ID = '42c0d279-f0d5-4bbb-b34d-55357deb7b71'
PRIVATE_KEY_PATH = '/Users/bmodelski/dev/private_nexmo.key'
HOST = 'a8022f27.ngrok.io'
FROM_NUMBER = '447520634619'
CALLBACK_URL = "http://" + HOST + "/callback"
EVENT_URL = "http://" + HOST + "/event"

@get('/')
def index():
    return "Choose number and go to /call/<number> to call"

call_id = ""

@get('/call/<number>')
def call(number):
    response = client.create_call({
        'to': [{'type': 'phone', 'number': number}],
        'from': {'type': 'phone', 'number': FROM_NUMBER},
        'answer_url': [CALLBACK_URL],
        'answer_method': "POST"
    })
    print(response)
    call_id = response["uuid"]

    return template('<b>Calling {{number}}</b>!', number=number)




@post('/event')
def callback():
    return "err"


@get('/callback')
def callback():
    print(call_id)
    ncco = [{
        "action": "talk",
        "text": "Hello and welcome to the ASR demo app. Please say a number.",
        "eventUrl": [EVENT_URL]
    }]
    
    """,{
        "speech": {
            "context": [ "one"],
            "language": "en-GB",
            "uuid": [call_id],
            "eventUrl": [CALLBACK_URL],
            "endOnSilence": 5,
            "submitOnHash": True
        },
        "action": "input"
    },
    {
        "action": "talk",
        "text": "Thanks. Have a good day!"
    }]"""
    return json.dumps(ncco)

print(CALLBACK_URL)

client = nexmo.Client(application_id=APPLICATION_ID, private_key=PRIVATE_KEY_PATH)
run(host='localhost', port=8080, debug=True)
