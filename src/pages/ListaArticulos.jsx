import ArticuloCard from '../components/ArticuloCard.jsx';
import FiltroCategorias from '../components/FiltroCategorias.jsx';
import { useInventario } from '../context/InventarioContext.jsx';
import { useFiltroCategoria } from '../hooks/useFiltroCategoria.js';
import { TODAS } from '../utils/filtros.js';

export default function ListaArticulos() {
  const { state, restablecer } = useInventario();
  const { categoria, setCategoria, categorias, conteo, filtrados } = useFiltroCategoria(state.inventario);

  return (
    <section aria-labelledby="titulo-lista" className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 id="titulo-lista" className="text-2xl font-bold text-slate-900">Inventario</h1>
          <p className="text-sm text-slate-600" aria-live="polite">
            Mostrando {filtrados.length} de {state.inventario.length} artículos
            {categoria !== TODAS && <> en la categoría <strong>{categoria}</strong></>}.
          </p>
        </div>
        <a href="#/nuevo" className="inline-flex w-fit items-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800">
          + Agregar artículo
        </a>
      </div>

      <FiltroCategorias
        categorias={categorias}
        conteo={conteo}
        total={state.inventario.length}
        seleccionada={categoria}
        onSeleccionar={setCategoria}
      />

      {filtrados.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
          No hay artículos para mostrar.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtrados.map((articulo) => (
            <ArticuloCard key={articulo.id} articulo={articulo} />
          ))}
        </ul>
      )}

      <div className="pt-4 text-right">
        <button
          type="button"
          onClick={() => {
            if (window.confirm('¿Restablecer el inventario y vaciar el carrito con los datos de ejemplo?')) restablecer();
          }}
          className="text-sm text-slate-500 underline hover:text-slate-700"
        >
          Restablecer datos de ejemplo
        </button>
      </div>
    </section>
  );
}
