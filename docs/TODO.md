# TODO — Smart Community

## Pendiente prioritario: dashboard `community_admin` (MVP)

### CRUD y censo de residentes

- [ ] Completar el flujo CRUD desde el dashboard: alta, consulta, edición y eliminación o baja segura del residente.
- [ ] Conectar los formularios y acciones de la lista con las acciones existentes; reemplazar los manejadores provisionales de detalle y cobro.
- [ ] Validar que exista un solo acceso por casa y evitar registros duplicados para la misma propiedad.
- [ ] Al crear o editar una residencia, permitir seleccionar su ubicación y validar en cliente y servidor que esté dentro del polígono de su comunidad.
- [ ] Completar el censo con mayores/menores de 18 años, relación con la propiedad (propia, alquiler, prestada, familiar u otra) y tipo de propiedad (negocio, casa, apartamentos, religioso, escuela, terreno u otro).
- [ ] Agregar los datos de estructura requeridos: número de pisos y cisterna u otro contenedor de agua.

### Cobros y pagos

- [ ] Crear el módulo administrativo para definir y administrar recaudaciones mensuales o anuales (seguridad, mantenimiento, reparaciones y otros conceptos).
- [ ] Registrar el historial de cambios de montos de las cuotas, conservando los valores anteriores para transparencia.
- [ ] Implementar el registro de pagos de una o varias cuotas en una sola transacción y asociarlos con la casa correspondiente.
- [ ] Mostrar saldos, pagos y pendientes por residente, casa, período y concepto.
- [ ] Generar un comprobante PDF por pago y permitir que la administración lo descargue o comparta.
- [ ] Integrar en la lista de residentes la acción real de cobrar; actualmente es provisional.

### Reportes y acciones administrativas

- [ ] Completar los reportes de recaudación por período, concepto y estado de pago; permitir su descarga como PDF.
- [ ] Crear el módulo para registrar y generar el listado diario de visitas para seguridad.
- [ ] Crear el módulo para administrar y generar el listado de accesos permanentes de los negocios.

## Pendiente: dashboards de otros roles

### `super_admin`

- [ ] Implementar el CRUD global de comunidades/tenants y sus cuentas.
- [ ] Incorporar un mapa en el formulario de comunidad para dibujar, consultar y editar el polígono de cobertura; guardar y validar la geometría.
- [ ] Asegurar que cada comunidad tenga un polígono válido disponible para validar las ubicaciones de sus residencias.
- [ ] Completar el dashboard global y las acciones propias del rol; las métricas actuales no completan el módulo.

### `resident`

- [ ] Completar el dashboard personal con cuotas pendientes, pagos e historial por período.
- [ ] Permitir consultar y descargar los comprobantes PDF de los pagos.
- [ ] Integrar las acciones de perfil y reporte de dispositivo en una experiencia funcional para el residente.

### `guard`

- [ ] Crear el dashboard de seguridad para consultar el listado diario de visitas.
- [ ] Permitir consultar la lista de accesos permanentes de negocios.

## Mejoras de mediano plazo

- [ ] Georreferenciar las propiedades dentro del polígono y mantener actualizado el mapa.
- [ ] Ubicar visitas y alertas de vecinos para apoyar la respuesta de seguridad.
- [ ] Crear mensajería y notificaciones entre junta directiva y residentes.
- [ ] Crear el tablero de publicaciones comunitarias: alquileres/ventas, mantenimiento, mascotas extraviadas y ventas de garage.

## Mejoras de largo plazo

- [ ] Generar códigos QR para visitas con fecha y hora de entrada.
- [ ] Evaluar la automatización de la pluma de acceso, incluyendo el procedimiento ante cortes de energía.
- [ ] Evaluar como proyectos opcionales e independientes las votaciones electrónicas y la vigilancia con drones.
- [ ] Evaluar un tablero de administración inmobiliaria para varias comunidades.
