import React from 'react';
import { View, Text, StyleSheet, TextInput, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface FiltrosRepuestosProps {
  categorias: string[];
  filtros: {
    categoria: string;
    precioMinimo: string;
    precioMaximo: string;
    cantidadMinima: string;
    soloStockBajo: boolean;
  };
  onCambiarFiltro: (campo: string, valor: string | boolean) => void;
}

export default function FiltrosRepuestos({ categorias, filtros, onCambiarFiltro }: FiltrosRepuestosProps) {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.etiqueta}>Categoría</Text>
      <Picker
        selectedValue={filtros.categoria}
        onValueChange={(itemValue: string) => onCambiarFiltro('categoria', itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Todas" value="" />
        {categorias.map((cat) => (
          <Picker.Item key={cat} label={cat} value={cat} />
        ))}
      </Picker>

      <Text style={styles.etiqueta}>Precio mínimo</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={filtros.precioMinimo}
        onChangeText={(text) => onCambiarFiltro('precioMinimo', text)}
        placeholder="0"
      />

      <Text style={styles.etiqueta}>Precio máximo</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={filtros.precioMaximo}
        onChangeText={(text) => onCambiarFiltro('precioMaximo', text)}
        placeholder="1000"
      />

      <Text style={styles.etiqueta}>Cantidad mínima</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={filtros.cantidadMinima}
        onChangeText={(text) => onCambiarFiltro('cantidadMinima', text)}
        placeholder="0"
      />

      <View style={styles.switchContainer}>
        <Text style={styles.etiqueta}>Solo stock bajo</Text>
        <Switch
          value={filtros.soloStockBajo}
          onValueChange={(value) => onCambiarFiltro('soloStockBajo', value)}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 12,
  },
  etiqueta: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#212529',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  picker: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
