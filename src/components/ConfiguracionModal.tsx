import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Layers, 
  MessageSquare, 
  Phone, 
  Link as LinkIcon, 
  CheckCircle2, 
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Globe,
  Share2,
  Lock,
  Copy,
  Check
} from 'lucide-react';
import { ConfiguracionGrupo } from '../types';
import { INITIAL_CONFIG } from '../data/initialData';

interface ConfiguracionModalProps {
  config: ConfiguracionGrupo;
  onSaveConfig: (newConfig: ConfiguracionGrupo) => void;
  onResetDefaults: () => void;
}

export const ConfiguracionModal: React.FC<ConfiguracionModalProps> = ({
  config,
  onSaveConfig,
  onResetDefaults
}) => {
  const [formData, setFormData] = useState<ConfiguracionGrupo>(config);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Admin password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const handleUpdateTramite = (index: number, field: 'titulo' | 'descripcion', value: string) => {
    const updated = [...formData.tiposTramite];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setFormData({ ...formData, tiposTramite: updated });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'La nueva contraseña y la confirmación no coinciden.' });
      return;
    }

    if (newPassword.length < 4) {
      setPasswordMsg({ type: 'error', text: 'La nueva contraseña debe tener al menos 4 caracteres.' });
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setPasswordMsg({ type: 'success', text: '¡Contraseña actualizada con éxito!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMsg({ type: 'error', text: data.message || 'Error al cambiar contraseña.' });
      }
    } catch (err) {
      setPasswordMsg({ type: 'error', text: 'No se pudo conectar con el servidor para actualizar la contraseña.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleCopyLink = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(type);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const publicLink = currentUrl;
  const adminLink = `${currentUrl}?view=admin`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden space-y-6">
      {/* Top banner */}
      <div className="bg-slate-900 text-white p-4 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            <span>Configuración del Sistema y Administrador</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Ajuste los tipos de trámite, el saludo oficial de coordinación, la contraseña de administrador y revise la guía para el link permanente.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormData(INITIAL_CONFIG);
            onResetDefaults();
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
          }}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restaurar Valores Iniciales</span>
        </button>
      </div>

      {/* GUIA DE LINK PERMANENTE Y MIGRACIÓN */}
      <div className="p-4 sm:p-6 pt-0 space-y-6">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-5 border border-slate-700 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300">
              Guía de Despliegue y Link Permanente
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                1. Enlace Público (Para los 500 integrantes del grupo)
              </span>
              <p className="text-slate-400">
                Los miembros del grupo ingresan directamente para registrar sus pedidos y consultar estados sin requerir contraseña.
              </p>
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="font-mono text-emerald-400 truncate flex-1">{publicLink}</span>
                <button
                  type="button"
                  onClick={() => handleCopyLink(publicLink, 'public')}
                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold flex items-center gap-1 shrink-0"
                >
                  {copiedLink === 'public' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLink === 'public' ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            <div className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700 space-y-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                2. Enlace Directo de Administrador (Con Contraseña)
              </span>
              <p className="text-slate-400">
                Acceso exclusivo para el coordinador para revisar la bandeja en tiempo real, cambiar estados y descargar en Excel.
              </p>
              <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800">
                <span className="font-mono text-amber-400 truncate flex-1">{adminLink}</span>
                <button
                  type="button"
                  onClick={() => handleCopyLink(adminLink, 'admin')}
                  className="px-2 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-[11px] font-bold flex items-center gap-1 shrink-0"
                >
                  {copiedLink === 'admin' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedLink === 'admin' ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 1: CAMBIO DE CONTRASEÑA DE ADMINISTRADOR */}
        <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-600" />
            <span>Seguridad: Cambiar Contraseña del Administrador</span>
          </h3>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Contraseña Actual
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="admin123"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-900 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 4 caracteres"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-900 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Confirmar Nueva Contraseña
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita nueva clave"
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 text-slate-900 outline-none font-medium"
                />
              </div>
            </div>

            {passwordMsg && (
              <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                passwordMsg.type === 'success' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}>
                {passwordMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <button
              id="btn-submit-change-password"
              type="submit"
              disabled={passwordLoading || !newPassword || !currentPassword}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{passwordLoading ? 'Guardando clave...' : 'Actualizar Contraseña Admin'}</span>
            </button>
          </form>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* SECTION 2: GENERAL GROUP SETTINGS */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 pb-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Parámetros de WhatsApp y Coordinación</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nombre del Grupo de WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.nombreGrupo}
                  onChange={(e) => setFormData({ ...formData, nombreGrupo: e.target.value })}
                  placeholder="Grupo de Impulso Procesal Judicial - WhatsApp"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Saludo / Destinatario Predeterminado
                </label>
                <input
                  type="text"
                  value={formData.destinatarioDefault}
                  onChange={(e) => setFormData({ ...formData, destinatarioDefault: e.target.value })}
                  placeholder="Buen dia dra. Yuly"
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 outline-none font-medium"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Aparecerá al inicio de cada mensaje generado</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Teléfono WhatsApp del Coordinador / Destino (Opcional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.telefonoCoordinador}
                    onChange={(e) => setFormData({ ...formData, telefonoCoordinador: e.target.value })}
                    placeholder="51987654321 (código de país + número)"
                    className="w-full pl-3.5 pr-8 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 outline-none font-mono"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Enlace de Invitación al Grupo de WhatsApp (Opcional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.enlaceGrupoWhatsapp}
                    onChange={(e) => setFormData({ ...formData, enlaceGrupoWhatsapp: e.target.value })}
                    placeholder="https://chat.whatsapp.com/..."
                    className="w-full pl-3.5 pr-8 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 text-slate-900 outline-none font-mono text-xs"
                  />
                  <LinkIcon className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 3: TIPOS DE TRAMITE */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Configuración de Alternativas de "Tipo de Trámite"</span>
              </h3>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                {formData.tiposTramite.length} Alternativas Disponibles
              </span>
            </div>

            <div className="space-y-3">
              {formData.tiposTramite.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={item.titulo}
                        onChange={(e) => handleUpdateTramite(index, 'titulo', e.target.value)}
                        placeholder={`Alternativa ${index + 1}`}
                        className="w-full px-3 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-lg focus:ring-1 focus:ring-emerald-500 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="pl-9">
                    <input
                      type="text"
                      value={item.descripcion}
                      onChange={(e) => handleUpdateTramite(index, 'descripcion', e.target.value)}
                      placeholder="Descripción breve de ayuda para los abogados..."
                      className="w-full px-3 py-1 text-[11px] bg-white border border-slate-300 rounded-lg text-slate-600 focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div>
              {saveSuccess && (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Configuración guardada correctamente</span>
                </div>
              )}
            </div>

            <button
              id="btn-save-config-submit"
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Cambios de Configuración</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
