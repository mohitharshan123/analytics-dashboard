import base64
import boto3
import json
import os

from datetime import datetime
from opensearchpy import OpenSearch, RequestsHttpConnection
from requests_aws4auth import AWS4Auth

region = os.environ['AWS_REGION']
service = os.environ['AWS_SERVICE']
credentials = boto3.Session().get_credentials()
awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service, session_token=credentials.token)
host = os.environ['OPEN_SEARCH_HOST']
index = os.environ['INDEX_NAME']


def create_open_search_client():
    client = OpenSearch(
        hosts=[{'host': host, 'port': 443}],
        http_auth=awsauth,
        use_ssl=True,
        verify_certs=True,
        connection_class=RequestsHttpConnection
    )
    return client


def remove_from_open_search(open_search_client, record):
    document_id = record['dynamodb']['Keys']['id']['S']  
    open_search_client.delete(
                index=index,
                id=document_id,
                refresh=True
            )

def add_index_to_open_search(open_search_client, record):
    dynamo_record = record['dynamodb']['NewImage']  
 
    document_without_types = {key: value['S'] if 'S' in value else value for key, value in dynamo_record.items()}
    open_search_client.index(
                index=index,
                body=document_without_types,
                id=document_without_types['id'],
                refresh=True
            )

def lambda_handler(event, context):
    open_search_client = create_open_search_client()
    for record in event['Records']:
        try:
            event_name = record['eventName']
            if event_name == 'REMOVE':
                remove_from_open_search(open_search_client, record)
                print(f'Document with ID {document_id} removed from OpenSearch.')
            else:
                add_index_to_open_search(open_search_client, record)
                print(f'Document with ID {document_without_types["id"]} indexed into OpenSearch.')
        except Exception as e:
            print(f'Error processing record: {str(e)}')
            pass
       