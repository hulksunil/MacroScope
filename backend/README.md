## How to run

Be sure to have python 3.10 or 3.11 (not above 3.12 and not below 3.9)

### virtual environment mode

I made a virtual environment using python 3.10 venv .venv  
Activate it using `.\.venv\Scripts\Activate.bat` if on cmd OR `.\.venv\Scripts\Activate.ps1` if on powershell and scripts have been enabled to be run

On MacOS : first: python -m venv venv (to create the environment)
then source venv/bin/activate

Then follow the remaining steps

#### to deactivate

`.\venv\Scripts\deactivate.bat` or `deactivate`

## common issues with running

### Error

[WinError 10061] No connection could be made because the target machine actively refused it (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms), Timeout: 30s, Topology Description: <TopologyDescription id: 67a32c154a432f967ee50ca5, topology_type: Unknown, servers: [<ServerDescription ('localhost', 27017) server_type: Unknown, rtt: None, error=AutoReconnect('localhost:27017: [WinError 10061] No connection could be made because the target machine actively refused it (configured timeouts: socketTimeoutMS: 20000.0ms, connectTimeoutMS: 20000.0ms)')>]

### solution

**Download the .env file, MAKE SURE ITS CALLED .env, then place the .env file in the /backend/ folder**

1. `pip install -r requirements.txt`
2. `python ./main.py`

### To Test classify

1. Open up cmd (**must be cmd**)
2. `curl -X POST -F "image=@./test_images/test-image-2.jpg" http://127.0.0.1:5001/classify`
3. `curl -X POST -F "image=@./test_images/test-image.jpg" http://127.0.0.1:5001/classify`

### To Test nutrition (must run classify first)

1. Open up cmd (**must be cmd**)
2. Set the `"food_item"` value in test_data.json to be the actual food item of the image that was sent to classify
3. `curl -X POST http://127.0.0.1:5001/nutrition -H "Content-Type: application/json" --data @test_data.json`
