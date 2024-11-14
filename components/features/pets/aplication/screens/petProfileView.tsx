import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { usePetProfile } from '../../provider';

const PetProfileView = () => {
    const { petId } = useLocalSearchParams();
    const router = useRouter();
    const {
        pet,
        loading,
        error,
        message,
        isEditModalOpen,
        fetchPetDetails,
        updatePet,
        deletePet,
        setEditModalOpen,
        clearMessage,
    } = usePetProfile();

    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        species: '',
        breed: '',
        color: '',
        birthDate: '',
    });

    useEffect(() => {
        if (petId) {
            fetchPetDetails(petId.toString());
        }
    }, [petId]);

    useEffect(() => {
        if (pet) {
            setEditForm({
                name: pet.name,
                species: pet.species,
                breed: pet.breed,
                color: pet.color,
                birthDate: pet.birthDate,
            });
        }
    }, [pet]);

    const handleDelete = () => {
        if (petId) {
            console.log('Esta disponible')
            deletePet(petId.toString());
            router.push('/home');
        }
    };
    
    const handleUpdate = async () => {
        if (petId) {
            if (!editForm.name || !editForm.species || !editForm.breed || !editForm.color || !editForm.birthDate) {
                alert("Por favor, completa todos los campos.");
                return;
            }
            await updatePet(petId.toString(), editForm);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Cargando detalles de la mascota...</Text>
            </View>
        );
    }

    if (!pet) {
        return (
            <View style={styles.container}>
                <Text>No se encontró la mascota</Text>
                {error && <Text style={styles.errorText}>{error}</Text>}
            </View>
        );
    }

    // InfoItem component
    const InfoItem = ({ icon, label, value }) => (
        <View style={styles.infoItem}>
            <FontAwesome5 name={icon} size={20} color="#FFD700" />
            <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>{label}:</Text>
                <Text style={styles.infoValue}>{value}</Text>
            </View>
        </View>
    );


    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton}
                        onPress={() => router.back()}
                    >
                        <MaterialIcons name="arrow-back" size={24} color="#FFD700" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Perfil de Mascota</Text>
                </View>

                {message && (
                    <View style={styles.messageContainer}>
                        <Text style={styles.messageText}>{message}</Text>
                        <TouchableOpacity onPress={clearMessage}>
                            <MaterialIcons name="close" size={20} color="#4CAF50" />
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.profileSection}>
                    <Text style={styles.petName}>{pet.name}</Text>
                </View>

                <View style={styles.infoSection}>
                    <InfoItem icon="paw" label="Especie" value={pet.species} />
                    <InfoItem icon="dog" label="Raza" value={pet.breed} />
                    <InfoItem icon="palette" label="Color" value={pet.color} />
                    <InfoItem icon="calendar-alt" label="Fecha de Nacimiento" value={pet.birthDate} />
                </View>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity 
                        style={[styles.actionButton, styles.editButton]}
                        onPress={() => setEditModalOpen(true)}
                    >
                        <MaterialIcons name="edit" size={24} color="#FFD700" />
                        <Text style={styles.actionButtonText}>Editar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => setDeleteModalOpen(true)}
                    >
                        <MaterialIcons name="delete" size={24} color="#FF0000" />
                        <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                            Eliminar
                        </Text>
                    </TouchableOpacity>

                    {/* Modal para confirmar eliminación */}
            <Modal
                visible={isDeleteModalOpen}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Confirmar eliminación</Text>
                        <Text>¿Estás seguro de que deseas eliminar esta mascota?</Text>
                        
                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setDeleteModalOpen(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.deleteConfirmButton]}
                                onPress={handleDelete}
                            >
                                <Text style={styles.modalButtonText}>Eliminar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
                </View>
            </ScrollView>

            <Modal
                visible={isEditModalOpen}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Mascota</Text>
                        
                        <TextInput
                            style={styles.input}
                            value={editForm.name}
                            onChangeText={(text) => setEditForm(prev => ({...prev, name: text}))}
                            placeholder="Nombre"
                        />
                        <TextInput
                            style={styles.input}
                            value={editForm.species}
                            onChangeText={(text) => setEditForm(prev => ({...prev, species: text}))}
                            placeholder="Especie"
                        />
                        <TextInput
                            style={styles.input}
                            value={editForm.breed}
                            onChangeText={(text) => setEditForm(prev => ({...prev, breed: text}))}
                            placeholder="Raza"
                        />
                        <TextInput
                            style={styles.input}
                            value={editForm.color}
                            onChangeText={(text) => setEditForm(prev => ({...prev, color: text}))}
                            placeholder="Color"
                        />
                        <TextInput
                            style={styles.input}
                            value={editForm.birthDate}
                            onChangeText={(text) => setEditForm(prev => ({...prev, birthDate: text}))}
                            placeholder="Fecha de Nacimiento"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.cancelButton]}
                                onPress={() => setEditModalOpen(false)}
                            >
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.saveButton]}
                                onPress={handleUpdate}
                            >
                                <Text style={styles.modalButtonText}>Guardar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

export default PetProfileView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 16,
        color: '#333',
    },
    profileSection: {
        alignItems: 'center',
        padding: 20,
    },
    petImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 16,
    },
    petName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#b57c00',
    },
    infoSection: {
        padding: 20,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        backgroundColor: '#f9f9f9',
        padding: 12,
        borderRadius: 8,
    },
    infoTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
    },
    infoValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 8,
        minWidth: 120,
        justifyContent: 'center',
    },
    editButton: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    deleteButton: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#FF0000',
    },
    deleteConfirmButton: {
        backgroundColor: '#FF0000',
    },
    actionButtonText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#FFD700',
        fontWeight: 'bold',
    },
    deleteButtonText: {
        color: '#FF0000',
    },
    errorText: {
        color: '#FF0000',
        textAlign: 'center',
        marginTop: 20,
    },
    messageText: {
        color: '#4CAF50',
        textAlign: 'center',
        margin: 20,
    },
    button: {
        backgroundColor: '#FFD700',
        padding: 12,
        borderRadius: 8,
        marginTop: 12,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    // ... (estilos anteriores) ...
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    modalButton: {
        padding: 12,
        borderRadius: 8,
        flex: 0.45,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#f0f0f0',
    },
    saveButton: {
        backgroundColor: '#FFD700',
    },
    modalButtonText: {
        fontWeight: 'bold',
        color: '#333',
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#E8F5E9',
        padding: 10,
        margin: 10,
        borderRadius: 8,
    },
   
});