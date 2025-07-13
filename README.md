# 📱 Almacén de Repuestos - Aplicación React Native

## 🚀 Descripción del Proyecto

Aplicación móvil para gestión de almacén de repuestos desarrollada en React Native con TypeScript, integrada con Firebase para autenticación, almacenamiento de datos e imágenes.

## ✨ Características Principales

### 🔐 Autenticación
- Inicio de sesión con Firebase Auth
- Registro de nuevos usuarios
- Gestión automática del estado de autenticación
- Cierre de sesión seguro
- Validación de formularios

### 📦 Gestión de Repuestos (CRUD)
- **Listar repuestos**: Vista completa con imágenes, nombre, descripción, cantidad y precio
- **Agregar repuesto**: Formulario con validaciones y subida de imágenes
- **Editar repuesto**: Modificación de repuestos existentes con gestión de imágenes
- **Eliminar repuesto**: Eliminación con confirmación y limpieza de imágenes

### 🖼️ Gestión de Imágenes
- Integración con Firebase Storage
- Selección de imágenes desde la galería del dispositivo
- Captura de fotos con la cámara
- Subida y recuperación automática de imágenes
- Eliminación automática de imágenes al eliminar repuestos

### 🧭 Navegación
- React Navigation v6
- 5 pantallas principales:
  - **PantallaLogin**: Inicio de sesión
  - **PantallaRegistro**: Registro de usuarios
  - **PantallaListaRepuestos**: Lista principal de repuestos
  - **PantallaAgregarRepuesto**: Formulario para agregar repuestos
  - **PantallaEditarRepuesto**: Formulario para editar repuestos

### 🔄 Gestión de Estado
- Context API (ContextoRepuestos)
- Estado global compartido
- Gestión de usuarios, repuestos y estados de carga
- Manejo centralizado de errores

## 🛠️ Tecnologías Utilizadas

- **React Native** - Framework móvil
- **TypeScript** - Tipado estático
- **Expo** - Plataforma de desarrollo
- **Firebase Auth** - Autenticación
- **Firestore** - Base de datos NoSQL
- **Firebase Storage** - Almacenamiento de imágenes
- **React Navigation** - Navegación entre pantallas
- **Expo Image Picker** - Selección de imágenes y cámara
- **Context API** - Gestión de estado global

## 📁 Estructura del Proyecto

```
AlmacenRepuestos/
├── src/
│   ├── contexto/
│   │   └── ContextoRepuestos.tsx     # Context API para estado global
│   ├── pantallas/
│   │   ├── PantallaLogin.tsx         # Pantalla de inicio de sesión
│   │   ├── PantallaRegistro.tsx      # Pantalla de registro
│   │   ├── PantallaListaRepuestos.tsx # Lista principal de repuestos
│   │   ├── PantallaAgregarRepuesto.tsx # Agregar nuevo repuesto
│   │   └── PantallaEditarRepuesto.tsx  # Editar repuesto existente
│   └── tipos/
│       └── index.ts                  # Definiciones de tipos TypeScript
├── firebaseConfig.ts                 # Configuración de Firebase
├── App.tsx                          # Componente principal con navegación
├── package.json                     # Dependencias del proyecto
└── tsconfig.json                    # Configuración TypeScript
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn
- Expo CLI
- Android Studio (para emulador Android) o Xcode (para iOS)

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd AlmacenRepuestos
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Firebase**
   - Crear un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Habilitar Authentication (Email/Password)
   - Crear base de datos Firestore
   - Habilitar Storage
   - Actualizar `firebaseConfig.ts` con tus credenciales

4. **Ejecutar la aplicación**
   ```bash
   npm start
   ```

## 📱 Funcionalidades Detalladas

### Autenticación
- **Registro**: Los usuarios pueden crear cuentas con email y contraseña
- **Login**: Inicio de sesión con validación de credenciales
- **Persistencia**: El estado de autenticación se mantiene entre sesiones
- **Logout**: Cierre de sesión seguro con confirmación

### Gestión de Repuestos
- **Vista de Lista**: Tarjetas con imagen, nombre, descripción, cantidad y precio
- **Búsqueda y Filtrado**: Funcionalidad de refresh para actualizar datos
- **Formularios Inteligentes**: Validación en tiempo real con mensajes de error
- **Gestión de Imágenes**: Selección desde galería o captura con cámara

### Experiencia de Usuario
- **Navegación Intuitiva**: Transiciones suaves entre pantallas
- **Estados de Carga**: Indicadores visuales durante operaciones
- **Manejo de Errores**: Mensajes informativos para el usuario
- **Diseño Responsivo**: Interfaz adaptada para diferentes tamaños de pantalla

## 🔧 Configuración de Firebase

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /repuestos/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /repuestos/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🎨 Características de Diseño

- **Tema Moderno**: Colores azul (#007AFF) y grises para una apariencia profesional
- **Iconografía**: Emojis y símbolos para una interfaz amigable
- **Tipografía**: Fuentes del sistema con pesos variables
- **Espaciado**: Diseño consistente con márgenes y padding uniformes
- **Sombras**: Efectos de elevación para elementos interactivos

## 🔄 Estados de la Aplicación

### Estados Globales (Context)
- `usuario`: Información del usuario autenticado
- `repuestos`: Array de repuestos
- `cargando`: Estado de carga general
- `cargandoRepuestos`: Estado específico para operaciones de repuestos
- `error`: Mensajes de error globales

### Operaciones Asíncronas
- Todas las operaciones de Firebase son asíncronas
- Manejo de errores centralizado
- Estados de carga para mejor UX
- Validación de datos antes de envío

## 📝 Tipos TypeScript

La aplicación utiliza TypeScript para mayor seguridad de tipos:

- `Repuesto`: Estructura de datos de repuestos
- `Usuario`: Información de usuario
- `FormularioRepuesto`: Datos de formularios
- `RootStackParamList`: Tipos de navegación
- `EstadoContexto` y `AccionesContexto`: Tipos del Context

## 🚀 Comandos Disponibles

```bash
# Iniciar en modo desarrollo
npm start

# Ejecutar en Android
npm run android

# Ejecutar en iOS
npm run ios

# Ejecutar en web
npm run web

# Verificar tipos TypeScript
npx tsc --noEmit
```

## 🔒 Seguridad

- Autenticación requerida para todas las operaciones
- Validación de datos en cliente y servidor
- Reglas de seguridad en Firestore y Storage
- Manejo seguro de imágenes y archivos

## 🐛 Solución de Problemas

### Problemas Comunes

1. **Error de permisos de cámara/galería**
   - Verificar permisos en el dispositivo
   - Reinstalar la aplicación si es necesario

2. **Errores de conexión a Firebase**
   - Verificar configuración en `firebaseConfig.ts`
   - Comprobar reglas de Firestore y Storage

3. **Problemas de navegación**
   - Verificar que todos los nombres de pantallas coincidan
   - Revisar tipos en `RootStackParamList`

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para soporte o preguntas, por favor abre un issue en el repositorio del proyecto.

---

**Desarrollado con ❤️ usando React Native y Firebase**
