import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useContextoRepuestos } from '../contexto/ContextoRepuestos';
import { RootStackParamList } from '../tipos';

type PantallaLoginProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PantallaLogin'>;
};

export default function PantallaLogin({ navigation }: PantallaLoginProps) {
  const { iniciarSesion, recuperarContrasena, usuario, cargando, error, limpiarError } = useContextoRepuestos();
  
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (usuario) {
      navigation.replace('TabsNavegacion');
    }
  }, [usuario]);

  // Mostrar errores
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK', onPress: limpiarError }]);
    }
  }, [error]);

  const validarEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const manejarInicioSesion = async () => {
    // Validar campos vacíos
    if (!correo.trim() || !contrasena) {
      Alert.alert('Error', 'Por favor complete todos los campos');
      return;
    }

    // Validar formato de email
    if (!validarEmail(correo.trim())) {
      Alert.alert('Error', 'Por favor ingrese un correo electrónico válido');
      return;
    }

    // Validar longitud mínima de contraseña
    if (contrasena.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      await iniciarSesion(correo.trim().toLowerCase(), contrasena);
      // La navegación se maneja automáticamente en el useEffect
    } catch (error) {
      // El error ya se maneja en el contexto
    }
  };

  const manejarRecuperarContrasena = async () => {
    if (!correo.trim()) {
      Alert.alert('Error', 'Por favor ingrese su correo electrónico');
      return;
    }

    if (!validarEmail(correo.trim())) {
      Alert.alert('Error', 'Por favor ingrese un correo electrónico válido');
      return;
    }

    try {
      await recuperarContrasena(correo.trim().toLowerCase());
      Alert.alert(
        'Correo Enviado',
        'Se ha enviado un enlace de recuperación a su correo electrónico. Revise su bandeja de entrada.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      // El error ya se maneja en el contexto
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.titulo}>Gestión de Repuestos</Text>
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          placeholderTextColor="#666"
          value={correo}
          onChangeText={setCorreo}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <View style={styles.contenedorContrasena}>
          <TextInput
            style={styles.inputContrasena}
            placeholder="Contraseña"
            placeholderTextColor="#666"
            value={contrasena}
            onChangeText={setContrasena}
            secureTextEntry={!mostrarContrasena}
          />
          <TouchableOpacity
            style={styles.botonOjito}
            onPress={() => setMostrarContrasena(!mostrarContrasena)}
          >
            <Text style={styles.ojito}>👁️</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={[styles.boton, cargando && styles.botonDeshabilitado]} 
          onPress={manejarInicioSesion}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.textoBoton}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.botonRecuperar} 
          onPress={manejarRecuperarContrasena}
          disabled={cargando}
        >
          <Text style={styles.textoBotonRecuperar}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.botonSecundario} 
          onPress={() => navigation.navigate('PantallaRegistro')}
        >
          <Text style={styles.textoBotonSecundario}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#000',
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 16,
    color: '#000',
  },
  contenedorContrasena: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
    marginBottom: 15,
  },
  inputContrasena: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#000',
  },
  botonOjito: {
    padding: 15,
  },
  ojito: {
    fontSize: 18,
  },
  boton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botonRecuperar: {
    padding: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotonRecuperar: {
    color: '#007AFF',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  botonSecundario: {
    padding: 15,
    alignItems: 'center',
  },
  textoBotonSecundario: {
    color: '#666',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
});
