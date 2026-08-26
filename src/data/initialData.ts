import { ConfiguracionGrupo, SolicitudPedido } from '../types';

export const INITIAL_CONFIG: ConfiguracionGrupo = {
  nombreGrupo: "Grupo de Impulso Procesal Judicial - WhatsApp",
  destinatarioDefault: "Buen día Dra. Yuly",
  telefonoCoordinador: "51987654321",
  enlaceGrupoWhatsapp: "https://chat.whatsapp.com/pedidos-judiciales-oficial",
  tiposTramite: [
    {
      id: 1,
      titulo: "Proveido Escrito ( Indicar si es reterativo)",
      descripcion: "Solicitud de proveído de escrito pendiente de resolver o calificar (indicar si es reiterativo).",
      icono: "FileClock",
      tagColor: "blue"
    },
    {
      id: 2,
      titulo: "Emisión de Sentencia primera instancia  y segunda instancia",
      descripcion: "Expediente expedito para resolver o emitir sentencia en primera o segunda instancia / auto final.",
      icono: "Scale",
      tagColor: "amber"
    },
    {
      id: 3,
      titulo: "Notificación",
      descripcion: "Impulso de diligenciamiento de cédulas físicas, electrónicas y devolución de cargos.",
      icono: "Send",
      tagColor: "emerald"
    },
    {
      id: 4,
      titulo: "Elevacion de Expedientes",
      descripcion: "Elevación de actuados a Sala Superior o Corte Suprema por apelación o casación concedida.",
      icono: "Layers",
      tagColor: "purple"
    },
    {
      id: 5,
      titulo: "Diligencias o Audiencias",
      descripcion: "Programación, reprogramación o realización de audiencias, declaraciones o inspecciones.",
      icono: "Calendar",
      tagColor: "rose"
    },
    {
      id: 6,
      titulo: "Trámite Documentario",
      descripcion: "Expedición de copias certificadas, oficios, exhortos, endoses y desarchivamiento.",
      icono: "Files",
      tagColor: "cyan"
    },
    {
      id: 7,
      titulo: "Otros y Sugerencias",
      descripcion: "Otras solicitudes procesales, incidencias administrativas o sugerencias de atención judicial.",
      icono: "Sparkles",
      tagColor: "slate"
    }
  ],
  juzgados: [
    {
      id: "juz-civ-10",
      nombre: "10mo Juzgado Civil",
      especialidad: "Civil",
      sede: "Sede Central - Palacio de Justicia",
      juez: "Dra. SALAS FLORES, ZORAIDA JULIA",
      especialistas: [
        "Francis Zegarra Cardenas",
        "GARCIA JURADO MARISOL",
        "LIZARZABURU ROMERO CHRISTIAN EDUARDO",
         "MANTILLA VALDIVIA ERIK ALEXANDER",
         "FERNANDEZ HUAQUIPACO NORMA HILDA",
         "PEÑA CONDORI JESUS WANPIAU"
      ]
    },
    {
      id: "juz-civ-01",
      nombre: "1er Juzgado Civil",
      especialidad: "Civil",
      sede: "Sede Central",
      juez: "Dra. Patricia Arispe",
      especialistas: [
        "Mario Benavente Ponce",
        "Rosa Salazar Quispe",
        "Alonso Delgado Morales"
      ]
    },
    {
      id: "juz-civ-02",
      nombre: "2do Juzgado Civil",
      especialidad: "Civil",
      sede: "Sede Central",
      juez: "Dr. Víctor Guzmán",
      especialistas: [
        "Gisella Ramos Fernández",
        "Jorge Luis Cáceres",
        "Ana María Valdivia"
      ]
    },
    {
      id: "juz-civ-03",
      nombre: "3er Juzgado Civil",
      especialidad: "Civil",
      sede: "Sede Central",
      juez: "Dra. Elena Cornejo",
      especialistas: [
        "Héctor Velásquez Neyra",
        "Claudia Medina Torres"
      ]
    },
    {
      id: "juz-civ-04",
      nombre: "4to Juzgado Civil",
      especialidad: "Civil",
      sede: "Sede Central",
      juez: "Dr. Javier Monroy",
      especialistas: [
        "Sandra Beltrán Zúñiga",
        "Christian Portugal Apaza"
      ]
    },
    {
      id: "juz-civ-05",
      nombre: "5to Juzgado Civil",
      especialidad: "Civil",
      sede: "Sede Central",
      juez: "Dra. Carmen Montes",
      especialistas: [
        "Lucía Carpio Rivero",
        "Daniel Flores Mamani"
      ]
    },
    {
      id: "juz-civ-06",
      nombre: "6to Juzgado Civil",
      especialidad: "Civil",
      sede: "Sede Central",
      juez: "Dr. Fernando Vizcarra",
      especialistas: [
        "Rodrigo Pacheco Díaz",
        "Karina Gutiérrez Vera"
      ]
    },
    {
      id: "juz-civ-07",
      nombre: "7mo Juzgado Civil",
      especialidad: "Civil",
      sede: "Sede Central",
      juez: "Dra. Teresa Alarcón",
      especialistas: [
        "Miguel Ángel Pinto",
        "Vanessa Rojas Condori"
      ]
    },
    {
      id: "juz-civ-08",
      nombre: "8vo Juzgado Civil",
      especialidad: "Civil",
      sede: "Sede Central",
      juez: "Dr. Luis Guillén",
      especialistas: [
        "Esteban Quiroz Meza",
        "Monica Ticona Huanca"
      ]
    },
    {
      id: "juz-civ-09",
      nombre: "9no Juzgado Civil",
      especialidad: "Civil",
      sede: "Sede Central",
      juez: "Dra. Patricia Vilca",
      especialistas: [
        "Diego Manrique Soto",
        "Paola Yáñez Barreda"
      ]
    },
    {
      id: "juz-lab-01",
      nombre: "1er Juzgado de Trabajo (NLPT)",
      especialidad: "Laboral",
      sede: "Sede Laboral",
      juez: "Dr. Hugo Barrera",
      especialistas: [
        "Silvia Colquehuanca",
        "Gonzalo Miranda Paz"
      ]
    },
    {
      id: "juz-lab-02",
      nombre: "2do Juzgado de Trabajo (NLPT)",
      especialidad: "Laboral",
      sede: "Sede Laboral",
      juez: "Dra. Rocío Cuadros",
      especialistas: [
        "Marcos Espinoza Cruz",
        "Evelyn Choque Villegas"
      ]
    },
    {
      id: "juz-fam-01",
      nombre: "1er Juzgado de Familia",
      especialidad: "Familia",
      sede: "Sede Familia",
      juez: "Dra. Clara Fuentes",
      especialistas: [
        "Jessica Huamán Arias",
        "Walter Zevallos Ramos"
      ]
    },
    {
      id: "juz-const-01",
      nombre: "1er Juzgado Constitucional",
      especialidad: "Constitucional",
      sede: "Palacio de Justicia",
      juez: "Dr. Oscar Ballón",
      especialistas: [
        "César Huanca Portilla",
        "Diana Cárdenas Becerra"
      ]
    },
    {
      id: "juz-paz-01",
      nombre: "1er Juzgado de Paz Letrado Civil",
      especialidad: "Paz Letrado",
      sede: "Sede Módulo Básico",
      juez: "Dra. Nadia Portocarrero",
      especialistas: [
        "Manuel Bustamante Vera",
        "Liliana Cuentas Salas"
      ]
    }
  ],
  materiasFrecuentes: [
    "Reivindicación",
    "Obligación de Dar Suma de Dinero",
    "Desalojo por Ocupación Precaria",
    "Nulidad de Acto Jurídico",
    "Prescripción Adquisitiva de Dominio",
    "Otorgamiento de Escritura Pública",
    "División y Partición de Bienes",
    "Indemnización por Daños y Perjuicios",
    "Alimentos y Aumento de Alimentos",
    "Pago de Beneficios Sociales (NLPT)",
    "Reposición Laboral",
    "Acción de Amparo",
    "Sucesión Intestada",
    "Ejecución de Garantías",
    "Tercería de Propiedad",
    "Medida Cautelar Fuera de Proceso"
  ]
};

export const INITIAL_PEDIDOS: SolicitudPedido[] = [
  {
    id: "ped-001",
    fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    saludo: "Buen dia dra. Yuly",
    tipoTramite: "Proveido Escrito ( Indicar si es reterativo)",
    expediente: "02098-2015-8-0401-JR-CI-10",
    juzgado: "10mo Juzgado Civil",
    materia: "Reivindicación",
    especialista: "Francis Zegarra Cardenas",
    requerimiento: "Desde el 07 de julio del año en curso se encuentra pendiente de resolver escritos para poder impulsar el proceso. El expediente se tramita con la nueva especialista Dra. Francis Zegarra Cardenas. Pese a que existe un proceso disciplinario, la demora sigue perjudicando.",
    solicitante: "Dr. Marco Aurelio Vargas",
    telefono: "+51 958 123 456",
    colegiaturaOCasilla: "CAA 45892 / Casilla SINOE 11420",
    prioridad: "Muy Urgente",
    estado: "Pendiente",
    fechaEscritoPendiente: "2026-07-07"
  },
  {
    id: "ped-002",
    fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    saludo: "Buen día Dra. Yuly",
    tipoTramite: "Emisión de Sentencia primera instancia  y segunda instancia",
    expediente: "01452-2021-0-0401-JR-CI-02",
    juzgado: "2do Juzgado Civil",
    materia: "Obligación de Dar Suma de Dinero",
    especialista: "Gisella Ramos Fernández",
    requerimiento: "El proceso se encuentra con informe oral realizado y al despacho para sentenciar desde hace más de 45 días hábiles, habiendo vencido en exceso el plazo legal para emitir sentencia.",
    solicitante: "Dra. Beatriz Lucero",
    telefono: "+51 984 765 432",
    colegiaturaOCasilla: "CAA 38710",
    prioridad: "Urgente",
    estado: "En Trámite",
    observaciones: "Coordinado con especialista para revisión el viernes."
  },
  {
    id: "ped-003",
    fechaCreacion: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    saludo: "Buenas tardes Dra. Yuly",
    tipoTramite: "Notificación",
    expediente: "00874-2023-0-0401-JR-CI-01",
    juzgado: "1er Juzgado Civil",
    materia: "Desalojo por Ocupación Precaria",
    especialista: "Rosa Salazar Quispe",
    requerimiento: "Se solicita impulsar la notificación de la Resolución N° 04 a la parte demandada en su domicilio real, habiendo transcurrido más de 30 días sin que se adjunte el cargo de notificación respectivo a los autos.",
    solicitante: "Dr. Carlos Enrique Mendoza",
    telefono: "+51 991 234 876",
    colegiaturaOCasilla: "CAA 50122",
    prioridad: "Normal",
    estado: "Atendido",
    observaciones: "Cédula remitida a Central de Notificaciones SERNOT."
  }
];
