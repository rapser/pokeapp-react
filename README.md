# Pokedex Challenge — React Native

App React Native (CLI, TypeScript) que consume [PokéAPI](https://pokeapi.co/) para mostrar un listado paginado de Pokémon y su detalle. Es la réplica funcional y arquitectónica de la versión iOS del mismo challenge ([pokeapp](https://github.com/rapser/pokeapp)): misma Clean Architecture en 4 capas, mismo patrón MVVM, mismo comportamiento de paginación/cache/errores — implementado con el stack que suelen pedir apps móviles enterprise/fintech (React Native CLI puro, sin Expo, para tener control total de los proyectos nativos).

## Requisitos

- Node.js 22+ y npm.
- Watchman (recomendado, mejora el rendimiento del file watcher de Metro).
- **Para iOS**: macOS, Xcode 16+, Ruby + Bundler, CocoaPods (`bundle install` ya deja el CocoaPods correcto vía `Gemfile`).
- **Para Android**: Android Studio (SDK + un emulador o dispositivo), JDK 21 (LTS).

## Cómo correr

1. Clonar el repositorio e instalar dependencias JS:
   ```bash
   npm install
   ```
2. **iOS**:
   ```bash
   cd ios
   bundle install        # solo la primera vez
   bundle exec pod install
   cd ..
   npm run ios
   ```
   O abrir `ios/PokeappReact.xcworkspace` en Xcode (no el `.xcodeproj`) y correr con `Cmd+R`.
3. **Android**: tener un emulador corriendo o un dispositivo conectado, y:
   ```bash
   npm run android
   ```
   O abrir la carpeta `android/` en Android Studio y correr desde ahí.

> Los scripts `ios`/`android` son genéricos a propósito (usan el simulador/dispositivo por defecto o el único disponible) para no atar el repo a los nombres de simulador/AVD de una máquina en particular. Si tienes varios simuladores/emuladores y quieres apuntar a uno específico, pasa el flag al vuelo sin tocar `package.json`:
> ```bash
> npm run ios -- --simulator="iPhone 17"
> npm run android -- --device "Pixel_7"   # requiere que el emulador ya esté corriendo (emulator -avd Pixel_7 &)
> ```

Ver el documento `~/Downloads/pokeapp-react-guia-completa.md` para el detalle completo de prerequisitos, cómo generar un IPA y un APK/AAB firmados, y troubleshooting.

### Sobre el JDK en Android

El build de Android depende del JDK con el que corre el **daemon de Gradle**, no del que tengas en `PATH`. Dos fallos habituales:

- **`WARNING: A restricted method in java.lang.System has been called`** al configurar C/C++ (tarea de Prefab). Pasa con JDK 24+ (incluida la JBR que Android Studio trae embebida): desde el JEP 472 la JVM escribe ese aviso en `stderr`, y la tarea de AGP lo interpreta como error. Se resuelve usando JDK 21.
- **`jlink executable ... does not exist`** en la transformación `androidJdkImage`. Ocurre cuando el daemon corre sobre un JRE recortado — por ejemplo el que empaqueta la extensión de Java de VS Code, que trae `javac` pero no `jlink`. Como Gradle reutiliza daemons ya levantados, esto puede pasar aunque el IDE esté configurado con otro JDK.

Para evitar ambos, fija el JDK **fuera del repo** (para no versionar rutas de tu máquina), en `~/.gradle/gradle.properties`:

```properties
org.gradle.java.home=/ruta/a/tu/jdk-21
org.gradle.java.installations.paths=/ruta/a/tu/jdk-21
org.gradle.java.installations.auto-detect=false
```

Verifica con `cd android && ./gradlew -q javaToolchains`, y usa `./gradlew --stop` si quedaron daemons viejos corriendo con otro JDK.

## Cómo correr los tests

**Unitarios (Jest)**:
```bash
npm test
```
Cobertura actual: `GetPokemonListUseCase` (éxito y propagación de error), `GetPokemonDetailUseCase` (éxito y propagación de error), y mapeo DTO → Domain para listado y detalle (`PokemonMapper.test.ts`) — mismo alcance de testing "quirúrgico" que la versión iOS.

**End-to-end (Detox)** — se agregó además de Jest porque el perfil de la posición pide explícitamente Jest/Detox/Appium; la versión iOS no tiene UI tests reales:
```bash
npm run e2e:build:ios && npm run e2e:test:ios       # requiere simulador iPhone 17
npm run e2e:build:android && npm run e2e:test:android  # requiere emulador Pixel_7
```
El AVD que espera Detox se configura en `.detoxrc.js` (`emulator.device.avdName`); ajústalo si tu emulador se llama distinto.

## Arquitectura

Clean Architecture en 4 capas, flujo unidireccional `Screen → Hook (ViewModel) → UseCase → Repository → DataSource`:

```
src/
  core/            NetworkError, ViewState, apiClient (Axios), storage (AsyncStorage + CachedEnvelope)
  domain/          Entidades, interfaz de repositorio, casos de uso
  data/            DTOs, mappers, data sources (remoto/local), implementación del repositorio
  di/              Contenedor de DI custom + "assemblies" + DependencyProvider (Context)
  presentation/    Screens, hooks-ViewModel, componentes, navegación (React Navigation)
```

- **Domain** no conoce Axios, FastImage ni AsyncStorage — solo interfaces TypeScript.
- **Data** implementa esas interfaces y es la única capa que conoce el shape del JSON de PokéAPI (snake_case).
- **Presentation** solo conoce los `UseCase`s y las entidades de dominio, nunca DTOs ni detalles de red.

### MVVM con hooks

El equivalente a un ViewModel `@Observable` de SwiftUI en React es un **hook custom por pantalla** (`usePokemonListViewModel`, `usePokemonDetailViewModel`): encapsula el `ViewState`, expone acciones (`loadNextPage`, `retry`) y nunca se filtra un DTO ni un detalle de red hacia el componente. Es la forma idiomática de MVVM en React — no se usa una librería de estado global (Redux/Zustand) porque, igual que en la app iOS, no hace falta estado compartido entre pantallas.

### Inyección de dependencias (contenedor custom)

Se implementó un contenedor de DI minimalista (`src/di/Container.ts`) en vez de usar una librería como `tsyringe` o `InversifyJS`. Ambas dependen de `reflect-metadata` y decorators experimentales, que en un proyecto RN CLI (Hermes + Babel, sin `experimentalDecorators` configurado por defecto) agregan fricción y una fuente extra de errores de build para un beneficio marginal frente a un contenedor de \~40 líneas. El contenedor registra factories por token (`register(token, factory, { singleton })`) y las resuelve (`resolve<T>(token)`), replicando el mismo patrón de Assemblies de Swinject (`registerNetworkAndData`, `registerDomain` en `src/di/assemblies.ts`, combinadas en `buildContainer()` — equivalente a `AppAssembler.resolver`). Se expone a las pantallas vía un `DependencyProvider` (React Context) para no depender de un singleton global.

### Estrategia de persistencia y offline parcial

`PokemonRepositoryImpl` usa **network-first con fallback a cache** — idéntico a la versión iOS: siempre intenta traer datos frescos de la red primero; solo si la petición falla recurre al cache guardado en `AsyncStorage`. El cache se guarda como JSON plano envuelto en `CachedEnvelope<T>` con `cachedAt` (sin invalidación por TTL, mismo trade-off documentado en iOS). El listado se persiste acumulativamente (todas las páginas ya vistas en una sola entrada `pokemon_list_all`); el detalle se persiste por id (`pokemon_detail_<id>`).

### Paginación

`usePokemonListViewModel` mantiene `nextOffsetRef` (`undefined` = no hay más páginas) y un flag `isFetchingRef` (no forma parte del estado de React, para no re-renderizar en cada intento) que evita disparar requests duplicados cuando `onEndReached` de `FlatList` dispara varias veces. El error de la primera carga es bloqueante (pantalla completa con retry); el error de una página siguiente se muestra como alerta no bloqueante, dejando visible el contenido ya cargado — mismo patrón UX que iOS.

### Manejo de errores

`NetworkError` (unión discriminada: `invalidURL | noConnection | decodingError | serverError(statusCode) | unknown`) se mapea desde errores de Axios vía `mapAxiosError()`, y expone `userMessage()` para mensajes amigables — equivalente directo de `NetworkError` + `AFError.map` en iOS.

### Skeleton loaders

`PokemonRowSkeletonList` usa `Animated.loop` sobre la opacidad de 8 filas placeholder mientras el estado es `loading`/`idle` — mismo efecto que el modifier `.shimmering()` de la versión iOS, implementado con la API de animaciones nativa de RN (sin librerías extra).

## Librerías utilizadas

| Librería | Uso | Justificación |
|---|---|---|
| Axios | Networking (`apiClient.get(...)`) | Interceptors reutilizables para mapear errores a `NetworkError`, estándar de facto en apps RN enterprise por sobre `fetch` puro. |
| `@d11/react-native-fast-image` | Carga y cache de imágenes (memoria + disco) | Fork mantenido de `react-native-fast-image` (el original está sin mantenimiento); evita reinventar cache de imágenes, equivalente directo a Kingfisher en iOS. |
| `@react-navigation/native` + `native-stack` | Navegación entre listado y detalle | Estándar de facto para stack navigation en RN, análogo a `NavigationStack` de SwiftUI. |
| `@react-native-async-storage/async-storage` | Cache JSON local (network-first fallback) | Equivalente a FileManager+JSON de iOS. |
| `@react-native-vector-icons/material-design-icons` | Iconografía (peso, altura, exp, estados vacío/error) | Sucesor mantenido de `react-native-vector-icons` (deprecado), análogo a SF Symbols. |
| Jest + `@testing-library/react-native` | Tests unitarios | Equivalente a XCTest; mismo alcance que iOS (use cases + mapeo). |
| Detox | Tests end-to-end | Agregado explícitamente por el perfil de la vacante (pide Jest/Detox/Appium); iOS no tiene UI tests reales. |

Sin dependencia de DI externa (contenedor custom, ver arriba) ni de gestión de estado global (Redux/Zustand) — mismo alcance que la app iOS.

## Pendientes / trade-offs

- Sin invalidación de cache por antigüedad (TTL): `CachedEnvelope` ya guarda `cachedAt`, se podría comparar contra un umbral para forzar refresh.
- Sin `pull-to-refresh` explícito (se podría agregar `RefreshControl` en el `FlatList` de `PokemonListScreen`).
- Los tests E2E con Detox cubren dos flujos smoke (listado + paginación, navegación a detalle); no se llegó a cubrir estados de error/offline en E2E, solo en unit tests.
- No hay búsqueda ni filtro — mismo alcance que la versión iOS.
