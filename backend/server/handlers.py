import tornado
import tornado.ioloop
import tornado.web
import requests
import re
import time
import json

from local_utils.response import response

HEADERS = {
    "user-agent": "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/523.15 (KHTML, like Gecko, Safari/419.3) Arora/0.2"
}

TEMPLATES = {
    "ru": "{title} — Текст: электронный // {domen}: [сайт]. — URL: {url} (дата обращения: {date}).",
    "en": "{title} Available at: {url} (accessed {date})."
}


def create_gost(url: str, lang: str = "RU"):
    _date = time.strftime("%d.%m.20%y")
    _domen = url.split("/")[2].replace("www.", "", 1)

    target_url_text = requests.get(url, headers=HEADERS).text
    try:
        _title = re.findall('<title>(.+?)</title>', target_url_text)[0] +'.'
    except Exception:
        _title='.'
    
    return TEMPLATES.get(lang.lower()).format(
        title=_title,
        date=_date,
        url=url,
        domen=_domen
    )


def handleError(f):
    def wrapper():
        try:
            res = f()
            return res
        except Exception as e:
            return response(str(e), "ERROR")
    return wrapper


class getTitle(tornado.web.RequestHandler):
    def get(self):
        target_url_text = requests.get(self.get_query_argument("url"), headers=HEADERS).text
        try:
            _title = re.findall('<title>(.+?)</title>', target_url_text)[0] +'.'
        except Exception:
            _title='.'
        self.write(response(_title))


class getGostLink(tornado.web.RequestHandler):
    def prepare(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        return super().prepare()

    def get(self):
        arg_url = self.get_query_argument("url")
        arg_lang = self.get_query_argument("lang")
        
        self.write(response(create_gost(arg_url, arg_lang)))

    def post(self):
        arg_lang = self.get_query_argument("lang")

        request_body = json.loads(self.request.body)
        resp = []

        for url in request_body:
            resp.append(create_gost(url, arg_lang))

        resp = sorted(resp)

        self.write(response(resp))