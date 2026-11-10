import { useState } from 'react';
import Alerta from '../components/Alerta.jsx';
import CantidadControl from '../components/CantidadControl.jsx';
import { useInventario } from '../context/InventarioContext.jsx';
import { carritoDetallado, totalAPagar, totalUnidades } from '../context/inventarioReducer.js';
import { ICONOS } from '../data/inventarioInicial.js';
import { formatearPrecio } from '../utils/formato.js';

export default function Carrito() {
  const { state, cambiarCantidad, quitarDelCarrito, vaciarCarrito, finalizarCompra } = useInventario();
  const [compra, setCompra] = useState(null);

  const lineas = carritoDetallado(state);
  const unidades = totalUnidades(state);
  const total = totalAPagar(state);

  const confirmarCompra = () => {
    setCompra({ unidades, total });
    finalizarCompra();
  };

  if (lineas.length === 0) {
    return (
      <section aria-labelledby="titulo-carrito" className="mx-auto max-w-3xl space-y-4">
        <h1 id="titulo-carrito" className="text-2xl font-bold text-slate-900">Carrito de compras</h1>
        {compra && (
          <Alerta tipo="exito">
            ¡Compra realizada! {compra.unidades} unidad{compra.unidades === 1 ? '' : 'es'} por {formatearPrecio(compra.total)}.
          </Alerta>
        )}
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p aria-hidden="true" className="text-5xl">🛒</p>
          <p className="mt-3 text-slate-600">Tu carrito está vacío.</p>
          <a href="#/" className="mt-4 inline-block rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
            Ver inventario
          </a>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby="titulo-carrito" className="mx-auto max-w-4xl space-y-4">
      <h1 id="titulo-carrito" className="text-2xl font-bold text-slate-900">Carrito de compras</h1>

      <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white shadow-sm">
        {lineas.map(({ articulo, cantidad, subtotal }) => (
          <li key={articulo.id} className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
            <div className="flex flex-1 items-center gap-4">
              <span aria-hidden="true" className="text-4xl">{ICONOS[articulo.categoria] ?? '🛒'}</span>
              <div>
                <a href={`#/articulo/${articulo.id}`} className="font-semibold text-slate-900 hover:text-emerald-700 hover:underline">{articulo.nombre}</a>
                <p className="text-sm text-slate-500">{formatearPrecio(articulo.precio)} c/u · Disponibles en inventario: {articulo.cantidad}</p>
              </div>
            </div>

            <CantidadControl
              valor={cantidad}
              etiqueta={articulo.nombre}
              onMenos={() => cambiarCantidad(articulo.id, -1)}
              onMas={() => cambiarCantidad(articulo.id, 1)}
              deshabilitarMas={articulo.cantidad === 0}
            />

            <p className="w-28 text-right text-lg font-bold text-emerald-700">{formatearPrecio(subtotal)}</p>

            <button
              type="button"
              onClick={() => quitarDelCarrito(articulo.id)}
              aria-label={`Quitar ${articulo.nombre} del carrito`}
              className="self-end rounded-md px-2 py-1 text-sm text-red-600 hover:bg-red-50 sm:self-auto"
            >
              Quitar
            </button>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">{unidades} unidad{unidades === 1 ? '' : 'es'} en el carrito</p>
          <p className="text-2xl font-bold text-slate-900">Total: {formatearPrecio(total)}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={vaciarCarrito} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
            Vaciar carrito
          </button>
          <button type="button" onClick={confirmarCompra} className="rounded-md bg-emerald-700 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
            Finalizar compra
          </button>
        </div>
      </div>
    </section>
  );
}
