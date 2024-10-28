import { StyleSheet, View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { router } from "expo-router";
import { useSessionState } from "../../provider";

const RegisterView = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { loading, user, message, register } = useSessionState();

  const onRegister = async () => {
    await register(name, email, password, confirmPassword); // Pasar confirmPassword aquí
  };

  useEffect(() => {
    if (user) {
      // Mostrar un mensaje de éxito durante 1 segundo antes de redirigir al usuario
      const timer = setTimeout(() => {
        router.push('/home');
      }, 3000); // 1000ms = 1 segundo

      // Limpiar el temporizador si el componente se desmonta antes de la redirección
      return () => clearTimeout(timer);
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create an Account</Text>
      </View>

      {message && typeof message === "string" && ( // Verificar que message sea una cadena
        <Text style={message === "Usuario registrado con éxito." ? styles.successMessage : styles.errorMessage}>
          {message}
        </Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry={true}
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.registerButton} onPress={onRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Register'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterView;

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  input: {
    width: '100%',
    padding: 15,
    borderColor: '#FFD700',
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  registerButton: {
    width: '100%',
    backgroundColor: '#FFD700',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  successMessage: {
    color: 'blue', // Estilo del mensaje de éxito
    marginBottom: 20,
  },
  errorMessage: {
    color: 'red', // Estilo del mensaje de error
    marginBottom: 20,
  },
});


