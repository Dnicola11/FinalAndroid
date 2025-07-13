# 🔥 Guía Paso a Paso: Configurar Firebase Storage

## 📋 **Pasos Detallados para Configurar Storage**

### **Paso 1: Acceder a Firebase Console**
1. Ve a [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Busca y selecciona tu proyecto **`proyectom2-ff9fc`**

### **Paso 2: Localizar Storage en el Menú**
1. En el menú lateral izquierdo, busca la sección **"Compilación"** o **"Build"**
2. Dentro de esa sección, busca **"Storage"**
3. Haz clic en **"Storage"**

### **Paso 3: Inicializar Storage**

#### **Si ves "Comenzar" o "Get Started":**
1. Haz clic en el botón **"Comenzar"** o **"Get Started"**
2. Aparecerá un diálogo de configuración

#### **Configuración de Reglas:**
1. Selecciona **"Comenzar en modo de producción"** 
   - (NO selecciones "modo de prueba" ya que es menos seguro)
2. Haz clic en **"Siguiente"**

#### **Selección de Ubicación:**
1. Elige la ubicación **"us-central1 (Iowa)"**
   - ⚠️ **IMPORTANTE:** Debe ser la misma ubicación que tu Firestore
2. Haz clic en **"Listo"**

### **Paso 4: Verificar que Storage se Creó**
Después de unos segundos deberías ver:
- Una pantalla con pestañas: **"Archivos"**, **"Reglas"**, **"Uso"**
- Un bucket vacío con una URL como: `gs://proyectom2-ff9fc.appspot.com`

### **Paso 5: Configurar Reglas de Seguridad**
1. Haz clic en la pestaña **"Reglas"**
2. Verás un editor de código con reglas por defecto
3. **REEMPLAZA TODO** el contenido con esto:

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

4. Haz clic en **"Publicar"**
5. Confirma haciendo clic en **"Publicar"** nuevamente

### **Paso 6: Verificar Configuración**
1. Ve a la pestaña **"Archivos"**
2. Deberías ver un espacio vacío (esto es normal)
3. La URL del bucket debe aparecer arriba

## 🔍 **Capturas de Pantalla de Referencia**

### **Menú de Firebase Console:**
```
📁 Proyecto: proyectom2-ff9fc
├── 🏠 Información general
├── 👥 Authentication
├── 🗄️ Firestore Database
├── 📦 Storage          ← AQUÍ
├── 🔧 Functions
└── ⚙️ Configuración del proyecto
```

### **Pantalla de Storage Inicial:**
```
🔥 Cloud Storage

[Comenzar]  ← Haz clic aquí si aparece

O si ya está configurado:
┌─────────────────────────────────┐
│ Archivos | Reglas | Uso         │
├─────────────────────────────────┤
│ gs://proyectom2-ff9fc.appspot.com│
│                                 │
│ (Espacio vacío - normal)        │
└─────────────────────────────────┘
```

## ⚠️ **Problemas Comunes y Soluciones**

### **Problema 1: No veo "Storage" en el menú**
**Solución:**
1. Actualiza la página del navegador
2. Verifica que estás en el proyecto correcto
3. Busca en la sección "Compilación" o "Build"

### **Problema 2: Error "Storage no disponible en esta región"**
**Solución:**
1. Elige una región diferente (us-central1, us-east1, europe-west1)
2. Asegúrate de que sea la misma región que Firestore

### **Problema 3: No puedo publicar las reglas**
**Solución:**
1. Verifica que copiaste exactamente el código de las reglas
2. Asegúrate de que no hay caracteres extra
3. Intenta refrescar la página y volver a intentar

### **Problema 4: Ya tengo Storage pero sigue fallando**
**Solución:**
1. Ve a la pestaña "Reglas"
2. Verifica que las reglas permitan acceso a usuarios autenticados
3. Asegúrate de que la carpeta "repuestos" esté incluida

## ✅ **Verificación Final**

### **Checklist de Configuración:**
- [ ] Storage aparece en el menú de Firebase Console
- [ ] Puedo ver las pestañas "Archivos", "Reglas", "Uso"
- [ ] Las reglas están configuradas correctamente
- [ ] El bucket tiene una URL válida (gs://...)

### **Prueba en la Aplicación:**
1. Ejecuta `npm start`
2. Inicia sesión en la app
3. Intenta agregar un repuesto con imagen
4. Debería funcionar sin errores

## 🆘 **Si Necesitas Ayuda Adicional**

### **Información que necesito si sigue fallando:**
1. ¿Ves "Storage" en el menú de Firebase Console?
2. ¿Qué mensaje aparece cuando intentas configurarlo?
3. ¿Cuál es la URL de tu bucket de Storage?
4. ¿Qué error específico aparece en la consola de la app?

### **Alternativa Temporal:**
Si Storage sigue sin funcionar, puedes usar la aplicación sin imágenes:
- Todos los repuestos se guardarán correctamente
- Solo no tendrán imágenes asociadas
- Puedes agregar imágenes después cuando Storage funcione

## 📞 **Contacto para Soporte**
Si sigues teniendo problemas, comparte:
1. Capturas de pantalla de Firebase Console
2. Mensajes de error específicos
3. Logs de la consola del navegador

¡La aplicación funcionará perfectamente una vez que Storage esté configurado! 🎉
