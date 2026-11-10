import { useMemo, useState } from 'react';
import {
  TODAS, categoriasDisponibles, contarPorCategoria, filtrarPorCategoria,
} from '../utils/filtros.js';

/**
 * Filtra el inventario por categoría. La categoría seleccionada vive en su propio estado
 * y la lista visible se DERIVA con useMemo: el inventario original nunca se modifica.
 */
export function useFiltroCategoria(articulos) {
  const [categoria, setCategoria] = useState(TODAS);
  const categorias = useMemo(() => categoriasDisponibles(articulos), [articulos]);
  const conteo = useMemo(() => contarPorCategoria(articulos), [articulos]);
  const filtrados = useMemo(() => filtrarPorCategoria(articulos, categoria), [articulos, categoria]);
  return { categoria, setCategoria, categorias, conteo, filtrados };
}
