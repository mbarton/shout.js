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

inital_sample_state = [False, False, False, False, False, False, False, False, False, False, False, False, False, False, False, False]
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
    def get_dict():
      return dict

rooms = AutoVivification()

@app.route('/get/<room>/', methods=['GET'])
def getstate(room):
    if room not in rooms:
      rooms[room] = positions 
    print json.dumps(rooms)
    callback = request.args.get('callback', False)
    if callback:
      content = str(callback) + '(' + json.dumps(rooms[room]) + ')'
      return current_app.response_class(content, mimetype='application/json')

    return json.dumps(rooms[room])

@app.route('/change/<room>/<sample>/<position>/<enabled>')
def update_room_state(room, sample, position, enabled):
    sample_i = get_sample_index(room, sample)
    print 'Updating sample' + str(sample_i)
    rooms[room][sample_i]['triggers'][int(position)] = bool(enabled)
     
    app.p[room].trigger('change', {'sample': sample, 'position': position, 'enabled': enabled})
    #rooms[room] = {'sample': sample, 'positions': positions}
    print rooms
    return ''

@app.route('/addsample/<room>/<name>', methods=['POST'])
def add_sample(room, name):
  print len(rooms[room]) #{'sample': name, 'path': path}
  file_path = request.form.get('filepath', False)
  if get_sample_index(room, name) == -1:
    new_triggers = []
    new_triggers += inital_sample_state
    new_sample_json = {'sample': name, 'path': file_path, 'triggers': new_triggers}
    rooms[room].append(new_sample_json)
    app.p[room].trigger('newsample', new_sample_json)
    return 'Sample has been added'
  return 'Sample is a duplicate'

@app.route('/playback/<room>/<state>')
def update_playback(room, state):
  app.p[room].trigger('playback', {'state': state})
  return ''

@app.route('/tempo/<room>/<tempo>')
def update_tempo(room, tempo):
  app.p[room].trigger('tempo', {'tempo' : tempo})
  return ''

def get_sample_index(room, sample):
  for room_sample in rooms[room]:
     if room_sample['sample'] == sample:
	#print 'Got index for ' + sample + ' ' + str(rooms[room].index(room_sample))
        return rooms[room].index(room_sample)
  return -1

@app.route('/')
def catch_all():
	print 'Catch all has been called'
	return 'Catch all'

if __name__ == '__main__':
    app.run(debug=True, port=8080, host="0.0.0.0")
