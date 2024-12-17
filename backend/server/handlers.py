import tornado
import tornado.ioloop
import tornado.web
import requests
import re
import time

from local_utils.response import response

HEADERS = {
    "user-agent": "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/523.15 (KHTML, like Gecko, Safari/419.3) Arora/0.2"
}

TEMPLATES = {
    "ru": "{title} — Текст: электронный // {domen}: [сайт]. — URL: {url} (дата обращения: {date}).",
    "en": "{title} Available at: {url} (accessed {date})."
}


class getTitle(tornado.web.RequestHandler):
    def get(self):
        target_url_text = requests.get(self.get_query_argument("url"), headers=HEADERS).text
        try:
            _title = re.findall('<title>(.+?)</title>', target_url_text)[0] +'.'
        except Exception:
            _title='.'
        self.write(response(_title))

class getGostLink(tornado.web.RequestHandler):
    def get(self):
        arg_url = self.get_query_argument("url")
        arg_lang = self.get_query_argument("lang")

        _date = time.strftime("%d.%m.20%y")
        _domen = arg_url.split("/")[2].replace("www.", "", 1)

        target_url_text = requests.get(arg_url, headers=HEADERS).text
        try:
            _title = re.findall('<title>(.+?)</title>', target_url_text)[0] +'.'
        except Exception:
            _title='.'
        
        self.write(response(TEMPLATES.get(arg_lang.lower()).format(
            title=_title,
            date=_date,
            url=arg_url,
            domen=_domen
        )))