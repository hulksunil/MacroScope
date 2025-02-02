import PhotoPreviewSection from '@/components/PhotoPreviewSection';
import { AntDesign } from '@expo/vector-icons';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import axios from 'axios';
import { useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function Camera() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState<any>(null);
  const [predictions, setPredictions] = useState<string[]>([]); // Stores the food predictions array
  const [selectedFood, setSelectedFood] = useState<string | null>(null); // Tracks user's selected food
  const [photoConfirmed, setPhotoConfirmed] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const cameraRef = useRef<CameraView | null>(null);

  useEffect(() => {
    if (predictions.length > 0) {
      console.log("Predictions updated:", predictions); // Debugging
    }
  }, [predictions]); // ✅ Runs when predictions update

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }


  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  const handleTakePhoto =  async () => {
    if (cameraRef.current) {
        const options = {
            quality: 1,
            base64: true,
            exif: false,
        };
        const takedPhoto = await cameraRef.current.takePictureAsync(options);

        setPhoto(takedPhoto);
    }
  }; 

  const handleRetakePhoto = () => setPhoto(null);


  const handleUploadPhoto = async () => {
    if (!photo) return;
  
    const fileUri = photo.uri; // File path
    const fileName = 'image.jpg';
  
    // Fetch the image as a Blob from the URI
    const response = await fetch(photo.uri);
    const blob = await response.blob();
  
  
    // Create FormData for the file
    const formData = new FormData();
    
    formData.append('image', {
      uri: fileUri, // ✅ Correct way to send file in React Native
      name: fileName,
      type: 'image/jpeg',
    } as any); // ✅ Type assertion to avoid TypeScript error
  
    try {
      //172.20.10.3 -> My(Assane) Mac's IP address
      const response = await axios.post('http://172.20.10.3:5001/classify', formData);

      setPredictions(response.data.top_5_predictions); 
      console.log(predictions)

      // user has chosen to upload the file
      setIsUploaded(true);
  
      console.log('Response from server:', response.data);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };
  

  // 👇 Handles food item selection by user
const handleSelectFood = (food: string) => {
  setSelectedFood(food);
};

// 👇 Submits the selected food to the backend
const handleSubmitFood = async () => {
  if (!selectedFood) return;

  try {
    // 👇 Send selection to new endpoint
    const response = await axios.post('http://172.20.10.3:5001/nutrition', {
      food_item: selectedFood
    });
    
    console.log('Submission response:', response.data);
    alert('Selection submitted successfully!');


    setPhoto(null);
    setPredictions([]);
    setSelectedFood(null);
    setPhotoConfirmed(false);
    setIsUploaded(false);
    
  } catch (error) {
    console.error('Submission failed:', error);
    alert('Submission failed. Please try again.');
  }
};

  
  if (photo) {
    return <PhotoPreviewSection 
    photo={photo} 
    handleRetakePhoto={handleRetakePhoto}
    handleUploadPhoto={handleUploadPhoto}
    predictions={predictions}         
    selectedFood={selectedFood}       
    handleSelectFood={handleSelectFood}
    handleSubmitFood={handleSubmitFood}
    photoConfirmed={photoConfirmed}  // Pass state
    setPhotoConfirmed={setPhotoConfirmed} // Pass function to update it
    isUploaded={isUploaded}
/>
}

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <AntDesign name='retweet' size={44} color='black' />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleTakePhoto}>
            <AntDesign name='camera' size={44} color='black' />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: 'gray',
    borderRadius: 10,
    marginBottom: 28
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});