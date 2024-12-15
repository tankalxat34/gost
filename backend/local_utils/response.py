def response(data: any, status: str = "OK"):
    return {
        "status": status,
        "data": data
    }
