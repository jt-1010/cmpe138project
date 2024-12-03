from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import bigquery
from datetime import datetime
import os
import logging
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.get("/data")
async def get_data(lat: float, lon: float, start_time: str, end_time: str, category: str = None):
    try:
        #C:/Users/Jeremy/Desktop/sql-project-440823-043703ba649f.json C:/Users/zheng/Downloads/sql-project-440823-887aecfd7da3.json
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:/Users/Jeremy/Desktop/sql-project-440823-043703ba649f.json"
        google_credentials = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        if not google_credentials:
            raise Exception("GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.")
        
        client = bigquery.Client()
        start_time_dt = datetime.fromisoformat(start_time.replace("Z", "+00:00"))
        end_time_dt = datetime.fromisoformat(end_time.replace("Z", "+00:00"))
        start_time_str = start_time_dt.strftime("%Y-%m-%d %H:%M:%S")
        end_time_str = end_time_dt.strftime("%Y-%m-%d %H:%M:%S")
        
        query = f"""
        SELECT latitude, longitude, 1 as value
        FROM `bigquery-public-data.san_francisco.sfpd_incidents`
        WHERE ST_DISTANCE(ST_GEOGPOINT(longitude, latitude), ST_GEOGPOINT({lon}, {lat})) < 1000
        AND timestamp BETWEEN '{start_time_str}' AND '{end_time_str}'
        AND category != 'NON-CRIMINAL'
        """
        if category:
            query += f" AND category = '{category}'"
        
        logger.info(f"Running query: {query}")
        start_time = time.time()
        
        query_job = client.query(query)
        results = query_job.result()
        
        bytes_processed = query_job.total_bytes_processed
        end_time = time.time()
        execution_time = end_time - start_time
        data = [{"latitude": row.latitude, "longitude": row.longitude, "value": row.value} for row in results]
        logger.info(f"Query results: {data}")
        print(f"Query executed in {execution_time:.2f} seconds")
        print(f"Bytes processed: {bytes_processed} bytes")
        return {"data": data, "execution_time": execution_time, "bytes_processed": bytes_processed}
    except Exception as e:
        logger.error(f"Error fetching data: {e}")
        return {"error": str(e)}

@app.get("/data_partitioned")
async def get_data_partitioned(lat: float, lon: float, start_time: str, end_time: str, category: str = None):
    try:
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:/Users/Jeremy/Desktop/sql-project-440823-043703ba649f.json"
        google_credentials = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        if not google_credentials:
            raise Exception("GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.")
        
        client = bigquery.Client()
        start_time_dt = datetime.fromisoformat(start_time.replace("Z", "+00:00"))
        end_time_dt = datetime.fromisoformat(end_time.replace("Z", "+00:00"))
        start_time_str = start_time_dt.strftime("%Y-%m-%d %H:%M:%S")
        end_time_str = end_time_dt.strftime("%Y-%m-%d %H:%M:%S")
        
        query = f"""
        SELECT latitude, longitude, 1 as value
        FROM `sql-project-440823.clusteredsfpd.sfpd_incidents_partitioned_clustered`
        WHERE ST_DISTANCE(ST_GEOGPOINT(longitude, latitude), ST_GEOGPOINT({lon}, {lat})) < 1000
        AND timestamp BETWEEN '{start_time_str}' AND '{end_time_str}'
        AND category != 'NON-CRIMINAL'
        """
        if category:
            query += f" AND category = '{category}'"
        
        logger.info(f"Running query: {query}")
        start_time = time.time()
        
        query_job = client.query(query)
        results = query_job.result()
        
        bytes_processed = query_job.total_bytes_processed
        end_time = time.time()
        execution_time = end_time - start_time
        data = [{"latitude": row.latitude, "longitude": row.longitude, "value": row.value} for row in results]
        logger.info(f"Query results: {data}")
        print(f"Query executed in {execution_time:.2f} seconds")
        print(f"Bytes processed: {bytes_processed} bytes")
        return {"data": data, "execution_time": execution_time, "bytes_processed": bytes_processed}
    except Exception as e:
        logger.error(f"Error fetching data: {e}")
        return {"error": str(e)}