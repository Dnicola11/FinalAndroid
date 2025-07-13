# 🔥 Configuración de Firebase para Almacén de Repuestos

## 📋 Pasos para Configurar Firebase

### 1. **Configurar Reglas de Firestore**

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto `proyectom2-ff9fc`
3. Ve a **Firestore Database** → **Reglas**
4. Reemplaza las reglas existentes con el contenido del archivo `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /repuestos/{document} {
      allow read, write: if request.auth != null;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

5. Haz clic en **Publicar**

### 2. **Configurar Reglas de Storage**

1. En Firebase Console, ve a **Storage** → **Reglas**
2. Reemplaza las reglas existentes con el contenido del archivo `storage.rules`:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /repuestos/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

3. Haz clic en **Publicar**

### 3. **Verificar Configuración de Authentication**

1. Ve a **Authentication** → **Método de acceso**
2. Asegúrate de que **Correo electrónico/contraseña** esté **habilitado**
3. Si no está habilitado, haz clic en él y actívalo

### 4. **Verificar Configuración de Firestore**

1. Ve a **Firestore Database**
2. Si no existe, créala en **modo de producción**
3. Selecciona una ubicación cercana (ej: `us-central1`)

### 5. **Verificar Configuración de Storage**

1. Ve a **Storage**
2. Si no existe, créalo
3. Selecciona la misma ubicación que Firestore

## 🔧 Solución de Problemas Comunes

### Error: "permission-denied"
- **Causa**: Las reglas de Firestore/Storage no están configuradas correctamente
- **Solución**: Verifica que las reglas permitan acceso a usuarios autenticados

### Error: "Usuario no autenticado"
- **Causa**: El usuario no ha iniciado sesión correctamente
- **Solución**: Verifica que Authentication esté configurado y el usuario esté logueado

### Error: "storage/unknown" al subir imágenes
- **Causa**: Storage no está inicializado o configurado incorrectamente
- **Solución**: 
  1. Ve a Firebase Console → Storage
  2. Si no existe, haz clic en "Comenzar"
  3. Selecciona "Comenzar en modo de producción"
  4. Elige la misma ubicación que Firestore
  5. Aplica las reglas de `storage.rules`

### Error: "storage/unauthorized"
- **Causa**: Las reglas de Storage son muy restrictivas
- **Solución**: Asegúrate de aplicar exactamente las reglas de `storage.rules`

### Error de conexión
- **Causa**: Configuración incorrecta en `firebaseConfig.ts`
- **Solución**: Verifica que todas las credenciales sean correctas

### Error: "Firebase Storage: An unknown error occurred"
- **Causa**: Storage no está habilitado o hay problemas de configuración
- **Solución**:
  1. Verifica que Storage esté habilitado en Firebase Console
  2. Asegúrate de que las reglas de Storage estén aplicadas
  3. Verifica que la ubicación de Storage sea compatible
  4. Intenta crear el bucket manualmente si no existe

## 📱 Probar la Aplicación

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar la aplicación:**
   ```bash
   npm start
   ```

3. **Probar funcionalidades:**
   - Registrar un nuevo usuario
   - Iniciar sesión
   - Agregar un repuesto con imagen
   - Editar un repuesto
   - Eliminar un repuesto

## 🐛 Debug y Logs

La aplicación incluye logs detallados en la consola para ayudar con el debugging:

- Logs de autenticación
- Logs de subida de imágenes
- Logs de operaciones CRUD
- Logs de errores detallados

Para ver los logs:
1. Abre las herramientas de desarrollador en tu navegador/emulador
2. Ve a la pestaña **Console**
3. Observa los mensajes mientras usas la aplicación

## ✅ Verificación Final

Una vez configurado todo, deberías poder:

- ✅ Registrar nuevos usuarios
- ✅ Iniciar sesión
- ✅ Ver la lista de repuestos (vacía inicialmente)
- ✅ Agregar repuestos con imágenes
- ✅ Editar repuestos existentes
- ✅ Eliminar repuestos
- ✅ Cerrar sesión

Si alguna funcionalidad no funciona, revisa los logs en la consola para identificar el problema específico.
