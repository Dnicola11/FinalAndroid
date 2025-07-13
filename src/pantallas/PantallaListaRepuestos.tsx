import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useContextoRepuestos } from '../contexto/ContextoRepuestos';
import { RootStackParamList, Repuesto } from '../tipos';

type PantallaListaRepuestosProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'PantallaListaRepuestos'>;
};

export default function PantallaListaRepuestos({ navigation }: PantallaListaRepuestosProps) {
  const {
    repuestos,
    cargandoRepuestos,
    error,
    obtenerRepuestos,
    eliminarRepuesto,
    cerrarSesion,
    limpiarError,
  } = useContextoRepuestos();

  useEffect(() => {
    // Configurar header con botón de salir
    navigation.setOptions({
      title: 'Almacén de Repuestos',
      headerRight: () => (
        <TouchableOpacity style={styles.botonHeaderSalir} onPress={manejarCerrarSesion}>
          <Text style={styles.textoBotonHeaderSalir}>Salir</Text>
        </TouchableOpacity>
      ),
    });

    // Cargar repuestos al montar el componente
    obtenerRepuestos();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK', onPress: limpiarError }]);
    }
  }, [error]);

  const manejarCerrarSesion = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Está seguro que desea cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: async () => {
            try {
              await cerrarSesion();
              navigation.replace('PantallaLogin');
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar sesión');
            }
          },
        },
      ]
    );
  };

  const manejarEliminarRepuesto = (repuesto: Repuesto) => {
    Alert.alert(
      'Confirmar Eliminación',
      `¿Está seguro que desea eliminar "${repuesto.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await eliminarRepuesto(repuesto.id);
              Alert.alert('Éxito', 'Repuesto eliminado correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el repuesto');
            }
          },
        },
      ]
    );
  };

  const renderizarRepuesto = ({ item }: { item: Repuesto }) => (
    <View style={styles.tarjetaRepuesto}>
      <View style={styles.contenedorImagen}>
        {item.imagenUrl ? (
          <Image source={{ uri: item.imagenUrl }} style={styles.imagenRepuesto} />
        ) : (
          <View style={styles.imagenPlaceholder}>
            <Text style={styles.textoPlaceholder}>Sin Imagen</Text>
          </View>
        )}
      </View>

      <View style={styles.informacionRepuesto}>
        <Text style={styles.nombreRepuesto}>{item.nombre}</Text>
        <Text style={styles.descripcionRepuesto} numberOfLines={2}>
          {item.descripcion}
        </Text>
        <View style={styles.detallesRepuesto}>
          <Text style={styles.cantidadRepuesto}>Cantidad: {item.cantidad}</Text>
          <Text style={styles.precioRepuesto}>S/ {item.precio.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.botonesAccion}>
        <TouchableOpacity
          style={[styles.botonAccion, styles.botonEditar]}
          onPress={() =>
            navigation.navigate('PantallaEditarRepuesto', { repuesto: item })
          }
        >
          <Text style={styles.textoBotonAccion}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.botonAccion, styles.botonEliminar]}
          onPress={() => manejarEliminarRepuesto(item)}
        >
          <Text style={styles.textoBotonAccion}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderizarListaVacia = () => (
    <View style={styles.contenedorVacio}>
      <Text style={styles.textoVacio}>📦</Text>
      <Text style={styles.tituloVacio}>No hay repuestos</Text>
      <Text style={styles.descripcionVacio}>
        Agrega tu primer repuesto tocando el botón "+"
      </Text>
    </View>
  );

  if (cargandoRepuestos && repuestos.length === 0) {
    return (
      <View style={styles.contenedorCarga}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.textoCarga}>Cargando repuestos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={repuestos}
        keyExtractor={(item) => item.id}
        renderItem={renderizarRepuesto}
        ListEmptyComponent={renderizarListaVacia}
        refreshControl={
          <RefreshControl
            refreshing={cargandoRepuestos}
            onRefresh={obtenerRepuestos}
            colors={['#007AFF']}
          />
        }
        contentContainerStyle={repuestos.length === 0 ? styles.listaVacia : undefined}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.botonAgregar}
        onPress={() => navigation.navigate('PantallaAgregarRepuesto')}
      >
        <Text style={styles.textoBotonAgregar}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  botonHeaderSalir: {
    backgroundColor: '#ff3b30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 10,
  },
  textoBotonHeaderSalir: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  tarjetaRepuesto: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  contenedorImagen: {
    marginRight: 16,
  },
  imagenRepuesto: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  imagenPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoPlaceholder: {
    color: '#6c757d',
    fontSize: 12,
    textAlign: 'center',
  },
  informacionRepuesto: {
    flex: 1,
    marginRight: 12,
  },
  nombreRepuesto: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  descripcionRepuesto: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
    lineHeight: 20,
  },
  detallesRepuesto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cantidadRepuesto: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '500',
  },
  precioRepuesto: {
    fontSize: 16,
    color: '#28a745',
    fontWeight: '700',
  },
  botonesAccion: {
    flexDirection: 'column',
    gap: 8,
  },
  botonAccion: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonEditar: {
    backgroundColor: '#007AFF',
  },
  botonEliminar: {
    backgroundColor: '#ff3b30',
  },
  textoBotonAccion: {
    fontSize: 16,
    color: '#fff',
  },
  contenedorVacio: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  textoVacio: {
    fontSize: 64,
    marginBottom: 16,
  },
  tituloVacio: {
    fontSize: 24,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 8,
  },
  descripcionVacio: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
  },
  listaVacia: {
    flex: 1,
  },
  contenedorCarga: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  textoCarga: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c757d',
  },
  botonAgregar: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  textoBotonAgregar: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '300',
  },
});
