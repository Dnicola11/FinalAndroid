import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  User 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { auth, db, storage } from '../../firebaseConfig';
import { EstadoContexto, AccionesContexto, Repuesto, Usuario, Categoria, EstadisticasInventario, FiltrosRepuestos } from '../tipos';

// Estado inicial
const estadoInicial: EstadoContexto = {
  usuario: null,
  repuestos: [],
  categorias: [],
  cargando: false,
  cargandoRepuestos: false,
  cargandoCategorias: false,
  error: null,
};

// Tipos de acciones
type TipoAccion = 
  | { type: 'SET_CARGANDO'; payload: boolean }
  | { type: 'SET_CARGANDO_REPUESTOS'; payload: boolean }
  | { type: 'SET_CARGANDO_CATEGORIAS'; payload: boolean }
  | { type: 'SET_USUARIO'; payload: Usuario | null }
  | { type: 'SET_REPUESTOS'; payload: Repuesto[] }
  | { type: 'SET_CATEGORIAS'; payload: Categoria[] }
  | { type: 'AGREGAR_REPUESTO'; payload: Repuesto }
  | { type: 'AGREGAR_CATEGORIA'; payload: Categoria }
  | { type: 'ACTUALIZAR_REPUESTO'; payload: { id: string; repuesto: Partial<Repuesto> } }
  | { type: 'ACTUALIZAR_CATEGORIA'; payload: { id: string; categoria: Partial<Categoria> } }
  | { type: 'ELIMINAR_REPUESTO'; payload: string }
  | { type: 'ELIMINAR_CATEGORIA'; payload: string }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'LIMPIAR_ERROR' };

// Reducer
const reducer = (estado: EstadoContexto, accion: TipoAccion): EstadoContexto => {
  switch (accion.type) {
    case 'SET_CARGANDO':
      return { ...estado, cargando: accion.payload };
    case 'SET_CARGANDO_REPUESTOS':
      return { ...estado, cargandoRepuestos: accion.payload };
    case 'SET_CARGANDO_CATEGORIAS':
      return { ...estado, cargandoCategorias: accion.payload };
    case 'SET_USUARIO':
      return { ...estado, usuario: accion.payload };
    case 'SET_REPUESTOS':
      return { ...estado, repuestos: accion.payload };
    case 'SET_CATEGORIAS':
      return { ...estado, categorias: accion.payload };
    case 'AGREGAR_REPUESTO':
      return { ...estado, repuestos: [...estado.repuestos, accion.payload] };
    case 'AGREGAR_CATEGORIA':
      return { ...estado, categorias: [...estado.categorias, accion.payload] };
    case 'ACTUALIZAR_REPUESTO':
      return {
        ...estado,
        repuestos: estado.repuestos.map(repuesto =>
          repuesto.id === accion.payload.id
            ? { ...repuesto, ...accion.payload.repuesto, fechaActualizacion: new Date() }
            : repuesto
        ),
      };
    case 'ACTUALIZAR_CATEGORIA':
      return {
        ...estado,
        categorias: estado.categorias.map(categoria =>
          categoria.id === accion.payload.id
            ? { ...categoria, ...accion.payload.categoria }
            : categoria
        ),
      };
    case 'ELIMINAR_REPUESTO':
      return {
        ...estado,
        repuestos: estado.repuestos.filter(repuesto => repuesto.id !== accion.payload),
      };
    case 'ELIMINAR_CATEGORIA':
      return {
        ...estado,
        categorias: estado.categorias.filter(categoria => categoria.id !== accion.payload),
      };
    case 'SET_ERROR':
      return { ...estado, error: accion.payload };
    case 'LIMPIAR_ERROR':
      return { ...estado, error: null };
    default:
      return estado;
  }
};

// Contexto
const ContextoRepuestos = createContext<(EstadoContexto & AccionesContexto) | undefined>(undefined);

// Provider
interface ProveedorContextoRepuestosProps {
  children: ReactNode;
}

export const ProveedorContextoRepuestos: React.FC<ProveedorContextoRepuestosProps> = ({ children }) => {
  const [estado, dispatch] = useReducer(reducer, estadoInicial);

  // Efecto para escuchar cambios de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        const usuario: Usuario = {
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || undefined,
        };
        dispatch({ type: 'SET_USUARIO', payload: usuario });
      } else {
        dispatch({ type: 'SET_USUARIO', payload: null });
        dispatch({ type: 'SET_REPUESTOS', payload: [] });
      }
    });

    return () => unsubscribe();
  }, []);

  // Funciones de autenticación
  const iniciarSesion = async (email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_CARGANDO', payload: true });
      dispatch({ type: 'LIMPIAR_ERROR' });
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      let mensajeError = 'Error al iniciar sesión';
      
      switch (error.code) {
        case 'auth/user-not-found':
          mensajeError = 'No existe una cuenta con este correo electrónico';
          break;
        case 'auth/wrong-password':
          mensajeError = 'Contraseña incorrecta';
          break;
        case 'auth/invalid-email':
          mensajeError = 'El formato del correo electrónico no es válido';
          break;
        case 'auth/too-many-requests':
          mensajeError = 'Demasiados intentos fallidos. Intente más tarde';
          break;
        default:
          mensajeError = error.message;
      }
      
      dispatch({ type: 'SET_ERROR', payload: mensajeError });
      throw new Error(mensajeError);
    } finally {
      dispatch({ type: 'SET_CARGANDO', payload: false });
    }
  };

  const registrarUsuario = async (email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_CARGANDO', payload: true });
      dispatch({ type: 'LIMPIAR_ERROR' });
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      let mensajeError = 'Error al registrar usuario';
      
      switch (error.code) {
        case 'auth/email-already-in-use':
          mensajeError = 'Este correo electrónico ya está registrado';
          break;
        case 'auth/invalid-email':
          mensajeError = 'Correo electrónico inválido';
          break;
        case 'auth/weak-password':
          mensajeError = 'La contraseña es muy débil';
          break;
        default:
          mensajeError = error.message;
      }
      
      dispatch({ type: 'SET_ERROR', payload: mensajeError });
      throw new Error(mensajeError);
    } finally {
      dispatch({ type: 'SET_CARGANDO', payload: false });
    }
  };

  const cerrarSesion = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al cerrar sesión' });
      throw new Error('Error al cerrar sesión');
    }
  };

  const recuperarContrasena = async (email: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_CARGANDO', payload: true });
      dispatch({ type: 'LIMPIAR_ERROR' });
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      let mensajeError = 'Error al enviar correo de recuperación';
      
      switch (error.code) {
        case 'auth/user-not-found':
          mensajeError = 'No existe una cuenta con este correo electrónico';
          break;
        case 'auth/invalid-email':
          mensajeError = 'El formato del correo electrónico no es válido, Ingresar otro';
          break;
        case 'auth/too-many-requests':
          mensajeError = 'Demasiados intentos. Intente más tarde';
          break;
        default:
          mensajeError = error.message;
      }
      
      dispatch({ type: 'SET_ERROR', payload: mensajeError });
      throw new Error(mensajeError);
    } finally {
      dispatch({ type: 'SET_CARGANDO', payload: false });
    }
  };

  // Funciones de repuestos
  const obtenerRepuestos = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_CARGANDO_REPUESTOS', payload: true });
      dispatch({ type: 'LIMPIAR_ERROR' });
      
      const q = query(collection(db, 'repuestos'), orderBy('fechaCreacion', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const repuestos: Repuesto[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        repuestos.push({
          id: doc.id,
          nombre: data.nombre,
          descripcion: data.descripcion,
          cantidad: data.cantidad,
          precio: data.precio,
          categoria: data.categoria || 'General',
          stockMinimo: data.stockMinimo || 5,
          imagenUrl: data.imagenUrl,
          fechaCreacion: data.fechaCreacion?.toDate() || new Date(),
          fechaActualizacion: data.fechaActualizacion?.toDate() || new Date(),
        });
      });
      
      dispatch({ type: 'SET_REPUESTOS', payload: repuestos });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al obtener repuestos' });
      throw new Error('Error al obtener repuestos');
    } finally {
      dispatch({ type: 'SET_CARGANDO_REPUESTOS', payload: false });
    }
  };

  const agregarRepuesto = async (repuesto: Omit<Repuesto, 'id' | 'fechaCreacion' | 'fechaActualizacion'>): Promise<void> => {
    // Timeout para evitar que se quede colgado
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout: La operación tardó demasiado')), 10000); // 10 segundos
    });

    try {
      console.log('Iniciando agregado de repuesto:', repuesto);
      dispatch({ type: 'SET_CARGANDO', payload: true });
      dispatch({ type: 'LIMPIAR_ERROR' });
      
      // Verificar que el usuario esté autenticado
      if (!estado.usuario) {
        throw new Error('Usuario no autenticado');
      }
      
      const ahora = new Date();
      const nuevoRepuesto = {
        nombre: repuesto.nombre,
        descripcion: repuesto.descripcion,
        cantidad: repuesto.cantidad,
        precio: repuesto.precio,
        categoria: repuesto.categoria,
        stockMinimo: repuesto.stockMinimo,
        imagenUrl: repuesto.imagenUrl || null,
        fechaCreacion: Timestamp.fromDate(ahora),
        fechaActualizacion: Timestamp.fromDate(ahora),
      };
      
      console.log('Datos a guardar en Firestore:', nuevoRepuesto);
      console.log('Iniciando operación con timeout de 10 segundos...');
      
      // Usar Promise.race para implementar timeout
      const docRef = await Promise.race([
        addDoc(collection(db, 'repuestos'), nuevoRepuesto),
        timeoutPromise
      ]) as any;
      
      console.log('Repuesto guardado con ID:', docRef.id);
      
      const repuestoCompleto: Repuesto = {
        id: docRef.id,
        nombre: repuesto.nombre,
        descripcion: repuesto.descripcion,
        cantidad: repuesto.cantidad,
        precio: repuesto.precio,
        categoria: repuesto.categoria,
        stockMinimo: repuesto.stockMinimo,
        imagenUrl: repuesto.imagenUrl,
        fechaCreacion: ahora,
        fechaActualizacion: ahora,
      };
      
      dispatch({ type: 'AGREGAR_REPUESTO', payload: repuestoCompleto });
      console.log('Repuesto agregado al estado local exitosamente');
    } catch (error: any) {
      console.error('Error detallado al agregar repuesto:', error);
      let mensajeError = 'Error al agregar repuesto';
      
      if (error.message === 'Timeout: La operación tardó demasiado') {
        mensajeError = 'La operación tardó demasiado. Verifica tu conexión a internet y las reglas de Firestore.';
      } else if (error.code === 'permission-denied') {
        mensajeError = 'No tienes permisos para agregar repuestos. Verifica las reglas de Firestore.';
      } else if (error.code === 'unavailable') {
        mensajeError = 'Servicio no disponible. Verifica tu conexión a internet.';
      } else if (error.code === 'unauthenticated') {
        mensajeError = 'Usuario no autenticado. Inicia sesión nuevamente.';
      } else if (error.message) {
        mensajeError = `Error: ${error.message}`;
      }
      
      dispatch({ type: 'SET_ERROR', payload: mensajeError });
      throw new Error(mensajeError);
    } finally {
      console.log('Finalizando operación, reseteando estado de carga...');
      dispatch({ type: 'SET_CARGANDO', payload: false });
    }
  };

  const actualizarRepuesto = async (id: string, repuesto: Partial<Repuesto>): Promise<void> => {
    // Timeout para evitar que se quede colgado
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Timeout: La actualización tardó demasiado')), 10000); // 10 segundos
    });

    try {
      console.log('Iniciando actualización de repuesto:', id, repuesto);
      dispatch({ type: 'SET_CARGANDO', payload: true });
      dispatch({ type: 'LIMPIAR_ERROR' });
      
      const datosActualizacion = {
        ...repuesto,
        fechaActualizacion: Timestamp.fromDate(new Date()),
      };
      
      console.log('Datos a actualizar en Firestore:', datosActualizacion);
      console.log('Iniciando actualización con timeout de 10 segundos...');
      
      // Usar Promise.race para implementar timeout
      await Promise.race([
        updateDoc(doc(db, 'repuestos', id), datosActualizacion),
        timeoutPromise
      ]);
      
      console.log('Repuesto actualizado exitosamente');
      dispatch({ type: 'ACTUALIZAR_REPUESTO', payload: { id, repuesto } });
    } catch (error: any) {
      console.error('Error detallado al actualizar repuesto:', error);
      let mensajeError = 'Error al actualizar repuesto';
      
      if (error.message === 'Timeout: La actualización tardó demasiado') {
        mensajeError = 'La actualización tardó demasiado. Verifica tu conexión a internet y las reglas de Firestore.';
      } else if (error.code === 'permission-denied') {
        mensajeError = 'No tienes permisos para actualizar repuestos. Verifica las reglas de Firestore.';
      } else if (error.code === 'unavailable') {
        mensajeError = 'Servicio no disponible. Verifica tu conexión a internet.';
      } else if (error.code === 'unauthenticated') {
        mensajeError = 'Usuario no autenticado. Inicia sesión nuevamente.';
      } else if (error.message) {
        mensajeError = `Error: ${error.message}`;
      }
      
      dispatch({ type: 'SET_ERROR', payload: mensajeError });
      throw new Error(mensajeError);
    } finally {
      console.log('Finalizando actualización, reseteando estado de carga...');
      dispatch({ type: 'SET_CARGANDO', payload: false });
    }
  };

  const eliminarRepuesto = async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_CARGANDO', payload: true });
      dispatch({ type: 'LIMPIAR_ERROR' });
      
      // Buscar el repuesto para obtener la URL de la imagen
      const repuesto = estado.repuestos.find(r => r.id === id);
      
      // Eliminar imagen si existe
      if (repuesto?.imagenUrl) {
        await eliminarImagen(repuesto.imagenUrl);
      }
      
      await deleteDoc(doc(db, 'repuestos', id));
      dispatch({ type: 'ELIMINAR_REPUESTO', payload: id });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al eliminar repuesto' });
      throw new Error('Error al eliminar repuesto');
    } finally {
      dispatch({ type: 'SET_CARGANDO', payload: false });
    }
  };

  // Funciones de imágenes
  const subirImagen = async (uri: string): Promise<string> => {
    try {
      console.log('Iniciando subida de imagen:', uri);
      
      // Verificar que el usuario esté autenticado
      if (!estado.usuario) {
        throw new Error('Usuario no autenticado para subir imágenes');
      }
      
      // Crear un nombre de archivo único
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(7);
      const nombreArchivo = `repuestos/${timestamp}_${randomId}.jpg`;
      
      console.log('Nombre de archivo:', nombreArchivo);
      
      // Obtener la imagen como blob
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error(`Error al obtener imagen: ${response.status} ${response.statusText}`);
      }
      
      const blob = await response.blob();
      console.log('Blob creado - Tipo:', blob.type, 'Tamaño:', blob.size);
      
      // Verificar que el blob no esté vacío
      if (blob.size === 0) {
        throw new Error('La imagen está vacía o corrupta');
      }
      
      // Crear referencia de Storage
      const storageRef = ref(storage, nombreArchivo);
      console.log('Referencia de Storage creada:', storageRef.fullPath);
      
      // Subir con metadatos
      const metadata = {
        contentType: 'image/jpeg',
        customMetadata: {
          'uploadedBy': estado.usuario.uid,
          'uploadedAt': new Date().toISOString()
        }
      };
      
      console.log('Iniciando subida a Firebase Storage...');
      const snapshot = await uploadBytes(storageRef, blob, metadata);
      console.log('Imagen subida exitosamente. Bytes transferidos:', snapshot.metadata.size);
      
      // Obtener URL de descarga
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('URL de descarga obtenida:', downloadURL);
      
      return downloadURL;
    } catch (error: any) {
      console.error('Error detallado al subir imagen:', {
        message: error.message,
        code: error.code,
        serverResponse: error.serverResponse,
        customData: error.customData
      });
      
      let mensajeError = 'Error al subir imagen';
      
      if (error.code === 'storage/unauthorized') {
        mensajeError = 'No tienes permisos para subir imágenes. Verifica las reglas de Storage.';
      } else if (error.code === 'storage/canceled') {
        mensajeError = 'Subida de imagen cancelada';
      } else if (error.code === 'storage/unknown') {
        mensajeError = 'Error desconocido de Storage. Verifica tu conexión y configuración de Firebase.';
      } else if (error.code === 'storage/invalid-format') {
        mensajeError = 'Formato de imagen no válido';
      } else if (error.code === 'storage/invalid-argument') {
        mensajeError = 'Argumentos inválidos para Storage';
      } else if (error.message) {
        mensajeError = `Error: ${error.message}`;
      }
      
      dispatch({ type: 'SET_ERROR', payload: mensajeError });
      throw new Error(mensajeError);
    }
  };

  const eliminarImagen = async (url: string): Promise<void> => {
    try {
      // Extraer el path de la URL de Firebase Storage
      const baseUrl = 'https://firebasestorage.googleapis.com/v0/b/';
      if (url.startsWith(baseUrl)) {
        const pathStart = url.indexOf('/o/') + 3;
        const pathEnd = url.indexOf('?');
        const encodedPath = url.substring(pathStart, pathEnd);
        const decodedPath = decodeURIComponent(encodedPath);
        
        const imageRef = ref(storage, decodedPath);
        await deleteObject(imageRef);
        console.log('Imagen eliminada exitosamente');
      }
    } catch (error: any) {
      console.warn('Error al eliminar imagen:', error);
      // No lanzamos error aquí para no interrumpir otras operaciones
    }
  };

  // Funciones de categorías
  const obtenerCategorias = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_CARGANDO_CATEGORIAS', payload: true });
      dispatch({ type: 'LIMPIAR_ERROR' });
      
      const q = query(collection(db, 'categorias'), orderBy('fechaCreacion', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const categorias: Categoria[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        categorias.push({
          id: doc.id,
          nombre: data.nombre,
          descripcion: data.descripcion,
          color: data.color,
          fechaCreacion: data.fechaCreacion?.toDate() || new Date(),
        });
      });
      
      dispatch({ type: 'SET_CATEGORIAS', payload: categorias });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al obtener categorías' });
      throw new Error('Error al obtener categorías');
    } finally {
      dispatch({ type: 'SET_CARGANDO_CATEGORIAS', payload: false });
    }
  };

  const agregarCategoria = async (categoria: Omit<Categoria, 'id' | 'fechaCreacion'>): Promise<void> => {
    try {
      dispatch({ type: 'SET_CARGANDO', payload: true });
      dispatch({ type: 'LIMPIAR_ERROR' });
      
      const ahora = new Date();
      const nuevaCategoria = {
        ...categoria,
        fechaCreacion: Timestamp.fromDate(ahora),
      };
      
      const docRef = await addDoc(collection(db, 'categorias'), nuevaCategoria);
      
      const categoriaCompleta: Categoria = {
        id: docRef.id,
        ...categoria,
        fechaCreacion: ahora,
      };
      
      dispatch({ type: 'AGREGAR_CATEGORIA', payload: categoriaCompleta });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al agregar categoría' });
      throw new Error('Error al agregar categoría');
    } finally {
      dispatch({ type: 'SET_CARGANDO', payload: false });
    }
  };

  const actualizarCategoria = async (id: string, categoria: Partial<Categoria>): Promise<void> => {
    try {
      dispatch({ type: 'SET_CARGANDO', payload: true });
      dispatch({ type: 'LIMPIAR_ERROR' });
      
      await updateDoc(doc(db, 'categorias', id), categoria);
      dispatch({ type: 'ACTUALIZAR_CATEGORIA', payload: { id, categoria } });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al actualizar categoría' });
      throw new Error('Error al actualizar categoría');
    } finally {
      dispatch({ type: 'SET_CARGANDO', payload: false });
    }
  };

  const eliminarCategoria = async (id: string): Promise<void> => {
    try {
      dispatch({ type: 'SET_CARGANDO', payload: true });
      dispatch({ type: 'LIMPIAR_ERROR' });
      
      await deleteDoc(doc(db, 'categorias', id));
      dispatch({ type: 'ELIMINAR_CATEGORIA', payload: id });
    } catch (error: any) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al eliminar categoría' });
      throw new Error('Error al eliminar categoría');
    } finally {
      dispatch({ type: 'SET_CARGANDO', payload: false });
    }
  };

  // Funciones de filtrado y estadísticas
  const filtrarRepuestos = (filtros: FiltrosRepuestos): Repuesto[] => {
    return estado.repuestos.filter(repuesto => {
      const cumpleBusqueda = !filtros.busqueda || 
        repuesto.nombre.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
        repuesto.descripcion.toLowerCase().includes(filtros.busqueda.toLowerCase());
      
      const cumpleCategoria = !filtros.categoria || filtros.categoria === 'Todas' || 
        repuesto.categoria === filtros.categoria;
      
      const cumplePrecio = repuesto.precio >= filtros.precioMinimo && 
        repuesto.precio <= filtros.precioMaximo;
      
      const cumpleCantidad = repuesto.cantidad >= filtros.cantidadMinima;
      
      const cumpleStockBajo = !filtros.soloStockBajo || 
        repuesto.cantidad <= repuesto.stockMinimo;
      
      return cumpleBusqueda && cumpleCategoria && cumplePrecio && cumpleCantidad && cumpleStockBajo;
    });
  };

  const obtenerEstadisticas = (): EstadisticasInventario => {
    const totalRepuestos = estado.repuestos.reduce((total, repuesto) => total + repuesto.cantidad, 0);
    const valorTotalInventario = estado.repuestos.reduce((total, repuesto) => total + (repuesto.precio * repuesto.cantidad), 0);
    const repuestosStockBajo = estado.repuestos.filter(repuesto => repuesto.cantidad <= repuesto.stockMinimo).length;
    
    // Encontrar categoría con más repuestos
    const categoriaCount: { [key: string]: number } = {};
    estado.repuestos.forEach(repuesto => {
      categoriaCount[repuesto.categoria] = (categoriaCount[repuesto.categoria] || 0) + 1;
    });
    
    const categoriaConMasRepuestos = Object.keys(categoriaCount).reduce((a, b) => 
      categoriaCount[a] > categoriaCount[b] ? a : b, 'General');
    
    const promedioPrecios = estado.repuestos.length > 0 ? 
      estado.repuestos.reduce((total, repuesto) => total + repuesto.precio, 0) / estado.repuestos.length : 0;
    
    return {
      totalRepuestos,
      valorTotalInventario,
      repuestosStockBajo,
      categoriaConMasRepuestos,
      promedioPrecios,
    };
  };

  const obtenerRepuestosStockBajo = (): Repuesto[] => {
    return estado.repuestos.filter(repuesto => repuesto.cantidad <= repuesto.stockMinimo);
  };

  const limpiarError = (): void => {
    dispatch({ type: 'LIMPIAR_ERROR' });
  };

  const valor = {
    ...estado,
    iniciarSesion,
    registrarUsuario,
    cerrarSesion,
    recuperarContrasena,
    obtenerRepuestos,
    agregarRepuesto,
    actualizarRepuesto,
    eliminarRepuesto,
    filtrarRepuestos,
    obtenerCategorias,
    agregarCategoria,
    actualizarCategoria,
    eliminarCategoria,
    obtenerEstadisticas,
    obtenerRepuestosStockBajo,
    subirImagen,
    eliminarImagen,
    limpiarError,
  };

  return (
    <ContextoRepuestos.Provider value={valor}>
      {children}
    </ContextoRepuestos.Provider>
  );
};

// Hook personalizado
export const useContextoRepuestos = () => {
  const contexto = useContext(ContextoRepuestos);
  if (contexto === undefined) {
    throw new Error('useContextoRepuestos debe usarse dentro de un ProveedorContextoRepuestos');
  }
  return contexto;
};
