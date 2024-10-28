import { Link } from "expo-router";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useEffect } from "react";
import { router } from "expo-router";
import { useSessionState } from "../../../auth/provider";
import {
    FontAwesome5,
    MaterialIcons,
    Ionicons
} from '@expo/vector-icons';

export function HomeView() {
    const {
        user,
        logout
    } = useSessionState();

    useEffect(() => {
        if (!user) {
            router.push('/auth/login');
        }
    }, [user]);

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={{ color: '#FFD700', marginBottom: 20 }}>Usuario no autenticado</Text>
                <Link href={"/auth/login"} style={styles.buttonText}>Ir al login</Link>
            </View>
        );
    }

    return (
        <View style={styles.mainContainer}>
            {/* Navbar con iconos */}
            <View style={styles.navbar}>
                <Link href={"/vaccinationsRecord"} asChild>
                    <TouchableOpacity style={styles.navButton}>
                        <View style={styles.navItem}>
                            <FontAwesome5 name="syringe" size={24} color="#fff" />
                            <Text style={styles.navText}>Vacunas</Text>
                        </View>
                    </TouchableOpacity>
                </Link>

                <Link href={"/treatments"} asChild>
                    <TouchableOpacity style={styles.navButton}>
                        <View style={styles.navItem}>
                            <FontAwesome5 name="pills" size={24} color="#fff" />
                            <Text style={styles.navText}>Tratamientos</Text>
                        </View>
                    </TouchableOpacity>
                </Link>

                <Link href={"/home"} asChild>
                    <TouchableOpacity style={styles.navButton}>
                        <View style={styles.navItem}>
                            <Ionicons name="home" size={24} color="#fff" />
                            <Text style={styles.navText}>Home</Text>
                        </View>
                    </TouchableOpacity>
                </Link>

                <Link href={"/consultations"} asChild>
                    <TouchableOpacity style={styles.navButton}>
                        <View style={styles.navItem}>
                            <FontAwesome5 name="clipboard-list" size={24} color="#fff" />
                            <Text style={styles.navText}>Consultas</Text>
                        </View>
                    </TouchableOpacity>
                </Link>


                <Link href={"/activities"} asChild>
                    <TouchableOpacity style={styles.navButton}>
                        <View style={styles.navItem}>
                            <MaterialIcons name="local-activity" size={24} color="#fff" />
                            <Text style={styles.navText}>Actividades</Text>
                        </View>
                    </TouchableOpacity>
                </Link>
            </View>

            <View style={styles.container}>
                <Text style={styles.name}>Bienvenido, {user?.email}</Text>
                <Text style={styles.nameText}>Mis mascostas</Text>

                <View style={styles.imageContainer}>
                    <Image
                        source={require('../../../../../assets/images/dog.jpeg')}
                        style={styles.centralImage}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.bottomButtons}>
                    <TouchableOpacity style={[styles.actionButton, styles.addButton]}>
                        <MaterialIcons name="pets" size={24} color="#FFD700" />
                        <Text style={styles.actionButtonText}>Agregar Mascota</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={logout}>
                        <MaterialIcons name="logout" size={24} color="#FF0000" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 10,
    },
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#ecab0f',
        paddingVertical: 2,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        paddingTop: 20, // Para iOS status bar
    },
    navButton: {
        padding: 8,
        minWidth: 60, // Asegura un ancho mínimo para el contenido
    },
    navItem: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50, // Altura fija para mantener consistencia
    },
    navText: {
        color: '#fff',
        fontSize: 12,
        marginTop: 8, // Más espacio entre el icono y el texto
        textAlign: 'center',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 5,
        color: '#FFD700',
    },
    nameText: {
        fontSize: 18,
        fontWeight: 'bold',
        // marginTop: 5,
        // marginBottom: 5,
        color: '#FFD700',
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        maxHeight: '50%',
        marginVertical: 4,
    },
    centralImage: {
        width: '80%',
        height: '80%',
        borderRadius: 50,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonText: {
        color: '#FFD700',
        fontSize: 18,
        fontWeight: 'bold',
    },
    bottomButtons: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
    },
    actionButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    addButton: {
        flexDirection: 'row',
        gap: 8,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#FFD700',
    },
    actionButtonText: {
        color: '#FFD700',
        fontSize: 14,
        fontWeight: 'bold',
    },
    // Modifica el estilo existente del logoutButton eliminando las propiedades de posición
    logoutButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
});