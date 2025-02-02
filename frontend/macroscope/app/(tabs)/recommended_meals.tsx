import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const RecommendedMeals = () => {
    const [meals, setMeals] = useState([]);

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const response = await axios.get('https://172.20.10.3:5001/meal_suggestions');
                setMeals(response.data);
            } catch (error) {
                console.error('Error fetching meals:', error);
            }
        };
        fetchMeals();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recommended Meals for Today</Text>
            <FlatList
                data={meals}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View>
                        <Text style={styles.mealText}>{item}</Text>
                        <View style={styles.breakline} />
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    mealText: {
        fontSize: 18,
        marginVertical: 10,
    },
    breakline: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 10,
    },
});

export default RecommendedMeals;
