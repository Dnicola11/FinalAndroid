import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { ProveedorContextoRepuestos } from './src/contexto/ContextoRepuestos';
import PantallaLogin from './src/pantallas/PantallaLogin';
import PantallaRegistro from './src/pantallas/PantallaRegistro';
import PantallaListaRepuestos from './src/pantallas/PantallaListaRepuestos';
import PantallaAgregarRepuesto from './src/pantallas/PantallaAgregarRepuesto';
import PantallaEditarRepuesto from './src/pantallas/PantallaEditarRepuesto';
import { RootStackParamList } from './src/tipos';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ProveedorContextoRepuestos>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="PantallaLogin"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: '600',
            },
            headerBackTitleVisible: false,
          }}
        >
          <Stack.Screen 
            name="PantallaLogin" 
            component={PantallaLogin}
            options={{ 
              headerShown: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen 
            name="PantallaRegistro" 
            component={PantallaRegistro}
            options={{ 
              title: 'Crear Cuenta',
              presentation: 'modal',
            }}
          />
          <Stack.Screen 
            name="PantallaListaRepuestos" 
            component={PantallaListaRepuestos}
            options={{ 
              title: 'Almacén de Repuestos',
              headerLeft: () => null,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen 
            name="PantallaAgregarRepuesto" 
            component={PantallaAgregarRepuesto}
            options={{ 
              title: 'Agregar Repuesto',
              presentation: 'modal',
            }}
          />
          <Stack.Screen 
            name="PantallaEditarRepuesto" 
            component={PantallaEditarRepuesto}
            options={{ 
              title: 'Editar Repuesto',
              presentation: 'modal',
            }}
          />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </ProveedorContextoRepuestos>
  );
}
