const ESTILOS = {
  exito: 'border-emerald-300 bg-emerald-50 text-emerald-800',
  error: 'border-red-300 bg-red-50 text-red-800',
  info: 'border-sky-300 bg-sky-50 text-sky-800',
};

export default function Alerta({ tipo = 'info', children }) {
  return (
    <div role={tipo === 'error' ? 'alert' : 'status'} className={`rounded-lg border px-4 py-3 text-sm ${ESTILOS[tipo]}`}>
      {children}
    </div>
  );
}
