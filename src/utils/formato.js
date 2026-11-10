const formatoPeso = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
});

export const formatearPrecio = (valor) => formatoPeso.format(valor);
