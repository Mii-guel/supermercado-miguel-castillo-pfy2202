/** Resuelve una ruta tipo hash ("/articulo/3") a un nombre de pantalla y sus parámetros. */
export function resolverRuta(ruta) {
  const limpia = (ruta ?? '/').split('?')[0].replace(/\/+$/, '') || '/';
  if (limpia === '/') return { nombre: 'lista', params: {} };
  if (limpia === '/nuevo') return { nombre: 'nuevo', params: {} };
  if (limpia === '/carrito') return { nombre: 'carrito', params: {} };
  const detalle = limpia.match(/^\/articulo\/(\d+)$/);
  if (detalle) return { nombre: 'detalle', params: { id: Number(detalle[1]) } };
  return { nombre: 'no-encontrado', params: {} };
}
