/** Valida los datos del formulario "Agregar artículo". Devuelve un objeto { campo: mensaje }. */
export function validarArticulo(datos, inventario = []) {
  const errores = {};
  const nombre = (datos.nombre ?? '').trim();

  if (nombre.length < 2) {
    errores.nombre = 'El nombre debe tener al menos 2 caracteres.';
  } else if (inventario.some((a) => a.nombre.toLowerCase() === nombre.toLowerCase())) {
    errores.nombre = 'Ya existe un artículo con ese nombre.';
  }

  if (!datos.categoria) {
    errores.categoria = 'Selecciona una categoría.';
  }

  const precio = Number(datos.precio);
  if (datos.precio === '' || !Number.isFinite(precio) || precio <= 0) {
    errores.precio = 'Ingresa un precio mayor a 0.';
  }

  const cantidad = Number(datos.cantidad);
  if (datos.cantidad === '' || !Number.isInteger(cantidad) || cantidad < 0) {
    errores.cantidad = 'Ingresa una cantidad entera igual o mayor a 0.';
  }

  return errores;
}
