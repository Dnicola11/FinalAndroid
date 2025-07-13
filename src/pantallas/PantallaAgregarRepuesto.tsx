import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useContextoRepuestos } from '../contexto/ContextoRepuestos';
import { RootStackParamList, FormularioRepuesto } from '../tipos';

type PantallaAgregarRepuestoProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PantallaAgregarRepuesto'>;
};

export default function PantallaAgregarRepuesto({ navigation }: PantallaAgregarRepuestoProps) {
  const { agregarRepuesto, subirImagen, cargando, error, limpiarError } = useContextoRepuestos();

  const [formulario, setFormulario] = useState<FormularioRepuesto>({
    nombre: '',
    descripcion: '',
    cantidad: '',
    precio: '',
    imagenUri: undefined,
  });

  const [erroresValidacion, setErroresValidacion] = useState<Partial<FormularioRepuesto>>({});

  useEffect(() => {
    navigation.setOptions({
      title: 'Agregar Repuesto',
    });
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK', onPress: limpiarError }]);
    }
  }, [error]);

  const validarFormulario = (): boolean => {
    const errores: Partial<FormularioRepuesto> = {};

    if (!formulario.nombre.trim()) {
      errores.nombre = 'El nombre es requerido';
    }

    if (!formulario.descripcion.trim()) {
      errores.descripcion = 'La descripción es requerida';
    }

    if (!formulario.cantidad.trim()) {
      errores.cantidad = 'La cantidad es requerida';
    } else {
      const cantidad = parseInt(formulario.cantidad);
      if (isNaN(cantidad) || cantidad < 0) {
        errores.cantidad = 'La cantidad debe ser un número válido mayor o igual a 0';
      }
    }

    if (!formulario.precio.trim()) {
      errores.precio = 'El precio es requerido';
    } else {
      const precio = parseFloat(formulario.precio);
      if (isNaN(precio) || precio < 0) {
        errores.precio = 'El precio debe ser un número válido mayor o igual a 0';
      }
    }

    setErroresValidacion(errores);
    return Object.keys(errores).length === 0;
  };

  const seleccionarImagen = async () => {
    try {
      // Solicitar permisos
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permisos requeridos',
          'Se necesitan permisos para acceder a la galería de fotos.'
        );
        return;
      }

      // Abrir selector de imágenes
      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!resultado.canceled && resultado.assets[0]) {
        setFormulario(prev => ({
          ...prev,
          imagenUri: resultado.assets[0].uri,
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const tomarFoto = async () => {
    try {
      // Solicitar permisos de cámara
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permisos requeridos',
          'Se necesitan permisos para acceder a la cámara.'
        );
        return;
      }

      // Abrir cámara
      const resultado = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!resultado.canceled && resultado.assets[0]) {
        setFormulario(prev => ({
          ...prev,
          imagenUri: resultado.assets[0].uri,
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo tomar la foto');
    }
  };

  const mostrarOpcionesImagen = () => {
    Alert.alert(
      'Seleccionar Imagen',
      'Elige una opción',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Galería', onPress: seleccionarImagen },
        { text: 'Cámara', onPress: tomarFoto },
      ]
    );
  };

  const eliminarImagen = () => {
    setFormulario(prev => ({
      ...prev,
      imagenUri: undefined,
    }));
  };

  const manejarGuardar = async () => {
    if (!validarFormulario()) {
      return;
    }

    try {
      let imagenUrl: string | undefined;

      // Intentar subir imagen si existe
      if (formulario.imagenUri) {
        try {
          console.log('Intentando subir imagen...');
          imagenUrl = await subirImagen(formulario.imagenUri);
          console.log('Imagen subida exitosamente');
        } catch (errorImagen: any) {
          console.warn('Error al subir imagen, guardando repuesto sin imagen:', errorImagen);
          
          // Mostrar alerta pero continuar sin imagen
          Alert.alert(
            'Advertencia',
            'No se pudo subir la imagen, pero el repuesto se guardará sin imagen. ¿Continuar?',
            [
              { text: 'Cancelar', style: 'cancel' },
              { 
                text: 'Continuar', 
                onPress: async () => {
                  await guardarRepuestoSinImagen();
                }
              }
            ]
          );
          return;
        }
      }

      // Crear repuesto
      await agregarRepuesto({
        nombre: formulario.nombre.trim(),
        descripcion: formulario.descripcion.trim(),
        cantidad: parseInt(formulario.cantidad),
        precio: parseFloat(formulario.precio),
        imagenUrl,
      });

      Alert.alert(
        'Éxito',
        'Repuesto agregado correctamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error al guardar repuesto:', error);
    }
  };

  const guardarRepuestoSinImagen = async () => {
    try {
      await agregarRepuesto({
        nombre: formulario.nombre.trim(),
        descripcion: formulario.descripcion.trim(),
        cantidad: parseInt(formulario.cantidad),
        precio: parseFloat(formulario.precio),
        imagenUrl: undefined,
      });

      Alert.alert(
        'Éxito',
        'Repuesto agregado correctamente (sin imagen)',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error al guardar repuesto sin imagen:', error);
    }
  };

  const actualizarCampo = (campo: keyof FormularioRepuesto, valor: string) => {
    setFormulario(prev => ({
      ...prev,
      [campo]: valor,
    }));

    // Limpiar error de validación si existe
    if (erroresValidacion[campo]) {
      setErroresValidacion(prev => ({
        ...prev,
        [campo]: undefined,
      }));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Sección de imagen */}
        <View style={styles.seccionImagen}>
          <Text style={styles.etiquetaSeccion}>Imagen del Repuesto</Text>
          {formulario.imagenUri ? (
            <View style={styles.contenedorImagenSeleccionada}>
              <Image source={{ uri: formulario.imagenUri }} style={styles.imagenSeleccionada} />
              <TouchableOpacity style={styles.botonEliminarImagen} onPress={eliminarImagen}>
                <Text style={styles.textoEliminarImagen}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.botonSeleccionarImagen} onPress={mostrarOpcionesImagen}>
              <Text style={styles.iconoImagen}>📷</Text>
              <Text style={styles.textoSeleccionarImagen}>Agregar Imagen</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Formulario */}
        <View style={styles.formulario}>
          <View style={styles.campo}>
            <Text style={styles.etiqueta}>Nombre *</Text>
            <TextInput
              style={[styles.input, erroresValidacion.nombre ? styles.inputError : null]}
              placeholder="Ej: Filtro de aceite"
              value={formulario.nombre}
              onChangeText={(texto) => actualizarCampo('nombre', texto)}
              maxLength={100}
            />
            {erroresValidacion.nombre && (
              <Text style={styles.textoError}>{erroresValidacion.nombre}</Text>
            )}
          </View>

          <View style={styles.campo}>
            <Text style={styles.etiqueta}>Descripción *</Text>
            <TextInput
              style={[styles.inputMultilinea, erroresValidacion.descripcion ? styles.inputError : null]}
              placeholder="Describe las características del repuesto..."
              value={formulario.descripcion}
              onChangeText={(texto) => actualizarCampo('descripcion', texto)}
              multiline
              numberOfLines={4}
              maxLength={500}
              textAlignVertical="top"
            />
            {erroresValidacion.descripcion && (
              <Text style={styles.textoError}>{erroresValidacion.descripcion}</Text>
            )}
          </View>

          <View style={styles.filaDoble}>
            <View style={[styles.campo, styles.campoMitad]}>
              <Text style={styles.etiqueta}>Cantidad *</Text>
              <TextInput
                style={[styles.input, erroresValidacion.cantidad ? styles.inputError : null]}
                placeholder="0"
                value={formulario.cantidad}
                onChangeText={(texto) => actualizarCampo('cantidad', texto)}
                keyboardType="numeric"
                maxLength={10}
              />
              {erroresValidacion.cantidad && (
                <Text style={styles.textoError}>{erroresValidacion.cantidad}</Text>
              )}
            </View>

            <View style={[styles.campo, styles.campoMitad]}>
              <Text style={styles.etiqueta}>Precio *</Text>
              <TextInput
                style={[styles.input, erroresValidacion.precio ? styles.inputError : null]}
                placeholder="0.00"
                value={formulario.precio}
                onChangeText={(texto) => actualizarCampo('precio', texto)}
                keyboardType="decimal-pad"
                maxLength={10}
              />
              {erroresValidacion.precio && (
                <Text style={styles.textoError}>{erroresValidacion.precio}</Text>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botones de acción */}
      <View style={styles.botonesAccion}>
        <TouchableOpacity
          style={[styles.boton, styles.botonCancelar]}
          onPress={() => navigation.goBack()}
          disabled={cargando}
        >
          <Text style={styles.textoBotonCancelar}>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.boton, styles.botonGuardar, cargando && styles.botonDeshabilitado]}
          onPress={manejarGuardar}
          disabled={cargando}
        >
          {cargando ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.textoBotonGuardar}>Guardar</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  seccionImagen: {
    marginBottom: 24,
  },
  etiquetaSeccion: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 12,
  },
  contenedorImagenSeleccionada: {
    position: 'relative',
    alignSelf: 'center',
  },
  imagenSeleccionada: {
    width: 200,
    height: 200,
    borderRadius: 12,
    backgroundColor: '#e9ecef',
  },
  botonEliminarImagen: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff3b30',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textoEliminarImagen: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  botonSeleccionarImagen: {
    height: 200,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#dee2e6',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  iconoImagen: {
    fontSize: 48,
    marginBottom: 8,
  },
  textoSeleccionarImagen: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
  formulario: {
    gap: 20,
  },
  campo: {
    gap: 8,
  },
  etiqueta: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#212529',
  },
  inputMultilinea: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#212529',
    minHeight: 100,
  },
  inputError: {
    borderColor: '#dc3545',
  },
  textoError: {
    fontSize: 14,
    color: '#dc3545',
    marginTop: 4,
  },
  filaDoble: {
    flexDirection: 'row',
    gap: 16,
  },
  campoMitad: {
    flex: 1,
  },
  botonesAccion: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
    gap: 12,
  },
  boton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonCancelar: {
    backgroundColor: '#6c757d',
  },
  botonGuardar: {
    backgroundColor: '#007AFF',
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  textoBotonCancelar: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  textoBotonGuardar: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
