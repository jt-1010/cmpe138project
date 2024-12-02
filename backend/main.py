from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import bigquery
from datetime import datetime, timedelta
import os
import logging

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
async def get_data(lat: float, lon: float, time: str):
    try:
        # Set the environment variable directly in the code
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "C:/Users/Jeremy/Desktop/sql-project-440823-043703ba649f.json"
        
        # Verify that the environment variable is set
        google_credentials = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
        if not google_credentials:
            raise Exception("GOOGLE_APPLICATION_CREDENTIALS environment variable is not set.")
        
        print("GOOGLE_APPLICATION_CREDENTIALS:", google_credentials)
        
        # Strip milliseconds and timezone offset from the datetime string
        time = time.split('.')[0]
        
        client = bigquery.Client()
        time_dt = datetime.strptime(time, "%Y-%m-%dT%H:%M:%S")
        start_time = (time_dt - timedelta(hours=1)).time()
        end_time = (time_dt + timedelta(hours=1)).time()
        
        query = f"""
        SELECT latitude, longitude, 1 as value
        FROM `bigquery-public-data.san_francisco.sfpd_incidents`
        WHERE ST_DISTANCE(ST_GEOGPOINT(longitude, latitude), ST_GEOGPOINT({lon}, {lat})) < 1000
        AND TIME(timestamp) BETWEEN '{start_time}' AND '{end_time}'
        """
        logger.info(f"Running query: {query}")
        query_job = client.query(query)
        results = query_job.result()
        data = [{"latitude": row.latitude, "longitude": row.longitude, "value": row.value} for row in results]
        logger.info(f"Query results: {data}")
        return {"data": data}
    except Exception as e:
        logger.error(f"Error fetching data: {e}")
        return {"error": str(e)}