# Prueba Técnica Frontend - Lista de Transacciones

## 1) Contexto rápido

- **Opción elegida**: A (Lista filtrable UI)
- **Alcance**: Componente TransactionsList con filtros por texto y categoría, ordenación por fecha/importe, estados de carga/error/vacío, y tests unitarios
- **Stack**: Next.js 16, TypeScript, Tailwind CSS, Jest + React Testing Library

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

- **SSR/RSC/CSR**: Elegí CSR para el componente principal porque simplifica el manejo de estado local de filtros y permite interactividad inmediata sin recargas de página
- **Estado**: Estado local con useState para filtros, evitando Redux por simplicidad y porque el estado es local al componente
- **Datos**: API Route de Next.js para simular backend, con datos mock estáticos para evitar dependencias externas
- **Estilos**: Tailwind CSS por su rapidez de desarrollo y consistencia visual

## 5) Accesibilidad (A11y)

Checklist implementado:

- ✅ Labels y roles correctos en todos los inputs
- ✅ Navegación por teclado funcional (tabindex en elementos interactivos)
- ✅ Mensajes `aria-live` para estados de carga
- ✅ Roles semánticos (listitem, alert, status)
- ✅ Contraste adecuado en colores de importes

## 6) Seguridad

- ✅ Evito `dangerouslySetInnerHTML` completamente
- ✅ Sanitización implícita con React (no se renderiza HTML crudo)
- ✅ Validación de parámetros en API route
- ✅ Manejo seguro de errores sin exposición de información sensible

## 7) Performance

- ✅ Uso de `useMemo` para filtros computados costosos
- ✅ Debouncing implícito con React (no necesario para esta escala)
- ✅ Componente optimizado para re-renders mínimos
- ✅ API route eficiente con filtrado en servidor

## 8) Testing (TDD breve)

- **Casos cubiertos**: Filtrado por categoría, búsqueda por texto, ordenación, estados de carga/error/vacío, formateo de datos
- **TDD**: Implementé primero los tests de la API route, luego el componente
- **Cobertura**: Tests unitarios para lógica de filtrado y integración para interacciones de usuario

## 9) Trade-offs y alternativas

- **Simplificado por tiempo**: No implementé paginación (se haría con cursor-based pagination)
- **Alternativas consideradas**: 
  - RSC para datos iniciales (más complejo para filtros dinámicos)
  - TanStack Query (overkill para esta escala)
  - CSS Modules (Tailwind es más rápido para prototipado)

## 10) Supuestos

- Formato de fechas: ISO 8601 (YYYY-MM-DD)
- Zona horaria: Local del navegador
- Categorías: Predefinidas en los datos mock
- Moneda: EUR con formato español

## 11) Próximos pasos (si tuviera 1–2 h más)

- Añadir paginación con cursor-based pagination
- Implementar filtros por rango de fechas
- Añadir exportación a CSV
- Implementar tests E2E con Playwright
- Añadir animaciones de transición para mejor UX

## 12) Tiempo invertido (aprox.)

- Implementación: ~35 min
- Tests: ~15 min  
- README: ~10 min

## 13) Notas para la revisión

- Enlaces rápidos: 
  - Página principal: `/`
  - API: `/api/transactions`
  - Tests: `src/components/__tests__/` y `src/app/api/transactions/route.test.ts`

## Respuestas a ejercicios de respuesta corta

### 1. Callback Hell
El "callback hell" ocurre cuando anidas múltiples callbacks, creando código difícil de leer y mantener. Lo evito usando:
- **Promises**: Para operaciones asíncronas individuales
- **async/await**: Para código más legible y manejo de errores
- **Promise.all()**: Para operaciones concurrentes cuando es apropiado
- **Control de concurrencia**: Con semáforos o limitadores cuando hay restricciones de recursos

### 2. TypeScript en Frontend
**Ventajas**:
- **Detección temprana de errores**: TypeScript encuentra errores en tiempo de compilación
- **Mejor IntelliSense**: Autocompletado y documentación en tiempo real

**Limitación**: Curva de aprendizaje y overhead de configuración inicial

**Ejemplo**:
```typescript
interface User { id: string; name: string; }
const getUser = (id: string): Promise<User> => { /* ... */ }
// TypeScript garantiza que getUser siempre retorne User
```

### 3. Análisis del fragmento
**Problemas**:
- `map` con `async` no espera las promesas (ejecuta en paralelo sin control)
- No hay manejo de errores
- No hay await del map completo

**Solución**:
```typescript
await Promise.all(
  rolesToCreate.map(role => 
    this.roleRepository.create({ identifier: role })
  )
);
```

### 4. SSR vs CSR para lista filtrable
**Elegiría CSR** porque:
- **SEO**: Las listas filtrables no necesitan SEO (son contenido dinámico)
- **Latencia**: CSR evita round-trips al servidor por cada filtro
- **Coste**: Menor carga en servidor, mejor escalabilidad
- **UX**: Filtrado instantáneo sin recargas de página

**SSR sería mejor si**: Necesitara SEO para URLs de filtros específicos o si los datos fueran críticos para el renderizado inicial.