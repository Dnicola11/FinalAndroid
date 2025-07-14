import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { ProveedorContextoRepuestos } from './src/contexto/ContextoRepuestos';
import PantallaLogin from './src/pantallas/PantallaLogin';
import PantallaRegistro from './src/pantallas/PantallaRegistro';
import PantallaListaRepuestos from './src/pantallas/PantallaListaRepuestos';
import PantallaAgregarRepuesto from './src/pantallas/PantallaAgregarRepuesto';
import PantallaEditarRepuesto from './src/pantallas/PantallaEditarRepuesto';
import PantallaDashboard from './src/pantallas/PantallaDashboard';
import PantallaGestionInventario from './src/pantallas/PantallaGestionInventario';
import { RootStackParamList, TabsParamList } from './src/tipos';
import { Ionicons } from '@expo/vector-icons';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<TabsParamList>();

function TabsNavegacion() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          if (route.name === 'ListaRepuestos') {
            iconName = 'list';
          } else if (route.name === 'Dashboard') {
            iconName = 'stats-chart';
          } else if (route.name === 'GestionInventario') {
            iconName = 'settings';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tabs.Screen name="ListaRepuestos" component={PantallaListaRepuestos} options={{ title: 'Repuestos' }} />
      <Tabs.Screen name="Dashboard" component={PantallaDashboard} options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="GestionInventario" component={PantallaGestionInventario} options={{ title: 'Inventario' }} />
    </Tabs.Navigator>
  );
}

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
            name="TabsNavegacion" 
            component={TabsNavegacion}
            options={{ 
              headerShown: false,
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
