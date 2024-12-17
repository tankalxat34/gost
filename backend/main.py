import asyncio
import tornado

from server.handlers import *

def make_app():
    return tornado.web.Application([
    (r"/api/v1/getTitle", getTitle),
    (r"/api/v1/getGostLink", getGostLink),
])

async def main():
    app = make_app()
    app.listen(8888)
    await asyncio.Event().wait()

if __name__ == "__main__":
    asyncio.run(main())