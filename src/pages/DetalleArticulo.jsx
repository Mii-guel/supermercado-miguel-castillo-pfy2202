import { useEffect, useState } from 'react';
import Alerta from '../components/Alerta.jsx';
import CantidadControl from '../components/CantidadControl.jsx';
import EstadoStock from '../components/EstadoStock.jsx';
import { useInventario } from '../context/InventarioContext.jsx';
import { ICONOS } from '../data/inventarioInicial.js';
import { formatearPrecio } from '../utils/formato.js';

export default function DetalleArticulo({ id }) {
  const { state, agregarAlCarrito } = useInventario();
  const articulo = state.inventario.find((a) => a.id === id);
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState(null);

  const disponible = articulo?.cantidad ?? 0;
  const enCarrito = state.carrito.find((l) => l.id === id)?.cantidad ?? 0;

  // Si cambia el stock disponible, la cantidad elegida nunca supera lo que queda.
  useEffect(() => {
    setCantidad((actual) => Math.max(1, Math.min(actual, disponible || 1)));
  }, [disponible]);

  if (!articulo) {
    return (
      <section className="space-y-4">
        <Alerta tipo="error">El artículo solicitado no existe.</Alerta>
        <a href="#/" className="font-semibold text-emerald-700 underline">Volver al inventario</a>
      </section>
    );
  }

  const agregar = () => {
    agregarAlCarrito(articulo.id, cantidad);
    setMensaje(`Agregaste ${cantidad} unidad${cantidad === 1 ? '' : 'es'} al carrito.`);
  };

  return (
    <section aria-labelledby="titulo-detalle" className="mx-auto max-w-3xl space-y-4">
      <a href="#/" className="inline-block text-sm font-medium text-emerald-700 hover:underline">← Volver al inventario</a>

      <article className="grid gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:grid-cols-[auto,1fr]">
        <div aria-hidden="true" className="flex h-32 w-32 items-center justify-center rounded-xl bg-emerald-50 text-6xl">
          {ICONOS[articulo.categoria] ?? '🛒'}
        </div>

        <div className="space-y-4">
          <div>
            <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">{articulo.categoria}</span>
            <h1 id="titulo-detalle" className="mt-2 text-2xl font-bold text-slate-900">{articulo.nombre}</h1>
          </div>

          <p className="text-slate-600">{articulo.descripcion || 'Sin descripción.'}</p>

          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-slate-500">Precio unitario</dt>
              <dd className="text-xl font-bold text-emerald-700">{formatearPrecio(articulo.precio)}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Stock</dt>
              <dd className="mt-1"><EstadoStock cantidad={articulo.cantidad} /></dd>
            </div>
            <div>
              <dt className="text-slate-500">En tu carrito</dt>
              <dd className="font-semibold">{enCarrito} unidad{enCarrito === 1 ? '' : 'es'}</dd>
            </div>
          </dl>

          {disponible > 0 ? (
            <div className="flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4">
              <CantidadControl
                valor={cantidad}
                etiqueta={articulo.nombre}
                onMenos={() => setCantidad((c) => Math.max(1, c - 1))}
                onMas={() => setCantidad((c) => Math.min(disponible, c + 1))}
                deshabilitarMenos={cantidad <= 1}
                deshabilitarMas={cantidad >= disponible}
              />
              <button type="button" onClick={agregar} className="rounded-md bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800">
                Agregar al carrito
              </button>
            </div>
          ) : (
            <Alerta tipo="info">Este artículo no tiene unidades disponibles por ahora.</Alerta>
          )}

          {mensaje && (
            <Alerta tipo="exito">
              {mensaje} <a href="#/carrito" className="font-semibold underline">Ir al carrito</a>
            </Alerta>
          )}
        </div>
      </article>
    </section>
  );
}
