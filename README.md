# Supermercado Castillo · Gestión de inventario

Aplicación web de gestión de inventario y carrito de compras de un supermercado, desarrollada con **React** y **Tailwind CSS** para la asignatura **Desarrollo Frontend II (PFY2202)**.

- **Autor:** Miguel Castillo
- **Repositorio:** `supermercado-miguel-castillo-pfy2202`
- **Demo (GitHub Pages):** `https://<tu-usuario>.github.io/supermercado-miguel-castillo-pfy2202/` *(completar con tu usuario de GitHub tras el despliegue)*

## Funcionalidades

| Requerimiento | Dónde está implementado |
| --- | --- |
| Pantalla para **agregar artículos** al inventario (con validaciones) | `src/pages/AgregarArticulo.jsx`, `src/utils/validaciones.js` |
| Pantalla de **listado** de todos los artículos disponibles | `src/pages/ListaArticulos.jsx`, `src/components/ArticuloCard.jsx` |
| **Filtro por categoría** que actualiza dinámicamente la vista sin perder los datos originales | `src/hooks/useFiltroCategoria.js`, `src/utils/filtros.js` |
| **Detalle** del artículo al hacer clic, con opción de agregarlo al carrito (descuenta stock) | `src/pages/DetalleArticulo.jsx` |
| **Carrito**: listar artículos, aumentar/disminuir cantidades, quitar, vaciar y finalizar compra; el inventario general se actualiza en cada cambio | `src/pages/Carrito.jsx`, `src/context/inventarioReducer.js` |
| Framework CSS con diseño **responsive** | Tailwind CSS (`tailwind.config.js`, clases utilitarias en los componentes) |

Extras: persistencia en `localStorage`, estados de stock (agotado / pocas unidades), accesibilidad básica (etiquetas, `aria-*`, foco visible, enlace para saltar al contenido) y botón para restablecer los datos de ejemplo.

## Tecnologías

- React 18 (hooks, Context API, `useReducer`, `useMemo`, `useCallback`, `memo`)
- Vite 5
- Tailwind CSS 3
- `gh-pages` para el despliegue
- Node.js test runner (`node --test`) para las pruebas de la lógica

## Estructura del proyecto

```
src/
├── App.jsx                     # Layout y selección de pantalla según la ruta
├── main.jsx                    # Punto de entrada (Provider + App)
├── index.css                   # Directivas de Tailwind
├── components/                 # Componentes reutilizables
│   ├── Navbar.jsx
│   ├── ArticuloCard.jsx
│   ├── FiltroCategorias.jsx
│   ├── CantidadControl.jsx     # Reutilizado en detalle y carrito
│   ├── EstadoStock.jsx
│   └── Alerta.jsx
├── pages/                      # Una pantalla por archivo
│   ├── ListaArticulos.jsx
│   ├── AgregarArticulo.jsx
│   ├── DetalleArticulo.jsx
│   ├── Carrito.jsx
│   └── NoEncontrado.jsx
├── context/
│   ├── InventarioContext.jsx   # Provider y hook useInventario
│   └── inventarioReducer.js    # Reducer y selectores (lógica pura)
├── hooks/
│   ├── useFiltroCategoria.js
│   └── useHashRoute.js
├── utils/                      # Funciones puras: filtros, formato, validaciones, rutas
└── data/inventarioInicial.js   # Datos de ejemplo y categorías
tests/inventario.test.js        # Pruebas de la lógica
```

## Cómo funciona el inventario y el carrito

El estado global tiene dos partes: `inventario` (cada artículo con su **cantidad disponible**) y `carrito` (líneas `{ id, cantidad }`). Todas las operaciones pasan por un único *reducer*:

- **Agregar al carrito:** resta la cantidad del inventario y la suma a la línea del carrito. No permite superar el stock.
- **Aumentar / disminuir en el carrito:** `+1` resta una unidad del inventario; `−1` la devuelve. Si la cantidad llega a 0, la línea se elimina.
- **Quitar / vaciar carrito:** devuelve las unidades al inventario.
- **Finalizar compra:** vacía el carrito y conserva el stock descontado.

Invariante verificada por las pruebas: mientras no se finaliza la compra, *disponible + en carrito = stock original* de cada artículo.

El **filtro** guarda solo la categoría seleccionada y *deriva* la lista visible con `useMemo`; el inventario original nunca se modifica.

## Instalación y ejecución

Requisitos: Node.js 18 o superior.

```bash
npm install
npm run dev        # servidor de desarrollo (http://localhost:5173)
npm test           # pruebas de la lógica
npm run build      # genera la carpeta dist/
npm run preview    # sirve el build localmente
```

## Publicación en GitHub y GitHub Pages

1. Crear en GitHub un repositorio **vacío y público** llamado `supermercado-miguel-castillo-pfy2202`.
2. Subir el código:

   ```bash
   git init
   git add .
   git commit -m "Proyecto supermercado: listado, filtro, detalle y carrito"
   git branch -M main
   git remote add origin https://github.com/<tu-usuario>/supermercado-miguel-castillo-pfy2202.git
   git push -u origin main
   ```

3. Desplegar en GitHub Pages (crea la rama `gh-pages` con el contenido de `dist/`):

   ```bash
   npm run deploy
   ```

4. En GitHub: **Settings → Pages → Source: Deploy from a branch → `gh-pages` / `/ (root)`**.
5. Completar la URL de la demo en este README y compartir la URL del repositorio con el docente.

> El proyecto usa `base: './'` en `vite.config.js` y enrutamiento por *hash* (`#/ruta`), por lo que funciona en GitHub Pages sin importar el nombre del repositorio.

## Decisiones técnicas

- **Context + useReducer** en lugar de estado disperso: centraliza las reglas de negocio y las hace testeables sin renderizar componentes.
- **Enrutamiento por hash propio** (`useHashRoute`): evita dependencias extra y problemas de rutas en GitHub Pages.
- **Componentes reutilizables** (`CantidadControl`, `EstadoStock`, `Alerta`) y **hooks personalizados** (`useInventario`, `useFiltroCategoria`, `useHashRoute`).
- **Funciones puras en `utils/`** para filtros, validaciones y rutas, cubiertas por pruebas.
