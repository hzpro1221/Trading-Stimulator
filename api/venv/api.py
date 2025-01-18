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

def promptingData(request):
    codePath = os.path.join('inputFile/', "code.py")
    with open(codePath, 'r') as file:
        content = file.read()
    prompt = f"""
You are a assistent. Your job is to helping people improve their trading agorithm. Here is the user's trading agorithm
{content}

Here is user request:
{request}

If user asking question not relevant to trading problem, answer: "Please asking question relevant to your code".
"""
    return [prompt]
    

@app.route('/api/gpt', methods=['POST'])
def generate():
    data = request.get_json()
    if not data or 'request' not in data:
        return jsonify({"error": "Missing 'request' in request"}), 400

    response = asyncio.run(gpt4FreeApiCallFunction(promptingData(data['request'])))
    while ("Unusual activity" in str(response[0])) or ("Request ended with status code 404" in str(response[0])):
        response = asyncio.run(gpt4FreeApiCallFunction(promptingData(data['request'])))
    
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

    dataChunk = 10
    with open(dataPath, 'r', newline='', encoding='utf-8') as csvfile:
        dataPoint = list(csv.reader(csvfile))

    from inputFile.code import tradingAgorithm

    dataLen = len(dataPoint)
    actions = []
    for i in range(dataLen - dataChunk):
        endIndex = (i + 1) * dataChunk
        actions += tradingAgorithm(dataPoint[i:(i + dataChunk)], i, dataChunk)
    return jsonify({'dataPoint': dataPoint, 'tradingDecisions': actions})
