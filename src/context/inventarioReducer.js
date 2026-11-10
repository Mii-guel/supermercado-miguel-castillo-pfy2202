import { INVENTARIO_INICIAL } from '../data/inventarioInicial.js';

export const ACCIONES = {
  AGREGAR_ARTICULO: 'AGREGAR_ARTICULO',
  AGREGAR_AL_CARRITO: 'AGREGAR_AL_CARRITO',
  CAMBIAR_CANTIDAD: 'CAMBIAR_CANTIDAD',
  QUITAR_DEL_CARRITO: 'QUITAR_DEL_CARRITO',
  VACIAR_CARRITO: 'VACIAR_CARRITO',
  FINALIZAR_COMPRA: 'FINALIZAR_COMPRA',
  RESTABLECER: 'RESTABLECER',
};

/**
 * Estado de la aplicación:
 *  - inventario: artículos con su cantidad DISPONIBLE actual.
 *  - carrito:    líneas { id, cantidad } con lo que el usuario reservó.
 * Invariante: para cada artículo, disponible + en carrito = stock original
 * (hasta que se finaliza la compra).
 */
export function crearEstadoInicial(inventario = INVENTARIO_INICIAL) {
  return { inventario: inventario.map((a) => ({ ...a })), carrito: [] };
}

const buscarArticulo = (state, id) => state.inventario.find((a) => a.id === id);
const buscarLinea = (state, id) => state.carrito.find((l) => l.id === id);

const ajustarDisponible = (inventario, id, delta) =>
  inventario.map((a) => (a.id === id ? { ...a, cantidad: a.cantidad + delta } : a));

export function inventarioReducer(state, action) {
  switch (action.type) {
    case ACCIONES.AGREGAR_ARTICULO: {
      const { nombre, categoria, precio, cantidad, descripcion = '' } = action.payload;
      const id = state.inventario.reduce((max, a) => Math.max(max, a.id), 0) + 1;
      const nuevo = {
        id,
        nombre: String(nombre).trim(),
        categoria,
        precio: Number(precio),
        cantidad: Number(cantidad),
        descripcion: String(descripcion).trim(),
      };
      return { ...state, inventario: [...state.inventario, nuevo] };
    }

    case ACCIONES.AGREGAR_AL_CARRITO: {
      const { id, cantidad = 1 } = action.payload;
      const articulo = buscarArticulo(state, id);
      if (!articulo || !Number.isInteger(cantidad) || cantidad < 1 || cantidad > articulo.cantidad) {
        return state; // operación inválida: no se modifica nada
      }
      const carrito = buscarLinea(state, id)
        ? state.carrito.map((l) => (l.id === id ? { ...l, cantidad: l.cantidad + cantidad } : l))
        : [...state.carrito, { id, cantidad }];
      return { inventario: ajustarDisponible(state.inventario, id, -cantidad), carrito };
    }

    case ACCIONES.CAMBIAR_CANTIDAD: {
      const { id, delta } = action.payload;
      const linea = buscarLinea(state, id);
      const articulo = buscarArticulo(state, id);
      if (!linea || !articulo || !Number.isInteger(delta) || delta === 0) return state;
      if (delta > 0 && articulo.cantidad < delta) return state; // sin stock suficiente
      if (linea.cantidad + delta < 0) return state;
      const nueva = linea.cantidad + delta;
      const carrito =
        nueva === 0
          ? state.carrito.filter((l) => l.id !== id)
          : state.carrito.map((l) => (l.id === id ? { ...l, cantidad: nueva } : l));
      return { inventario: ajustarDisponible(state.inventario, id, -delta), carrito };
    }

    case ACCIONES.QUITAR_DEL_CARRITO: {
      const linea = buscarLinea(state, action.payload.id);
      if (!linea) return state;
      return {
        inventario: ajustarDisponible(state.inventario, linea.id, linea.cantidad),
        carrito: state.carrito.filter((l) => l.id !== linea.id),
      };
    }

    case ACCIONES.VACIAR_CARRITO: {
      const inventario = state.inventario.map((a) => {
        const linea = buscarLinea(state, a.id);
        return linea ? { ...a, cantidad: a.cantidad + linea.cantidad } : a;
      });
      return { inventario, carrito: [] };
    }

    case ACCIONES.FINALIZAR_COMPRA:
      // La compra se concreta: el stock descontado se mantiene y el carrito queda vacío.
      return { ...state, carrito: [] };

    case ACCIONES.RESTABLECER:
      return crearEstadoInicial(action.payload ?? INVENTARIO_INICIAL);

    default:
      return state;
  }
}

/* ---------- Selectores (funciones puras derivadas del estado) ---------- */

export const totalUnidades = (state) => state.carrito.reduce((suma, l) => suma + l.cantidad, 0);

export function carritoDetallado(state) {
  return state.carrito
    .map((linea) => {
      const articulo = buscarArticulo(state, linea.id);
      return articulo ? { ...linea, articulo, subtotal: articulo.precio * linea.cantidad } : null;
    })
    .filter(Boolean);
}

export const totalAPagar = (state) =>
  carritoDetallado(state).reduce((suma, l) => suma + l.subtotal, 0);
