import React, { useState } from 'react';
import { 
   Building2, 
   UserCheck, 
   Search, 
   Plus, 
   FileText, 
   MapPin, 
   User, 
   Scale, 
   ArrowRight,
   Edit3,
   Trash2,
   RotateCcw,
   AlertTriangle,
   X,
   Check
 } from 'lucide-react';
 import { JuzgadoItem, ConfiguracionGrupo } from '../types';

interface DirectorioJudicialProps {
   config: ConfiguracionGrupo;
   onSelectJuzgadoAndEspecialista: (juzgado: string, especialista: string) => void;
   onOpenAddJuzgadoModal: () => void;
   onEditJuzgado?: (juzgado: JuzgadoItem) => void;
   onDeleteJuzgado?: (juzgadoId: string) => void;
   onResetJuzgados?: () => void;
}

export const DirectorioJudicial: React.FC<DirectorioJudicialProps> = ({
   config,
   onSelectJuzgadoAndEspecialista,
   onOpenAddJuzgadoModal,
   onEditJuzgado,
   onDeleteJuzgado,
   onResetJuzgados
}) => {
   const [searchTerm, setSearchTerm] = useState('');
   const [selectedSpecialty, setSelectedSpecialty] = useState<string>('todos');
   const [juzgadoToDelete, setJuzgadoToDelete] = useState<JuzgadoItem | null>(null);
   const [showResetConfirm, setShowResetConfirm] = useState(false);

   const filteredJuzgados = config.juzgados.filter(j => {
     const matchSearch = 
       j.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
       (j.juez && j.juez.toLowerCase().includes(searchTerm.toLowerCase())) ||
       j.especialistas.some(esp => esp.toLowerCase().includes(searchTerm.toLowerCase()));
     
     const matchSpecialty = selectedSpecialty === 'todos' || j.especialidad === selectedSpecialty;

     return matchSearch && matchSpecialty;
   });

   const confirmDelete = () => {
     if (juzgadoToDelete && onDeleteJuzgado) {
       onDeleteJuzgado(juzgadoToDelete.id);
       setJuzgadoToDelete(null);
     }
   };

   const confirmReset = () => {
     if (onResetJuzgados) {
       onResetJuzgados();
       setShowResetConfirm(false);
     }
   };

   return (
     <div className="space-y-6">
       {/* Top Banner */}
       <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200">
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
           <div>
             <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
               <Building2 className="w-5 h-5 text-emerald-600" />
               <span>Directorio de Juzgados y Especialistas</span>
             </h2>
             <p className="text-xs text-slate-500 mt-1 max-w-xl">
               Consulte y administre la lista de juzgados y especialistas legales. Puede seleccionar un especialista para iniciar un pedido o editar los nombres de los especialistas en cualquier momento.
             </p>
           </div>

           <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
             {onResetJuzgados && (
               <button
                 type="button"
                 onClick={() => setShowResetConfirm(true)}
                 className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-200 transition-colors flex items-center gap-1.5"
                 title="Cargar datos originales de initialData.ts"
               >
                 <RotateCcw className="w-3.5 h-3.5" />
                 <span>Recargar initialData.ts</span>
               </button>
             )}

             <button
               id="btn-add-juzgado"
               type="button"
               onClick={onOpenAddJuzgadoModal}
               className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
             >
               <Plus className="w-4 h-4" />
               <span>Agregar Juzgado / Especialista</span>
             </button>
           </div>
         </div>
       </div>

       {/* Search and Filters */}
       <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-3">
         <div className="flex-1 relative">
           <input
             id="input-search-directorio"
             type="text"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             placeholder="Buscar por juzgado, juez o especialista (ej. 10mo Juzgado, Francis Zegarra, GARCIA JURADO)..."
             className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-900 outline-none"
           />
           <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
         </div>

         <div className="flex items-center gap-1.5 flex-wrap">
           {['todos', 'Civil', 'Laboral', 'Familia', 'Paz Letrado'].map(spec => (
             <button
               key={spec}
               type="button"
               onClick={() => setSelectedSpecialty(spec)}
               className={`text-xs px-3 py-1.5 rounded-xl border transition-all ${
                 selectedSpecialty === spec
                   ? 'bg-slate-900 text-white border-slate-900 font-bold shadow-xs'
                   : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
               }`}
             >
               {spec === 'todos' ? 'Todas las Especialidades' : spec}
             </button>
           ))}
         </div>
       </div>

       {/* Cards Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {filteredJuzgados.map(juzgado => (
           <div
             key={juzgado.id}
             className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/90 hover:border-emerald-400 transition-all flex flex-col justify-between space-y-3 group"
           >
             <div>
               {/* Card Header */}
               <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                 <div>
                   <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                     {juzgado.especialidad}
                   </span>
                   <h3 className="text-sm font-bold text-slate-900 mt-1">
                     {juzgado.nombre}
                   </h3>
                 </div>
                 <div className="flex items-center gap-1">
                   {onEditJuzgado && (
                     <button
                       type="button"
                       onClick={() => onEditJuzgado(juzgado)}
                       title="Editar juzgado y especialistas"
                       className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-800 flex items-center justify-center transition-colors"
                     >
                       <Edit3 className="w-3.5 h-3.5" />
                     </button>
                   )}
                   {onDeleteJuzgado && (
                     <button
                       type="button"
                       onClick={() => setJuzgadoToDelete(juzgado)}
                       title="Eliminar juzgado"
                       className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700 flex items-center justify-center transition-colors"
                     >
                       <Trash2 className="w-3.5 h-3.5" />
                     </button>
                   )}
                 </div>
               </div>

               {/* Court Details */}
               <div className="text-xs text-slate-600 space-y-1.5 py-2">
                 {juzgado.sede && (
                   <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                     <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                     <span className="truncate">{juzgado.sede}</span>
                   </div>
                 )}
                 {juzgado.juez && (
                   <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                     <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                     <span><strong>Juez:</strong> {juzgado.juez}</span>
                   </div>
                 )}
               </div>

               {/* Specialists List */}
               <div className="pt-2">
                 <div className="flex items-center justify-between mb-1.5">
                   <span className="text-[11px] font-bold text-slate-700">
                     Especialistas Legales ({juzgado.especialistas.length}):
                   </span>
                   {onEditJuzgado && (
                     <button
                       type="button"
                       onClick={() => onEditJuzgado(juzgado)}
                       className="text-[10px] text-emerald-700 hover:underline font-semibold"
                     >
                       Editar lista
                     </button>
                   )}
                 </div>
                 <div className="space-y-1 max-h-48 overflow-y-auto pr-0.5">
                   {juzgado.especialistas.map((esp, idx) => (
                     <button
                       key={idx}
                       type="button"
                       onClick={() => onSelectJuzgadoAndEspecialista(juzgado.nombre, esp)}
                       className="w-full text-left p-1.5 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-800 hover:text-emerald-950 text-xs border border-slate-200/70 hover:border-emerald-300 transition-all flex items-center justify-between group/esp"
                       title={`Crear pedido para ${esp}`}
                     >
                       <div className="flex items-center gap-1.5">
                         <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                         <span className="font-semibold">{esp}</span>
                       </div>
                       <span className="text-[10px] text-emerald-600 opacity-0 group-hover/esp:opacity-100 font-bold flex items-center gap-0.5 shrink-0">
                         Elegir <ArrowRight className="w-2.5 h-2.5" />
                       </span>
                     </button>
                   ))}
                 </div>
               </div>
             </div>

             {/* Quick Action Footer */}
             <div className="pt-2 border-t border-slate-100">
               <button
                 type="button"
                 onClick={() => onSelectJuzgadoAndEspecialista(juzgado.nombre, juzgado.especialistas[0] || '')}
                 className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
               >
                 <FileText className="w-3.5 h-3.5 text-emerald-400" />
                 <span>Crear Pedido para este Juzgado</span>
               </button>
             </div>
           </div>
         ))}
       </div>

       {/* Delete Confirmation Modal */}
       {juzgadoToDelete && (
         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
           <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-slate-200 space-y-4">
             <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
               <AlertTriangle className="w-5 h-5" />
             </div>
             <div>
               <h3 className="text-base font-bold text-slate-900">¿Eliminar este juzgado?</h3>
               <p className="text-xs text-slate-600 mt-1">
                 Se eliminará <strong className="text-slate-900">"{juzgadoToDelete.nombre}"</strong> y sus {juzgadoToDelete.especialistas.length} especialistas del directorio local.
               </p>
             </div>
             <div className="flex items-center justify-end gap-2 pt-2">
               <button
                 type="button"
                 onClick={() => setJuzgadoToDelete(null)}
                 className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
               >
                 Cancelar
               </button>
               <button
                 type="button"
                 onClick={confirmDelete}
                 className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors flex items-center gap-1.5"
               >
                 <Trash2 className="w-3.5 h-3.5" />
                 <span>Eliminar Juzgado</span>
               </button>
             </div>
           </div>
         </div>
       )}

       {/* Reset InitialData Confirmation Modal */}
       {showResetConfirm && (
         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
           <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-slate-200 space-y-4">
             <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
               <RotateCcw className="w-5 h-5" />
             </div>
             <div>
               <h3 className="text-base font-bold text-slate-900">¿Recargar initialData.ts?</h3>
               <p className="text-xs text-slate-600 mt-1">
                 Se restaurará la lista completa de juzgados y especialistas con los datos definidos en el archivo de código <code>initialData.ts</code>.
               </p>
             </div>
             <div className="flex items-center justify-end gap-2 pt-2">
               <button
                 type="button"
                 onClick={() => setShowResetConfirm(false)}
                 className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
               >
                 Cancelar
               </button>
               <button
                 type="button"
                 onClick={confirmReset}
                 className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors flex items-center gap-1.5"
               >
                 <Check className="w-3.5 h-3.5 text-emerald-400" />
                 <span>Sí, Recargar</span>
               </button>
             </div>
           </div>
         </div>
       )}
     </div>
   );
 };


