import os
import base64
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.api import memcache

class BaseHandler(webapp.RequestHandler):
    def get(self):
        self.render()

class MainHandler(BaseHandler):
    def render(self):   
        path = os.path.join(os.path.dirname(__file__), 'templates/index.html')
        self.response.out.write(template.render(path, {}))

app = webapp.WSGIApplication([('/', MainHandler)],
                             debug=False)
