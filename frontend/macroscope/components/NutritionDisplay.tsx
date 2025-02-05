import { CameraCapturedPicture } from 'expo-camera';
import React from 'react';
import { SafeAreaView, Image, StyleSheet, View, Text } from 'react-native';

const NutritionDisplay = ({
    photo,
    nutritionData
}: {
    photo?: CameraCapturedPicture | null;  // Allow photo to be null or undefined
    nutritionData?: any;
}) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.box}>
                {photo?.uri ? (
                    <Image style={styles.previewContainer} source={{ uri: photo.uri }} />
                ) : (
                    <Text style={{ color: 'white' }}>No image available</Text>
                )}
            </View>

            {nutritionData && (
                <View style={styles.nutritionBox}>
                    <Text style={styles.nutritionTitle}>Nutrition Facts</Text>
                    <Text style={styles.nutritionText}>Calories: {nutritionData.nutrition_info.calories}</Text>
                    <Text style={styles.nutritionText}>Protein: {nutritionData.nutrition_info.protein_g}g</Text>
                    <Text style={styles.nutritionText}>Carbs: {nutritionData.nutrition_info.carbs_g}g</Text>
                    <Text style={styles.nutritionText}>Fiber: {nutritionData.nutrition_info.fiber_g}g</Text>
                    <Text style={styles.nutritionText}>Fats: {nutritionData.nutrition_info.fat_g}g</Text>
                </View>
            )}
        </SafeAreaView>
    );
};


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
        height: 400,
        borderRadius: 15,
        resizeMode: 'contain',
        marginBottom: 10,
    },
    nutritionBox: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 15,
        borderRadius: 10,
        marginTop: 15,
        width: '90%',
        alignItems: 'center',
    },
    nutritionTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    nutritionText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
});

export default NutritionDisplay;
