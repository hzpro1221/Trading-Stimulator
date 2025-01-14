from flask import *
import asyncio
import random
import g4f

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



@app.route('/api/route', methods=['POST'])
def predict():
    data = request.get_json()
    if not data or 'request' not in data:
        return jsonify({"error": "Missing 'request' in request"}), 400

    response = asyncio.run(gpt4FreeApiCallFunction([data['request']]))
    while ("Unusual activity" in str(response[0])) or ("Request ended with status code 404" in str(response[0])):
        response = asyncio.run(gpt4FreeApiCallFunction([data['request']]))
    
    return jsonify({"message": response})
