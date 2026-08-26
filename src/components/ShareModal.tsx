import React, { useState } from 'react';
import { 
  Share2, 
  X, 
  Copy, 
  Check, 
  MessageSquare, 
  Lock, 
  Users, 
  Globe,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { ConfiguracionGrupo } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ConfiguracionGrupo;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  config
}) => {
  const [copiedLink, setCopiedLink] = useState<'public' | 'admin' | null>(null);
  const [copiedBroadcast, setCopiedBroadcast] = useState(false);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://mi-mesa-judicial.app';
  const publicUrl = currentOrigin;
  const adminUrl = `${currentOrigin}?view=admin`;

  const broadcastMessage = `📢 *MESA DE PEDIDOS JUDICIALES - WHATSAPP* ⚖️
Estimados colegas y miembros del grupo (${config.nombreGrupo || '500 Miembros'}):

Para una atención ordenada, transparente y rápida de los pedidos de impulso procesal dirigidos a *${config.destinatarioDefault || 'la coordinación judicial'}*, ponemos a su disposición el generador oficial y registro de solicitudes:

🔗 *Acceso directo:* ${publicUrl}

*Pasos para registrar su requerimiento:*
1️⃣ Ingrese al enlace desde su celular o computadora.
2️⃣ Seleccione el *Tipo de Trámite*, *Expediente*, *Juzgado* y *Especialista*.
3️⃣ Ingrese el detalle de su pedido y presione *"Copiar para WhatsApp"* o *"Enviar a WhatsApp"*.
4️⃣ Su solicitud quedará registrada en el sistema y podrá consultar su estado en tiempo real.

¡Gracias por mantener el orden procesal de nuestro grupo!`;

  const handleCopy = (text: string, type: 'public' | 'admin') => {
    navigator.clipboard.writeText(text);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const handleCopyBroadcast = () => {
    navigator.clipboard.writeText(broadcastMessage);
    setCopiedBroadcast(true);
    setTimeout(() => setCopiedBroadcast(false), 2500);
  };

  const waShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(broadcastMessage)}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Enlaces y Compartir con el Grupo
              </h3>
              <p className="text-xs text-slate-300">
                Enlaces permanentes para el público y para el administrador
              </p>
            </div>
          </div>
          <button 
            id="btn-close-share-modal"
            onClick={onClose} 
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          {/* Public link box */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
            <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>Enlace Público (Para los 500 Miembros del Grupo):</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="flex-1 px-3 py-2 text-xs font-mono bg-white border border-slate-300 rounded-lg text-slate-800 select-all"
              />
              <button
                type="button"
                onClick={() => handleCopy(publicUrl, 'public')}
                className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shrink-0"
              >
                {copiedLink === 'public' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink === 'public' ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* Admin link box */}
          <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 space-y-2">
            <label className="block text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Enlace Directo del Administrador (Pide Contraseña):</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={adminUrl}
                className="flex-1 px-3 py-2 text-xs font-mono bg-white border border-amber-300 rounded-lg text-slate-800 select-all"
              />
              <button
                type="button"
                onClick={() => handleCopy(adminUrl, 'admin')}
                className="px-3 py-2 bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shrink-0"
              >
                {copiedLink === 'admin' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink === 'admin' ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
            <p className="text-[11px] text-amber-800">
              Contraseña predeterminada: <strong>admin123</strong> (puede cambiarla en el panel de Configuración).
            </p>
          </div>

          {/* Broadcast message preview */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Mensaje de Instrucciones para el Grupo:
              </label>
              <button
                type="button"
                onClick={handleCopyBroadcast}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
              >
                {copiedBroadcast ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedBroadcast ? '¡Mensaje Copiado!' : 'Copiar Texto del Anuncio'}</span>
              </button>
            </div>

            <div className="bg-slate-50 p-3 text-xs font-mono rounded-xl border border-slate-200 text-slate-700 whitespace-pre-wrap max-h-44 overflow-y-auto select-all">
              {broadcastMessage}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-[11px] text-slate-500">
            Compatible con celulares y WhatsApp Web
          </span>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cerrar
            </button>
            <a
              href={waShareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-4 py-2 text-xs font-bold bg-[#25d366] hover:bg-[#20bd5a] text-white rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 text-center"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Enviar Anuncio a WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
