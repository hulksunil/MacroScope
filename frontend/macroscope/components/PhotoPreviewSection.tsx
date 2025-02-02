import { Fontisto } from '@expo/vector-icons';
import { CameraCapturedPicture } from 'expo-camera';
import React from 'react';
import { TouchableOpacity, SafeAreaView, Image, StyleSheet, View, Text } from 'react-native';

const PhotoPreviewSection = ({
    photo,
    handleRetakePhoto,
    handleUploadPhoto
}: {
    photo: CameraCapturedPicture;
    handleRetakePhoto: () => void;
    handleUploadPhoto?: () => Promise<void>;
}) => (
    <SafeAreaView style={styles.container}>
        <View style={styles.box}>
            <Image
                style={styles.previewContainer}
                source={{ uri: photo.uri }}  // ✅ Using URI instead of base64
            />
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleRetakePhoto}>
                <Text>
                    <Fontisto name="trash" size={36} color="black" />
                </Text>
            </TouchableOpacity>

            {/* Upload Button */}
            {handleUploadPhoto && ( // ✅ Ensuring function exists before calling
                <TouchableOpacity onPress={handleUploadPhoto} style={styles.uploadButton}>
                    <Text style={{ color: 'white' }}>Upload Photo</Text>
                </TouchableOpacity>
            )}
        </View>
    </SafeAreaView>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
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
        width: '90%',
        height: '80%',
        borderRadius: 15
    },
    buttonContainer: {
        marginTop: '4%',
        flexDirection: 'row',
        justifyContent: "center",
        width: '100%',
    },
    button: {
        backgroundColor: 'gray',
        borderRadius: 25,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 28
    },
    uploadButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: 'blue',
        borderRadius: 8
    }
});

export default PhotoPreviewSection;
