import { Fontisto } from '@expo/vector-icons';
import { CameraCapturedPicture } from 'expo-camera';
import React from 'react';
import { TouchableOpacity, SafeAreaView, Image, StyleSheet, View, Text, FlatList } from 'react-native';

const PhotoPreviewSection = ({
    photo,
    handleRetakePhoto,
    handleUploadPhoto,
    predictions,
    selectedFood,
    handleSelectFood,
    handleSubmitFood,
    photoConfirmed,
    setPhotoConfirmed,
    isUploaded
}: {
    photo: CameraCapturedPicture;
    handleRetakePhoto: () => void;
    handleUploadPhoto?: () => Promise<void>;
    predictions: string[];
    selectedFood: string | null;
    handleSelectFood: (food: string) => void;
    handleSubmitFood: () => Promise<void>;
    photoConfirmed: boolean;
    setPhotoConfirmed: (confirmed: boolean) => void;
    isUploaded: boolean;
}) => (
    <SafeAreaView style={styles.container}>
        <View style={styles.box}>
            <Image
                style={styles.previewContainer}
                source={{ uri: photo.uri }}  
            />
        </View>

        {/* Show confirm & retake options before processing */}
        {!photoConfirmed ? (
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={handleRetakePhoto}>
                    <Text>
                        <Fontisto name="trash" size={36} color="black" />
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.uploadButton} onPress={() => setPhotoConfirmed(true)}>
                    <Text style={{ color: 'white' }}>Confirm</Text>
                </TouchableOpacity>
            </View>
        ) : (
            <>
                {/* Upload Button (only shown before predictions are loaded) */}
                {handleUploadPhoto && predictions.length === 0 && (
                    <TouchableOpacity onPress={handleUploadPhoto} style={styles.uploadButton}>
                        <Text style={{ color: 'white' }}>Upload Photo</Text>
                    </TouchableOpacity>
                )}

                {/* Show food choices only after uploading */}
                {predictions.length > 0 && (
                    <>
                        <Text style={{ color: 'white', fontSize: 18, marginTop: 10 }}>Select Food:</Text>
                        <FlatList
                            data={predictions}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    style={[
                                        styles.foodItem,
                                        selectedFood === item && styles.selectedFoodItem
                                    ]}
                                    onPress={() => handleSelectFood(item)}
                                >
                                    <Text style={{ color: 'white' }}>{item}</Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item}
                        />

                        {/* Submit button centered below the list */}
                        {selectedFood && (
                            <View style={styles.submitContainer}>
                                <TouchableOpacity onPress={handleSubmitFood} style={styles.submitButton}>
                                    <Text style={{ color: 'white' }}>Submit Selection</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </>
                )}
            </>
        )}
    </SafeAreaView>
);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 20,
    },
    box: {
        borderRadius: 15,
        padding: 1,
        width: '97%',
        backgroundColor: 'darkgray',
        justifyContent: 'center',
        alignItems: "center",
    },
    previewContainer: {
        width: '100%', 
        height: 400,  // ✅ Large size before upload
        borderRadius: 15,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    smallPreviewContainer: {
        width: '100%', 
        height: 200,  // ✅ Smaller size after upload
        borderRadius: 15,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: "center",
        width: '100%',
        marginTop: 10, 
    },
    button: {  
        backgroundColor: 'gray',
        borderRadius: 25,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 10,
    },
    uploadButton: {
        padding: 10,
        backgroundColor: 'blue',
        borderRadius: 8,
        marginHorizontal: 10,
    },
    foodItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    selectedFoodItem: {
        backgroundColor: '#e0e0e0',
    },
    submitContainer: {
        alignItems: 'center', // Center the button
        marginBottom: 50
    },
    submitButton: {
        padding: 12,
        backgroundColor: 'blue',
        borderRadius: 8,
        width: '50%', // Ensure proper sizing
        alignItems: 'center',
    }
});


export default PhotoPreviewSection;
