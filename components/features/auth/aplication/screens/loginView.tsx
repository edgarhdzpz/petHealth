import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { FC, useEffect, useState } from "react";
import { Link, router } from "expo-router";
import { useSessionState } from "../../provider";

const LoginView = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loading, user, message, login } = useSessionState();

  const onLogin = async () => {
    await login(email, password);
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
        <Text style={styles.title}>Welcome Back!</Text>
      </View>

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

      {/* Mostrar mensaje de error */}
      {message && (
        <Text style={message === "Usuario autenticado." ? styles.successMessage : styles.errorMessage}>
          {message}
        </Text>
      )}

      <TouchableOpacity style={styles.signInButton} onPress={onLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account?</Text>
        <TouchableOpacity onPress={() => router.push('/auth/register')}>
          <Text style={styles.linkText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginView;

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
  errorMessage: {
    color: '#FF0000', // Color rojo para el mensaje de error
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  successMessage: {
    color: '#0000FF', // Azul para mensajes de éxito (puedes cambiar a otro tono de azul si deseas)
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
  },
  signInButton: {
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
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: '#000',
  },
  linkText: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: 'bold',
  },
});
import { create } from "react-test-renderer";
