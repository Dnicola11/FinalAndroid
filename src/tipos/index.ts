// Tipos para la aplicación de gestión de repuestos

export interface Repuesto {
  id: string;
  nombre: string;
  descripcion: string;
  cantidad: number;
  precio: number;
  imagenUrl?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface Usuario {
  uid: string;
  email: string;
  displayName?: string;
}

export interface EstadoContexto {
  usuario: Usuario | null;
  repuestos: Repuesto[];
  cargando: boolean;
  cargandoRepuestos: boolean;
  error: string | null;
}

export interface AccionesContexto {
  // Autenticación
  iniciarSesion: (email: string, password: string) => Promise<void>;
  registrarUsuario: (email: string, password: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;
  
  // Repuestos
  obtenerRepuestos: () => Promise<void>;
  agregarRepuesto: (repuesto: Omit<Repuesto, 'id' | 'fechaCreacion' | 'fechaActualizacion'>) => Promise<void>;
  actualizarRepuesto: (id: string, repuesto: Partial<Repuesto>) => Promise<void>;
  eliminarRepuesto: (id: string) => Promise<void>;
  
  // Imágenes
  subirImagen: (uri: string) => Promise<string>;
  eliminarImagen: (url: string) => Promise<void>;
  
  // Utilidades
  limpiarError: () => void;
}

export type RootStackParamList = {
  PantallaLogin: undefined;
  PantallaListaRepuestos: undefined;
  PantallaAgregarRepuesto: undefined;
  PantallaEditarRepuesto: { repuesto: Repuesto };
  PantallaRegistro: undefined;
};

export interface FormularioRepuesto {
  nombre: string;
  descripcion: string;
  cantidad: string;
  precio: string;
  imagenUri?: string;
}
