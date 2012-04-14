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

class AutoVivification(dict):
    """Implementation of perl's autovivification feature."""
    def __getitem__(self, item):
        try:
            return dict.__getitem__(self, item)
        except KeyError:
            value = self[item] = type(self)()
            return value

rooms = AutoVivification()

def support_jsonp(f):
    """Wraps JSONified output for JSONP"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        callback = request.args.get('callback', False)
        if callback:
            content = str(callback) + '(' + str(f().data) + ')'
            return current_app.response_class(content, mimetype='application/json')
        else:
            return f(*args, **kwargs)
    return decorated_function

@app.route('/get/<room>/', methods=['GET'])
@support_jsonp
def getstate(room):
    return json.dumps(rooms[room])

@app.route('/change/<room>/<sample>/<position>/<enabled>')
def hello_world(room, sample, position, enabled):
    app.p[room].trigger('an_event', {'sample': sample, 'position': position, 'enabled': enabled})
    rooms[room][sample] = {'position': position, 'enabled': enabled}
    print rooms
    return ''

@app.route('/')
def catch_all():
	print 'Catch all has been called'
	return 'Catch all'

if __name__ == '__main__':
    app.run(debug=True, port=8080, host="0.0.0.0")
