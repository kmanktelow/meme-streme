import nexmo

from bottle import get, post, run, template, request
import json


APPLICATION_ID = '42c0d279-f0d5-4bbb-b34d-55357deb7b71'
PRIVATE_KEY_PATH = '/Users/bmodelski/dev/private_nexmo.key'
HOST = '68a6aa2f.ngrok.io'

@get('/')
def index():
    return "Choose number and go to /call/<number> to call"

@get('/call/<number>')
def call(number):
    ncco = [{
            "action": "record",
            "eventUrl": ["http://" + HOST + "/callback"],
            "format": "wav",
            "endOnSilence": "5",
            "timeout": "20",
            #"split": "conversation" - commented out yields singletrack call record
        }]

    response = client.create_call({
        'to': [{'type': 'phone', 'number': number}],
        'from': {'type': 'phone', 'number': '447482559511'},
        'ncco': ncco
    })

    return template('<b>Calling {{number}}</b>!', number=number)



@post('/callback')
def callback():
    # get data from request
    payload = json.load(request.body)
    #if "recording_url" not in payload:
    #    return '<b>Failed to obtain recording url from request body</b>!'
    print(payload)




client = nexmo.Client(application_id=APPLICATION_ID, private_key=PRIVATE_KEY_PATH)

run(host='localhost', port=8080, debug=True)