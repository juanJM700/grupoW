import React from 'react';
import { 
  Scale, 
  MessageSquare, 
  ListOrdered, 
  Building2, 
  Settings, 
  Share2, 
  Lock, 
  Unlock, 
  Search, 
  ClipboardPaste,
  ShieldCheck,
  LogOut,
  Download
} from 'lucide-react';
import { ViewMode } from '../types';

interface HeaderProps {
  activeTab: 'nuevo' | 'seguimiento' | 'bandeja' | 'directorio' | 'configuracion';
  setActiveTab: (tab: 'nuevo' | 'seguimiento' | 'bandeja' | 'directorio' | 'configuracion') => void;
  viewMode: ViewMode;
  totalPedidos: number;
  pedidosPendientes: number;
  nombreGrupo: string;
  onOpenImportModal: () => void;
  onShareApp: () => void;
  onOpenAdminLogin: () => void;
  onLogoutAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  viewMode,
  totalPedidos,
  pedidosPendientes,
  nombreGrupo,
  onOpenImportModal,
  onShareApp,
  onOpenAdminLogin,
  onLogoutAdmin
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top microbar for view status */}
      <div className="bg-slate-950 px-4 py-1 border-b border-slate-800/80 text-[11px] flex items-center justify-between">
        <div className="flex items-center gap-2">
          {viewMode === 'admin' ? (
            <span className="inline-flex items-center gap-1 text-amber-300 font-bold bg-amber-950/80 border border-amber-800/80 px-2 py-0.5 rounded-md">
              <ShieldCheck className="w-3 h-3 text-amber-400" />
              <span>Panel de Administrador Activo</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-emerald-300 font-medium bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Vista Pública (Grupo WhatsApp)</span>
            </span>
          )}
          <span className="text-slate-400 hidden sm:inline">| Base de datos en tiempo real</span>
        </div>

        <div className="flex items-center gap-3">
          {viewMode === 'admin' ? (
            <button
              id="btn-logout-admin-top"
              onClick={onLogoutAdmin}
              className="text-amber-300 hover:text-amber-200 font-semibold flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span>Cerrar Sesión Admin</span>
            </button>
          ) : (
            <button
              id="btn-login-admin-top"
              onClick={onOpenAdminLogin}
              className="text-slate-300 hover:text-white flex items-center gap-1 font-semibold transition-colors"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Acceso Administrador (Contraseña)</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          {/* Logo & Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center shadow-inner text-white font-bold">
                <Scale className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold text-slate-100 tracking-tight flex items-center gap-2">
                    Mesa de Pedidos Judiciales
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    WhatsApp 500
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate max-w-sm">
                  {nombreGrupo || "Generador y Registro de Requerimientos Procesales"}
                </p>
              </div>
            </div>

            {/* Mobile quick action */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                id="btn-import-mobile"
                onClick={onOpenImportModal}
                className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg border border-slate-700 text-xs flex items-center gap-1"
                title="Pegar mensaje de WhatsApp"
              >
                <ClipboardPaste className="w-4 h-4 text-emerald-400" />
              </button>
              <button
                id="btn-share-mobile"
                onClick={onShareApp}
                className="p-2 text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 rounded-lg border border-emerald-800 text-xs"
                title="Compartir link con grupo"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs & Actions */}
          <div className="flex items-center justify-between md:justify-end gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <nav className="flex items-center bg-slate-800/90 p-1 rounded-xl border border-slate-700/80 shadow-inner">
              {/* Common / Public / Admin Tabs */}
              <button
                id="tab-nuevo-pedido"
                onClick={() => setActiveTab('nuevo')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'nuevo'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Registrar Pedido</span>
              </button>

              {viewMode === 'public' && (
                <button
                  id="tab-seguimiento-publico"
                  onClick={() => setActiveTab('seguimiento')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'seguimiento'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Consultar Estado</span>
                </button>
              )}

              {viewMode === 'admin' && (
                <button
                  id="tab-bandeja-pedidos"
                  onClick={() => setActiveTab('bandeja')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                    activeTab === 'bandeja'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span>Bandeja Admin ({totalPedidos})</span>
                  {pedidosPendientes > 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute top-1 right-1"></span>
                  )}
                </button>
              )}

              <button
                id="tab-directorio-juzgados"
                onClick={() => setActiveTab('directorio')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'directorio'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Juzgados</span>
              </button>

              {viewMode === 'admin' && (
                <button
                  id="tab-configuracion"
                  onClick={() => setActiveTab('configuracion')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === 'configuracion'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Configuración</span>
                </button>
              )}
            </nav>

            {/* Desktop Action Buttons */}
            <div className="hidden md:flex items-center gap-2 pl-2">
              <button
                id="btn-import-desktop"
                onClick={onOpenImportModal}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                title="Pegar y autocompletar desde texto copiado de WhatsApp"
              >
                <ClipboardPaste className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pegar Texto</span>
              </button>

              <button
                id="btn-share-group-desktop"
                onClick={onShareApp}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Link Permanente</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
