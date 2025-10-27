# README - Prueba Técnica Frontend

## 1) Contexto rápido

- **Opción elegida**: A (Lista filtrable UI)
- **Alcance**: Componente TransactionsList con filtros por texto y categoría, ordenación por fecha/importe, estados de carga/error/vacío, y tests unitarios
- **Stack**: Next.js 14, TypeScript, Tailwind CSS, Jest + React Testing Library

## 2) Cómo ejecutar

```bash
npm install
npm run dev    # arranca en http://localhost:3000
```

Variables/flags relevantes: `NODE_ENV=development`, `NEXT_TELEMETRY_DISABLED=1`

## 3) Cómo testear

```bash
npm test           # unit/integración
npm run test:watch # modo watch
npm run test:coverage # con cobertura
```

## 4) Decisiones clave

- **SSR/RSC/CSR**: RSC para datos iniciales (SEO, latencia), Client Component para interactividad (filtros dinámicos)
- **Estado**: Local con useState para filtros, evitando Redux por simplicidad
- **Datos**: Mock con Route Handler, fetch en servidor para datos iniciales
- **Estilos**: Tailwind CSS por rapidez de desarrollo y consistencia

## 5) Accesibilidad (A11y)

Checklist mínimo:

- ✅ Labels y roles correctos (`htmlFor` + `id`, `role="listitem"`)
- ✅ Navegación por teclado/foco visible (`tabIndex={0}`)
- ✅ Mensajes `aria-live` para loading/empty/error (estados vacíos)

## 6) Seguridad

- ✅ Evito `dangerouslySetInnerHTML` completamente
- ✅ Sanitización implícita con React (no se renderiza HTML crudo)
- ✅ Validación de parámetros en API route

## 7) Performance

- ✅ RSC para datos iniciales (mejor SEO y latencia)
- ✅ `useMemo` para filtros computados costosos
- ✅ Filtrado local para interactividad instantánea

## 8) Testing (TDD breve)

- **Casos cubiertos**: Filtrado por texto, estado vacío, renderizado básico
- **Muestra 1 commit rojo→verde**: Test de filtrado implementado con `act()` para evitar warnings

## 9) Trade-offs y alternativas

- **Simplificado por tiempo**: No implementé paginación ni filtros por rango de fechas
- **Alternativas consideradas**: 
  - TanStack Query vs fetch RSC (elegí RSC siguiendo instrucciones de priorizar RSC)
  - CSS Modules vs Tailwind (elegí Tailwind por rapidez)

## 10) Supuestos

- Formato de fechas: ISO 8601 (YYYY-MM-DD)
- Zona horaria: Local del navegador
- Categorías: Predefinidas en los datos mock
- Moneda: EUR con formato español

## 11) Próximos pasos (si tuviera 1–2 h más)

- Añadir i18n (es/en) con `Intl`
- Gráfico simple en `/stats`
- E2E estable con datos seed

## 12) Tiempo invertido (aprox.)

- Implementación: ~45 min
- Tests: ~20 min  
- README: ~10 min

## 13) Notas para la revisión

- Enlaces rápidos: ruta principal `/`, API `/api/transactions`, test files en `__tests__/`