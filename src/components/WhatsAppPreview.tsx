import React, { useState } from 'react';
import { 
  MessageSquare, 
  Copy, 
  Check, 
  Send, 
  Smartphone, 
  Sparkles, 
  Share2, 
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  CheckCheck
} from 'lucide-react';
import { SolicitudPedido, ConfiguracionGrupo } from '../types';
import { formatToWhatsAppMessage, generateWhatsAppLink } from '../utils/whatsappFormatter';

interface WhatsAppPreviewProps {
  pedido: SolicitudPedido;
  config: ConfiguracionGrupo;
  onCopyText: (text: string) => void;
  copied: boolean;
}

export const WhatsAppPreview: React.FC<WhatsAppPreviewProps> = ({
  pedido,
  config,
  onCopyText,
  copied
}) => {
  const [formatStyle, setFormatStyle] = useState<'clasico' | 'estructurado_emoji' | 'compacto'>('clasico');
  const [includeSolicitante, setIncludeSolicitante] = useState(false);

  const formattedText = formatToWhatsAppMessage(pedido, {
    formatStyle,
    includeSolicitante
  });

  const whatsappUrl = generateWhatsAppLink(formattedText, config.telefonoCoordinador);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              Vista Previa WhatsApp
            </h3>
            <p className="text-[11px] text-slate-400">
              Así se verá el mensaje en el grupo
            </p>
          </div>
        </div>

        {/* Format Selector Pills */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs">
          <button
            type="button"
            onClick={() => setFormatStyle('clasico')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
              formatStyle === 'clasico'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Formato idéntico al solicitado"
          >
            Clásico
          </button>
          <button
            type="button"
            onClick={() => setFormatStyle('estructurado_emoji')}
            className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all ${
              formatStyle === 'estructurado_emoji'
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Formato con iconos y negritas"
          >
            Con Emojis
          </button>
        </div>
      </div>

      {/* WhatsApp Simulated Phone Screen & Chat Bubble */}
      <div className="p-4 bg-[#e5ddd5] flex-1 min-h-[320px] flex flex-col justify-center relative overflow-hidden">
        {/* Subtle WhatsApp wallpaper overlay */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#128c7e 0.75px, transparent 0.75px), radial-gradient(#128c7e 0.75px, #e5ddd5 0.75px)`,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 12px 12px'
          }}
        />

        {/* Chat Info Header */}
        <div className="mx-auto bg-white/90 backdrop-blur-xs border border-emerald-900/10 px-3 py-1 rounded-full text-[11px] font-medium text-slate-600 mb-3 shadow-xs flex items-center gap-1.5 z-10">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>{config.nombreGrupo || 'Grupo WhatsApp 500 Miembros'}</span>
        </div>

        {/* WhatsApp Green Outgoing Bubble */}
        <div className="max-w-[95%] sm:max-w-[90%] self-end bg-[#dcf8c6] text-slate-900 rounded-2xl rounded-tr-xs p-3.5 shadow-md border border-[#c6e6af] relative z-10 space-y-1">
          <div className="text-xs font-mono whitespace-pre-wrap leading-relaxed select-all text-slate-900">
            {formattedText}
          </div>

          {/* Time & Double Blue Check */}
          <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500 pt-1">
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <CheckCheck className="w-3.5 h-3.5 text-[#34b7f1]" />
          </div>
        </div>
      </div>

      {/* Options Bar & Action Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
        {/* Toggle options */}
        <div className="flex items-center justify-between text-xs text-slate-600">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={includeSolicitante}
              onChange={(e) => setIncludeSolicitante(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
            />
            <span>Incluir firma y contacto del solicitante</span>
          </label>

          <span className="text-[11px] text-slate-400 font-mono">
            {formattedText.length} caracteres
          </span>
        </div>

        {/* Cautelares Warning Badge */}
        <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-[11px] flex items-start gap-2">
          <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="leading-tight">
            <span className="font-bold text-red-800">Regla del Grupo: </span>
            <span>No se atienden Medidas Cautelares Reservadas. Únicamente Medidas Cautelares Públicas.</span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            id="btn-copy-preview"
            type="button"
            onClick={() => onCopyText(formattedText)}
            className={`py-2.5 px-3 rounded-xl font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 ${
              copied
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>¡Copiado con éxito!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-emerald-400" />
                <span>Copiar Mensaje</span>
              </>
            )}
          </button>

          <a
            id="link-open-whatsapp"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 rounded-xl font-bold text-xs bg-[#25d366] hover:bg-[#20bd5a] text-white shadow-sm transition-all flex items-center justify-center gap-1.5 text-center"
          >
            <Send className="w-4 h-4" />
            <span>Abrir en WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
