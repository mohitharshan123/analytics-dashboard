import os
import boto3
import json
from botocore.auth import SigV4Auth
from botocore.awsrequest import AWSRequest
import requests
from datetime import datetime, timedelta
import time  # Import the time module

region = os.environ['AWS_REGION']
service = os.environ['AWS_SERVICE']
credentials = boto3.Session().get_credentials()
host = os.environ['OPEN_SEARCH_HOST']
index = os.environ['INDEX_NAME']

url = f"{host}/{index}/_search"

def signed_request(method, url, data=None, params=None, headers=None):
    request = AWSRequest(method=method, url=url, data=data, params=params, headers=headers)
    SigV4Auth(credentials, service, region).add_auth(request)
    return requests.request(method=method, url=url, headers=dict(request.headers), data=data)

def get_time_filter_range(time_filter_option, start_time_param=None, end_time_param=None):
    now_epoch = int(time.time()) * 1000  
    now_datetime = datetime.utcfromtimestamp(now_epoch / 1000.0)  

    if time_filter_option == 'last_24_hours':
        start_time = int((now_datetime - timedelta(hours=24)).timestamp()) * 1000
        end_time = now_epoch
    elif time_filter_option == 'last_7_days':
        start_time = int((now_datetime - timedelta(days=7)).timestamp()) * 1000
        end_time = now_epoch
    elif time_filter_option == 'custom_range':
        try:
            start_time = int(float(start_time_param) * 1000)
        except (TypeError, ValueError):
            start_time = int((now_datetime - timedelta(hours=24)).timestamp()) * 1000

        try:
            end_time = int(float(end_time_param) * 1000)
        except (TypeError, ValueError):
            end_time = now_epoch
    else:
        start_time = int((now_datetime - timedelta(hours=24)).timestamp()) * 1000
        end_time = now_epoch

    return start_time, end_time

def lambda_handler(event, context):
    try:
        time_filter_option = event['queryStringParameters'].get('time_filter', 'last_24_hours')
        start_time_param = event['queryStringParameters'].get('start_time')
        end_time_param = event['queryStringParameters'].get('end_time')

        start_time, end_time = get_time_filter_range(time_filter_option, start_time_param, end_time_param)

        query = {
            "query": {
                "bool": {
                    "filter": {
                        "range": {
                            "timestamp": {
                                "gte": start_time,
                                "lte": end_time
                            }
                        }
                    }
                }
            },
            "aggs": {
                "unique_users": {
                    "cardinality": {
                        "field": "user_id.keyword"
                    }
                },
                "total_calls": {
                    "value_count": {
                        "field": "id.keyword"
                    }
                },
                "total_failures": {
                    "filter": {
                        "term": {"status": "failed"}
                    },
                    "aggs": {
                        "failed_calls": {
                            "value_count": {
                                "field": "id.keyword"
                            }
                        }
                    }
                }
            }
        }

        headers = {"Content-Type": "application/json"}

        r = signed_request(method='GET', url=url, data=json.dumps(query), headers=headers)

        response = {
            "statusCode": r.status_code,
            "headers": {
                "Access-Control-Allow-Origin": '*'
            },
            "isBase64Encoded": False
        }

        response['body'] = r.text
        return response
    except Exception as e:
        return {
            'statusCode': 500,
            'body': str(e)
        }
