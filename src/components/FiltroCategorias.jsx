import { memo } from 'react';
import { TODAS } from '../utils/filtros.js';

function FiltroCategorias({ categorias, conteo, total, seleccionada, onSeleccionar }) {
  const opciones = [{ nombre: TODAS, cantidad: total }, ...categorias.map((c) => ({ nombre: c, cantidad: conteo[c] ?? 0 }))];

  return (
    <div role="group" aria-label="Filtrar por categoría" className="flex flex-wrap gap-2">
      {opciones.map((opcion) => {
        const activa = seleccionada === opcion.nombre;
        return (
          <button
            key={opcion.nombre}
            type="button"
            aria-pressed={activa}
            onClick={() => onSeleccionar(opcion.nombre)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
              activa
                ? 'border-emerald-700 bg-emerald-700 text-white'
                : 'border-slate-300 bg-white text-slate-700 hover:border-emerald-600 hover:text-emerald-700'
            }`}
          >
            {opcion.nombre} <span className="opacity-75">({opcion.cantidad})</span>
          </button>
        );
      })}
    </div>
  );
}

export default memo(FiltroCategorias);
