import { useInventario } from '../context/InventarioContext.jsx';
import { totalUnidades } from '../context/inventarioReducer.js';

const ENLACES = [
  { nombre: 'lista', destino: '/', etiqueta: 'Inventario' },
  { nombre: 'nuevo', destino: '/nuevo', etiqueta: 'Agregar artículo' },
  { nombre: 'carrito', destino: '/carrito', etiqueta: 'Carrito' },
];

export default function Navbar({ pantallaActual }) {
  const { state } = useInventario();
  const unidades = totalUnidades(state);
  // El detalle de un artículo pertenece a la sección "Inventario".
  const seccion = pantallaActual === 'detalle' ? 'lista' : pantallaActual;

  return (
    <header className="bg-emerald-700 text-white shadow">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <a href="#/" className="flex items-center gap-2 text-xl font-bold">
          <span aria-hidden="true">🛒</span> Supermercado Castillo
        </a>
        <nav aria-label="Principal">
          <ul className="flex flex-wrap gap-2">
            {ENLACES.map((enlace) => {
              const activo = seccion === enlace.nombre;
              return (
                <li key={enlace.nombre}>
                  <a
                    href={`#${enlace.destino}`}
                    aria-current={activo ? 'page' : undefined}
                    className={`inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition ${
                      activo ? 'bg-white text-emerald-800' : 'text-emerald-50 hover:bg-emerald-600'
                    }`}
                  >
                    {enlace.etiqueta}
                    {enlace.nombre === 'carrito' && (
                      <span
                        aria-label={`${unidades} unidades en el carrito`}
                        className="ml-2 inline-flex min-w-6 justify-center rounded-full bg-amber-400 px-2 text-xs font-bold text-emerald-900"
                      >
                        {unidades}
                      </span>
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
