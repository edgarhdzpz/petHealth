import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSessionState } from '../../../auth/provider';
import { Link, router, useRootNavigationState } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

export function PetView ()  {
    const { addPet, user, message, loading } = useSessionState();
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('Perro'); // Valor por defecto
    // const [species, setSpecies] = useState('');
    const [breed, setBreed] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [color, setColor] = useState('');
    const navigationState = useRootNavigationState();

    useEffect(() => {
        if (navigationState?.key && !user) { // Espera a que la navegación esté lista y el usuario no esté autenticado
            router.replace('/auth/login');
        } 
    }, [navigationState?.key, user]);

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={{ color: '#FFD700', marginBottom: 20 }}>Usuario no autenticado</Text>
                <Link href={"/auth/login"} style={styles.buttonText}>Ir al login</Link>
            </View>
        );
    }
    
    const handleAddPet = () => {
        // Convertimos birthDate a formato ISO (siempre considera que birthDate tiene formato YYYY-MM-DD)
        const formattedBirthDate = new Date(birthDate).toISOString(); 
        addPet(name, species, breed, formattedBirthDate, color);
        router.push('/home');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Agregar Mascota</Text>
            {message && <Text style={styles.message}>{message}</Text>}

            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={name}
                onChangeText={setName}
            />
            <Text>Especie</Text>
            <Picker
                selectedValue={species}
                style={styles.picker}
                onValueChange={(itemValue) => setSpecies(itemValue)}
            >
                <Picker.Item label="Perro" value="Perro" />
                <Picker.Item label="Gato" value="Gato" />
            </Picker>
            <TextInput
                style={styles.input}
                placeholder="Raza"
                value={breed}
                onChangeText={setBreed}
            />
            <TextInput
                style={styles.input}
                placeholder="Fecha de nacimiento (YYYY-MM-DD)"
                value={birthDate}
                onChangeText={setBirthDate}
            />
            <TextInput
                style={styles.input}
                placeholder="Color"
                value={color}
                onChangeText={setColor}
            />

            <TouchableOpacity style={styles.button} onPress={handleAddPet} disabled={loading}>
                <Text style={styles.buttonText}>{loading ? 'Agregando...' : 'Agregar Mascota'}</Text>
            </TouchableOpacity>
        </View>
    );
};

// export default PetView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#FFD700',
    },
    message: {
        fontSize: 14,
        color: 'red',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    picker: {
        height: 40,
        // width: '100%',
        fontSize: 13,
        // fontWeight: 'bold',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#FFD700',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});