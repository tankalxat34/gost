def response(data: any, status: str = "OK"):
    if status.upper() == "OK":
        return {
            "status": status.upper(),
            "data": data
        }
    elif status.upper() == "ERROR":
        return {
            "status": status.upper(),
            "message": data
        }

