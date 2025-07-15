import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useContextoRepuestos } from '../contexto/ContextoRepuestos';
import { Repuesto } from '../tipos';

export default function PantallaDashboard() {
  const { 
    obtenerEstadisticas, 
    obtenerRepuestosStockBajo, 
    obtenerRepuestos,
    error,
    limpiarError 
  } = useContextoRepuestos();
  
  const [estadisticas, setEstadisticas] = useState({
    totalRepuestos: 0,
    valorTotalInventario: 0,
    repuestosStockBajo: 0,
    categoriaConMasRepuestos: '',
    promedioPrecios: 0,
  });
  const [repuestosStockBajo, setRepuestosStockBajo] = useState<Repuesto[]>([]);

  useEffect(() => {
    obtenerRepuestos();
  }, []);

  useEffect(() => {
    const stats = obtenerEstadisticas();
    setEstadisticas(stats);
    const bajos = obtenerRepuestosStockBajo();
    setRepuestosStockBajo(bajos);
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [{ text: 'OK', onPress: limpiarError }]);
    }
  }, [error]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>📊 Dashboard de Inventario</Text>

      {/* Tarjetas de estadísticas */}
      <View style={styles.tarjetasContainer}>
        <View style={styles.tarjeta}>
          <Text style={styles.iconoTarjeta}>📦</Text>
          <Text style={styles.numeroTarjeta}>{estadisticas.totalRepuestos}</Text>
          <Text style={styles.textoTarjeta}>Total Repuestos</Text>
        </View>

        <View style={styles.tarjeta}>
          <Text style={styles.iconoTarjeta}>💰</Text>
          <Text style={styles.numeroTarjeta}>S/ {estadisticas.valorTotalInventario.toFixed(2)}</Text>
          <Text style={styles.textoTarjeta}>Valor Total</Text>
        </View>

        <View style={[styles.tarjeta, styles.tarjetaAlerta]}>
          <Text style={styles.iconoTarjeta}>⚠️</Text>
          <Text style={styles.numeroTarjetaAlerta}>{estadisticas.repuestosStockBajo}</Text>
          <Text style={styles.textoTarjetaAlerta}>Stock Bajo</Text>
        </View>

        <View style={styles.tarjeta}>
          <Text style={styles.iconoTarjeta}>📈</Text>
          <Text style={styles.numeroTarjeta}>S/ {estadisticas.promedioPrecios.toFixed(2)}</Text>
          <Text style={styles.textoTarjeta}>Precio Promedio</Text>
        </View>
      </View>

      {/* Resumen por categorías */}
      <View style={styles.seccionResumen}>
        <Text style={styles.tituloSeccion}>🏷️ Resumen por Categorías</Text>
        <View style={styles.categoriaContainer}>
          <Text style={styles.categoriaTexto}>
            📊 Categoría más popular: {estadisticas.categoriaConMasRepuestos || 'N/A'}
          </Text>
        </View>
      </View>

      {/* Lista de repuestos con stock bajo */}
      <View style={styles.seccionLista}>
        <Text style={styles.tituloSeccion}>⚠️ Alertas de Stock Bajo</Text>
        {repuestosStockBajo.length > 0 ? (
          repuestosStockBajo.slice(0, 5).map((repuesto) => (
            <View key={repuesto.id} style={styles.itemAlerta}>
              <View style={styles.infoAlerta}>
                <Text style={styles.nombreAlerta}>{repuesto.nombre}</Text>
                <Text style={styles.cantidadAlerta}>
                  Stock: {repuesto.cantidad} (Mín: {repuesto.stockMinimo})
                </Text>
                <Text style={styles.categoriaAlerta}>Categoría: {repuesto.categoria}</Text>
              </View>
              <View style={styles.indicadorAlerta} />
            </View>
          ))
        ) : (
          <View style={styles.sinAlertasContainer}>
            <Text style={styles.textoSinAlertas}>✅ No hay alertas de stock bajo</Text>
            <Text style={styles.subtextoSinAlertas}>Todos los repuestos tienen stock suficiente</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  titulo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 24,
    textAlign: 'center',
  },
  tarjetasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  tarjeta: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    padding: 20,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tarjetaAlerta: {
    backgroundColor: '#ff3b30',
  },
  iconoTarjeta: {
    fontSize: 24,
    marginBottom: 8,
  },
  numeroTarjeta: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  numeroTarjetaAlerta: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  textoTarjeta: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  textoTarjetaAlerta: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
    opacity: 0.9,
  },
  seccionResumen: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tituloSeccion: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 12,
  },
  categoriaContainer: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 12,
  },
  categoriaTexto: {
    fontSize: 16,
    color: '#1976d2',
    fontWeight: '500',
  },
  seccionLista: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemAlerta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  infoAlerta: {
    flex: 1,
  },
  nombreAlerta: {
    fontSize: 16,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 4,
  },
  cantidadAlerta: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 2,
  },
  categoriaAlerta: {
    fontSize: 12,
    color: '#856404',
    opacity: 0.8,
  },
  indicadorAlerta: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ffc107',
  },
  sinAlertasContainer: {
    alignItems: 'center',
    padding: 20,
  },
  textoSinAlertas: {
    fontSize: 18,
    color: '#28a745',
    fontWeight: '600',
    marginBottom: 4,
  },
  subtextoSinAlertas: {
    fontSize: 14,
    color: '#6c757d',
  },
  seccionInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoContainer: {
    paddingLeft: 8,
  },
  infoTexto: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 8,
    lineHeight: 20,
  },
});
