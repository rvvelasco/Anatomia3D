# Anatomía 3D

Atlas 3D interactivo de **huesos y músculos** del cuerpo humano para estudiar anatomía. Es una web estática (HTML + JavaScript + Three.js incluido en `vendor/`), sin build ni dependencias externas: funciona directamente en GitHub Pages.

## Qué incluye

- **Modelo 3D** con 192 piezas óseas (cráneo, 24 vértebras, sacro, cóccix, costillas, esternón, cinturas, carpo, tarso, metacarpianos, metatarsianos y falanges) y 216 músculos (108 por lado + diafragma y orbicular de la boca).
- **Ficha de cada estructura**:
  - Músculos: acción, origen, inserción, inervación, irrigación, sinergistas, antagonistas y nota clínica.
  - Huesos: descripción, partes y accidentes óseos, articulaciones (con su tipo), músculos que se originan y se insertan en él y nota clínica.
- **Conexiones en 3D**: al seleccionar un músculo se colorean sus huesos de origen (verde) e inserción (azul); al seleccionar un hueso, los músculos que se originan o insertan en él y los huesos con los que articula (morado).
- **Filtros**: huesos / músculos, por región, por lado, por profundidad (retirar capas musculares), opacidad, aislar una estructura con sus conexiones, ocultar estructuras.
- **Buscador** por nombre, nombre latino, inervación o acción (p. ej. "nervio radial" lista los músculos que inerva).
- **Modo estudio**: *Identificar* (elige el nombre de la estructura resaltada) o *Localizar* (haz clic en la estructura pedida), filtrable por región y tipo.
- Enlaces compartibles a una estructura (`index.html#biceps_braquial:d`). Funciona en móvil.

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
js/main.js            visor, filtros, ficha, búsqueda y modo estudio
js/geo.js             utilidades geométricas
js/model/skeleton.js  geometría de los huesos
js/model/muscles.js   geometría de los músculos (de origen a inserción)
js/data/bones.js      datos de los huesos
js/data/muscles.js    datos de los músculos
vendor/               Three.js r170 (licencia MIT)
dev/                  herramientas de desarrollo (capturas y validación de datos)
```

Para añadir un músculo: crea su entrada en `js/data/muscles.js` (con `oh`/`ih`, los huesos de origen e inserción) y su geometría en `js/model/muscles.js` con el mismo id. `dev/check.html` comprueba que datos y geometría coinciden.

> El modelo es esquemático y está generado por código con fines de estudio; las formas son simplificadas. Contrasta siempre con tu atlas de referencia.
