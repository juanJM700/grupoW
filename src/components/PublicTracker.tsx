import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Building2, 
  User, 
  FileText, 
  Calendar,
  Sparkles,
  Info,
  ShieldCheck
} from 'lucide-react';
import { SolicitudPedido } from '../types';

interface PublicTrackerProps {
  pedidos: SolicitudPedido[];
  onSelectForEdit?: (pedido: SolicitudPedido) => void;
}

export const PublicTracker: React.FC<PublicTrackerProps> = ({ pedidos }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPedidos = useMemo(() => {
    if (!searchTerm.trim()) {
      // Show latest 10 by default
      return pedidos.slice(0, 10);
    }
    const term = searchTerm.toLowerCase().trim();
    return pedidos.filter(p => 
      p.expediente.toLowerCase().includes(term) ||
      p.juzgado.toLowerCase().includes(term) ||
      p.especialista.toLowerCase().includes(term) ||
      (p.solicitante && p.solicitante.toLowerCase().includes(term))
    );
  }, [pedidos, searchTerm]);

  const getStatusBadge = (estado: SolicitudPedido['estado']) => {
    switch (estado) {
      case 'Pendiente':
        return (
          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 inline-flex">
            <Clock className="w-3.5 h-3.5 text-amber-600" /> 
            <span>Pendiente de Atención</span>
          </span>
        );
      case 'En Trámite':
        return (
          <span className="bg-blue-100 text-blue-900 border border-blue-300 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 inline-flex">
            <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" /> 
            <span>En Trámite en Juzgado</span>
          </span>
        );
      case 'Atendido':
        return (
          <span className="bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 inline-flex">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 
            <span>Atendido / Resuelto</span>
          </span>
        );
      case 'Observado':
        return (
          <span className="bg-rose-100 text-rose-900 border border-rose-300 text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 inline-flex">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> 
            <span>Observado / Revisar</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Consulta Pública de Estado</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Seguimiento de Pedidos Procesales
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Consulte en tiempo real si su requerimiento judicial ha sido registrado, tramitado o respondido por la coordinación del grupo de WhatsApp.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mt-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            id="input-public-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ingrese N° de Expediente (ej: 02098-2015...), Juzgado o Especialista..."
            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            {searchTerm.trim() ? `Resultados (${filteredPedidos.length})` : `Últimos Requerimientos Registrados (${filteredPedidos.length})`}
          </h3>
          <span className="text-xs text-slate-400">Actualización en tiempo real</span>
        </div>

        {filteredPedidos.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 text-slate-500 space-y-2">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="font-semibold text-slate-700">No se encontraron pedidos con ese criterio</p>
            <p className="text-xs text-slate-400">Verifique el número de expediente o registre una nueva solicitud.</p>
          </div>
        ) : (
          filteredPedidos.map((pedido) => (
            <div 
              key={pedido.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition-all space-y-3"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                    {pedido.expediente}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {pedido.tipoTramite}
                  </span>
                </div>
                <div>
                  {getStatusBadge(pedido.estado)}
                </div>
              </div>

              {/* Court and Specialist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                  <span><strong>Juzgado:</strong> {pedido.juzgado}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400 shrink-0" />
                  <span><strong>Especialista:</strong> {pedido.especialista}</span>
                </div>
              </div>

              {/* Requirement */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-800 leading-relaxed">
                <span className="font-bold text-slate-900 block mb-0.5">Requerimiento:</span>
                {pedido.requerimiento}
              </div>

              {/* Admin Observations if any */}
              {pedido.observaciones && (
                <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-950">Respuesta / Observación de Coordinación:</strong>
                    <p className="mt-0.5">{pedido.observaciones}</p>
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Registrado el: {new Date(pedido.fechaCreacion).toLocaleDateString()}</span>
                {pedido.solicitante && <span>Solicitado por: <strong>{pedido.solicitante}</strong></span>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
