export default function NoEncontrado() {
  return (
    <section className="mx-auto max-w-xl space-y-4 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Página no encontrada</h1>
      <p className="text-slate-600">La dirección que buscas no existe.</p>
      <a href="#/" className="inline-block rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">Ir al inventario</a>
    </section>
  );
}
