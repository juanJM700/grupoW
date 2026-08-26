/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Header 
} from './components/Header';
import { 
  FormularioPedido 
} from './components/FormularioPedido';
import { 
  WhatsAppPreview 
} from './components/WhatsAppPreview';
import { 
  BandejaPedidos 
} from './components/BandejaPedidos';
import { 
  PublicTracker 
} from './components/PublicTracker';
import { 
  DirectorioJudicial 
} from './components/DirectorioJudicial';
import { 
  ConfiguracionModal 
} from './components/ConfiguracionModal';
import { 
  ImportadorRapido 
} from './components/ImportadorRapido';
import { 
  AddJuzgadoModal 
} from './components/AddJuzgadoModal';
import { 
  ShareModal 
} from './components/ShareModal';
import { 
  AdminLoginModal 
} from './components/AdminLoginModal';
import { 
  SolicitudPedido, 
  ConfiguracionGrupo, 
  JuzgadoItem,
  ViewMode 
} from './types';
import { 
  INITIAL_CONFIG, 
  INITIAL_PEDIDOS 
} from './data/initialData';
import { 
  formatToWhatsAppMessage, 
  generateWhatsAppLink 
} from './utils/whatsappFormatter';

export default function App() {
  // Check URL params for admin view
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const isAuth = sessionStorage.getItem('admin_auth_token');
      if (params.get('view') === 'admin' && isAuth) {
        return 'admin';
      }
    }
    return 'public';
  });

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'nuevo' | 'seguimiento' | 'bandeja' | 'directorio' | 'configuracion'>('nuevo');

  // Load config
  const [config, setConfig] = useState<ConfiguracionGrupo>(() => {
    const saved = localStorage.getItem('config_pedidos_judiciales');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.tiposTramite || parsed.tiposTramite.length < 7) {
          parsed.tiposTramite = INITIAL_CONFIG.tiposTramite;
        }
        if (parsed.juzgados && Array.isArray(parsed.juzgados) && parsed.juzgados.length > 0) {
          // keep
        } else {
          parsed.juzgados = INITIAL_CONFIG.juzgados;
        }
        return parsed;
      } catch (e) {}
    }
    return INITIAL_CONFIG;
  });

  // Load petitions
  const [pedidos, setPedidos] = useState<SolicitudPedido[]>(() => {
    const saved = localStorage.getItem('lista_pedidos_judiciales');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_PEDIDOS;
  });

  // Fetch from server on load
  const loadServerData = useCallback(async () => {
    try {
      const [pedidosRes, configRes] = await Promise.all([
        fetch('/api/pedidos'),
        fetch('/api/config')
      ]);

      if (pedidosRes.ok) {
        const data = await pedidosRes.json();
        if (Array.isArray(data) && data.length > 0) {
          setPedidos(data);
          localStorage.setItem('lista_pedidos_judiciales', JSON.stringify(data));
        }
      }

      if (configRes.ok) {
        const cfgData = await configRes.json();
        if (cfgData && cfgData.nombreGrupo) {
          setConfig(prev => ({
            ...prev,
            ...cfgData,
            juzgados: (cfgData.juzgados && cfgData.juzgados.length > 0) ? cfgData.juzgados : prev.juzgados
          }));
        }
      }
    } catch (err) {
      console.log("Servidor local / offline, usando almacenamiento local.");
    }
  }, []);

  useEffect(() => {
    loadServerData();
  }, [loadServerData]);

  // If URL has ?view=admin on open, trigger login modal if not authenticated
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'admin') {
        const isAuth = sessionStorage.getItem('admin_auth_token');
        if (isAuth) {
          setViewMode('admin');
          setActiveTab('bandeja');
        } else {
          setIsLoginModalOpen(true);
        }
      }
    }
  }, []);

  // Current active working petition for the form
  const [currentPedido, setCurrentPedido] = useState<SolicitudPedido>({
    id: `ped-${Date.now()}`,
    fechaCreacion: new Date().toISOString(),
    saludo: config.destinatarioDefault || 'Buen dia dra. Yuly',
    tipoTramite: config.tiposTramite[0]?.titulo || 'Proveido Escrito ( Indicar si es reterativo)',
    expediente: '02098-2015-8-0401-JR-CI-10',
    juzgado: '10mo Juzgado Civil',
    materia: 'Reivindicación',
    especialista: 'Francis Zegarra Cardenas',
    requerimiento: 'Desde el 07 de julio del año en curso se encuentra pendiente de resolver escritos para poder impulsar el proceso. El expediente se tramita con la nueva especialista Dra. Francis Zegarra Cardenas. Pese a que existe un proceso disciplinario, la demora sigue perjudicando.',
    solicitante: '',
    telefono: '',
    colegiaturaOCasilla: '',
    prioridad: 'Urgente',
    estado: 'Pendiente'
  });

  // Modals state
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAddJuzgadoModalOpen, setIsAddJuzgadoModalOpen] = useState(false);
  const [editingJuzgado, setEditingJuzgado] = useState<JuzgadoItem | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Toast / Copy state
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('config_pedidos_judiciales', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('lista_pedidos_judiciales', JSON.stringify(pedidos));
  }, [pedidos]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Save petition to local state AND backend database
  const handleSavePedido = async (pedidoToSave: SolicitudPedido, notify = true) => {
    // 1. Update UI state immediately
    setPedidos(prev => {
      const existsIndex = prev.findIndex(p => p.id === pedidoToSave.id);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = pedidoToSave;
        return updated;
      }
      return [pedidoToSave, ...prev];
    });

    if (notify) {
      showToast("Solicitud registrada exitosamente en la base de datos.");
    }

    // 2. Persist to server backend
    try {
      await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pedidoToSave)
      });
    } catch (e) {
      console.error("Error guardando en el backend:", e);
    }
  };

  // Copy text helper
  const handleCopyFormatted = (customText?: string) => {
    const textToCopy = customText || formatToWhatsAppMessage(currentPedido);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);

    // Auto-save the request so it's registered in database
    handleSavePedido(currentPedido, false);

    showToast("¡Texto copiado y pedido registrado! Listo para pegar en WhatsApp.");
    
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.85 }
      });
    } catch (e) {}

    setTimeout(() => setCopied(false), 2500);
  };

  // Direct send to WhatsApp
  const handleSendWhatsApp = () => {
    const text = formatToWhatsAppMessage(currentPedido);
    const url = generateWhatsAppLink(text, config.telefonoCoordinador);
    
    // Save in records
    handleSavePedido(currentPedido, false);
    
    window.open(url, '_blank');
  };

  // Update request status (Admin)
  const handleUpdatePedidoEstado = async (id: string, nuevoEstado: SolicitudPedido['estado'], notas?: string) => {
    setPedidos(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          estado: nuevoEstado,
          observaciones: notas !== undefined ? notas : p.observaciones
        };
      }
      return p;
    }));

    showToast(`Pedido actualizado a estado: ${nuevoEstado}`);

    try {
      await fetch(`/api/pedidos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado, observaciones: notas })
      });
    } catch (e) {
      console.error("Error actualizando en backend:", e);
    }
  };

  // Delete request (Admin)
  const handleDeletePedido = async (id: string) => {
    if (!window.confirm("¿Está seguro de eliminar esta solicitud del registro?")) return;
    
    setPedidos(prev => prev.filter(p => p.id !== id));
    showToast("Solicitud eliminada.");

    try {
      await fetch(`/api/pedidos/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error("Error eliminando en backend:", e);
    }
  };

  // Select for edit
  const handleSelectForEdit = (pedido: SolicitudPedido) => {
    setCurrentPedido(pedido);
    setActiveTab('nuevo');
    showToast(`Solicitud ${pedido.expediente} cargada en el formulario.`);
  };

  // Reset form
  const handleResetForm = () => {
    setCurrentPedido({
      id: `ped-${Date.now()}`,
      fechaCreacion: new Date().toISOString(),
      saludo: config.destinatarioDefault || 'Buen dia dra. Yuly',
      tipoTramite: config.tiposTramite[0]?.titulo || 'Proveido Escrito ( Indicar si es reterativo)',
      expediente: '',
      juzgado: config.juzgados[0]?.nombre || '',
      materia: '',
      especialista: config.juzgados[0]?.especialistas[0] || '',
      requerimiento: '',
      solicitante: '',
      telefono: '',
      colegiaturaOCasilla: '',
      prioridad: 'Normal',
      estado: 'Pendiente'
    });
    showToast("Formulario limpiado para un nuevo registro.");
  };

  // Fill example
  const handleFillExample = () => {
    setCurrentPedido({
      id: `ped-${Date.now()}`,
      fechaCreacion: new Date().toISOString(),
      saludo: config.destinatarioDefault || 'Buen dia dra. Yuly',
      tipoTramite: 'Proveido Escrito ( Indicar si es reterativo)',
      expediente: '02098-2015-8-0401-JR-CI-10',
      juzgado: '10mo Juzgado Civil',
      materia: 'Reivindicación',
      especialista: 'Francis Zegarra Cardenas',
      requerimiento: 'Desde el 07 de julio del año en curso se encuentra pendiente de resolver escritos para poder impulsar el proceso. El expediente se tramita con la nueva especialista Dra. Francis Zegarra Cardenas. Pese a que existe un proceso disciplinario, la demora sigue perjudicando.',
      solicitante: 'Abg. Carlos Mendoza',
      telefono: '954123987',
      colegiaturaOCasilla: 'CAA-4921',
      prioridad: 'Urgente',
      estado: 'Pendiente'
    });
    showToast("Ejemplo oficial cargado en el formulario.");
  };

  // Select court and specialist from directory
  const handleSelectJuzgadoAndEspecialista = (juzgado: string, especialista: string) => {
    setCurrentPedido(prev => ({
      ...prev,
      juzgado,
      especialista
    }));
    setActiveTab('nuevo');
    showToast(`Seleccionado: ${juzgado} - ${especialista}`);
  };

  // Save court in directory
  const handleSaveJuzgado = (juzgado: JuzgadoItem) => {
    const exists = config.juzgados.find(j => j.id === juzgado.id);
    let updatedJuzgados: JuzgadoItem[];
    
    if (exists) {
      updatedJuzgados = config.juzgados.map(j => j.id === juzgado.id ? juzgado : j);
      showToast(`Juzgado ${juzgado.nombre} actualizado.`);
    } else {
      updatedJuzgados = [juzgado, ...config.juzgados];
      showToast(`Juzgado ${juzgado.nombre} añadido.`);
    }

    const updatedConfig = { ...config, juzgados: updatedJuzgados };
    setConfig(updatedConfig);

    // Sync to backend
    fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedConfig)
    }).catch(console.error);
  };

  // Delete court
  const handleDeleteJuzgado = (id: string) => {
    const updatedJuzgados = config.juzgados.filter(j => j.id !== id);
    const updatedConfig = { ...config, juzgados: updatedJuzgados };
    setConfig(updatedConfig);
    showToast("Juzgado eliminado del directorio.");

    fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedConfig)
    }).catch(console.error);
  };

  // Reset courts
  const handleResetJuzgados = () => {
    const updatedConfig = { ...config, juzgados: INITIAL_CONFIG.juzgados };
    setConfig(updatedConfig);
    showToast("Directorio restaurado con los datos iniciales.");

    fetch('/api/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedConfig)
    }).catch(console.error);
  };

  // Apply parsed raw WhatsApp message
  const handleApplyParsed = (parsed: Partial<SolicitudPedido>) => {
    setCurrentPedido(prev => ({
      ...prev,
      ...parsed,
      saludo: parsed.saludo || prev.saludo,
      tipoTramite: parsed.tipoTramite || prev.tipoTramite,
      expediente: parsed.expediente || prev.expediente,
      juzgado: parsed.juzgado || prev.juzgado,
      materia: parsed.materia || prev.materia,
      especialista: parsed.especialista || prev.especialista,
      requerimiento: parsed.requerimiento || prev.requerimiento,
      solicitante: parsed.solicitante || prev.solicitante,
      telefono: parsed.telefono || prev.telefono
    }));
    setActiveTab('nuevo');
    showToast("Datos importados y cargados al formulario.");
  };

  // Admin login success
  const handleAdminLoginSuccess = () => {
    setViewMode('admin');
    setActiveTab('bandeja');
    showToast("¡Bienvenido al Panel de Administrador!");
  };

  // Admin logout
  const handleAdminLogout = () => {
    sessionStorage.removeItem('admin_auth_token');
    setViewMode('public');
    setActiveTab('nuevo');
    showToast("Sesión de Administrador cerrada.");
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Toast notification banner */}
      {toastMessage && (
        <div className="fixed top-16 right-4 z-50 bg-slate-900 text-white border border-emerald-500 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-medium flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        viewMode={viewMode}
        totalPedidos={pedidos.length}
        pedidosPendientes={pedidos.filter(p => p.estado === 'Pendiente').length}
        nombreGrupo={config.nombreGrupo}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        onShareApp={() => setIsShareModalOpen(true)}
        onOpenAdminLogin={() => setIsLoginModalOpen(true)}
        onLogoutAdmin={handleAdminLogout}
      />

      {/* Main Body Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* TAB: NUEVO PEDIDO / FORMULARIO */}
        {activeTab === 'nuevo' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Form Column (7 Cols) */}
            <div className="lg:col-span-7">
              <FormularioPedido
                pedido={currentPedido}
                setPedido={setCurrentPedido}
                config={config}
                onSavePedido={handleSavePedido}
                onCopyFormattedText={() => handleCopyFormatted()}
                onSendDirectWhatsApp={handleSendWhatsApp}
                onResetForm={handleResetForm}
                onFillExample={handleFillExample}
              />
            </div>

            {/* Preview Column (5 Cols) */}
            <div className="lg:col-span-5 lg:sticky lg:top-20">
              <WhatsAppPreview
                pedido={currentPedido}
                config={config}
                onCopyText={handleCopyFormatted}
                copied={copied}
              />
            </div>
          </div>
        )}

        {/* TAB: SEGUIMIENTO PÚBLICO */}
        {activeTab === 'seguimiento' && (
          <PublicTracker
            pedidos={pedidos}
            onSelectForEdit={handleSelectForEdit}
          />
        )}

        {/* TAB: BANDEJA Y CONTROL DE PEDIDOS (ADMIN) */}
        {activeTab === 'bandeja' && (
          <BandejaPedidos
            pedidos={pedidos}
            onUpdatePedidoEstado={handleUpdatePedidoEstado}
            onDeletePedido={handleDeletePedido}
            onSelectForEdit={handleSelectForEdit}
            config={config}
            onCopyText={handleCopyFormatted}
            onRefreshData={loadServerData}
          />
        )}

        {/* TAB: DIRECTORIO DE JUZGADOS */}
        {activeTab === 'directorio' && (
          <DirectorioJudicial
            config={config}
            onSelectJuzgadoAndEspecialista={handleSelectJuzgadoAndEspecialista}
            onOpenAddJuzgadoModal={() => {
              setEditingJuzgado(null);
              setIsAddJuzgadoModalOpen(true);
            }}
            onEditJuzgado={(juzgado) => {
              setEditingJuzgado(juzgado);
              setIsAddJuzgadoModalOpen(true);
            }}
            onDeleteJuzgado={handleDeleteJuzgado}
            onResetJuzgados={handleResetJuzgados}
          />
        )}

        {/* TAB: CONFIGURACIÓN DEL GRUPO (ADMIN) */}
        {activeTab === 'configuracion' && (
          <ConfiguracionModal
            config={config}
            onSaveConfig={(newCfg) => {
              setConfig(newCfg);
              fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCfg)
              }).catch(console.error);
              showToast("Configuración guardada en el servidor.");
            }}
            onResetDefaults={() => {
              setConfig(INITIAL_CONFIG);
              fetch('/api/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(INITIAL_CONFIG)
              }).catch(console.error);
              showToast("Configuración restablecida a valores iniciales.");
            }}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-4 px-4 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">Mesa de Pedidos Judiciales</span>
            <span>• Diseñado para grupos de WhatsApp con 500 miembros</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Dra. Yuly & Coordinación</span>
            <span>•</span>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              Compartir Enlaces
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccessLogin={handleAdminLoginSuccess}
      />

      <ImportadorRapido
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onApplyParsed={handleApplyParsed}
      />

      <AddJuzgadoModal
        isOpen={isAddJuzgadoModalOpen}
        onClose={() => {
          setIsAddJuzgadoModalOpen(false);
          setEditingJuzgado(null);
        }}
        onSaveJuzgado={handleSaveJuzgado}
        initialJuzgado={editingJuzgado}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        config={config}
      />
    </div>
  );
}
