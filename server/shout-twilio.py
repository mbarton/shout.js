from flask import Flask, request, redirect, url_for, g, current_app
import twilio.twiml
import pusher
import urllib
import json
from os import listdir
from os.path import isfile, join, splitext

app = Flask(__name__)

pusher.app_id = ''
pusher.key = ''
pusher.secret = ''

app.p = pusher.Pusher()
app.maxSample = 0

samples = {}

@app.route("/service")
def hello_monkey():
    # from_number = request.args.get('From', None)
    call_sid = request.args.get('CallSid', None)
    
    print "Service: " + str(call_sid)
 
    resp = twilio.twiml.Response()
    # Greet the caller by name
    resp.say("Hello shouter")
    # resp.play("http://demo.twilio.com/hellomonkey/monkey.mp3")
 
    # Gather digits.
    with resp.gather(numDigits=1, action="/twilio/handle-key", method="GET") as g:
        g.say(""" 
                 Press 1 to record your shout.
                 Press any other key to start over.""")
 
    return str(resp)
 
@app.route("/handle-key")
def handle_key():
    """Handle key press from a user."""
 
    digit_pressed = request.args.get('Digits', None)

    if digit_pressed == "1":
        resp = twilio.twiml.Response()
        resp.say("You have 2 seconds to record your shout after the tone.")
        resp.record(maxLength="2", action="/twilio/handle-recording")
        return str(resp)
 
    # If the caller pressed anything but 1, redirect them to the homepage.
    else:
        return redirect("/twilio/service")
 

@app.route("/handle-recording", methods=["GET", "POST"])
def handle_recording():
    """Play back the caller's recording."""

    recording_url = request.form.get("RecordingUrl", None)
    call_sid = request.form.get('CallSid', "test")

    print "handle-recording. url: " + str( recording_url )

    app.maxSample += 1
    sample_id = app.maxSample
    filename = "shout_" + str(sample_id) + ".mp3"
    rec_file = "static/" + filename;
    print "rec file: " + rec_file

    if recording_url:
        urllib.urlretrieve( recording_url, rec_file ) # download file localy
        sample_url = url_for('static', filename=filename)
        samples[sample_id] = sample_url
        push_to_pusher("twilio", str(sample_id), str(sample_url) )

    resp = twilio.twiml.Response()
    resp.say("Thanks for shouting. ")
    # resp.play(recording_url)
    resp.say("Your shout number is " + str(sample_id) + ". ")
    resp.say("Goodbye.")

    return str(resp)

def push_to_pusher(room, sample_id, sample_url):
    print "Pushing to room: " + room + ", url: " + sample_url
    app.p[room].trigger( 'twilio_event', { 'id': sample_id, 'url': sample_url} )

@app.route("/repush")
def repush():
    lastkey = samples.keys().pop(0)
    push_to_pusher("twilio", "None", str(lastkey), str(samples[lastkey]) )

@app.route("/list")
def handle_list():
    ret = "{ samples: [\n"
    for f in listdir("static"):
        ret = ret + url_for('static', filename=str(f)) + ", "
    ret += "}"
    return str(ret)

@app.route('/get/twilio', methods=['GET'])
def get_twilio():
    callback = request.args.get('callback', False)
    json_str = handle_show()

    if callback:
      content = str(callback) + '(' + json_str + ')'
      return current_app.response_class(content, mimetype='application/json')

    return json_str

@app.route("/show", methods=["GET", "POST"])
def handle_show():    
    ret = "{ samples: ["
    for k in samples:
        ret += "{ id: '" + str(k) + "', url: '" + str( samples[k] ) + "' }, "
    ret += "]  }"
    return str(ret)

def read_samples():
    for f in listdir("static"):
        fname = splitext(f)[0]
        fparts = fname.split("_")
        
        if len(fparts)>1:
            sample_id = int(fparts[1])
            samples[sample_id] = 'static/' + f

            if sample_id > app.maxSample:
                app.maxSample = sample_id

def create_app():
    return app

if __name__ == "__main__":
    read_samples()
    app.debug = True
    app.run(host="0.0.0.0")
