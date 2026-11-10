/** Control reutilizable de cantidad (− valor +), usado en el detalle y en el carrito. */
export default function CantidadControl({ valor, onMenos, onMas, deshabilitarMenos, deshabilitarMas, etiqueta }) {
  const boton =
    'flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 bg-white text-lg font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40';
  return (
    <div className="inline-flex items-center gap-2" role="group" aria-label={`Cantidad de ${etiqueta}`}>
      <button type="button" className={boton} onClick={onMenos} disabled={deshabilitarMenos} aria-label={`Disminuir cantidad de ${etiqueta}`}>
        −
      </button>
      <output className="min-w-8 text-center text-base font-semibold" aria-live="polite">{valor}</output>
      <button type="button" className={boton} onClick={onMas} disabled={deshabilitarMas} aria-label={`Aumentar cantidad de ${etiqueta}`}>
        +
      </button>
    </div>
  );
}
