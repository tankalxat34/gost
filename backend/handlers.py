import tornado

from local_utils.response import response

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write(response("tankalxat34"))