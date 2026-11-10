export const TODAS = 'Todas';

/** Devuelve un arreglo filtrado sin modificar el inventario original. */
export function filtrarPorCategoria(articulos, categoria) {
  if (!categoria || categoria === TODAS) return articulos;
  return articulos.filter((a) => a.categoria === categoria);
}

export function categoriasDisponibles(articulos) {
  return [...new Set(articulos.map((a) => a.categoria))].sort((a, b) => a.localeCompare(b, 'es'));
}

export function contarPorCategoria(articulos) {
  return articulos.reduce((conteo, a) => ({ ...conteo, [a.categoria]: (conteo[a.categoria] ?? 0) + 1 }), {});
}
