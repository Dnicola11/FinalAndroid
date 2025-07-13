# 📚 Guía para Subir tu Proyecto a GitHub

## 🚀 **Pasos para crear un nuevo repositorio en GitHub**

### **Paso 1: Crear repositorio en GitHub.com**
1. Ve a [GitHub.com](https://github.com) e inicia sesión
2. Haz clic en el botón **"New"** (verde) o **"+"** → **"New repository"**
3. **Configuración del repositorio:**
   - **Repository name:** `almacen-repuestos-react-native`
   - **Description:** `Aplicación móvil para gestión de almacén de repuestos con React Native, TypeScript y Firebase`
   - **Visibility:** Selecciona **Public** o **Private** según prefieras
   - **NO marques** "Add a README file" (ya tienes uno)
   - **NO marques** "Add .gitignore" (ya tienes uno)
   - **NO marques** "Choose a license"
4. Haz clic en **"Create repository"**

### **Paso 2: Preparar tu proyecto local**
Abre la terminal en tu carpeta del proyecto y ejecuta estos comandos:

```bash
# 1. Inicializar Git (si no está inicializado)
git init

# 2. Agregar todos los archivos
git add .

# 3. Hacer el primer commit
git commit -m "🎉 Proyecto inicial: App de gestión de repuestos con React Native + Firebase

✨ Características:
- Autenticación con Firebase Auth
- CRUD completo de repuestos
- Subida de imágenes con Firebase Storage
- Base de datos con Cloud Firestore
- Navegación con React Navigation
- TypeScript para tipado estático
- Context API para gestión de estado
- Timeouts y manejo robusto de errores

🛠️ Tecnologías:
- React Native + Expo
- TypeScript
- Firebase (Auth, Firestore, Storage)
- React Navigation v6
- Context API"

# 4. Agregar el repositorio remoto (reemplaza con tu URL)
git remote add origin https://github.com/TU_USUARIO/almacen-repuestos-react-native.git

# 5. Subir el código
git branch -M main
git push -u origin main
```

### **Paso 3: Comandos específicos para tu proyecto**

**Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub:**

```bash
# Ejemplo si tu usuario es "davidnicola":
git remote add origin https://github.com/davidnicola/almacen-repuestos-react-native.git
```

### **Paso 4: Verificar que se subió correctamente**
1. Ve a tu repositorio en GitHub
2. Deberías ver todos tus archivos
3. El README.md debería mostrarse en la página principal

## 📝 **Crear un README.md profesional**

Si quieres mejorar tu README.md, aquí tienes una plantilla:

```markdown
# 📱 Almacén de Repuestos - React Native App

Aplicación móvil para gestión de inventario de repuestos desarrollada con React Native, TypeScript y Firebase.

## ✨ Características

- 🔐 **Autenticación** - Login/registro con Firebase Auth
- 📦 **Gestión de Repuestos** - CRUD completo (crear, leer, actualizar, eliminar)
- 🖼️ **Gestión de Imágenes** - Subida y almacenamiento con Firebase Storage
- 🧭 **Navegación Fluida** - React Navigation v6
- 💾 **Base de Datos** - Cloud Firestore para almacenamiento
- 🔄 **Estado Global** - Context API para gestión de estado
- ⚡ **Performance** - Timeouts y manejo robusto de errores

## 🛠️ Tecnologías

- **React Native** + Expo
- **TypeScript** - Tipado estático
- **Firebase** - Auth, Firestore, Storage
- **React Navigation** - Navegación entre pantallas
- **Context API** - Gestión de estado global

## 🚀 Instalación

```bash
# Clonar repositorio
git clone https://github.com/TU_USUARIO/almacen-repuestos-react-native.git

# Instalar dependencias
cd almacen-repuestos-react-native
npm install

# Ejecutar aplicación
npm start
```

## 📱 Pantallas

- **Login/Registro** - Autenticación de usuarios
- **Lista de Repuestos** - Vista principal con todos los repuestos
- **Agregar Repuesto** - Formulario para nuevos repuestos
- **Editar Repuesto** - Modificación de repuestos existentes

## 🔧 Configuración Firebase

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Habilitar Authentication, Firestore y Storage
3. Configurar reglas de seguridad
4. Actualizar `firebaseConfig.ts` con tus credenciales

## 📄 Licencia

MIT License
```

## 🔒 **Consideraciones de Seguridad**

### **⚠️ IMPORTANTE: Proteger credenciales de Firebase**

Tu archivo `firebaseConfig.ts` contiene credenciales. Para proyectos públicos:

1. **Crear archivo `.env`:**
```bash
EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

2. **Actualizar `firebaseConfig.ts`:**
```typescript
export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};
```

3. **Agregar `.env` al `.gitignore`:**
```
# Environment variables
.env
.env.local
.env.production
```

## 🎯 **Comandos Resumidos**

```bash
# Comandos rápidos para subir a GitHub:
git init
git add .
git commit -m "🎉 Proyecto inicial: App de gestión de repuestos"
git remote add origin https://github.com/TU_USUARIO/almacen-repuestos-react-native.git
git branch -M main
git push -u origin main
```

## 🔄 **Para futuras actualizaciones**

```bash
# Después de hacer cambios:
git add .
git commit -m "✨ Descripción de los cambios"
git push
```

¡Tu proyecto estará disponible públicamente en GitHub! 🎉
