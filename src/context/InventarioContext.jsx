import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import {
  ACCIONES, crearEstadoInicial, inventarioReducer,
} from './inventarioReducer.js';

const CLAVE_ALMACENAMIENTO = 'supermercado-castillo-estado-v1';
const InventarioContext = createContext(null);

/** Lee el estado guardado en el navegador; si no existe o es inválido, usa los datos de ejemplo. */
function cargarEstado() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE_ALMACENAMIENTO));
    if (guardado && Array.isArray(guardado.inventario) && Array.isArray(guardado.carrito)) {
      return guardado;
    }
  } catch {
    /* almacenamiento no disponible o JSON inválido: se ignora */
  }
  return crearEstadoInicial();
}

export function InventarioProvider({ children }) {
  const [state, dispatch] = useReducer(inventarioReducer, undefined, cargarEstado);

  // Persistencia: el inventario y el carrito sobreviven a recargar la página.
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(state));
    } catch {
      /* sin almacenamiento disponible */
    }
  }, [state]);

  const agregarArticulo = useCallback((datos) => dispatch({ type: ACCIONES.AGREGAR_ARTICULO, payload: datos }), []);
  const agregarAlCarrito = useCallback((id, cantidad = 1) => dispatch({ type: ACCIONES.AGREGAR_AL_CARRITO, payload: { id, cantidad } }), []);
  const cambiarCantidad = useCallback((id, delta) => dispatch({ type: ACCIONES.CAMBIAR_CANTIDAD, payload: { id, delta } }), []);
  const quitarDelCarrito = useCallback((id) => dispatch({ type: ACCIONES.QUITAR_DEL_CARRITO, payload: { id } }), []);
  const vaciarCarrito = useCallback(() => dispatch({ type: ACCIONES.VACIAR_CARRITO }), []);
  const finalizarCompra = useCallback(() => dispatch({ type: ACCIONES.FINALIZAR_COMPRA }), []);
  const restablecer = useCallback(() => dispatch({ type: ACCIONES.RESTABLECER }), []);

  const value = useMemo(
    () => ({
      state, agregarArticulo, agregarAlCarrito, cambiarCantidad, quitarDelCarrito, vaciarCarrito, finalizarCompra, restablecer,
    }),
    [state, agregarArticulo, agregarAlCarrito, cambiarCantidad, quitarDelCarrito, vaciarCarrito, finalizarCompra, restablecer]
  );

  return <InventarioContext.Provider value={value}>{children}</InventarioContext.Provider>;
}

/** Hook personalizado para consumir el inventario y el carrito. */
export function useInventario() {
  const contexto = useContext(InventarioContext);
  if (!contexto) throw new Error('useInventario debe usarse dentro de <InventarioProvider>.');
  return contexto;
}
