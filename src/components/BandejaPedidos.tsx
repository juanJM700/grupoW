import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Send, 
  Copy, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Building2, 
  User, 
  FileText, 
  ExternalLink,
  Plus,
  RefreshCw,
  Printer,
  FileSpreadsheet,
  FileCode,
  MessageSquare,
  Edit3,
  Check,
  X
} from 'lucide-react';
import { SolicitudPedido, ConfiguracionGrupo } from '../types';
import { formatToWhatsAppMessage, generateWhatsAppLink } from '../utils/whatsappFormatter';

interface BandejaPedidosProps {
  pedidos: SolicitudPedido[];
  onUpdatePedidoEstado: (id: string, nuevoEstado: SolicitudPedido['estado'], notas?: string) => void;
  onDeletePedido: (id: string) => void;
  onSelectForEdit: (pedido: SolicitudPedido) => void;
  config: ConfiguracionGrupo;
  onCopyText: (text: string) => void;
  onRefreshData?: () => void;
}

export const BandejaPedidos: React.FC<BandejaPedidosProps> = ({
  pedidos,
  onUpdatePedidoEstado,
  onDeletePedido,
  onSelectForEdit,
  config,
  onCopyText,
  onRefreshData
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState<string>('todos');
  const [selectedTipoTramite, setSelectedTipoTramite] = useState<string>('todos');
  const [selectedJuzgado, setSelectedJuzgado] = useState<string>('todos');
  
  // Note edit state
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [tempNoteText, setTempNoteText] = useState<string>('');

  // Filtered list
  const filteredPedidos = useMemo(() => {
    return pedidos.filter(p => {
      const matchSearch = 
        p.expediente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.juzgado.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.especialista.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.materia.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.solicitante && p.solicitante.toLowerCase().includes(searchTerm.toLowerCase())) ||
        p.requerimiento.toLowerCase().includes(searchTerm.toLowerCase());

      const matchEstado = selectedEstado === 'todos' || p.estado === selectedEstado;
      const matchTipo = selectedTipoTramite === 'todos' || p.tipoTramite === selectedTipoTramite;
      const matchJuzgado = selectedJuzgado === 'todos' || p.juzgado === selectedJuzgado;

      return matchSearch && matchEstado && matchTipo && matchJuzgado;
    });
  }, [pedidos, searchTerm, selectedEstado, selectedTipoTramite, selectedJuzgado]);

  // Export to CSV / Excel
  const handleExportCSV = () => {
    const headers = [
      "ID", 
      "Fecha Creacion", 
      "Expediente", 
      "Tipo de Tramite", 
      "Juzgado", 
      "Materia", 
      "Especialista", 
      "Requerimiento", 
      "Solicitante", 
      "Telefono", 
      "Prioridad", 
      "Estado", 
      "Observaciones / Respuesta"
    ];
    
    const rows = filteredPedidos.map(p => [
      p.id,
      new Date(p.fechaCreacion).toLocaleString(),
      `"${p.expediente.replace(/"/g, '""')}"`,
      `"${p.tipoTramite.replace(/"/g, '""')}"`,
      `"${p.juzgado.replace(/"/g, '""')}"`,
      `"${p.materia.replace(/"/g, '""')}"`,
      `"${p.especialista.replace(/"/g, '""')}"`,
      `"${p.requerimiento.replace(/"/g, '""')}"`,
      `"${(p.solicitante || '').replace(/"/g, '""')}"`,
      `"${(p.telefono || '').replace(/"/g, '""')}"`,
      p.prioridad || 'Normal',
      p.estado,
      `"${(p.observaciones || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map(e => e.join(","))].join("\r\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `pedidos_judiciales_admin_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON Backup
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredPedidos, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", `backup_pedidos_judiciales_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print view
  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (estado: SolicitudPedido['estado']) => {
    switch (estado) {
      case 'Pendiente':
        return <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1"><Clock className="w-3 h-3 text-amber-600" /> Pendiente</span>;
      case 'En Trámite':
        return <span className="bg-blue-100 text-blue-900 border border-blue-300 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1"><RefreshCw className="w-3 h-3 text-blue-600 animate-spin" /> En Trámite</span>;
      case 'Atendido':
        return <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-600" /> Atendido</span>;
      case 'Observado':
        return <span className="bg-rose-100 text-rose-900 border border-rose-300 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-rose-600" /> Observado</span>;
    }
  };

  const startEditNote = (pedido: SolicitudPedido) => {
    setEditingNoteId(pedido.id);
    setTempNoteText(pedido.observaciones || '');
  };

  const saveNote = (id: string, currentEstado: SolicitudPedido['estado']) => {
    onUpdatePedidoEstado(id, currentEstado, tempNoteText.trim());
    setEditingNoteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Bandeja y Control de Solicitudes</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                {pedidos.length} Registros Centralizados
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Panel del Administrador: Descarga de reportes, control de estados y respuestas para los 500 integrantes.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onRefreshData && (
              <button
                id="btn-refresh-pedidos"
                type="button"
                onClick={onRefreshData}
                className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-300"
                title="Sincronizar pedidos con el servidor"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Actualizar</span>
              </button>
            )}

            <button
              id="btn-export-csv"
              type="button"
              onClick={handleExportCSV}
              className="px-3 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              title="Descargar pedidos filtrados en formato Excel / CSV"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
              <span>Descargar Excel (CSV)</span>
            </button>

            <button
              id="btn-export-json"
              type="button"
              onClick={handleExportJSON}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              title="Descargar copia de seguridad en JSON"
            >
              <FileCode className="w-4 h-4 text-slate-300" />
              <span>Backup JSON</span>
            </button>

            <button
              id="btn-print-pedidos"
              type="button"
              onClick={handlePrint}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-300"
              title="Imprimir lista o guardar como PDF"
            >
              <Printer className="w-4 h-4 text-slate-600" />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 block">Total Pedidos</span>
            <span className="text-2xl font-extrabold text-slate-900">{pedidos.length}</span>
          </div>
          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
            <span className="text-[11px] font-semibold text-amber-700 block">Pendientes</span>
            <span className="text-2xl font-extrabold text-amber-800">
              {pedidos.filter(p => p.estado === 'Pendiente').length}
            </span>
          </div>
          <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
            <span className="text-[11px] font-semibold text-blue-700 block">En Trámite</span>
            <span className="text-2xl font-extrabold text-blue-800">
              {pedidos.filter(p => p.estado === 'En Trámite').length}
            </span>
          </div>
          <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            <span className="text-[11px] font-semibold text-emerald-700 block">Atendidos</span>
            <span className="text-2xl font-extrabold text-emerald-800">
              {pedidos.filter(p => p.estado === 'Atendido').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          {/* Search box */}
          <div className="sm:col-span-5 relative">
            <input
              id="input-search-pedidos"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por expediente, especialista, juzgado, materia o abogado..."
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          </div>

          {/* Filter by Estado */}
          <div className="sm:col-span-2">
            <select
              id="filter-estado"
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-800 font-medium outline-none"
            >
              <option value="todos">Todos los Estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="En Trámite">En Trámite</option>
              <option value="Atendido">Atendido</option>
              <option value="Observado">Observado</option>
            </select>
          </div>

          {/* Filter by Tipo de Trámite */}
          <div className="sm:col-span-3">
            <select
              id="filter-tipo-tramite"
              value={selectedTipoTramite}
              onChange={(e) => setSelectedTipoTramite(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-800 font-medium outline-none"
            >
              <option value="todos">Todos los Tipos de Trámite ({config.tiposTramite.length})</option>
              {config.tiposTramite.map(t => (
                <option key={t.id} value={t.titulo}>{t.titulo}</option>
              ))}
            </select>
          </div>

          {/* Filter by Juzgado */}
          <div className="sm:col-span-2">
            <select
              id="filter-juzgado"
              value={selectedJuzgado}
              onChange={(e) => setSelectedJuzgado(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-800 font-medium outline-none"
            >
              <option value="todos">Todos los Juzgados</option>
              {config.juzgados.map(j => (
                <option key={j.id} value={j.nombre}>{j.nombre}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {filteredPedidos.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">No se encontraron pedidos</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Intente ajustar los filtros de búsqueda o registre un nuevo pedido judicial desde el formulario.
            </p>
          </div>
        ) : (
          filteredPedidos.map(item => {
            const formatted = formatToWhatsAppMessage(item);
            const waUrl = generateWhatsAppLink(formatted, config.telefonoCoordinador);
            const isEditingNote = editingNoteId === item.id;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/90 hover:border-emerald-300 transition-all space-y-3"
              >
                {/* Header of card */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                      {item.expediente}
                    </span>
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {item.tipoTramite}
                    </span>
                    {getStatusBadge(item.estado)}
                  </div>

                  <div className="text-[11px] text-slate-400 font-medium">
                    {new Date(item.fechaCreacion).toLocaleDateString()} a las {new Date(item.fechaCreacion).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {/* Key Judicial Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-700 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="font-semibold text-slate-500 block text-[10px] uppercase">Juzgado:</span>
                    <span className="font-bold text-slate-900">{item.juzgado}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500 block text-[10px] uppercase">Especialista:</span>
                    <span className="font-bold text-slate-900">{item.especialista}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-500 block text-[10px] uppercase">Materia:</span>
                    <span className="font-bold text-slate-900">{item.materia}</span>
                  </div>
                </div>

                {/* Requirement Body */}
                <div className="text-xs text-slate-800 bg-white p-3 rounded-xl border border-slate-200/80 leading-relaxed font-sans">
                  <div className="font-semibold text-slate-500 text-[10px] uppercase mb-1">Requerimiento:</div>
                  <p>{item.requerimiento}</p>
                </div>

                {/* Observations / Resolution by Admin */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
                      <span>Observaciones / Respuesta de Coordinación:</span>
                    </span>
                    {!isEditingNote && (
                      <button
                        type="button"
                        onClick={() => startEditNote(item)}
                        className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{item.observaciones ? 'Editar Respuesta' : '+ Añadir Respuesta'}</span>
                      </button>
                    )}
                  </div>

                  {isEditingNote ? (
                    <div className="space-y-2">
                      <textarea
                        value={tempNoteText}
                        onChange={(e) => setTempNoteText(e.target.value)}
                        placeholder="Escriba la respuesta o estado interno (ej: Se conversó con especialista, proveído saldrá el 28/08)..."
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                        rows={2}
                      />
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setEditingNoteId(null)}
                          className="px-2.5 py-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={() => saveNote(item.id, item.estado)}
                          className="px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" />
                          <span>Guardar Observación</span>
                        </button>
                      </div>
                    </div>
                  ) : item.observaciones ? (
                    <p className="text-slate-800 font-medium bg-amber-50/70 p-2 rounded-lg border border-amber-200/80">
                      {item.observaciones}
                    </p>
                  ) : (
                    <p className="text-slate-400 italic">Sin observaciones añadidas aún.</p>
                  )}
                </div>

                {/* Solicitante info & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
                  <div className="text-[11px] text-slate-600 flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span><strong>Solicitante:</strong> {item.solicitante || 'Anónimo'}</span>
                    {item.telefono && <span className="text-slate-400">• Cel: {item.telefono}</span>}
                  </div>

                  {/* Actions Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Status Changer dropdown */}
                    <select
                      value={item.estado}
                      onChange={(e) => onUpdatePedidoEstado(item.id, e.target.value as any, item.observaciones)}
                      className="px-2 py-1 text-xs rounded-lg border border-slate-300 bg-white font-medium text-slate-700 outline-none"
                    >
                      <option value="Pendiente">Marcar Pendiente</option>
                      <option value="En Trámite">Marcar En Trámite</option>
                      <option value="Atendido">Marcar Atendido</option>
                      <option value="Observado">Marcar Observado</option>
                    </select>

                    <button
                      type="button"
                      onClick={() => onCopyText(formatted)}
                      className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-medium border border-slate-300 transition-colors flex items-center gap-1"
                      title="Copiar texto formateado de WhatsApp"
                    >
                      <Copy className="w-3 h-3 text-slate-600" />
                      <span>Copiar</span>
                    </button>

                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 text-xs bg-[#25d366] hover:bg-[#20bd5a] text-white rounded-lg font-semibold transition-colors flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>WhatsApp</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => onSelectForEdit(item)}
                      className="px-2.5 py-1 text-xs bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-medium transition-colors"
                    >
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeletePedido(item.id)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Eliminar registro"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
