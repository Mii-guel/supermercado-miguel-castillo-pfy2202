import Navbar from './components/Navbar.jsx';
import { useHashRoute } from './hooks/useHashRoute.js';
import AgregarArticulo from './pages/AgregarArticulo.jsx';
import Carrito from './pages/Carrito.jsx';
import DetalleArticulo from './pages/DetalleArticulo.jsx';
import ListaArticulos from './pages/ListaArticulos.jsx';
import NoEncontrado from './pages/NoEncontrado.jsx';
import { resolverRuta } from './utils/rutas.js';

export default function App() {
  const ruta = useHashRoute();
  const { nombre, params } = resolverRuta(ruta);

  let pantalla;
  switch (nombre) {
    case 'lista': pantalla = <ListaArticulos />; break;
    case 'nuevo': pantalla = <AgregarArticulo />; break;
    case 'detalle': pantalla = <DetalleArticulo key={params.id} id={params.id} />; break;
    case 'carrito': pantalla = <Carrito />; break;
    default: pantalla = <NoEncontrado />;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-10 focus:rounded focus:bg-white focus:px-3 focus:py-2">
        Saltar al contenido
      </a>
      <Navbar pantallaActual={nombre} />
      <main id="contenido" className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{pantalla}</main>
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-sm text-slate-500">
        Desarrollo Frontend II (PFY2202) · Miguel Castillo
      </footer>
    </div>
  );
}
