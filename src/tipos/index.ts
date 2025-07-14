// Tipos para la aplicación de gestión de repuestos

export interface Repuesto {
  id: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  categoria: string;
  stockMinimo: number;
  imagenUrl?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
  color: string;
  fechaCreacion: Date;
}

export interface EstadisticasInventario {
  totalRepuestos: number;
  valorTotalInventario: number;
  repuestosStockBajo: number;
  categoriaConMasRepuestos: string;
  promedioPrecios: number;
}

export interface FiltrosRepuestos {
  busqueda: string;
  categoria: string;
  precioMinimo: number;
  precioMaximo: number;
  cantidadMinima: number;
  soloStockBajo: boolean;
}

export interface Usuario {
  uid: string;
  email: string;
  displayName?: string;
}

export interface EstadoContexto {
  usuario: Usuario | null;
  repuestos: Repuesto[];
  categorias: Categoria[];
  cargando: boolean;
  cargandoRepuestos: boolean;
  cargandoCategorias: boolean;
  error: string | null;
}

export interface AccionesContexto {
  // Autenticación
  iniciarSesion: (email: string, password: string) => Promise<void>;
  registrarUsuario: (email: string, password: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;
  recuperarContrasena: (email: string) => Promise<void>;
  
  // Repuestos
  obtenerRepuestos: () => Promise<void>;
  agregarRepuesto: (repuesto: Omit<Repuesto, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) => Promise<void>;
  actualizarRepuesto: (id: string, repuesto: Partial<Repuesto>) => Promise<void>;
  eliminarRepuesto: (id: string) => Promise<void>;
  filtrarRepuestos: (filtros: FiltrosRepuestos) => Repuesto[];
  
  // Categorías
  obtenerCategorias: () => Promise<void>;
  agregarCategoria: (categoria: Omit<Categoria, 'id' | 'fechaCreacion'>) => Promise<void>;
  actualizarCategoria: (id: string, categoria: Partial<Categoria>) => Promise<void>;
  eliminarCategoria: (id: string) => Promise<void>;
  
  // Estadísticas
  obtenerEstadisticas: () => EstadisticasInventario;
  obtenerRepuestosStockBajo: () => Repuesto[];
  
  // Imágenes
  subirImagen: (uri: string) => Promise<string>;
  eliminarImagen: (url: string) => Promise<void>;
  
  // Utilidades
  limpiarError: () => void;
}

export type RootStackParamList = {
  PantallaLogin: undefined;
  PantallaRegistro: undefined;
  TabsNavegacion: undefined;
  PantallaAgregarRepuesto: undefined;
  PantallaEditarRepuesto: { repuesto: Repuesto };
};

export type TabsParamList = {
  ListaRepuestos: undefined;
  Dashboard: undefined;
  GestionInventario: undefined;
};

export type StackRepuestosParamList = {
  PantallaListaRepuestos: undefined;
  PantallaAgregarRepuesto: undefined;
  PantallaEditarRepuesto: { repuesto: Repuesto };
};

export interface FormularioRepuesto {
  nombre: string;
  descripcion: string;
  cantidad: string;
  precio: string;
  categoria: string;
  stockMinimo: string;
  imagenUri?: string;
}
