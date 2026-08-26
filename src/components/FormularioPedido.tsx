import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Building2, 
  UserCheck, 
  Scale, 
  Sparkles, 
  Calendar, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Send, 
  Copy, 
  RotateCcw,
  MessageSquare,
  ShieldAlert,
  ChevronDown,
  Info,
  Layers,
  Phone,
  User,
  Hash,
  Bookmark,
  Eye,
  EyeOff
} from 'lucide-react';
import { SolicitudPedido, ConfiguracionGrupo, JuzgadoItem } from '../types';

interface FormularioPedidoProps {
  pedido: SolicitudPedido;
  setPedido: React.Dispatch<React.SetStateAction<SolicitudPedido>>;
  config: ConfiguracionGrupo;
  onSavePedido: (pedido: SolicitudPedido) => void;
  onCopyFormattedText: () => void;
  onSendDirectWhatsApp: () => void;
  onResetForm: () => void;
  onFillExample: () => void;
}

export const FormularioPedido: React.FC<FormularioPedidoProps> = ({
  pedido,
  setPedido,
  config,
  onSavePedido,
  onCopyFormattedText,
  onSendDirectWhatsApp,
  onResetForm,
  onFillExample,
}) => {
  const [selectedJuzgadoItem, setSelectedJuzgadoItem] = useState<JuzgadoItem | null>(null);
  const [customEspecialista, setCustomEspecialista] = useState(false);
  const [showSolicitante, setShowSolicitante] = useState(false);
  const [activeTemplateCategory, setActiveTemplateCategory] = useState<'demora' | 'sentencia' | 'notificacion' | 'general'>('demora');

  // Sync selected court whenever pedido.juzgado changes
  useEffect(() => {
    const found = config.juzgados.find(j => j.nombre.toLowerCase() === pedido.juzgado.toLowerCase());
    setSelectedJuzgadoItem(found || null);
  }, [pedido.juzgado, config.juzgados]);

  // Handle court change
  const handleJuzgadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const juzgadoNombre = e.target.value;
    const found = config.juzgados.find(j => j.nombre === juzgadoNombre);
    
    setSelectedJuzgadoItem(found || null);
    
    // If the court has specialists, auto-suggest or reset especialista if not in list
    if (found && found.especialistas.length > 0) {
      // If current specialist is not in this court's list, pick first or keep empty
      if (!found.especialistas.includes(pedido.especialista)) {
        setPedido(prev => ({
          ...prev,
          juzgado: juzgadoNombre,
          especialista: found.especialistas[0] || ''
        }));
      } else {
        setPedido(prev => ({ ...prev, juzgado: juzgadoNombre }));
      }
    } else {
      setPedido(prev => ({ ...prev, juzgado: juzgadoNombre }));
    }
  };

  // Quick insertion of requirement templates
  const applyRequerimientoTemplate = (text: string) => {
    setPedido(prev => ({
      ...prev,
      requerimiento: text
    }));
  };

  const templates = {
    demora: [
      `Desde el 07 de julio del año en curso se encuentra pendiente de resolver escritos para poder impulsar el proceso. . ${pedido.especialista || '[Especialista]'}. Pese a que existe un proceso disciplinario, la demora sigue perjudicando.`,
      ``,
      `.`
    ],
    sentencia: [
      `.`,
      ``
    ],
    notificacion: [
      `.`,
      `.`
    ],
    general: [
      ``,
      `a.`
    ]
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden">
      {/* Top Banner / Helper */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6 text-white border-b border-slate-700/80">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Formulario Estructurado Oficial
              </span>
              <span className="text-xs text-slate-400">Grupo de 500 Miembros</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Registro de Solicitud Procesal
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-xl">
              Complete los 5 campos requeridos para generar el texto estandarizado listo para enviar o copiar al grupo de WhatsApp.
            </p>

            {/* AVISO IMPORTANTE EN ROJO */}
            <div className="mt-3 p-3 bg-red-950/90 border border-red-500/70 rounded-xl text-red-100 text-xs sm:text-sm flex items-start gap-2.5 shadow-sm max-w-2xl">
              <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold text-red-300">AVISO IMPORTANTE: </span>
                <span className="text-red-200">Los pedidos de Medidas Cautelares Reservados no serán atendidos. </span>
                <span className="font-semibold text-white block sm:inline">Únicamente se atenderán los pedidos de Medidas Cautelares Públicas.</span>
              </div>
            </div>
          </div>

          {/* Action buttons on top */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              id="btn-fill-example"
              type="button"
              onClick={onFillExample}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-600 transition-colors flex items-center gap-1.5 shadow-sm"
              title="Cargar el caso de ejemplo típico: 10mo Juzgado Civil - Francis Zegarra"
            >
              <Bookmark className="w-3.5 h-3.5 text-amber-400" />
              <span>Ejemplo Típico</span>
            </button>
            <button
              id="btn-reset-form"
              type="button"
              onClick={onResetForm}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-xl border border-slate-600 transition-colors"
              title="Limpiar formulario"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="p-4 sm:p-6 space-y-6">
        {/* FIELD 0: SALUDO / DESTINATARIO */}
        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/90">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              Saludo / Destinatario en el Grupo
            </span>
            <span className="text-[11px] font-normal text-slate-500">Ej: "Buen dia dra. Yuly"</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="input-saludo"
              type="text"
              value={pedido.saludo}
              onChange={(e) => setPedido({ ...pedido, saludo: e.target.value })}
              placeholder="Buen dia dra. Yuly"
              className="flex-1 px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium text-slate-900 outline-none"
            />
            {/* Quick Greeting Chips */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {["Buen dia dra. Yuly", "Buenas tardes dra. Yuly", "Buen día Estimados"].map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPedido({ ...pedido, saludo: s })}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${
                    pedido.saludo === s 
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-semibold' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FIELD 1: TIPO DE TRAMITE */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>TIPO DE TRÁMITE</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {config.tiposTramite.length} Alternativas Disponibles
              </span>
            </label>
            <span className="text-xs text-slate-500 italic hidden sm:inline">
              Seleccione una de las {config.tiposTramite.length} opciones
            </span>
          </div>

          {/* The Alternatives Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-2.5">
            {config.tiposTramite.map((item, index) => {
              const isSelected = pedido.tipoTramite === item.titulo;
              return (
                <button
                  key={item.id}
                  id={`btn-tipo-tramite-${item.id}`}
                  type="button"
                  onClick={() => setPedido({ ...pedido, tipoTramite: item.titulo })}
                  className={`p-3 text-left rounded-xl border-2 transition-all flex flex-col justify-between relative group ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/80 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white hover:border-emerald-300 hover:bg-slate-50/80'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {index + 1}
                      </span>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 animate-scale" />
                      )}
                    </div>
                    <div className={`text-xs font-bold leading-snug line-clamp-2 ${
                      isSelected ? 'text-emerald-950' : 'text-slate-900'
                    }`}>
                      {item.titulo}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {item.descripcion}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Quick confirmation banner of selected trámite */}
          {pedido.tipoTramite && (
            <div className="bg-emerald-50/90 text-emerald-900 border border-emerald-200/90 px-3.5 py-2 rounded-lg text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold">Seleccionado:</span>
                <span className="font-bold">{pedido.tipoTramite}</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-medium">Opción Activa</span>
            </div>
          )}
        </div>

        {/* FIELD 2 & 3: EXPEDIENTE Y MATERIA */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* EXPEDIENTE (7 Cols) */}
          <div className="md:col-span-7 space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-[11px] flex items-center justify-center font-bold">2</span>
                <span>EXPEDIENTE JUDICIAL</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">Formato: 02098-2015-8-0401-JR-CI-10</span>
            </label>
            <div className="relative">
              <input
                id="input-expediente"
                type="text"
                value={pedido.expediente}
                onChange={(e) => setPedido({ ...pedido, expediente: e.target.value })}
                placeholder="02098-2015-8-0401-JR-CI-10"
                className="w-full pl-3.5 pr-10 py-2.5 text-sm font-mono font-bold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 outline-none"
              />
              <FileText className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* MATERIA (5 Cols) */}
          <div className="md:col-span-5 space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-[11px] flex items-center justify-center font-bold">3</span>
                <span>MATERIA</span>
              </span>
              <span className="text-[11px] text-slate-500">Ej: Reivindicación</span>
            </label>
            <input
              id="input-materia"
              type="text"
              value={pedido.materia}
              onChange={(e) => setPedido({ ...pedido, materia: e.target.value })}
              placeholder="Reivindicación / Alimentos / Desalojo"
              list="materias-list"
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 font-medium outline-none"
            />
            <datalist id="materias-list">
              {config.materiasFrecuentes.map((mat, idx) => (
                <option key={idx} value={mat} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Quick Materias Pills */}
        <div className="flex items-center gap-1.5 flex-wrap -mt-2">
          <span className="text-[11px] text-slate-500 font-medium mr-1">Materias frecuentes:</span>
          {["Reivindicación", "Obligación de Dar Suma", "Desalojo", "Nulidad de Acto", "Alimentos", "Laboral"].map((m, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPedido({ ...pedido, materia: m })}
              className={`text-[11px] px-2 py-0.5 rounded-md border transition-all ${
                pedido.materia.toLowerCase().includes(m.toLowerCase())
                  ? 'bg-slate-900 text-white border-slate-900 font-medium'
                  : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        {/* FIELD 4 & 5: JUZGADO Y ESPECIALISTA (AS REQUESTED) */}
        <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Órgano Jurisdiccional y Personal a Cargo
              </h3>
            </div>
            <span className="text-xs text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded font-medium">
              Selección Inteligente
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* JUZGADO DROPDOWN / PICKER */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-[11px] flex items-center justify-center font-bold">4</span>
                  <span>JUZGADO</span>
                </span>
                <span className="text-[11px] text-slate-500">Seleccionable</span>
              </label>
              <div className="relative">
                <select
                  id="select-juzgado"
                  value={pedido.juzgado}
                  onChange={handleJuzgadoChange}
                  className="w-full pl-3.5 pr-8 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 font-semibold appearance-none outline-none"
                >
                  <option value="">-- Seleccione el Juzgado --</option>
                  <optgroup label="Juzgados Civiles">
                    {config.juzgados.filter(j => j.especialidad === 'Civil').map(j => (
                      <option key={j.id} value={j.nombre}>{j.nombre}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Juzgados Laborales">
                    {config.juzgados.filter(j => j.especialidad === 'Laboral').map(j => (
                      <option key={j.id} value={j.nombre}>{j.nombre}</option>
                    ))}
                  </optgroup>
                  <optgroup label="Otros Juzgados">
                    {config.juzgados.filter(j => j.especialidad !== 'Civil' && j.especialidad !== 'Laboral').map(j => (
                      <option key={j.id} value={j.nombre}>{j.nombre} ({j.especialidad})</option>
                    ))}
                  </optgroup>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
              </div>
              {selectedJuzgadoItem && (
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-0.5">
                  <span className="font-semibold text-slate-700">Sede:</span> {selectedJuzgadoItem.sede || 'Palacio de Justicia'}
                  {selectedJuzgadoItem.juez && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span className="font-semibold text-slate-700">Juez:</span> {selectedJuzgadoItem.juez}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* ESPECIALISTA DROPDOWN / PICKER */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-white text-[11px] flex items-center justify-center font-bold">5</span>
                  <span>ESPECIALISTA LEGAL</span>
                </label>
                <button
                  type="button"
                  onClick={() => setCustomEspecialista(!customEspecialista)}
                  className="text-[11px] text-emerald-700 hover:text-emerald-800 font-medium underline"
                >
                  {customEspecialista ? 'Elegir de la lista' : 'Escribir otro nombre'}
                </button>
              </div>

              {!customEspecialista && selectedJuzgadoItem && selectedJuzgadoItem.especialistas.length > 0 ? (
                <div className="relative">
                  <select
                    id="select-especialista"
                    value={pedido.especialista}
                    onChange={(e) => setPedido({ ...pedido, especialista: e.target.value })}
                    className="w-full pl-3.5 pr-8 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 font-semibold appearance-none outline-none"
                  >
                    <option value="">-- Seleccione Especialista del {selectedJuzgadoItem.nombre} --</option>
                    {selectedJuzgadoItem.especialistas.map((esp, idx) => (
                      <option key={idx} value={esp}>{esp}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                </div>
              ) : (
                <div className="relative">
                  <input
                    id="input-especialista"
                    type="text"
                    value={pedido.especialista}
                    onChange={(e) => setPedido({ ...pedido, especialista: e.target.value })}
                    placeholder="Francis Zegarra Cardenas"
                    className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 font-semibold outline-none"
                  />
                  <UserCheck className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              )}

              {/* Quick suggestion for Francis Zegarra Cardenas if 10mo Juzgado is chosen */}
              {pedido.juzgado.includes('10mo') && (
                <div className="text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded flex items-center justify-between">
                  <span>Especialista sugerida: <strong>Francis Zegarra Cardenas</strong></span>
                  <button
                    type="button"
                    onClick={() => setPedido({ ...pedido, especialista: 'Francis Zegarra Cardenas' })}
                    className="text-[11px] text-emerald-700 font-bold hover:underline"
                  >
                    Aplicar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FIELD 6: REQUERIMIENTO (EL CUERPO DEL PEDIDO) */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>REQUERIMIENTO / MOTIVO DE LA SOLICITUD</span>
            </label>
            
            {/* Template category selector tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px]">
              <button
                type="button"
                onClick={() => setActiveTemplateCategory('demora')}
                className={`px-2 py-0.5 rounded font-medium transition-all ${
                  activeTemplateCategory === 'demora' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Demora / Escritos
              </button>
              <button
                type="button"
                onClick={() => setActiveTemplateCategory('sentencia')}
                className={`px-2 py-0.5 rounded font-medium transition-all ${
                  activeTemplateCategory === 'sentencia' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sentencia
              </button>
              <button
                type="button"
                onClick={() => setActiveTemplateCategory('notificacion')}
                className={`px-2 py-0.5 rounded font-medium transition-all ${
                  activeTemplateCategory === 'notificacion' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cédulas
              </button>
            </div>
          </div>

          {/* Quick Clickable Template Snippets */}
          <div className="space-y-1.5">
            {templates[activeTemplateCategory].map((tmpl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyRequerimientoTemplate(tmpl)}
                className="w-full text-left p-2 rounded-lg text-xs bg-slate-50 hover:bg-emerald-50/70 border border-slate-200/80 hover:border-emerald-300 text-slate-700 transition-all flex items-start gap-2 group"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 mt-0.5 shrink-0" />
                <span className="line-clamp-2">{tmpl}</span>
              </button>
            ))}
          </div>

          {/* Main Textarea */}
          <div className="relative">
            <textarea
              id="textarea-requerimiento"
              rows={4}
              value={pedido.requerimiento}
              onChange={(e) => setPedido({ ...pedido, requerimiento: e.target.value })}
              placeholder="Describa el requerimiento, escrito pendiente de resolver, fecha del escrito, demora advertida o motivo..."
              className="w-full p-3.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-slate-900 outline-none leading-relaxed"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
              <span>Caracteres: {pedido.requerimiento.length}</span>
              <span className="text-slate-500">Se recomienda detallar fechas o estado del escrito</span>
            </div>
          </div>
        </div>

        {/* FIELD 7: DATOS DEL SOLICITANTE (OCULTO POR DEFECTO) */}
        <div className="bg-slate-50/80 rounded-xl border border-slate-200/80 overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => setShowSolicitante(!showSolicitante)}
            className="w-full px-3.5 py-2.5 flex items-center justify-between hover:bg-slate-100/70 transition-colors text-left"
          >
            <span className="text-xs font-semibold text-slate-600 flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Datos del Abogado / Solicitante (Para contacto en el grupo)</span>
              <span className="text-[10px] font-medium text-slate-500 bg-slate-200/70 px-2 py-0.5 rounded-full">
                {showSolicitante ? 'Visible' : 'Oculto'}
              </span>
            </span>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              {showSolicitante ? (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[11px]">Ocultar</span>
                </>
              ) : (
                <>
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-[11px]">Mostrar</span>
                </>
              )}
            </div>
          </button>

          {showSolicitante && (
            <div className="p-3.5 pt-1 border-t border-slate-200/70 space-y-3 bg-white/60">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nombre / Letrado</label>
                  <input
                    id="input-solicitante"
                    type="text"
                    value={pedido.solicitante || ''}
                    onChange={(e) => setPedido({ ...pedido, solicitante: e.target.value })}
                    placeholder="Dr. Marco Aurelio Vargas"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">WhatsApp / Celular</label>
                  <input
                    id="input-telefono"
                    type="text"
                    value={pedido.telefono || ''}
                    onChange={(e) => setPedido({ ...pedido, telefono: e.target.value })}
                    placeholder="+51 958 123 456"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 text-slate-800 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Colegiatura / Casilla SINOE</label>
                  <input
                    id="input-colegiatura"
                    type="text"
                    value={pedido.colegiaturaOCasilla || ''}
                    onChange={(e) => setPedido({ ...pedido, colegiaturaOCasilla: e.target.value })}
                    placeholder="CAA 45892 / Casilla 11420"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 text-slate-800 outline-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM PRIMARY ACTION BUTTONS */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            id="btn-copy-main"
            type="button"
            onClick={onCopyFormattedText}
            className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4 text-emerald-400" />
            <span>Copiar para WhatsApp</span>
          </button>

          <button
            id="btn-send-whatsapp-main"
            type="button"
            onClick={onSendDirectWhatsApp}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Enviar Directo a WhatsApp</span>
          </button>

          <button
            id="btn-save-pedido-main"
            type="button"
            onClick={() => onSavePedido(pedido)}
            className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm border border-slate-300 transition-colors flex items-center justify-center gap-2"
            title="Guardar en la bandeja interna del registro"
          >
            <Bookmark className="w-4 h-4 text-slate-600" />
            <span>Guardar Registro</span>
          </button>
        </div>
      </div>
    </div>
  );
};
