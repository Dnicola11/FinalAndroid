import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useContextoRepuestos } from '../contexto/ContextoRepuestos';
import { RootStackParamList } from '../tipos';

type PantallaRegistroProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PantallaRegistro'>;
};

export default function PantallaRegistro({ navigation }: PantallaRegistroProps) {
  const { registrarUsuario, usuario, cargando, error, limpiarError } = useContextoRepuestos();
  
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [mostrarConfirmarContrasena, setMostrarConfirmarContrasena] = useState(false);

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

  const manejarRegistro = async () => {
    // Validar campos vacíos
    if (!correo.trim() || !contrasena || !confirmarContrasena) {
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

    // Validar que las contraseñas coincidan
    if (contrasena !== confirmarContrasena) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      await registrarUsuario(correo.trim().toLowerCase(), contrasena);
      Alert.alert('Éxito', 'Usuario registrado correctamente');
      // La navegación se maneja automáticamente en el useEffect
    } catch (error) {
      // El error ya se maneja en el contexto
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.titulo}>Crear Cuenta</Text>
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
        <View style={styles.contenedorContrasena}>
          <TextInput
            style={styles.inputContrasena}
            placeholder="Confirmar contraseña"
            placeholderTextColor="#666"
            value={confirmarContrasena}
            onChangeText={setConfirmarContrasena}
            secureTextEntry={!mostrarConfirmarContrasena}
          />
          <TouchableOpacity
            style={styles.botonOjito}
            onPress={() => setMostrarConfirmarContrasena(!mostrarConfirmarContrasena)}
          >
            <Text style={styles.ojito}>👁️</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={[styles.boton, cargando && styles.botonDeshabilitado]} 
          onPress={manejarRegistro}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.textoBoton}>Registrarse</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.botonSecundario} 
          onPress={() => navigation.navigate('PantallaLogin')}
        >
          <Text style={styles.textoBotonSecundario}>¿Ya tienes cuenta? Inicia sesión</Text>
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
    marginBottom: 15,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
