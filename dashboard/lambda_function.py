import os
import boto3
import json
from botocore.auth import SigV4Auth
from botocore.awsrequest import AWSRequest
import requests

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

def lambda_handler(event, context):
    try:
        start_time= event['queryStringParameters'].get('start_time')
        end_time = event['queryStringParameters'].get('end_time')
        page = event['queryStringParameters'].get('page')
        page_size = event['queryStringParameters'].get('page_size')

        query = {
            "from": page,
            "size": page_size,
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
            },
            "sort": [
                {
                    "timestamp.keyword": {
                        "order": "desc"
                    }
                }
            ]
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
