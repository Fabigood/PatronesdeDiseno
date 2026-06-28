# Evidencia - Taller Formativo SOLID y Patrones de Diseño

## Proyecto

Sistema de Fidelización desarrollado con Vue.js, Node.js, Express y Supabase.

## Enlaces de entrega

- Link del código en Git: https://github.com/Fabigood/Fidelidad-APP-Supabase
- Link del video explicativo: pendiente de agregar por el estudiante
- Link del proyecto deployado: pendiente de agregar por el estudiante

## Principios SOLID aplicados

### 1. SRP - Principio de Responsabilidad Única

Se separaron las responsabilidades del backend:

- `routes/`: únicamente define rutas.
- `controllers/`: maneja la entrada y salida HTTP.
- `services/`: contiene reglas de negocio.
- `repositories/`: contiene consultas a Supabase.
- `validators/`: contiene validaciones reutilizables.

Con esto, el Core dejó de depender de rutas gigantes con lógica mezclada.

### 2. DIP - Principio de Inversión de Dependencias

Los servicios no crean directamente sus dependencias. Las reciben desde `backend/core/container.js`.

Ejemplo aplicado:

- `FidelidadService` recibe repositorios y estrategias.
- `AuthService` recibe `UserRepository` y `JWT_SECRET`.
- `ClienteService` recibe `ClienteRepository` y `LevelStrategy`.

Esto reduce el acoplamiento y permite cambiar implementaciones sin modificar las clases principales.

### 3. OCP - Principio Abierto/Cerrado

El cálculo de puntos y niveles fue separado en estrategias. Si cambia la regla de negocio, se puede crear otra estrategia sin alterar los controladores ni rutas.

## Patrones de diseño aplicados

### 1. Repository Pattern

Archivos:

- `backend/repositories/UserRepository.js`
- `backend/repositories/ClienteRepository.js`
- `backend/repositories/CompraRepository.js`
- `backend/repositories/RecompensaRepository.js`
- `backend/repositories/ReclamoRepository.js`

Objetivo: separar la lógica de acceso a datos del resto del sistema.

### 2. Strategy Pattern

Archivos:

- `backend/services/strategies/pointsStrategy.js`
- `backend/services/strategies/levelStrategy.js`

Objetivo: permitir reglas intercambiables para calcular puntos y niveles.

### 3. Dependency Injection

Archivo:

- `backend/core/container.js`

Objetivo: centralizar la creación de dependencias y reducir acoplamiento.

## Endpoints mantenidos

Se mantuvieron los endpoints existentes para que el frontend siga funcionando:

- `POST /api/auth/login`
- `GET /api/fidelidad/clientes`
- `POST /api/fidelidad/clientes`
- `PUT /api/fidelidad/clientes/:id`
- `DELETE /api/fidelidad/clientes/:id`
- `POST /api/fidelidad/compras`
- `GET /api/fidelidad/recompensas`
- `POST /api/fidelidad/recompensas`
- `PUT /api/fidelidad/recompensas/:id`
- `DELETE /api/fidelidad/recompensas/:id`
- `POST /api/fidelidad/reclamos`

## Guion para el video

1. Presentar el sistema de fidelización.
2. Explicar que antes las rutas tenían demasiadas responsabilidades.
3. Mostrar la nueva estructura del backend.
4. Explicar SRP usando controller, service y repository.
5. Explicar DIP mostrando el archivo `container.js`.
6. Explicar Repository Pattern con `ClienteRepository.js`.
7. Explicar Strategy Pattern con `pointsStrategy.js` y `levelStrategy.js`.
8. Probar una ruta del sistema y demostrar que el frontend mantiene funcionamiento.
