import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useContextoRepuestos } from '../contexto/ContextoRepuestos';
import { Repuesto } from '../tipos';

export default function PantallaGestionInventario() {
  const {
    repuestos,
    obtenerRepuestos,
    eliminarRepuesto,
    error,
    limpiarError,
  } = useContextoRepuestos();

  const [stockBajo, setStockBajo] = useState<Repuesto[]>([]);
  const [categorias, setCategorias] = useState<string[]>([]);

  useEffect(() => {
    obtenerRepuestos();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK', onPress: limpiarError }]);
    }
  }, [error]);

  useEffect(() => {
    // Filtrar repuestos con stock bajo
    const bajos = repuestos.filter(r => {
      const stockMinimo = r.stockMinimo || 5;
      return r.cantidad <= stockMinimo;
    });
    setStockBajo(bajos);

    // Extraer categorías únicas de los repuestos
    const categoriasUnicas = [...new Set(repuestos.map(r => r.categoria || 'General'))];
    setCategorias(categoriasUnicas);
  }, [repuestos]);

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

  const contarRepuestosPorCategoria = (categoria: string) => {
    return repuestos.filter(r => (r.categoria || 'General') === categoria).length;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>🚨 Alertas de Stock Bajo</Text>
      
      {stockBajo.length === 0 ? (
        <View style={styles.sinAlertasContainer}>
          <Text style={styles.textoSinAlertas}>✅ No hay repuestos con stock bajo</Text>
          <Text style={styles.subtextoSinAlertas}>Todos los repuestos tienen stock suficiente</Text>
        </View>
      ) : (
        <View style={styles.seccionAlertas}>
          {stockBajo.map((item) => (
            <View key={item.id} style={styles.itemStockBajo}>
              <View style={styles.infoRepuesto}>
                <Text style={styles.nombreRepuesto}>{item.nombre}</Text>
                <Text style={styles.detalleStock}>
                  Stock actual: {item.cantidad} | Mínimo: {item.stockMinimo || 5}
                </Text>
                <Text style={styles.categoriaStock}>Categoría: {item.categoria || 'General'}</Text>
              </View>
              <TouchableOpacity
                style={styles.botonEliminar}
                onPress={() => manejarEliminarRepuesto(item)}
              >
                <Text style={styles.textoBotonEliminar}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.titulo}>🏷️ Categorías de Repuestos</Text>
      
      {categorias.length === 0 ? (
        <View style={styles.sinCategoriasContainer}>
          <Text style={styles.textoSinCategorias}>📦 No hay categorías disponibles</Text>
          <Text style={styles.subtextoSinCategorias}>Agrega repuestos para ver las categorías</Text>
        </View>
      ) : (
        <View style={styles.seccionCategorias}>
          {categorias.map((categoria, index) => (
            <View key={index} style={styles.itemCategoria}>
              <View style={styles.infoCategoria}>
                <Text style={styles.nombreCategoria}>{categoria}</Text>
                <Text style={styles.contadorCategoria}>
                  {contarRepuestosPorCategoria(categoria)} repuesto(s)
                </Text>
              </View>
              <View style={styles.indicadorCategoria} />
            </View>
          ))}
        </View>
      )}

      <View style={styles.resumenContainer}>
        <Text style={styles.tituloResumen}>📊 Resumen</Text>
        <Text style={styles.textoResumen}>
          • Total de repuestos: {repuestos.length}
        </Text>
        <Text style={styles.textoResumen}>
          • Repuestos con stock bajo: {stockBajo.length}
        </Text>
        <Text style={styles.textoResumen}>
          • Categorías activas: {categorias.length}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    color: '#212529',
  },
  texto: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 16,
  },
  sinAlertasContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#d4edda',
    borderRadius: 8,
    marginBottom: 20,
  },
  textoSinAlertas: {
    fontSize: 18,
    color: '#155724',
    fontWeight: '600',
    marginBottom: 4,
  },
  subtextoSinAlertas: {
    fontSize: 14,
    color: '#155724',
  },
  seccionAlertas: {
    marginBottom: 20,
  },
  itemStockBajo: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoRepuesto: {
    flex: 1,
  },
  nombreRepuesto: {
    fontWeight: '600',
    fontSize: 16,
    color: '#856404',
    marginBottom: 4,
  },
  detalleStock: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 2,
  },
  categoriaStock: {
    fontSize: 12,
    color: '#856404',
    opacity: 0.8,
  },
  botonEliminar: {
    backgroundColor: '#ff3b30',
    padding: 8,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotonEliminar: {
    color: '#fff',
    fontSize: 16,
  },
  sinCategoriasContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#e2e3e5',
    borderRadius: 8,
    marginBottom: 20,
  },
  textoSinCategorias: {
    fontSize: 18,
    color: '#383d41',
    fontWeight: '600',
    marginBottom: 4,
  },
  subtextoSinCategorias: {
    fontSize: 14,
    color: '#383d41',
  },
  seccionCategorias: {
    marginBottom: 20,
  },
  itemCategoria: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoCategoria: {
    flex: 1,
  },
  nombreCategoria: {
    fontWeight: '700',
    fontSize: 16,
    color: '#212529',
    marginBottom: 4,
  },
  contadorCategoria: {
    fontSize: 14,
    color: '#6c757d',
  },
  indicadorCategoria: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  resumenContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tituloResumen: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 12,
  },
  textoResumen: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 8,
    lineHeight: 20,
  },
  descripcionCategoria: {
    fontSize: 14,
    color: '#6c757d',
  },
});
