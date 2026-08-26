import React, { useState, useEffect } from 'react';
import { Building2, X, Plus, Edit3, Trash2, Check, UserCheck } from 'lucide-react';
import { JuzgadoItem } from '../types';

interface AddJuzgadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveJuzgado: (juzgado: JuzgadoItem) => void;
  initialJuzgado?: JuzgadoItem | null;
}

export const AddJuzgadoModal: React.FC<AddJuzgadoModalProps> = ({
  isOpen,
  onClose,
  onSaveJuzgado,
  initialJuzgado
}) => {
  const [nombre, setNombre] = useState('');
  const [especialidad, setEspecialidad] = useState<JuzgadoItem['especialidad']>('Civil');
  const [sede, setSede] = useState('Sede Central');
  const [juez, setJuez] = useState('');
  const [especialistasInput, setEspecialistasInput] = useState('');

  useEffect(() => {
    if (initialJuzgado) {
      setNombre(initialJuzgado.nombre || '');
      setEspecialidad(initialJuzgado.especialidad || 'Civil');
      setSede(initialJuzgado.sede || 'Sede Central');
      setJuez(initialJuzgado.juez || '');
      setEspecialistasInput((initialJuzgado.especialistas || []).join('\n'));
    } else {
      setNombre('');
      setEspecialidad('Civil');
      setSede('Sede Central');
      setJuez('');
      setEspecialistasInput('');
    }
  }, [initialJuzgado, isOpen]);

  if (!isOpen) return null;

  const isEditing = Boolean(initialJuzgado);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const especialistasList = especialistasInput
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const savedJuzgado: JuzgadoItem = {
      id: initialJuzgado ? initialJuzgado.id : `juz-${Date.now()}`,
      nombre: nombre.trim(),
      especialidad,
      sede: sede.trim() || 'Sede Central',
      juez: juez.trim() || undefined,
      especialistas: especialistasList.length > 0 ? especialistasList : ['Especialista de Turno']
    };

    onSaveJuzgado(savedJuzgado);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">
              {isEditing ? 'Editar Juzgado y Especialistas' : 'Agregar Nuevo Juzgado y Especialistas'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nombre del Juzgado *
            </label>
            <input
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: 10mo Juzgado Civil / 1er Juzgado de Trabajo"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium text-slate-900"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Especialidad
              </label>
              <select
                value={especialidad}
                onChange={(e) => setEspecialidad(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
              >
                <option value="Civil">Civil</option>
                <option value="Laboral">Laboral</option>
                <option value="Familia">Familia</option>
                <option value="Penal">Penal</option>
                <option value="Constitucional">Constitucional</option>
                <option value="Paz Letrado">Paz Letrado</option>
                <option value="Comercial">Comercial</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sede Judicial
              </label>
              <input
                type="text"
                value={sede}
                onChange={(e) => setSede(e.target.value)}
                placeholder="Ej: Sede Central / Palacio de Justicia"
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nombre del Juez a Cargo (Opcional)
            </label>
            <input
              type="text"
              value={juez}
              onChange={(e) => setJuez(e.target.value)}
              placeholder="Ej: Dra. SALAS FLORES, ZORAIDA JULIA"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Especialistas Legales (Uno por línea)</span>
              </label>
              <span className="text-[10px] text-slate-400 font-normal">1 nombre por fila</span>
            </div>
            <textarea
              rows={5}
              value={especialistasInput}
              onChange={(e) => setEspecialistasInput(e.target.value)}
              placeholder={`Francis Zegarra Cardenas\nGARCIA JURADO MARISOL\nLIZARZABURU ROMERO CHRISTIAN EDUARDO\nMANTILLA VALDIVIA ERIK ALEXANDER\nFERNANDEZ HUAQUIPACO NORMA HILDA\nPEÑA CONDORI JESUS WANPIAU`}
              className="w-full p-3 text-xs font-mono bg-slate-50 focus:bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 leading-relaxed"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Escriba o pegue la lista de especialistas. Cada línea será una opción seleccionable en los formularios.
            </p>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-sm transition-all flex items-center gap-1.5"
            >
              {isEditing ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isEditing ? 'Guardar Cambios' : 'Guardar Juzgado'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

