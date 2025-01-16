from flask import *
import os
import asyncio
import random
import g4f
import csv
import math

app = Flask(__name__) 

async def gpt4FreeApiCallFunction(requests):
    async def process_api_request(request, index):
        while True:
            try:
                await asyncio.sleep(random.randint(10, 20))
                print(f"Started API request of index: {index}.")
                response = await g4f.ChatCompletion.create_async(
                    model="gpt-4o-mini",
                    messages=[{"role": "user", "content": request}],
                )
                if len(response) == 0:
                    continue
                print(response[0])
                print(f"Completed API request of index: {index}")
                return response
            except Exception as e:
                print(f"Request of index {index} - Error: {str(e)}")
                await asyncio.sleep(10)    
    tasks = []
    for index, request in enumerate(requests):
        tasks.append(process_api_request(request, index))
    return await asyncio.gather(*tasks, return_exceptions=True)


@app.route('/api/gpt', methods=['POST'])
def generate():
    data = request.get_json()
    if not data or 'request' not in data:
        return jsonify({"error": "Missing 'request' in request"}), 400

    response = asyncio.run(gpt4FreeApiCallFunction([data['request']]))
    while ("Unusual activity" in str(response[0])) or ("Request ended with status code 404" in str(response[0])):
        response = asyncio.run(gpt4FreeApiCallFunction([data['request']]))
    
    return jsonify({"message": response})

@app.route('/api/uploadData', methods=['POST'])
def uploadData():
    uploadedFile = request.files['file']
    file_extension = uploadedFile.filename.rsplit('.', 1)[1].lower()
    if (file_extension == 'csv'):
        uploadedFile.save(os.path.join('inputFile/', "data.csv"))
        return {'data': 'file upload sucess'}
    else:
        return {'data': 'Data must be .csv extension'}, 400

@app.route('/api/uploadCode', methods=['POST'])
def uploadCode():
    uploadedFile = request.files['file']
    file_extension = uploadedFile.filename.rsplit('.', 1)[1].lower()
    if (file_extension == 'py'):
        uploadedFile.save(os.path.join('inputFile/', "code.py"))
        csvFile = csv.reader(os.path.join('inputFile/', "code.py"))
        for lines in csvFile:
            print(lines)

        return {'data': 'file upload sucess'}
    else:
        return {'data': 'Data must be .py extension'}, 400

@app.route('/api/evaluate')
def evaluate():
    dataPath = os.path.join('inputFile/', "data.csv")
    codePath = os.path.join('inputFile/', "code.py")

    dataChunk = 2
    with open(dataPath, 'r', newline='', encoding='utf-8') as csvfile:
        dataList = list(csv.reader(csvfile))
    
    from inputFile.code import tradingAgorithm

    dataLen = len(dataList)
    for i in range(dataLen - dataChunk):
        endIndex = (i + 1) * dataChunk
        tradingAgorithm(dataList[i:(i + dataChunk)], i, dataChunk)
    return {'data': 'file upload sucess'}


    