# Imperio Gym — aplicación Expo

Aplicación React Native con Expo, TypeScript y Supabase para administración, entrenadores y clientes. El repositorio `Evaluacion-Flutter` es otra implementación; no se asume que usen la misma base de datos.

## Ejecutar

```sh
npm ci
npm start
# Alternativas:
npm run android
npm run ios
npm run web
npm run typecheck
```

Requiere Node.js compatible con Expo SDK 54 y un emulador o dispositivo compatible. `ios` requiere macOS para el simulador.

## Autenticación y navegación

`App.tsx` mantiene la sesión y consulta `profiles.role` por ID de usuario. Solo admite `admin`, `trainer` y `client`. Un rol desconocido no se convierte automáticamente en cliente.

La consulta de perfil corre fuera del callback de autenticación. Las respuestas atrasadas se descartan al cambiar de cuenta o desmontar el componente. La navegación por rol es presentación: las políticas RLS de Supabase deben imponer los mismos límites de acceso en datos.

`lib/supabase.ts` conserva la configuración pública existente. La clave anon no reemplaza las políticas de autorización; nunca debe sustituirse por una clave service role en una app móvil. El esquema y las políticas de la instancia aún no se versionan en este repositorio.

## Estructura

| Ruta | Responsabilidad |
| --- | --- |
| `app/screens/` | pantallas por rol |
| `app/components/VideoPlayer.tsx` | reproducción de ejercicios |
| `lib/bodyMetrics.ts` | cálculos y estimaciones corporales |
| `lib/supabase.ts` | cliente de datos |

## Estado y pendientes

Prototipo con pantallas de gestión deportiva. Faltan esquema y datos de demostración reproducibles, pruebas de integración de sesión/roles, almacenamiento persistente de sesión apropiado a cada plataforma y separación de consultas respecto de pantallas grandes. No hay enlace de despliegue web confirmado.

Las métricas corporales son estimaciones: algunas usan reglas aproximadas y no se deben presentar como mediciones clínicas. Antes de promover este módulo se necesita revisar sus fórmulas, unidades, entradas incompletas y mensajes.

## Capturas existentes

<img width="444" height="764" alt="image" src="https://github.com/user-attachments/assets/da35f4ca-2a9c-43f7-9d13-cfea37b7d517" />


Contamos con 3 apartados 

ADMINISTRADOR

<img width="285" height="612" alt="image" src="https://github.com/user-attachments/assets/4d880844-ede5-4324-bb72-0feb280cd853" />

ENTRENADOR 
<img width="319" height="626" alt="image" src="https://github.com/user-attachments/assets/1983171c-e971-4833-b80c-4ca746aaa6df" />
<img width="280" height="603" alt="image" src="https://github.com/user-attachments/assets/1252a736-f40e-429a-904c-5ce4faa0c3f3" />
<img width="303" height="595" alt="image" src="https://github.com/user-attachments/assets/d30cb98c-c042-41c6-b827-142152ad584f" />
<img width="307" height="604" alt="image" src="https://github.com/user-attachments/assets/a3c65961-1133-4ec5-8595-bb02724c59d9" />


SOCIO

<img width="316" height="620" alt="image" src="https://github.com/user-attachments/assets/45da0680-8895-4a46-b8ce-c1009fbcab24" />
<img width="314" height="626" alt="image" src="https://github.com/user-attachments/assets/a7ba8709-c308-4948-a16b-a5b0ced6d22a" />
<img width="322" height="621" alt="image" src="https://github.com/user-attachments/assets/90a922a8-f007-469b-9a9d-025a6717a5f3" />
<img width="290" height="565" alt="image" src="https://github.com/user-attachments/assets/1cc140fc-315b-47f7-9878-eed388376e9c" />
