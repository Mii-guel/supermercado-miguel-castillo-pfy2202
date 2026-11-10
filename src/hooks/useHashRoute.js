import { useEffect, useState } from 'react';

const leerRuta = () => {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  return hash.startsWith('/') ? hash : `/${hash}`;
};

/**
 * Enrutamiento por hash (#/ruta): funciona en GitHub Pages sin configuración del servidor.
 * Devuelve la ruta actual y se actualiza cuando cambia el hash del navegador.
 */
export function useHashRoute() {
  const [ruta, setRuta] = useState(leerRuta);

  useEffect(() => {
    const alCambiar = () => {
      setRuta(leerRuta());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', alCambiar);
    return () => window.removeEventListener('hashchange', alCambiar);
  }, []);

  return ruta;
}
