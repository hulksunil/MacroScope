

## How to run
1) `pip install -r requirements.txt`  
2) `python ./main.py`

### To Test  
1) Open up cmd (**must be cmd**)
2) curl -X POST -F "image=@./test_images/test-image-2.jpg" http://127.0.0.1:5000/classify
3) curl -X POST -F "image=@./test_images/test-image.jpg" http://127.0.0.1:5000/classify