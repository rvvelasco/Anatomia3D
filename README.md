# Anatomía 3D

Atlas 3D interactivo de **huesos y músculos** del cuerpo humano para estudiar anatomía. Es una web estática (HTML + JavaScript + Three.js incluido en `vendor/`), sin build ni dependencias externas: funciona directamente en GitHub Pages.

## Qué incluye

- **Modelo 3D** con 192 piezas óseas y 216 músculos (108 por lado + diafragma y orbicular de la boca). Los músculos muestran sus fibras y sus tendones (en blanco) e iluminación realista.
- **Ficha por pestañas** para cada estructura:
  - *Resumen*: qué hace, de dónde sale y a dónde llega, nervio e irrigación de un vistazo, truco para recordar y dato clínico.
  - *Detalle*: origen, inserción, inervación, irrigación y acción completos (huesos: partes y accidentes óseos).
  - *Conexiones*: huesos de origen e inserción, sinergistas, antagonistas, músculos que comparten nervio y grupo (huesos: articulaciones y músculos que se anclan).
  - *Clínica*: notas clínicas y qué ocurre si se lesiona su nervio.
  - *Mis notas*: apuntes personales guardados en el navegador.
- **Colores de conexión y etiquetas 3D**: lo seleccionado en naranja, origen en verde, inserción en azul y articulaciones en morado; el resto queda en modo "fantasma".
- **16 lecciones guiadas** (manguito rotador, cuádriceps, isquiotibiales, pata de ganso, carpo, columna, costillas…) con trucos para memorizar.
- **Mapa de nervios**: elige un nervio y verás todos los músculos que inerva y las consecuencias de su lesión.
- **Modo estudio**: *Identificar*, *Localizar*, *Test* (preguntas de nervio, acción, origen, inserción y articulaciones) y *Fichas* con repaso espaciado (cajas de Leitner).
- **Examen simulado**: 10 preguntas seguidas con nota, tiempo, historial y lista de lo que hay que repasar.
- **Favoritos ★**: guarda las estructuras que te cuestan, fíltralas en la lista y estúdialas aparte.
- **Corte anatómico**: planos sagital, coronal y transversal que se pueden desplazar para ver el interior.
- **Imprimir ficha** completa con una imagen del modelo, **tema claro/oscuro** y botón **🎲 al azar**.
- **Navegación con historial**: el botón "Atrás" (del navegador o del móvil) vuelve a la estructura anterior.
- **Progreso**: estructuras vistas y lecciones completadas.
- Filtros por tipo, región, lado y profundidad muscular; transparencia; aislar u ocultar; vistas de cámara, giro automático y captura de imagen.
- Buscador de estructuras, nervios y lecciones; enlaces compartibles (`#biceps_braquial:d`, `#leccion=manguito`, `#nervio=radial`).
- **Versión móvil y tablet**: panel lateral deslizable, ficha como hoja inferior en vertical y como panel lateral en horizontal.

## Publicar en GitHub Pages

1. Sube el repositorio a GitHub.
2. En **Settings → Pages**, en *Build and deployment* elige **Deploy from a branch**, rama `main` y carpeta `/ (root)`.
3. En un minuto la web estará en `https://<tu-usuario>.github.io/<repositorio>/`.

## Probar en local

Los módulos ES necesitan un servidor (no abras el archivo con doble clic):

```bash
npx http-server .   # o: python3 -m http.server
```

## Estructura

```
index.html            interfaz
css/style.css         estilos
js/main.js            visor, filtros, ficha, lecciones, nervios, búsqueda y modo estudio
js/materials.js       materiales (shader de músculo con tendones) e iluminación
js/geo.js             utilidades geométricas
js/model/skeleton.js  geometría de los huesos
js/model/muscles.js   geometría de los músculos (de origen a inserción)
js/data/bones.js      datos de los huesos
js/data/muscles.js    datos de los músculos
js/data/lessons.js    lecciones guiadas
js/data/nerves.js     nervios y sus lesiones
vendor/               Three.js r170 (licencia MIT)
dev/                  herramientas de desarrollo: validación de datos (check), pruebas de humo (smoke, smoke2) y de UX (ux)
```

Para añadir un músculo: crea su entrada en `js/data/muscles.js` (con `oh`/`ih`, los huesos de origen e inserción) y su geometría en `js/model/muscles.js` con el mismo id. `dev/check.html` comprueba que datos y geometría coinciden.

> El modelo es esquemático y está generado por código con fines de estudio; las formas son simplificadas. Contrasta siempre con tu atlas de referencia.
