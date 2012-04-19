#!/usr/bin/python
from flup.server.fcgi import WSGIServer
from shout_pusher import create_app 

if __name__ == '__main__':
    application = create_app()
    WSGIServer(application, bindAddress='/tmp/shout-fcgi.sock').run()
