import flask
from functools import wraps
from flask import redirect, request, current_app
import pusher
import json
app = flask.Flask(__name__)

pusher.app_id = '18530'
pusher.key = '79a35f6a8db88187adb6'
pusher.secret = 'a719ef391208056aa57c'
app.p = pusher.Pusher()

#positions = [False, False, False, False, False, False, False, False, False, False, False, False, False, False, False, False]
positions = [
{"sample": "kick", "path": "samples/kick.mp3", "triggers": [True, False, False, False, True, False, False, False, True, False, False, False, True, False, False, False]},
{"sample": "hat", "path": "samples/hat.mp3", "triggers": [False, False, True, False, False, False, True, False, False, False, True, False, False, False, True, False]},
{"sample": "snare", "path": "samples/snare.mp3", "triggers": [False, False, False, False, True, False, False, False, False, False, False, False, True, False, False, False]},
{"sample": "crash", "path": "samples/crash.mp3", "triggers": [True, False, False, False, False, False, False, False, False, False, False, False, False, False, False, False]} ];

class AutoVivification(dict):
    """Implementation of perl's autovivification feature."""
    def __getitem__(self, item):
        try:
            return dict.__getitem__(self, item)
        except KeyError:
            value = self[item] = type(self)()
            return value

rooms = AutoVivification()

@app.route('/get/<room>/', methods=['GET'])
def getstate(room):
    if room not in rooms:
      rooms[room] = positions 
    callback = request.args.get('callback', False)
    if callback:
      content = str(callback) + '(' + json.dumps(rooms[room]) + ')'
      return current_app.response_class(content, mimetype='application/json')

    return json.dumps(rooms[room])

@app.route('/change/<room>/<sample>/<position>/<enabled>')
def hello_world(room, sample, position, enabled):
    sample_i = get_sample_i(sample)
    rooms[room][sample_i]['triggers'][int(position)] = bool(enabled)
     
    app.p[room].trigger('an_event', {'sample': sample, 'position': position, 'enabled': enabled})
    #rooms[room] = {'sample': sample, 'positions': positions}
    print rooms
    return ''

def get_sample_i(sample):
  if sample == 'kick':
    return 0
  if sample == 'hat':
    return 1
  if sample == 'snare':
    return 2
  if sample == 'crash':
    return 3

@app.route('/')
def catch_all():
	print 'Catch all has been called'
	return 'Catch all'

if __name__ == '__main__':
    app.run(debug=True, port=8080, host="0.0.0.0")
