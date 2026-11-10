/** Etiqueta con el estado del stock disponible: agotado, pocas unidades o disponible. */
export default function EstadoStock({ cantidad }) {
  if (cantidad === 0) {
    return <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">Sin stock</span>;
  }
  if (cantidad <= 5) {
    return <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">Quedan {cantidad}</span>;
  }
  return <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">Disponibles: {cantidad}</span>;
}
