


## How to run
Be sure to have python 3.10 or 3.11 (not above 3.12 and not below 3.9)

**Place the .env file in the /backend/ folder**

1) `pip install -r requirements.txt`  
2) `python ./main.py`

### To Test classify 
1) Open up cmd (**must be cmd**)
2) `curl -X POST -F "image=@./test_images/test-image-2.jpg" http://127.0.0.1:5000/classify`
3) `curl -X POST -F "image=@./test_images/test-image.jpg" http://127.0.0.1:5000/classify`

### To Test nutrition (must run classify first)
1) Open up cmd (**must be cmd**)
2) Set the `"food_item"` value in test_data.json to be the actual food item of the image that was sent to classify  
3) `curl -X POST http://127.0.0.1:5000/nutrition -H "Content-Type: application/json" --data @test_data.json`
