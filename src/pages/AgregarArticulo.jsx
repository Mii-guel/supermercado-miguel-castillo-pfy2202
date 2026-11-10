import { useState } from 'react';
import Alerta from '../components/Alerta.jsx';
import { useInventario } from '../context/InventarioContext.jsx';
import { CATEGORIAS } from '../data/inventarioInicial.js';
import { validarArticulo } from '../utils/validaciones.js';

const FORMULARIO_VACIO = { nombre: '', categoria: '', precio: '', cantidad: '', descripcion: '' };

function Campo({ id, etiqueta, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">{etiqueta}</label>
      {children}
      {error && <p id={`${id}-error`} className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

const claseInput = (error) =>
  `w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200 ${
    error ? 'border-red-400' : 'border-slate-300'
  }`;

export default function AgregarArticulo() {
  const { state, agregarArticulo } = useInventario();
  const [datos, setDatos] = useState(FORMULARIO_VACIO);
  const [errores, setErrores] = useState({});
  const [agregado, setAgregado] = useState(null);

  const alCambiar = (e) => {
    const { name, value } = e.target;
    setDatos((previo) => ({ ...previo, [name]: value }));
    setAgregado(null);
  };

  const alEnviar = (e) => {
    e.preventDefault();
    const nuevosErrores = validarArticulo(datos, state.inventario);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;
    agregarArticulo(datos);
    setAgregado(datos.nombre.trim());
    setDatos(FORMULARIO_VACIO);
  };

  const propsCampo = (id, error) => ({
    id, name: id, value: datos[id], onChange: alCambiar,
    className: claseInput(error), 'aria-invalid': error ? 'true' : 'false', 'aria-describedby': error ? `${id}-error` : undefined,
  });

  return (
    <section aria-labelledby="titulo-nuevo" className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 id="titulo-nuevo" className="text-2xl font-bold text-slate-900">Agregar artículo al inventario</h1>
        <p className="text-sm text-slate-600">Completa los datos del nuevo producto. Todos los campos marcados son obligatorios.</p>
      </div>

      {agregado && (
        <Alerta tipo="exito">
          Se agregó «{agregado}» al inventario. <a href="#/" className="font-semibold underline">Ver inventario</a>
        </Alerta>
      )}

      <form onSubmit={alEnviar} noValidate className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <Campo id="nombre" etiqueta="Nombre del artículo *" error={errores.nombre}>
          <input type="text" autoComplete="off" {...propsCampo('nombre', errores.nombre)} />
        </Campo>

        <Campo id="categoria" etiqueta="Categoría *" error={errores.categoria}>
          <select {...propsCampo('categoria', errores.categoria)}>
            <option value="">Selecciona una categoría</option>
            {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </Campo>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Campo id="precio" etiqueta="Precio (CLP) *" error={errores.precio}>
            <input type="number" min="1" step="1" inputMode="numeric" {...propsCampo('precio', errores.precio)} />
          </Campo>
          <Campo id="cantidad" etiqueta="Cantidad disponible *" error={errores.cantidad}>
            <input type="number" min="0" step="1" inputMode="numeric" {...propsCampo('cantidad', errores.cantidad)} />
          </Campo>
        </div>

        <Campo id="descripcion" etiqueta="Descripción (opcional)">
          <textarea rows="3" {...propsCampo('descripcion')} />
        </Campo>

        <div className="flex flex-wrap justify-end gap-3 pt-2">
          <a href="#/" className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Cancelar</a>
          <button type="submit" className="rounded-md bg-emerald-700 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800">
            Guardar artículo
          </button>
        </div>
      </form>
    </section>
  );
}
