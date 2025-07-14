import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';

interface BarraBusquedaProps {
  valor: string;
  onCambio: (texto: string) => void;
  placeholder?: string;
  mostrarLimpiar?: boolean;
}

export default function BarraBusqueda({ 
  valor, 
  onCambio, 
  placeholder = "Buscar repuestos...",
  mostrarLimpiar = true 
}: BarraBusquedaProps) {
  return (
    <View style={styles.contenedor}>
      <View style={styles.contenedorInput}>
        <Text style={styles.iconoBusqueda}>🔍</Text>
        <TextInput
          style={styles.input}
          value={valor}
          onChangeText={onCambio}
          placeholder={placeholder}
          placeholderTextColor="#999"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {mostrarLimpiar && valor.length > 0 && (
          <TouchableOpacity
            style={styles.botonLimpiar}
            onPress={() => onCambio('')}
          >
            <Text style={styles.textoLimpiar}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    marginBottom: 16,
  },
  contenedorInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  iconoBusqueda: {
    fontSize: 16,
    marginRight: 12,
    color: '#6c757d',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#212529',
    paddingVertical: 0,
  },
  botonLimpiar: {
    padding: 4,
    marginLeft: 8,
  },
  textoLimpiar: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: 'bold',
  },
});
