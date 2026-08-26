export type TipoTramite = 
  | 'Proveido Escrito ( Indicar si es reterativo)'
  | 'Emisión de Sentencia primera instancia  y segunda instancia'
  | 'Notificación'
  | 'Elevacion de Expedientes'
  | 'Diligencias o Audiencias'
  | 'Trámite Documentario'
  | 'Otros y Sugerencias';

export interface JuzgadoItem {
  id: string;
  nombre: string;
  especialidad: 'Civil' | 'Laboral' | 'Familia' | 'Penal' | 'Constitucional' | 'Paz Letrado' | 'Comercial' | 'Otro';
  sede?: string;
  juez?: string;
  especialistas: string[];
}

export interface SolicitudPedido {
  id: string;
  fechaCreacion: string; // ISO string
  saludo: string; // e.g. "Buen día Dra. Yuly"
  tipoTramite: string; // uno de los 5 tipos
  expediente: string; // e.g. "02098-2015-8-0401-JR-CI-10"
  juzgado: string; // e.g. "10mo Juzgado Civil"
  materia: string; // e.g. "Reivindicación"
  especialista: string; // e.g. "Francis Zegarra Cardenas"
  requerimiento: string;
  solicitante?: string;
  telefono?: string;
  colegiaturaOCasilla?: string;
  prioridad: 'Normal' | 'Urgente' | 'Muy Urgente';
  estado: 'Pendiente' | 'En Trámite' | 'Atendido' | 'Observado';
  observaciones?: string;
  fechaEscritoPendiente?: string;
}

export interface ConfiguracionGrupo {
  nombreGrupo: string;
  destinatarioDefault: string; // e.g. "Dra. Yuly"
  telefonoCoordinador: string;
  enlaceGrupoWhatsapp: string;
  adminPassword?: string;
  tiposTramite: {
    id: number;
    titulo: string;
    descripcion: string;
    icono: string;
    tagColor: string;
  }[];
  juzgados: JuzgadoItem[];
  materiasFrecuentes: string[];
}

export type ViewMode = 'public' | 'admin';

