export const CATEGORIAS = [
  'Lácteos',
  'Panadería',
  'Frutas y verduras',
  'Carnes',
  'Bebidas',
  'Despensa',
  'Limpieza',
];

export const ICONOS = {
  Lácteos: '🥛',
  Panadería: '🍞',
  'Frutas y verduras': '🍎',
  Carnes: '🥩',
  Bebidas: '🥤',
  Despensa: '🥫',
  Limpieza: '🧼',
};

// "cantidad" es la cantidad DISPONIBLE en el inventario.
export const INVENTARIO_INICIAL = [
  { id: 1, nombre: 'Leche entera 1 L', categoria: 'Lácteos', precio: 1190, cantidad: 24, descripcion: 'Leche entera larga vida en envase de 1 litro.' },
  { id: 2, nombre: 'Yogur natural 150 g', categoria: 'Lácteos', precio: 450, cantidad: 40, descripcion: 'Yogur natural sin azúcar agregada.' },
  { id: 3, nombre: 'Queso gauda laminado 250 g', categoria: 'Lácteos', precio: 2990, cantidad: 12, descripcion: 'Queso gauda en láminas, ideal para sándwiches.' },
  { id: 4, nombre: 'Pan marraqueta (kg)', categoria: 'Panadería', precio: 2200, cantidad: 15, descripcion: 'Pan fresco horneado durante el día.' },
  { id: 5, nombre: 'Pan de molde integral', categoria: 'Panadería', precio: 2490, cantidad: 10, descripcion: 'Pan de molde integral de 580 g.' },
  { id: 6, nombre: 'Manzana roja (kg)', categoria: 'Frutas y verduras', precio: 1790, cantidad: 30, descripcion: 'Manzana roja nacional, calibre mediano.' },
  { id: 7, nombre: 'Plátano (kg)', categoria: 'Frutas y verduras', precio: 1590, cantidad: 5, descripcion: 'Plátano maduro listo para consumir.' },
  { id: 8, nombre: 'Tomate (kg)', categoria: 'Frutas y verduras', precio: 1990, cantidad: 18, descripcion: 'Tomate larga vida para ensaladas y salsas.' },
  { id: 9, nombre: 'Posta rosada (kg)', categoria: 'Carnes', precio: 8990, cantidad: 8, descripcion: 'Corte de vacuno magro, ideal para guisos y asados.' },
  { id: 10, nombre: 'Pechuga de pollo (kg)', categoria: 'Carnes', precio: 5490, cantidad: 14, descripcion: 'Pechuga de pollo fresca sin hueso.' },
  { id: 11, nombre: 'Bebida cola 2 L', categoria: 'Bebidas', precio: 2190, cantidad: 36, descripcion: 'Bebida gaseosa sabor cola en botella de 2 litros.' },
  { id: 12, nombre: 'Agua mineral 1,5 L', categoria: 'Bebidas', precio: 990, cantidad: 0, descripcion: 'Agua mineral sin gas (producto agotado, útil para probar el estado sin stock).' },
  { id: 13, nombre: 'Arroz grado 1 (1 kg)', categoria: 'Despensa', precio: 1490, cantidad: 50, descripcion: 'Arroz grado 1 de grano largo.' },
  { id: 14, nombre: 'Fideos espagueti 400 g', categoria: 'Despensa', precio: 890, cantidad: 45, descripcion: 'Fideos de sémola de trigo.' },
  { id: 15, nombre: 'Detergente líquido 3 L', categoria: 'Limpieza', precio: 7490, cantidad: 9, descripcion: 'Detergente líquido para ropa, 3 litros.' },
  { id: 16, nombre: 'Lavaloza 750 ml', categoria: 'Limpieza', precio: 1790, cantidad: 20, descripcion: 'Lavaloza concentrado con aroma a limón.' },
];
