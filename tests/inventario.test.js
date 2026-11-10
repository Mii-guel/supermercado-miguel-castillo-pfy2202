import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ACCIONES, inventarioReducer, crearEstadoInicial, totalUnidades, totalAPagar, carritoDetallado,
} from '../src/context/inventarioReducer.js';
import { INVENTARIO_INICIAL } from '../src/data/inventarioInicial.js';
import { filtrarPorCategoria, categoriasDisponibles, contarPorCategoria, TODAS } from '../src/utils/filtros.js';
import { validarArticulo } from '../src/utils/validaciones.js';
import { resolverRuta } from '../src/utils/rutas.js';

const nuevo = () => crearEstadoInicial();
const disponible = (s, id) => s.inventario.find((a) => a.id === id).cantidad;
const enCarrito = (s, id) => s.carrito.find((l) => l.id === id)?.cantidad ?? 0;
const accion = (type, payload) => ({ type, payload });

test('agregar al carrito descuenta la cantidad disponible del inventario', () => {
  let s = nuevo();
  s = inventarioReducer(s, accion(ACCIONES.AGREGAR_AL_CARRITO, { id: 1, cantidad: 3 }));
  assert.equal(disponible(s, 1), 21);
  assert.equal(enCarrito(s, 1), 3);
  s = inventarioReducer(s, accion(ACCIONES.AGREGAR_AL_CARRITO, { id: 1, cantidad: 2 }));
  assert.equal(disponible(s, 1), 19);
  assert.equal(enCarrito(s, 1), 5); // acumula en la misma línea
  assert.equal(s.carrito.length, 1);
});

test('no permite agregar más que el stock ni artículos agotados', () => {
  const s = nuevo();
  assert.equal(inventarioReducer(s, accion(ACCIONES.AGREGAR_AL_CARRITO, { id: 7, cantidad: 6 })), s);
  assert.equal(inventarioReducer(s, accion(ACCIONES.AGREGAR_AL_CARRITO, { id: 12, cantidad: 1 })), s);
  assert.equal(inventarioReducer(s, accion(ACCIONES.AGREGAR_AL_CARRITO, { id: 1, cantidad: 0 })), s);
  assert.equal(inventarioReducer(s, accion(ACCIONES.AGREGAR_AL_CARRITO, { id: 999, cantidad: 1 })), s);
});

test('aumentar y disminuir cantidad en el carrito actualiza el inventario general', () => {
  let s = inventarioReducer(nuevo(), accion(ACCIONES.AGREGAR_AL_CARRITO, { id: 7, cantidad: 4 }));
  assert.equal(disponible(s, 7), 1);
  s = inventarioReducer(s, accion(ACCIONES.CAMBIAR_CANTIDAD, { id: 7, delta: 1 }));
  assert.equal(disponible(s, 7), 0);
  assert.equal(enCarrito(s, 7), 5);
  const sinCambio = inventarioReducer(s, accion(ACCIONES.CAMBIAR_CANTIDAD, { id: 7, delta: 1 }));
  assert.equal(sinCambio, s); // sin stock: no deja aumentar
  s = inventarioReducer(s, accion(ACCIONES.CAMBIAR_CANTIDAD, { id: 7, delta: -1 }));
  assert.equal(disponible(s, 7), 1);
  assert.equal(enCarrito(s, 7), 4);
});

test('disminuir hasta 0 elimina la línea y devuelve el stock', () => {
  let s = inventarioReducer(nuevo(), accion(ACCIONES.AGREGAR_AL_CARRITO, { id: 2, cantidad: 1 }));
  s = inventarioReducer(s, accion(ACCIONES.CAMBIAR_CANTIDAD, { id: 2, delta: -1 }));
  assert.equal(s.carrito.length, 0);
  assert.equal(disponible(s, 2), 40);
});

test('quitar del carrito y vaciar carrito restituyen el stock', () => {
  let s = nuevo();
  s = inventarioReducer(s, accion(ACCIONES.AGREGAR_AL_CARRITO, { id: 1, cantidad: 2 }));
  s = inventarioReducer(s, accion(ACCIONES.AGREGAR_AL_CARRITO, { id: 3, cantidad: 4 }));
  const quitado = inventarioReducer(s, accion(ACCIONES.QUITAR_DEL_CARRITO, { id: 1 }));
  assert.equal(disponible(quitado, 1), 24);
  assert.equal(quitado.carrito.length, 1);
  const vacio = inventarioReducer(s, accion(ACCIONES.VACIAR_CARRITO));
  assert.deepEqual(vacio.inventario, INVENTARIO_INICIAL);
  assert.equal(vacio.carrito.length, 0);
});

test('finalizar compra vacía el carrito y mantiene el stock descontado', () => {
  let s = inventarioReducer(nuevo(), accion(ACCIONES.AGREGAR_AL_CARRITO, { id: 1, cantidad: 5 }));
  s = inventarioReducer(s, accion(ACCIONES.FINALIZAR_COMPRA));
  assert.equal(s.carrito.length, 0);
  assert.equal(disponible(s, 1), 19);
});

test('totales del carrito', () => {
  let s = inventarioReducer(nuevo(), accion(ACCIONES.AGREGAR_AL_CARRITO, { id: 1, cantidad: 2 })); // 1190
  s = inventarioReducer(s, accion(ACCIONES.AGREGAR_AL_CARRITO, { id: 9, cantidad: 1 })); // 8990
  assert.equal(totalUnidades(s), 3);
  assert.equal(totalAPagar(s), 2 * 1190 + 8990);
  assert.equal(carritoDetallado(s)[0].subtotal, 2380);
});

test('invariante: disponible + en carrito = stock original tras operaciones aleatorias', () => {
  let semilla = 12345;
  const azar = (n) => { semilla = (semilla * 1103515245 + 12345) % 2147483648; return semilla % n; };
  let s = nuevo();
  const tipos = [ACCIONES.AGREGAR_AL_CARRITO, ACCIONES.CAMBIAR_CANTIDAD, ACCIONES.QUITAR_DEL_CARRITO];
  for (let i = 0; i < 2000; i++) {
    const id = 1 + azar(16);
    const t = tipos[azar(3)];
    const payload = t === ACCIONES.AGREGAR_AL_CARRITO ? { id, cantidad: 1 + azar(4) }
      : t === ACCIONES.CAMBIAR_CANTIDAD ? { id, delta: azar(2) ? 1 : -1 } : { id };
    s = inventarioReducer(s, accion(t, payload));
    for (const a of INVENTARIO_INICIAL) {
      assert.equal(disponible(s, a.id) + enCarrito(s, a.id), a.cantidad);
      assert.ok(disponible(s, a.id) >= 0);
    }
  }
});

test('agregar un artículo nuevo genera un id consecutivo y no altera el resto', () => {
  const s = inventarioReducer(nuevo(), accion(ACCIONES.AGREGAR_ARTICULO, {
    nombre: '  Galletas  ', categoria: 'Despensa', precio: '1200', cantidad: '10',
  }));
  const ultimo = s.inventario.at(-1);
  assert.equal(ultimo.id, 17);
  assert.equal(ultimo.nombre, 'Galletas');
  assert.equal(ultimo.precio, 1200);
  assert.equal(s.inventario.length, 17);
});

test('el reducer no muta el estado anterior', () => {
  const s = nuevo();
  const copia = JSON.stringify(s);
  inventarioReducer(s, accion(ACCIONES.AGREGAR_AL_CARRITO, { id: 1, cantidad: 2 }));
  assert.equal(JSON.stringify(s), copia);
});

test('filtro por categoría no modifica los datos originales', () => {
  const s = nuevo();
  const copia = JSON.stringify(s.inventario);
  const lacteos = filtrarPorCategoria(s.inventario, 'Lácteos');
  assert.equal(lacteos.length, 3);
  assert.ok(lacteos.every((a) => a.categoria === 'Lácteos'));
  assert.equal(filtrarPorCategoria(s.inventario, TODAS).length, 16);
  assert.equal(JSON.stringify(s.inventario), copia);
  assert.equal(categoriasDisponibles(s.inventario).length, 7);
  assert.equal(contarPorCategoria(s.inventario).Bebidas, 2);
});

test('validaciones del formulario', () => {
  const inv = INVENTARIO_INICIAL;
  assert.deepEqual(validarArticulo({ nombre: 'Café', categoria: 'Despensa', precio: '2500', cantidad: '5' }, inv), {});
  const errores = validarArticulo({ nombre: ' ', categoria: '', precio: '-3', cantidad: '1.5' }, inv);
  assert.deepEqual(Object.keys(errores).sort(), ['cantidad', 'categoria', 'nombre', 'precio']);
  assert.ok(validarArticulo({ nombre: 'leche ENTERA 1 l', categoria: 'Lácteos', precio: '1', cantidad: '1' }, inv).nombre);
  assert.deepEqual(validarArticulo({ nombre: 'Sal', categoria: 'Despensa', precio: '500', cantidad: '0' }, inv), {});
});

test('resolución de rutas', () => {
  assert.deepEqual(resolverRuta('/'), { nombre: 'lista', params: {} });
  assert.deepEqual(resolverRuta(''), { nombre: 'lista', params: {} });
  assert.deepEqual(resolverRuta('/nuevo'), { nombre: 'nuevo', params: {} });
  assert.deepEqual(resolverRuta('/carrito/'), { nombre: 'carrito', params: {} });
  assert.deepEqual(resolverRuta('/articulo/12'), { nombre: 'detalle', params: { id: 12 } });
  assert.equal(resolverRuta('/articulo/abc').nombre, 'no-encontrado');
  assert.equal(resolverRuta('/otra-cosa').nombre, 'no-encontrado');
});
