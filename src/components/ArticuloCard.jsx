import { memo } from 'react';
import { ICONOS } from '../data/inventarioInicial.js';
import { formatearPrecio } from '../utils/formato.js';
import EstadoStock from './EstadoStock.jsx';

function ArticuloCard({ articulo }) {
  return (
    <li>
      <a
        href={`#/articulo/${articulo.id}`}
        className="flex h-full flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-500 hover:shadow-md"
      >
        <div className="flex items-start justify-between gap-2">
          <span aria-hidden="true" className="text-4xl">{ICONOS[articulo.categoria] ?? '🛒'}</span>
          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{articulo.categoria}</span>
        </div>
        <h3 className="text-base font-semibold text-slate-900">{articulo.nombre}</h3>
        <div className="mt-auto flex items-end justify-between gap-2">
          <p className="text-lg font-bold text-emerald-700">{formatearPrecio(articulo.precio)}</p>
          <EstadoStock cantidad={articulo.cantidad} />
        </div>
      </a>
    </li>
  );
}

export default memo(ArticuloCard);
