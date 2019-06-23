import nexmo
from flask import Flask
from flask import render_template
import random
import giphy_client
from giphy_client.rest import ApiException
from pprint import pprint

# create an instance of the API class

api_instance = giphy_client.DefaultApi()
# creates a Flask application, named app
app = Flask(__name__)


def get_gif(search_pattern):
    api_key = 'bYRZV8RLtaxTNIEkbhQFNGhTOZgZbWCu'  # str | Giphy API Key.
    limit = 50  # int | The maximum number of records to return. (optional) (default to 25)
    lang = 'en'  # str | Specify default country for regional content; use a 2-letter ISO 639-1 country code. See list of supported languages <a href = \"../language-support\">here</a>. (optional)
    fmt = 'json'  # str | Used to indicate the expected response format. Default is Json. (optional) (default to json)
    try:
        # Search Endpoint
        api_response = api_instance.gifs_search_get(api_key, search_pattern, limit=limit, lang=lang, fmt=fmt)
        if (len(api_response.data)) < 1:
            api_response = api_instance.gifs_search_get(api_key, 'boaz', limit=limit, lang=lang, fmt=fmt)
        gif = random.choice(api_response.data).images.original
        return gif.url
        # pprint(api_response)
    except Exception as e:
        print("Exception when calling DefaultApi->gifs_search_get: %s\n" % e)
        return "something"


# a route where we will display a welcome message via an HTML template
@app.route("/")
def hello():
    message = "Hello, World"
    return render_template('index.html', message=message, gif=get_gif('noobie'))


@app.route("/<search>")
def search(search):
    message = "Hello, we'll show you some {}".format(search)
    return render_template('index.html', message=message, gif=get_gif(search))


# run the application
if __name__ == "__main__":
    app.run(debug=True)

