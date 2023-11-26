import time
import random
import uuid
import boto3
import pytz

from datetime import datetime
from fastapi import FastAPI, Request, Response
from fastapi.responses import JSONResponse
import time
import json

app = FastAPI()
credentials = boto3.Session().get_credentials()

dynamodb = boto3.resource('dynamodb',
                    aws_access_key_id = credentials.access_key,
                    aws_secret_access_key = credentials.secret_key,
                    region_name='us-east-1'
                          )


@app.middleware("http")
async def api_middleware(request: Request, call_next):
    response = await call_next(request)
    table = dynamodb.Table('log')
    response_body = b""
    async for chunk in response.body_iterator:
        response_body += chunk
    tz = pytz.timezone('Asia/Kolkata') 

    log = { 
        "id": str(uuid.uuid4()),
        "user_id": request.path_params.get("user_id"),
        "timestamp": str(int(time.time()) * 1000),
        "request": str(request.__dict__),
        "response": str(response.__dict__),
        "error_message": ""
    }
    if 200 <= response.status_code < 300:
        log["status"] = "success"
    else:
        log["status"] = "failed"
        log["error_message"] = json.loads(response_body.decode())["message"]

    table.put_item(Item = log)
    
    return Response(content=response_body, status_code=response.status_code, 
        headers=dict(response.headers), media_type=response.media_type)

@app.get("/{user_id}")
def hello_world(user_id: int):
    if random.random() < 0.2:
        return JSONResponse(content={"message": "Internal Server Error"}, status_code=500)

    return JSONResponse(content={"message": "Hello world"}, status_code=200)



