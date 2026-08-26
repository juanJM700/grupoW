import React, { useState } from 'react';
import { 
  ClipboardPaste, 
  Sparkles, 
  X, 
  ArrowRight, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { SolicitudPedido } from '../types';
import { parseRawWhatsAppMessage } from '../utils/whatsappFormatter';

interface ImportadorRapidoProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyParsed: (parsed: Partial<SolicitudPedido>) => void;
}

export const ImportadorRapido: React.FC<ImportadorRapidoProps> = ({
  isOpen,
  onClose,
  onApplyParsed
}) => {
  const [rawText, setRawText] = useState('');
  const [previewData, setPreviewData] = useState<Partial<SolicitudPedido> | null>(null);

  if (!isOpen) return null;

  const handleParse = (text: string) => {
    setRawText(text);
    const parsed = parseRawWhatsAppMessage(text);
    setPreviewData(parsed);
  };

  const handleConfirm = () => {
    if (previewData) {
      onApplyParsed(previewData);
      onClose();
    }
  };

  const sampleRaw = `Buen dia dra. Yuly 
EXPEDIENTE     : 02098-2015-8-0401-JR-CI-10 
JUZGADO : 10mo Juzgado Civil 
MATERIA 	    : Reivindicación 
Especialista :  Francis Zegarra Cardenas 
REQUERIMIENTO: Desde el 07 de julio del año en curso se encuentra pendiente de resolver escritos para poder impulsar el proceso. El expediente se tramita con la nueva especialista Dra. Francis Zegarra Cardenas. Pese a que existe un proceso disciplinario, la demora sigue perjudicando.`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <ClipboardPaste className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Pegar y Auto-Detectar Mensaje de WhatsApp
              </h3>
              <p className="text-xs text-slate-300">
                Pega cualquier texto que hayan enviado al grupo y el sistema completará el formulario
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Pegue el texto sin procesar aquí:
            </label>
            <button
              type="button"
              onClick={() => handleParse(sampleRaw)}
              className="text-[11px] text-emerald-700 font-semibold hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Probar con el ejemplo de la consulta</span>
            </button>
          </div>

          <textarea
            rows={6}
            value={rawText}
            onChange={(e) => handleParse(e.target.value)}
            placeholder="Pegue aquí el mensaje tal como llegó a WhatsApp..."
            className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 outline-none"
          />

          {/* Parsed summary preview */}
          {previewData && Object.keys(previewData).length > 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 space-y-2">
              <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                Campos Detectados Automáticamente:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs text-emerald-950">
                {previewData.expediente && (
                  <div><strong>Expediente:</strong> {previewData.expediente}</div>
                )}
                {previewData.juzgado && (
                  <div><strong>Juzgado:</strong> {previewData.juzgado}</div>
                )}
                {previewData.materia && (
                  <div><strong>Materia:</strong> {previewData.materia}</div>
                )}
                {previewData.especialista && (
                  <div><strong>Especialista:</strong> {previewData.especialista}</div>
                )}
                {previewData.tipoTramite && (
                  <div className="col-span-2"><strong>Trámite:</strong> {previewData.tipoTramite}</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!rawText.trim()}
            onClick={handleConfirm}
            className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>Cargar en Formulario</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
