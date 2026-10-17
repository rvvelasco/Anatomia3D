// Base de datos de músculos.
// capa: 1 = superficial, 2 = intermedia, 3 = profunda (para "pelar" capas en el visor).
// oh / ih: huesos de origen / inserción (ids de js/data/bones.js).

const M = {};
const add = (id, o) => (M[id] = { bilateral: true, ...o });
const range = (pre, a, b, suf = '') => Array.from({ length: b - a + 1 }, (_, i) => `${pre}${a + i}${suf}`);

// ================================ CABEZA ================================
add('occipitofrontal', {
  nombre: 'Occipitofrontal', latin: 'M. occipitofrontalis', region: 'cabeza', grupo: 'Músculos de la expresión facial (epicraneales)', capa: 1,
  origen: 'Vientre frontal: aponeurosis epicraneal (galea). Vientre occipital: dos tercios laterales de la línea nucal superior del occipital y apófisis mastoides.',
  insercion: 'Vientre frontal: piel y tejido subcutáneo de cejas y frente. Vientre occipital: aponeurosis epicraneal.',
  oh: ['occipital', 'temporal'], ih: ['frontal'],
  inervacion: 'Nervio facial (VII par): ramo temporal (vientre frontal) y ramo auricular posterior (vientre occipital).',
  irrigacion: 'Arterias supraorbitaria, supratroclear, temporal superficial y occipital.',
  accion: 'Eleva las cejas y arruga la frente (expresión de sorpresa); el vientre occipital tracciona el cuero cabelludo hacia atrás.',
  antagonistas: ['orbicular_ojo'],
  clinica: 'En la parálisis facial periférica (de Bell) el paciente no puede arrugar la frente del lado afectado; en la central (ictus) la frente se conserva.',
});
add('temporal', {
  nombre: 'Temporal', latin: 'M. temporalis', region: 'cabeza', grupo: 'Músculos de la masticación', capa: 1,
  origen: 'Fosa temporal (hasta la línea temporal inferior) y fascia temporal.',
  insercion: 'Apófisis coronoides y borde anterior de la rama de la mandíbula, pasando por dentro del arco cigomático.',
  oh: ['parietal', 'temporal', 'frontal', 'esfenoides'], ih: ['mandibula'],
  inervacion: 'Nervios temporales profundos, ramos del nervio mandibular (V3, trigémino).',
  irrigacion: 'Arterias temporales profundas (de la maxilar) y temporal media.',
  accion: 'Eleva la mandíbula (cierra la boca); sus fibras posteriores la retruyen.',
  sinergistas: ['masetero', 'pterigoideo_medial'], antagonistas: ['digastrico', 'pterigoideo_lateral'],
  clinica: 'Se palpa en la sien al apretar los dientes. Su tensión es causa frecuente de cefalea tensional y bruxismo.',
});
add('masetero', {
  nombre: 'Masetero', latin: 'M. masseter', region: 'cabeza', grupo: 'Músculos de la masticación', capa: 1,
  origen: 'Borde inferior y cara medial del arco cigomático (hueso cigomático y apófisis cigomática del temporal).',
  insercion: 'Cara lateral de la rama y ángulo de la mandíbula.',
  oh: ['cigomatico', 'temporal', 'maxilar'], ih: ['mandibula'],
  inervacion: 'Nervio maseterino (de V3, trigémino).',
  irrigacion: 'Arteria maseterina (de la maxilar), facial y transversa de la cara.',
  accion: 'Eleva la mandíbula con gran fuerza (cierre de la boca); la protruye ligeramente.',
  sinergistas: ['temporal', 'pterigoideo_medial'], antagonistas: ['digastrico'],
  clinica: 'Es uno de los músculos más potentes del cuerpo en relación a su tamaño. Su hipertrofia se observa en el bruxismo. El trismo (espasmo) es un signo del tétanos.',
});
add('pterigoideo_medial', {
  nombre: 'Pterigoideo medial (interno)', latin: 'M. pterygoideus medialis', region: 'cabeza', grupo: 'Músculos de la masticación', capa: 3,
  origen: 'Cara medial de la lámina lateral de la apófisis pterigoides (fosa pterigoidea) del esfenoides; tuberosidad del maxilar.',
  insercion: 'Cara medial de la rama y del ángulo de la mandíbula.',
  oh: ['esfenoides', 'maxilar'], ih: ['mandibula'],
  inervacion: 'Nervio pterigoideo medial (de V3).',
  irrigacion: 'Ramos pterigoideos de la arteria maxilar.',
  accion: 'Eleva la mandíbula; con el pterigoideo lateral produce movimientos de lateralidad (trituración).',
  sinergistas: ['masetero', 'temporal'],
  clinica: 'Forma con el masetero un "cabestrillo" muscular alrededor del ángulo mandibular.',
});
add('pterigoideo_lateral', {
  nombre: 'Pterigoideo lateral (externo)', latin: 'M. pterygoideus lateralis', region: 'cabeza', grupo: 'Músculos de la masticación', capa: 3,
  origen: 'Cabeza superior: cara infratemporal del ala mayor del esfenoides. Cabeza inferior: cara lateral de la lámina lateral de la apófisis pterigoides.',
  insercion: 'Fosita pterigoidea del cuello del cóndilo mandibular, cápsula y disco de la ATM.',
  oh: ['esfenoides'], ih: ['mandibula'],
  inervacion: 'Nervio pterigoideo lateral (de V3).',
  irrigacion: 'Ramos pterigoideos de la arteria maxilar.',
  accion: 'Protruye la mandíbula y la desplaza hacia el lado opuesto; inicia la apertura de la boca (desliza el cóndilo hacia delante).',
  antagonistas: ['temporal'],
  clinica: 'Es el único músculo de la masticación que ayuda a abrir la boca. Su espasmo se relaciona con disfunciones de la ATM y chasquidos articulares.',
});
add('orbicular_ojo', {
  nombre: 'Orbicular del ojo (de los párpados)', latin: 'M. orbicularis oculi', region: 'cabeza', grupo: 'Músculos de la expresión facial', capa: 1,
  origen: 'Borde medial de la órbita (porción nasal del frontal, apófisis frontal del maxilar), ligamento palpebral medial y hueso lagrimal.',
  insercion: 'Piel alrededor de la órbita, rafe palpebral lateral y párpados.',
  oh: ['frontal', 'maxilar'], ih: ['frontal', 'cigomatico'],
  inervacion: 'Nervio facial (VII): ramos temporales y cigomáticos.',
  irrigacion: 'Arterias facial, temporal superficial, supraorbitaria e infraorbitaria.',
  accion: 'Cierra los párpados: porción palpebral (parpadeo suave) y porción orbitaria (cierre forzado). Ayuda al drenaje de las lágrimas.',
  antagonistas: ['occipitofrontal'],
  clinica: 'En la parálisis facial el ojo no cierra (lagoftalmos) y hay riesgo de úlcera corneal. Su contracción involuntaria produce el blefaroespasmo.',
});
add('orbicular_boca', {
  nombre: 'Orbicular de la boca (de los labios)', latin: 'M. orbicularis oris', region: 'cabeza', grupo: 'Músculos de la expresión facial', capa: 1, bilateral: false,
  origen: 'Fibras propias y de músculos faciales vecinos (buccinador); fosas incisivas del maxilar y la mandíbula; tabique nasal.',
  insercion: 'Piel y mucosa de los labios y modiolo (comisura).',
  oh: ['maxilar', 'mandibula'], ih: [],
  inervacion: 'Nervio facial (VII): ramos bucales y marginal de la mandíbula.',
  irrigacion: 'Arterias labiales superior e inferior (de la facial).',
  accion: 'Cierra y protruye los labios (silbar, besar, sorber). Esfínter de la boca.',
  antagonistas: ['cigomatico_mayor'],
  clinica: 'Es importante en el habla y en la alimentación. Su parálisis hace que la comida y la saliva escapen por la comisura.',
});
add('cigomatico_mayor', {
  nombre: 'Cigomático mayor', latin: 'M. zygomaticus major', region: 'cabeza', grupo: 'Músculos de la expresión facial', capa: 1,
  origen: 'Cara lateral del hueso cigomático.',
  insercion: 'Piel y músculo del ángulo de la boca (modiolo).',
  oh: ['cigomatico'], ih: [],
  inervacion: 'Nervio facial (VII): ramos cigomáticos y bucales.',
  irrigacion: 'Arteria facial (labial superior).',
  accion: 'Lleva la comisura de la boca hacia arriba y afuera: es el músculo de la sonrisa.',
  antagonistas: ['orbicular_boca'],
  clinica: 'La sonrisa "genuina" (de Duchenne) combina el cigomático mayor con el orbicular del ojo.',
});
add('buccinador', {
  nombre: 'Buccinador', latin: 'M. buccinator', region: 'cabeza', grupo: 'Músculos de la expresión facial', capa: 2,
  origen: 'Apófisis alveolares del maxilar y la mandíbula (a nivel de los molares) y rafe pterigomandibular.',
  insercion: 'Ángulo de la boca, fibras del orbicular de la boca.',
  oh: ['maxilar', 'mandibula'], ih: [],
  inervacion: 'Nervio facial (VII): ramos bucales. (El nervio bucal del trigémino que lo atraviesa es sensitivo).',
  irrigacion: 'Arterias facial y bucal (de la maxilar).',
  accion: 'Comprime las mejillas contra los dientes; mantiene el bolo alimenticio entre los molares; soplar.',
  clinica: 'Es el músculo del trompetista. Lo atraviesa el conducto parotídeo (de Stenon) frente al 2.º molar superior.',
});

// ================================ CUELLO ================================
add('esternocleidomastoideo', {
  nombre: 'Esternocleidomastoideo', latin: 'M. sternocleidomastoideus', region: 'cuello', grupo: 'Músculos laterales del cuello', capa: 1,
  origen: 'Cabeza esternal: cara anterior del manubrio esternal. Cabeza clavicular: tercio medial de la clavícula.',
  insercion: 'Cara lateral de la apófisis mastoides del temporal y mitad lateral de la línea nucal superior del occipital.',
  oh: ['esternon', 'clavicula'], ih: ['temporal', 'occipital'],
  inervacion: 'Nervio accesorio (XI par, raíz espinal); fibras propioceptivas de C2-C3.',
  irrigacion: 'Arterias occipital, auricular posterior, tiroidea superior y supraescapular.',
  accion: 'Unilateral: inclina la cabeza hacia su lado y la rota hacia el lado contrario. Bilateral: flexiona el cuello y extiende la cabeza; músculo accesorio de la inspiración.',
  sinergistas: ['escaleno_anterior', 'trapecio'], antagonistas: ['esplenio_cabeza'],
  clinica: 'Divide el cuello en triángulos anterior y posterior. Su acortamiento congénito causa la tortícolis congénita. Es referencia para la canalización de la vena yugular interna.',
});
add('escaleno_anterior', {
  nombre: 'Escaleno anterior', latin: 'M. scalenus anterior', region: 'cuello', grupo: 'Músculos escalenos (prevertebrales laterales)', capa: 2,
  origen: 'Tubérculos anteriores de las apófisis transversas de C3-C6.',
  insercion: 'Tubérculo del escaleno anterior (de Lisfranc) en la cara superior de la 1.ª costilla.',
  oh: ['c3', 'c4', 'c5', 'c6'], ih: ['costilla_1'],
  inervacion: 'Ramos anteriores de los nervios cervicales C4-C6.',
  irrigacion: 'Arteria cervical ascendente (de la tiroidea inferior).',
  accion: 'Eleva la 1.ª costilla (inspiración forzada); flexiona e inclina lateralmente el cuello.',
  sinergistas: ['escaleno_medio', 'esternocleidomastoideo'],
  clinica: 'Entre el escaleno anterior y el medio pasan el plexo braquial y la arteria subclavia (desfiladero de los escalenos); la vena subclavia pasa por delante. Su hipertrofia puede causar compresión neurovascular.',
});
add('escaleno_medio', {
  nombre: 'Escaleno medio', latin: 'M. scalenus medius', region: 'cuello', grupo: 'Músculos escalenos (prevertebrales laterales)', capa: 2,
  origen: 'Tubérculos posteriores de las apófisis transversas de C2-C7.',
  insercion: 'Cara superior de la 1.ª costilla, por detrás del surco de la arteria subclavia.',
  oh: ['c2', 'c3', 'c4', 'c5', 'c6', 'c7'], ih: ['costilla_1'],
  inervacion: 'Ramos anteriores de los nervios cervicales C3-C8.',
  irrigacion: 'Arteria cervical ascendente.',
  accion: 'Eleva la 1.ª costilla; inclina lateralmente el cuello.',
  sinergistas: ['escaleno_anterior'],
  clinica: 'Lo atraviesan el nervio dorsal de la escápula y el nervio torácico largo.',
});
add('esplenio_cabeza', {
  nombre: 'Esplenio de la cabeza', latin: 'M. splenius capitis', region: 'cuello', grupo: 'Músculos de la nuca', capa: 2,
  origen: 'Mitad inferior del ligamento nucal y apófisis espinosas de C7-T3.',
  insercion: 'Apófisis mastoides del temporal y tercio lateral de la línea nucal superior del occipital.',
  oh: ['c7', 't1', 't2', 't3'], ih: ['temporal', 'occipital'],
  inervacion: 'Ramos posteriores de los nervios cervicales medios (C2-C4).',
  irrigacion: 'Arteria occipital y cervical transversa.',
  accion: 'Bilateral: extiende la cabeza y el cuello. Unilateral: inclina y rota la cabeza hacia su mismo lado.',
  sinergistas: ['trapecio'], antagonistas: ['esternocleidomastoideo'],
  clinica: 'Se lesiona con frecuencia en el latigazo cervical.',
});
add('digastrico', {
  nombre: 'Digástrico', latin: 'M. digastricus', region: 'cuello', grupo: 'Músculos suprahioideos', capa: 2,
  origen: 'Vientre posterior: escotadura mastoidea del temporal. Vientre anterior: fosa digástrica de la mandíbula.',
  insercion: 'Tendón intermedio unido al cuerpo y asta mayor del hioides mediante un asa fibrosa.',
  oh: ['temporal', 'mandibula'], ih: ['hioides'],
  inervacion: 'Vientre anterior: nervio milohioideo (de V3). Vientre posterior: nervio facial (VII).',
  irrigacion: 'Arterias submentoniana (vientre anterior) y occipital/auricular posterior (vientre posterior).',
  accion: 'Desciende la mandíbula (abre la boca) y eleva el hioides en la deglución.',
  antagonistas: ['masetero', 'temporal'], sinergistas: ['milohioideo'],
  clinica: 'Su doble inervación refleja su doble origen embrionario (1.º y 2.º arcos faríngeos). Delimita el triángulo submandibular.',
});
add('milohioideo', {
  nombre: 'Milohioideo', latin: 'M. mylohyoideus', region: 'cuello', grupo: 'Músculos suprahioideos', capa: 3,
  origen: 'Línea milohioidea de la cara interna de la mandíbula.',
  insercion: 'Rafe milohioideo medio y cuerpo del hioides.',
  oh: ['mandibula'], ih: ['hioides'],
  inervacion: 'Nervio milohioideo (de V3, trigémino).',
  irrigacion: 'Arteria submentoniana (de la facial) y sublingual.',
  accion: 'Forma el suelo de la boca; eleva el hioides y la lengua en la deglución; desciende la mandíbula.',
  sinergistas: ['digastrico'],
  clinica: 'Es el "diafragma de la boca". Las infecciones dentales por debajo de su línea de inserción se extienden al cuello (angina de Ludwig).',
});
add('esternohioideo', {
  nombre: 'Esternohioideo', latin: 'M. sternohyoideus', region: 'cuello', grupo: 'Músculos infrahioideos', capa: 1,
  origen: 'Cara posterior del manubrio esternal y extremo medial de la clavícula.',
  insercion: 'Borde inferior del cuerpo del hioides.',
  oh: ['esternon', 'clavicula'], ih: ['hioides'],
  inervacion: 'Asa cervical (C1-C3).',
  irrigacion: 'Arteria tiroidea superior.',
  accion: 'Desciende el hioides tras la deglución y la fonación.',
  sinergistas: ['omohioideo'], antagonistas: ['digastrico', 'milohioideo'],
  clinica: 'Músculo "en cinta" que se separa en la línea media en la cirugía de tiroides y la traqueostomía.',
});
add('omohioideo', {
  nombre: 'Omohioideo', latin: 'M. omohyoideus', region: 'cuello', grupo: 'Músculos infrahioideos', capa: 2,
  origen: 'Vientre inferior: borde superior de la escápula, cerca de la escotadura escapular.',
  insercion: 'Vientre superior: borde inferior del hioides. Ambos vientres se unen por un tendón intermedio anclado a la clavícula.',
  oh: ['escapula'], ih: ['hioides'],
  inervacion: 'Asa cervical (C1-C3).',
  irrigacion: 'Arterias tiroidea superior y cervical transversa.',
  accion: 'Desciende y fija el hioides; tensa la fascia cervical (facilita el retorno venoso yugular).',
  sinergistas: ['esternohioideo'],
  clinica: 'Es referencia quirúrgica: cruza la vena yugular interna y divide los triángulos del cuello.',
});

// ================================ TÓRAX ================================
add('pectoral_mayor', {
  nombre: 'Pectoral mayor', latin: 'M. pectoralis major', region: 'torax', grupo: 'Músculos toracoapendiculares anteriores', capa: 1,
  origen: 'Porción clavicular: mitad medial de la clavícula. Porción esternocostal: cara anterior del esternón y cartílagos costales 1-6. Porción abdominal: vaina del recto del abdomen.',
  insercion: 'Labio lateral del surco intertubercular (cresta del tubérculo mayor) del húmero.',
  oh: ['clavicula', 'esternon', 'costilla_1', 'costilla_2', 'costilla_3', 'costilla_4', 'costilla_5', 'costilla_6'], ih: ['humero'],
  inervacion: 'Nervios pectorales lateral (C5-C7) y medial (C8-T1).',
  irrigacion: 'Rama pectoral de la arteria toracoacromial; arteria torácica interna (perforantes) y torácica lateral.',
  accion: 'Aduce y rota medialmente el húmero. La porción clavicular flexiona el brazo; la esternocostal lo extiende desde la flexión. Músculo accesorio de la inspiración (con el brazo fijo).',
  sinergistas: ['dorsal_ancho', 'deltoides', 'redondo_mayor', 'subescapular'], antagonistas: ['infraespinoso', 'redondo_menor', 'deltoides'],
  clinica: 'Forma el pliegue axilar anterior. Su ausencia congénita forma parte del síndrome de Poland. Se usa como colgajo en cirugía reconstructiva.',
});
add('pectoral_menor', {
  nombre: 'Pectoral menor', latin: 'M. pectoralis minor', region: 'torax', grupo: 'Músculos toracoapendiculares anteriores', capa: 2,
  origen: 'Cara externa de las costillas 3.ª a 5.ª, cerca de sus cartílagos.',
  insercion: 'Borde medial y cara superior de la apófisis coracoides de la escápula.',
  oh: ['costilla_3', 'costilla_4', 'costilla_5'], ih: ['escapula'],
  inervacion: 'Nervio pectoral medial (C8-T1).',
  irrigacion: 'Arteria toracoacromial (rama pectoral) y torácica lateral.',
  accion: 'Desciende y protruye la escápula, estabilizándola contra el tórax; eleva las costillas en la inspiración forzada.',
  sinergistas: ['serrato_anterior', 'subclavio'], antagonistas: ['trapecio', 'romboides_mayor'],
  clinica: 'Es la referencia para dividir la arteria axilar en tres porciones y los ganglios axilares en tres niveles (cáncer de mama).',
});
add('subclavio', {
  nombre: 'Subclavio', latin: 'M. subclavius', region: 'torax', grupo: 'Músculos toracoapendiculares anteriores', capa: 2,
  origen: 'Unión de la 1.ª costilla con su cartílago costal.',
  insercion: 'Surco del subclavio en la cara inferior del tercio medio de la clavícula.',
  oh: ['costilla_1'], ih: ['clavicula'],
  inervacion: 'Nervio del subclavio (C5-C6).',
  irrigacion: 'Rama clavicular de la arteria toracoacromial.',
  accion: 'Ancla y desciende la clavícula, estabilizando la articulación esternoclavicular.',
  sinergistas: ['pectoral_menor'],
  clinica: 'Amortigua y protege los vasos subclavios en las fracturas de clavícula.',
});
add('serrato_anterior', {
  nombre: 'Serrato anterior', latin: 'M. serratus anterior', region: 'torax', grupo: 'Músculos toracoapendiculares anteriores', capa: 1,
  origen: 'Caras externas de las 8-9 primeras costillas mediante digitaciones.',
  insercion: 'Cara anterior (costal) del borde medial de la escápula, desde el ángulo superior al inferior.',
  oh: range('costilla_', 1, 9), ih: ['escapula'],
  inervacion: 'Nervio torácico largo (de Bell) (C5-C7).',
  irrigacion: 'Arterias torácica lateral, toracodorsal y torácica superior.',
  accion: 'Protrae (abduce) la escápula y la mantiene pegada al tórax; rota la escápula hacia arriba (permite elevar el brazo por encima de 90°). "Músculo del boxeador".',
  sinergistas: ['trapecio', 'pectoral_menor'], antagonistas: ['romboides_mayor', 'romboides_menor'],
  clinica: 'La lesión del nervio torácico largo (p. ej., en la mastectomía) produce la "escápula alada": el borde medial se separa del tórax al empujar contra una pared.',
});
add('intercostales_externos', {
  nombre: 'Intercostales externos', latin: 'Mm. intercostales externi', region: 'torax', grupo: 'Músculos de la pared torácica', capa: 2,
  origen: 'Borde inferior de cada costilla (del tubérculo hasta la unión costocondral).',
  insercion: 'Borde superior de la costilla inferior. Sus fibras se dirigen hacia abajo y adelante ("manos en los bolsillos").',
  oh: range('costilla_', 1, 11), ih: range('costilla_', 2, 12),
  inervacion: 'Nervios intercostales (T1-T11).',
  irrigacion: 'Arterias intercostales posteriores y anteriores; arteria torácica interna.',
  accion: 'Elevan las costillas durante la inspiración; mantienen la rigidez de los espacios intercostales.',
  sinergistas: ['diafragma'], antagonistas: ['intercostales_internos'],
  clinica: 'El paquete vasculonervioso intercostal discurre bajo cada costilla, entre los intercostales internos y los íntimos.',
});
add('intercostales_internos', {
  nombre: 'Intercostales internos', latin: 'Mm. intercostales interni', region: 'torax', grupo: 'Músculos de la pared torácica', capa: 3,
  origen: 'Surco costal y borde inferior de cada costilla (desde el esternón hasta el ángulo costal).',
  insercion: 'Borde superior de la costilla inferior. Fibras perpendiculares a los intercostales externos (hacia abajo y atrás).',
  oh: range('costilla_', 1, 11), ih: range('costilla_', 2, 12),
  inervacion: 'Nervios intercostales (T1-T11).',
  irrigacion: 'Arterias intercostales y torácica interna.',
  accion: 'Descienden las costillas en la espiración forzada (porción interósea); la porción intercondral ayuda a la inspiración.',
  antagonistas: ['intercostales_externos'],
  clinica: 'Las punciones torácicas se hacen por el borde superior de la costilla inferior para no lesionar el paquete intercostal.',
});
add('diafragma', {
  nombre: 'Diafragma', latin: 'Diaphragma', region: 'torax', grupo: 'Músculo respiratorio principal', capa: 3, bilateral: false,
  origen: 'Porción esternal: cara posterior de la apófisis xifoides. Porción costal: caras internas de los cartílagos costales 7-12. Porción lumbar: pilares derecho (L1-L3) e izquierdo (L1-L2) y ligamentos arqueados.',
  insercion: 'Centro tendinoso (centro frénico).',
  oh: ['esternon', 'costilla_7', 'costilla_8', 'costilla_9', 'costilla_10', 'costilla_11', 'costilla_12', 'l1', 'l2', 'l3'], ih: [],
  inervacion: 'Nervio frénico (C3, C4, C5): "C3, 4 y 5 mantienen vivo al diafragma". Sensibilidad periférica: nervios intercostales.',
  irrigacion: 'Arterias frénicas superiores e inferiores, pericardiofrénica, musculofrénica e intercostales inferiores.',
  accion: 'Principal músculo de la inspiración: al contraerse desciende y aumenta el diámetro vertical del tórax. Ayuda a aumentar la presión abdominal (defecación, parto, vómito).',
  sinergistas: ['intercostales_externos', 'escaleno_anterior'], antagonistas: ['recto_abdomen', 'transverso_abdomen'],
  clinica: 'Tiene tres orificios principales: de la vena cava (T8), esofágico (T10) y aórtico (T12). La hernia de hiato es el paso del estómago por el orificio esofágico. La irritación diafragmática produce dolor referido al hombro (C4).',
});

// ================================ ABDOMEN ================================
add('recto_abdomen', {
  nombre: 'Recto del abdomen', latin: 'M. rectus abdominis', region: 'abdomen', grupo: 'Músculos anterolaterales del abdomen', capa: 1,
  origen: 'Cresta del pubis y sínfisis del pubis.',
  insercion: 'Apófisis xifoides y cartílagos costales 5.º a 7.º.',
  oh: ['coxal'], ih: ['esternon', 'costilla_5', 'costilla_6', 'costilla_7'],
  inervacion: 'Nervios toracoabdominales (T7-T11) y subcostal (T12).',
  irrigacion: 'Arterias epigástricas superior (de la torácica interna) e inferior (de la ilíaca externa).',
  accion: 'Flexiona el tronco (columna lumbar); comprime las vísceras abdominales; estabiliza la pelvis.',
  sinergistas: ['oblicuo_externo', 'oblicuo_interno'], antagonistas: ['iliocostal', 'longisimo', 'espinoso'],
  clinica: 'Sus intersecciones tendinosas forman la "tableta" abdominal. La diástasis de rectos es la separación de ambos músculos (embarazo). Se usa como colgajo (TRAM) en reconstrucción mamaria.',
});
add('oblicuo_externo', {
  nombre: 'Oblicuo externo del abdomen', latin: 'M. obliquus externus abdominis', region: 'abdomen', grupo: 'Músculos anterolaterales del abdomen', capa: 1,
  origen: 'Caras externas de las costillas 5.ª a 12.ª (digitaciones que se entrecruzan con el serrato anterior y el dorsal ancho).',
  insercion: 'Línea alba, tubérculo del pubis y mitad anterior de la cresta ilíaca. Su aponeurosis forma el ligamento inguinal.',
  oh: range('costilla_', 5, 12), ih: ['coxal'],
  inervacion: 'Nervios toracoabdominales (T7-T11) y subcostal (T12).',
  irrigacion: 'Arterias intercostales posteriores inferiores, subcostal, epigástricas y circunfleja ilíaca profunda.',
  accion: 'Bilateral: flexiona el tronco y comprime el abdomen. Unilateral: inclina el tronco a su lado y lo rota hacia el lado opuesto. Fibras "hacia los bolsillos" (abajo y adelante).',
  sinergistas: ['oblicuo_interno', 'recto_abdomen'],
  clinica: 'Su aponeurosis forma el ligamento inguinal y el anillo inguinal superficial: zona de debilidad donde aparecen las hernias inguinales.',
});
add('oblicuo_interno', {
  nombre: 'Oblicuo interno del abdomen', latin: 'M. obliquus internus abdominis', region: 'abdomen', grupo: 'Músculos anterolaterales del abdomen', capa: 2,
  origen: 'Fascia toracolumbar, dos tercios anteriores de la cresta ilíaca y mitad lateral del ligamento inguinal.',
  insercion: 'Bordes inferiores de las costillas 10.ª-12.ª, línea alba y pecten del pubis (tendón conjunto).',
  oh: ['coxal'], ih: ['costilla_10', 'costilla_11', 'costilla_12', 'coxal'],
  inervacion: 'Nervios toracoabdominales (T7-T11), subcostal (T12) e iliohipogástrico e ilioinguinal (L1).',
  irrigacion: 'Arterias intercostales inferiores, subcostal, epigástricas y circunfleja ilíaca profunda.',
  accion: 'Bilateral: flexiona el tronco y comprime el abdomen. Unilateral: inclina y rota el tronco hacia su mismo lado (trabaja con el oblicuo externo contralateral).',
  sinergistas: ['oblicuo_externo', 'transverso_abdomen'],
  clinica: 'Sus fibras inferiores forman el músculo cremáster, que rodea el cordón espermático (reflejo cremastérico, L1-L2).',
});
add('transverso_abdomen', {
  nombre: 'Transverso del abdomen', latin: 'M. transversus abdominis', region: 'abdomen', grupo: 'Músculos anterolaterales del abdomen', capa: 3,
  origen: 'Caras internas de los cartílagos costales 7-12, fascia toracolumbar, cresta ilíaca y tercio lateral del ligamento inguinal.',
  insercion: 'Línea alba (mediante su aponeurosis), cresta del pubis y pecten del pubis (tendón conjunto).',
  oh: ['costilla_7', 'costilla_8', 'costilla_9', 'costilla_10', 'costilla_11', 'costilla_12', 'coxal'], ih: ['coxal'],
  inervacion: 'Nervios toracoabdominales (T7-T11), subcostal (T12), iliohipogástrico e ilioinguinal (L1).',
  irrigacion: 'Arterias intercostales inferiores, subcostal, epigástricas y circunfleja ilíaca profunda.',
  accion: 'Comprime y sostiene las vísceras abdominales ("faja" natural); estabiliza la columna lumbar antes del movimiento de los miembros.',
  sinergistas: ['oblicuo_interno', 'diafragma'],
  clinica: 'Es clave en la estabilidad del "core" y la rehabilitación del dolor lumbar. Entre él y el oblicuo interno discurren los nervios de la pared abdominal (bloqueo TAP en anestesia).',
});

// ================================ ESPALDA ================================
add('trapecio', {
  nombre: 'Trapecio', latin: 'M. trapezius', region: 'espalda', grupo: 'Músculos toracoapendiculares posteriores (superficiales)', capa: 1,
  origen: 'Tercio medial de la línea nucal superior, protuberancia occipital externa, ligamento nucal y apófisis espinosas de C7 a T12.',
  insercion: 'Tercio lateral de la clavícula, acromion y espina de la escápula.',
  oh: ['occipital', 'c7', ...range('t', 1, 12)], ih: ['clavicula', 'escapula'],
  inervacion: 'Nervio accesorio (XI par, motor); ramos de C3-C4 (propiocepción y dolor).',
  irrigacion: 'Arteria cervical transversa (principal), occipital y perforantes de las intercostales posteriores.',
  accion: 'Fibras superiores: elevan la escápula (encoger los hombros). Medias: retraen la escápula. Inferiores: la descienden. Superiores e inferiores juntas: rotan la escápula hacia arriba. Extiende el cuello si la escápula está fija.',
  sinergistas: ['serrato_anterior', 'elevador_escapula', 'romboides_mayor'], antagonistas: ['pectoral_menor', 'dorsal_ancho'],
  clinica: 'La lesión del nervio accesorio (p. ej., en biopsias ganglionares del triángulo posterior) provoca caída del hombro y dificultad para elevar el brazo por encima de la cabeza.',
});
add('dorsal_ancho', {
  nombre: 'Dorsal ancho', latin: 'M. latissimus dorsi', region: 'espalda', grupo: 'Músculos toracoapendiculares posteriores (superficiales)', capa: 1,
  origen: 'Apófisis espinosas de T7-T12, fascia toracolumbar (vértebras lumbares y sacro), tercio posterior de la cresta ilíaca, últimas 3-4 costillas y a veces el ángulo inferior de la escápula.',
  insercion: 'Suelo del surco intertubercular del húmero.',
  oh: [...range('t', 7, 12), ...range('l', 1, 5), 'sacro', 'coxal', 'costilla_9', 'costilla_10', 'costilla_11', 'costilla_12', 'escapula'], ih: ['humero'],
  inervacion: 'Nervio toracodorsal (C6-C8).',
  irrigacion: 'Arteria toracodorsal (de la subescapular) y perforantes intercostales y lumbares.',
  accion: 'Extiende, aduce y rota medialmente el húmero. Eleva el cuerpo hacia los brazos (trepar, dominadas). Ayuda a la espiración forzada (tos).',
  sinergistas: ['redondo_mayor', 'pectoral_mayor'], antagonistas: ['deltoides', 'supraespinoso'],
  clinica: 'Forma el pliegue axilar posterior. Es uno de los colgajos musculares más usados en cirugía reconstructiva (mama, cabeza y cuello).',
});
add('romboides_mayor', {
  nombre: 'Romboides mayor', latin: 'M. rhomboideus major', region: 'espalda', grupo: 'Músculos toracoapendiculares posteriores', capa: 2,
  origen: 'Apófisis espinosas de T2 a T5.',
  insercion: 'Borde medial de la escápula, desde la raíz de la espina hasta el ángulo inferior.',
  oh: ['t2', 't3', 't4', 't5'], ih: ['escapula'],
  inervacion: 'Nervio dorsal de la escápula (C4-C5).',
  irrigacion: 'Arteria dorsal de la escápula (o rama profunda de la cervical transversa) e intercostales posteriores.',
  accion: 'Retrae (aduce) la escápula y la rota hacia abajo; la fija contra el tórax.',
  sinergistas: ['romboides_menor', 'trapecio', 'elevador_escapula'], antagonistas: ['serrato_anterior', 'pectoral_menor'],
  clinica: 'Su debilidad contribuye a la postura de hombros adelantados. Las contracturas interescapulares son muy frecuentes.',
});
add('romboides_menor', {
  nombre: 'Romboides menor', latin: 'M. rhomboideus minor', region: 'espalda', grupo: 'Músculos toracoapendiculares posteriores', capa: 2,
  origen: 'Ligamento nucal y apófisis espinosas de C7 y T1.',
  insercion: 'Borde medial de la escápula, a nivel de la raíz de la espina.',
  oh: ['c7', 't1'], ih: ['escapula'],
  inervacion: 'Nervio dorsal de la escápula (C4-C5).',
  irrigacion: 'Arteria dorsal de la escápula.',
  accion: 'Retrae y rota hacia abajo la escápula; la fija a la pared torácica.',
  sinergistas: ['romboides_mayor', 'elevador_escapula'], antagonistas: ['serrato_anterior'],
  clinica: 'Se explora junto al romboides mayor pidiendo al paciente que junte las escápulas.',
});
add('elevador_escapula', {
  nombre: 'Elevador de la escápula', latin: 'M. levator scapulae', region: 'espalda', grupo: 'Músculos toracoapendiculares posteriores', capa: 2,
  origen: 'Tubérculos posteriores de las apófisis transversas de C1 a C4.',
  insercion: 'Borde medial de la escápula, desde el ángulo superior hasta la raíz de la espina.',
  oh: ['c1', 'c2', 'c3', 'c4'], ih: ['escapula'],
  inervacion: 'Nervio dorsal de la escápula (C5) y ramos cervicales C3-C4.',
  irrigacion: 'Arterias dorsal de la escápula y cervical transversa.',
  accion: 'Eleva la escápula y la rota hacia abajo; inclina el cuello hacia su lado.',
  sinergistas: ['trapecio', 'romboides_menor'], antagonistas: ['serrato_anterior'],
  clinica: 'Es una causa muy común de dolor y rigidez cervical ("tortícolis" postural); punto gatillo en el ángulo superior de la escápula.',
});
add('iliocostal', {
  nombre: 'Iliocostal (erector de la columna)', latin: 'M. iliocostalis', region: 'espalda', grupo: 'Músculos intrínsecos de la espalda — erector de la columna', capa: 3,
  origen: 'Tendón común del erector de la columna: cara posterior del sacro, cresta ilíaca y apófisis espinosas lumbares.',
  insercion: 'Ángulos de las costillas inferiores y superiores y apófisis transversas de C4-C6 (porciones lumbar, torácica y cervical).',
  oh: ['sacro', 'coxal', 'l1', 'l2', 'l3', 'l4', 'l5'], ih: [...range('costilla_', 1, 12), 'c4', 'c5', 'c6'],
  inervacion: 'Ramos posteriores de los nervios espinales.',
  irrigacion: 'Arterias intercostales posteriores, subcostales y lumbares.',
  accion: 'Bilateral: extiende la columna y la cabeza. Unilateral: inclina lateralmente la columna.',
  sinergistas: ['longisimo', 'espinoso', 'cuadrado_lumbar'], antagonistas: ['recto_abdomen'],
  clinica: 'Es la columna más lateral del erector de la columna. Los espasmos del erector son causa principal del lumbago agudo.',
});
add('longisimo', {
  nombre: 'Longísimo (erector de la columna)', latin: 'M. longissimus', region: 'espalda', grupo: 'Músculos intrínsecos de la espalda — erector de la columna', capa: 3,
  origen: 'Tendón común del erector de la columna (sacro, cresta ilíaca, espinosas lumbares) y apófisis transversas torácicas y cervicales.',
  insercion: 'Apófisis transversas torácicas y cervicales, costillas entre tubérculo y ángulo, y apófisis mastoides (longísimo de la cabeza).',
  oh: ['sacro', 'coxal', 'l1', 'l2', 'l3', 'l4', 'l5'], ih: [...range('t', 1, 12), ...range('costilla_', 3, 12), 'c2', 'c3', 'c4', 'c5', 'c6', 'temporal'],
  inervacion: 'Ramos posteriores de los nervios espinales.',
  irrigacion: 'Arterias intercostales posteriores, lumbares, cervical profunda y occipital.',
  accion: 'Bilateral: extiende la columna vertebral y la cabeza. Unilateral: inclina la columna y rota la cabeza hacia su lado.',
  sinergistas: ['iliocostal', 'espinoso'], antagonistas: ['recto_abdomen'],
  clinica: 'Es la columna intermedia y la más larga y potente del erector de la columna.',
});
add('espinoso', {
  nombre: 'Espinoso (erector de la columna)', latin: 'M. spinalis', region: 'espalda', grupo: 'Músculos intrínsecos de la espalda — erector de la columna', capa: 3,
  origen: 'Apófisis espinosas de T11-L2 (porción torácica) y de C7 (porción cervical).',
  insercion: 'Apófisis espinosas de T1-T8 (torácica) y de C2 (cervical).',
  oh: ['t11', 't12', 'l1', 'l2'], ih: range('t', 1, 8),
  inervacion: 'Ramos posteriores de los nervios espinales.',
  irrigacion: 'Arterias intercostales posteriores y lumbares.',
  accion: 'Extiende la columna vertebral.',
  sinergistas: ['iliocostal', 'longisimo'], antagonistas: ['recto_abdomen'],
  clinica: 'Es la columna más medial y pequeña del erector de la columna.',
});
add('cuadrado_lumbar', {
  nombre: 'Cuadrado lumbar', latin: 'M. quadratus lumborum', region: 'espalda', grupo: 'Músculos de la pared posterior del abdomen', capa: 3,
  origen: 'Labio interno de la cresta ilíaca y ligamento iliolumbar.',
  insercion: 'Borde inferior de la 12.ª costilla y apófisis transversas de L1-L4.',
  oh: ['coxal'], ih: ['costilla_12', 'l1', 'l2', 'l3', 'l4'],
  inervacion: 'Ramos anteriores de T12 y L1-L4.',
  irrigacion: 'Arterias lumbares, subcostal e iliolumbar.',
  accion: 'Inclina lateralmente la columna lumbar; fija la 12.ª costilla en la inspiración; eleva la cadera del mismo lado (bilateral: extiende la columna lumbar).',
  sinergistas: ['iliocostal', 'oblicuo_externo'],
  clinica: 'Fuente frecuente de dolor lumbar mecánico; su contractura puede simular una dismetría de miembros (pelvis elevada).',
});

// ================================ HOMBRO ================================
add('deltoides', {
  nombre: 'Deltoides', latin: 'M. deltoideus', region: 'miembro_superior', grupo: 'Hombro (escapulohumerales)', capa: 1,
  origen: 'Porción anterior: tercio lateral de la clavícula. Porción media: acromion. Porción posterior: espina de la escápula.',
  insercion: 'Tuberosidad deltoidea del húmero.',
  oh: ['clavicula', 'escapula'], ih: ['humero'],
  inervacion: 'Nervio axilar (circunflejo) (C5-C6).',
  irrigacion: 'Arteria circunfleja humeral posterior y rama deltoidea de la toracoacromial.',
  accion: 'Porción media: abduce el brazo (15°-90°). Anterior: flexiona y rota medialmente. Posterior: extiende y rota lateralmente.',
  sinergistas: ['supraespinoso', 'pectoral_mayor', 'infraespinoso'], antagonistas: ['dorsal_ancho', 'pectoral_mayor'],
  clinica: 'La fractura del cuello quirúrgico del húmero o la luxación del hombro pueden lesionar el nervio axilar: atrofia del deltoides (hombro "cuadrado") y anestesia en la "insignia de sargento". Lugar habitual de inyecciones intramusculares.',
});
add('supraespinoso', {
  nombre: 'Supraespinoso', latin: 'M. supraspinatus', region: 'miembro_superior', grupo: 'Hombro — manguito de los rotadores', capa: 2,
  origen: 'Fosa supraespinosa de la escápula.',
  insercion: 'Carilla superior del tubérculo mayor del húmero.',
  oh: ['escapula'], ih: ['humero'],
  inervacion: 'Nervio supraescapular (C5-C6).',
  irrigacion: 'Arteria supraescapular.',
  accion: 'Inicia la abducción del brazo (0°-15°) y estabiliza la cabeza humeral en la cavidad glenoidea.',
  sinergistas: ['deltoides'], antagonistas: ['dorsal_ancho'],
  clinica: 'Es el tendón del manguito de los rotadores que más se rompe y el que más sufre el síndrome subacromial (pinzamiento bajo el acromion; "arco doloroso" entre 60° y 120°).',
});
add('infraespinoso', {
  nombre: 'Infraespinoso', latin: 'M. infraspinatus', region: 'miembro_superior', grupo: 'Hombro — manguito de los rotadores', capa: 2,
  origen: 'Fosa infraespinosa de la escápula.',
  insercion: 'Carilla media del tubérculo mayor del húmero.',
  oh: ['escapula'], ih: ['humero'],
  inervacion: 'Nervio supraescapular (C5-C6).',
  irrigacion: 'Arterias supraescapular y circunfleja de la escápula.',
  accion: 'Rota lateralmente el brazo; estabiliza la articulación glenohumeral.',
  sinergistas: ['redondo_menor', 'deltoides'], antagonistas: ['subescapular', 'pectoral_mayor'],
  clinica: 'Se atrofia en el atrapamiento del nervio supraescapular en la escotadura espinoglenoidea (voleibolistas).',
});
add('redondo_menor', {
  nombre: 'Redondo menor', latin: 'M. teres minor', region: 'miembro_superior', grupo: 'Hombro — manguito de los rotadores', capa: 2,
  origen: 'Dos tercios superiores del borde lateral de la escápula (cara posterior).',
  insercion: 'Carilla inferior del tubérculo mayor del húmero.',
  oh: ['escapula'], ih: ['humero'],
  inervacion: 'Nervio axilar (C5-C6).',
  irrigacion: 'Arteria circunfleja de la escápula y circunfleja humeral posterior.',
  accion: 'Rota lateralmente el brazo y ayuda a estabilizar la cabeza humeral.',
  sinergistas: ['infraespinoso'], antagonistas: ['subescapular'],
  clinica: 'Delimita con el redondo mayor y el húmero el espacio cuadrangular (nervio axilar y arteria circunfleja humeral posterior) y el triangular.',
});
add('redondo_mayor', {
  nombre: 'Redondo mayor', latin: 'M. teres major', region: 'miembro_superior', grupo: 'Hombro (escapulohumerales)', capa: 2,
  origen: 'Cara posterior del ángulo inferior de la escápula.',
  insercion: 'Labio medial (cresta del tubérculo menor) del surco intertubercular del húmero.',
  oh: ['escapula'], ih: ['humero'],
  inervacion: 'Nervio subescapular inferior (C5-C6).',
  irrigacion: 'Arteria circunfleja de la escápula y toracodorsal.',
  accion: 'Aduce, extiende y rota medialmente el brazo ("ayudante del dorsal ancho").',
  sinergistas: ['dorsal_ancho', 'subescapular'], antagonistas: ['deltoides', 'infraespinoso'],
  clinica: 'No forma parte del manguito de los rotadores. Su borde inferior marca el límite entre arteria axilar y braquial.',
});
add('subescapular', {
  nombre: 'Subescapular', latin: 'M. subscapularis', region: 'miembro_superior', grupo: 'Hombro — manguito de los rotadores', capa: 3,
  origen: 'Fosa subescapular (cara anterior/costal de la escápula).',
  insercion: 'Tubérculo menor del húmero.',
  oh: ['escapula'], ih: ['humero'],
  inervacion: 'Nervios subescapulares superior e inferior (C5-C7).',
  irrigacion: 'Arterias subescapular, supraescapular y dorsal de la escápula.',
  accion: 'Rota medialmente y aduce el brazo; principal estabilizador anterior de la cabeza humeral.',
  sinergistas: ['pectoral_mayor', 'redondo_mayor', 'dorsal_ancho'], antagonistas: ['infraespinoso', 'redondo_menor'],
  clinica: 'Su rotura se explora con la maniobra de "lift-off" (despegar la mano de la espalda). Es el músculo más potente del manguito.',
});

// ================================ BRAZO ================================
add('biceps_braquial', {
  nombre: 'Bíceps braquial', latin: 'M. biceps brachii', region: 'miembro_superior', grupo: 'Brazo — compartimento anterior (flexor)', capa: 1,
  origen: 'Cabeza larga: tubérculo supraglenoideo de la escápula (tendón intraarticular). Cabeza corta: vértice de la apófisis coracoides.',
  insercion: 'Tuberosidad del radio y, mediante la aponeurosis bicipital (lacertus fibrosus), fascia del antebrazo.',
  oh: ['escapula'], ih: ['radio'],
  inervacion: 'Nervio musculocutáneo (C5-C6).',
  irrigacion: 'Ramas musculares de la arteria braquial.',
  accion: 'Supina el antebrazo (es su supinador más potente) y flexiona el codo, sobre todo en supinación. Ayuda a flexionar el hombro.',
  sinergistas: ['braquial', 'braquiorradial', 'supinador'], antagonistas: ['triceps_braquial', 'pronador_redondo'],
  clinica: 'Reflejo bicipital (C5-C6). La rotura del tendón de la cabeza larga produce el signo de "Popeye". Los "tornillos" (atornillar con la mano derecha) usan su potente supinación.',
});
add('braquial', {
  nombre: 'Braquial', latin: 'M. brachialis', region: 'miembro_superior', grupo: 'Brazo — compartimento anterior (flexor)', capa: 2,
  origen: 'Mitad distal de la cara anterior del húmero.',
  insercion: 'Apófisis coronoides y tuberosidad del cúbito.',
  oh: ['humero'], ih: ['cubito'],
  inervacion: 'Nervio musculocutáneo (C5-C6) (y una pequeña parte por el nervio radial).',
  irrigacion: 'Arterias braquial y recurrente radial.',
  accion: 'Flexor principal del codo en cualquier posición del antebrazo ("el caballo de tiro" de la flexión).',
  sinergistas: ['biceps_braquial', 'braquiorradial'], antagonistas: ['triceps_braquial'],
  clinica: 'Tras traumatismos del codo puede desarrollar miositis osificante.',
});
add('coracobraquial', {
  nombre: 'Coracobraquial', latin: 'M. coracobrachialis', region: 'miembro_superior', grupo: 'Brazo — compartimento anterior', capa: 2,
  origen: 'Vértice de la apófisis coracoides de la escápula.',
  insercion: 'Tercio medio de la cara medial del húmero.',
  oh: ['escapula'], ih: ['humero'],
  inervacion: 'Nervio musculocutáneo (C5-C7), que lo atraviesa.',
  irrigacion: 'Arteria braquial.',
  accion: 'Flexiona y aduce el brazo; estabiliza la cabeza humeral.',
  sinergistas: ['pectoral_mayor', 'deltoides'],
  clinica: 'Referencia para localizar el nervio musculocutáneo, que lo perfora.',
});
add('triceps_braquial', {
  nombre: 'Tríceps braquial', latin: 'M. triceps brachii', region: 'miembro_superior', grupo: 'Brazo — compartimento posterior (extensor)', capa: 1,
  origen: 'Cabeza larga: tubérculo infraglenoideo de la escápula. Cabeza lateral: cara posterior del húmero por encima del surco radial. Cabeza medial: cara posterior del húmero por debajo del surco radial.',
  insercion: 'Cara superior del olécranon del cúbito.',
  oh: ['escapula', 'humero'], ih: ['cubito'],
  inervacion: 'Nervio radial (C6-C8).',
  irrigacion: 'Arteria braquial profunda y colaterales cubitales.',
  accion: 'Principal extensor del codo. La cabeza larga ayuda a extender y aducir el hombro.',
  sinergistas: ['anconeo'], antagonistas: ['biceps_braquial', 'braquial'],
  clinica: 'Reflejo tricipital (C7). En las fracturas de la diáfisis humeral el nervio radial se lesiona en el surco radial, entre las cabezas lateral y medial.',
});

// ================================ ANTEBRAZO ================================
add('pronador_redondo', {
  nombre: 'Pronador redondo', latin: 'M. pronator teres', region: 'miembro_superior', grupo: 'Antebrazo anterior — capa superficial', capa: 1,
  origen: 'Cabeza humeral: epitróclea (epicóndilo medial). Cabeza cubital: apófisis coronoides del cúbito.',
  insercion: 'Parte media de la cara lateral del radio.',
  oh: ['humero', 'cubito'], ih: ['radio'],
  inervacion: 'Nervio mediano (C6-C7).',
  irrigacion: 'Arterias cubital y radial (recurrentes).',
  accion: 'Prona el antebrazo y flexiona el codo.',
  sinergistas: ['pronador_cuadrado'], antagonistas: ['supinador', 'biceps_braquial'],
  clinica: 'El nervio mediano pasa entre sus dos cabezas y puede quedar atrapado (síndrome del pronador).',
});
add('flexor_radial_carpo', {
  nombre: 'Flexor radial del carpo (palmar mayor)', latin: 'M. flexor carpi radialis', region: 'miembro_superior', grupo: 'Antebrazo anterior — capa superficial', capa: 1,
  origen: 'Epitróclea del húmero (tendón flexor común).',
  insercion: 'Base del 2.º metacarpiano (y 3.º).',
  oh: ['humero'], ih: ['metacarpiano_2', 'metacarpiano_3'],
  inervacion: 'Nervio mediano (C6-C7).',
  irrigacion: 'Arteria radial.',
  accion: 'Flexiona y abduce (desviación radial) la muñeca.',
  sinergistas: ['flexor_cubital_carpo', 'palmar_largo', 'extensor_radial_largo_carpo'], antagonistas: ['extensor_radial_corto_carpo', 'extensor_cubital_carpo'],
  clinica: 'Su tendón es referencia para tomar el pulso radial, que se palpa lateral a él.',
});
add('palmar_largo', {
  nombre: 'Palmar largo (palmar menor)', latin: 'M. palmaris longus', region: 'miembro_superior', grupo: 'Antebrazo anterior — capa superficial', capa: 1,
  origen: 'Epitróclea del húmero (tendón flexor común).',
  insercion: 'Retináculo flexor y aponeurosis palmar.',
  oh: ['humero'], ih: [],
  inervacion: 'Nervio mediano (C7-C8).',
  irrigacion: 'Arteria cubital.',
  accion: 'Flexiona la muñeca y tensa la aponeurosis palmar.',
  sinergistas: ['flexor_radial_carpo', 'flexor_cubital_carpo'],
  clinica: 'Falta en un 10-15 % de las personas. Su tendón se usa como injerto (p. ej., reconstrucción de ligamentos). El nervio mediano está justo por debajo de él en la muñeca.',
});
add('flexor_cubital_carpo', {
  nombre: 'Flexor cubital del carpo (cubital anterior)', latin: 'M. flexor carpi ulnaris', region: 'miembro_superior', grupo: 'Antebrazo anterior — capa superficial', capa: 1,
  origen: 'Cabeza humeral: epitróclea. Cabeza cubital: olécranon y borde posterior del cúbito.',
  insercion: 'Pisiforme, gancho del ganchoso y base del 5.º metacarpiano.',
  oh: ['humero', 'cubito'], ih: ['pisiforme', 'ganchoso', 'metacarpiano_5'],
  inervacion: 'Nervio cubital (C7-C8).',
  irrigacion: 'Arteria cubital (recurrente cubital posterior).',
  accion: 'Flexiona y aduce (desviación cubital) la muñeca.',
  sinergistas: ['flexor_radial_carpo', 'extensor_cubital_carpo'], antagonistas: ['extensor_radial_largo_carpo'],
  clinica: 'El nervio cubital pasa entre sus dos cabezas (túnel cubital): lugar de compresión frecuente.',
});
add('flexor_superficial_dedos', {
  nombre: 'Flexor superficial de los dedos', latin: 'M. flexor digitorum superficialis', region: 'miembro_superior', grupo: 'Antebrazo anterior — capa intermedia', capa: 2,
  origen: 'Cabeza humerocubital: epitróclea y apófisis coronoides. Cabeza radial: mitad superior del borde anterior del radio.',
  insercion: 'Caras laterales de las falanges medias de los dedos 2.º a 5.º (sus tendones se dividen para dejar pasar al flexor profundo).',
  oh: ['humero', 'cubito', 'radio'], ih: ['falange_media_mano_2', 'falange_media_mano_3', 'falange_media_mano_4', 'falange_media_mano_5'],
  inervacion: 'Nervio mediano (C7-T1).',
  irrigacion: 'Arterias cubital y radial.',
  accion: 'Flexiona las articulaciones interfalángicas proximales y metacarpofalángicas de los dedos 2-5; ayuda a flexionar la muñeca.',
  sinergistas: ['flexor_profundo_dedos', 'lumbricales'], antagonistas: ['extensor_dedos'],
  clinica: 'Se explora flexionando la IFP con los demás dedos sujetos en extensión. Sus tendones pasan por el túnel carpiano.',
});
add('flexor_profundo_dedos', {
  nombre: 'Flexor profundo de los dedos', latin: 'M. flexor digitorum profundus', region: 'miembro_superior', grupo: 'Antebrazo anterior — capa profunda', capa: 3,
  origen: 'Tres cuartos superiores de las caras anterior y medial del cúbito y membrana interósea.',
  insercion: 'Bases de las falanges distales de los dedos 2.º a 5.º (cara palmar).',
  oh: ['cubito'], ih: ['falange_distal_mano_2', 'falange_distal_mano_3', 'falange_distal_mano_4', 'falange_distal_mano_5'],
  inervacion: 'Porción medial (dedos 4-5): nervio cubital. Porción lateral (dedos 2-3): nervio interóseo anterior (mediano). (C8-T1).',
  irrigacion: 'Arterias cubital e interósea anterior.',
  accion: 'Único músculo que flexiona las articulaciones interfalángicas distales; también flexiona el resto de articulaciones de los dedos y la muñeca.',
  sinergistas: ['flexor_superficial_dedos'], antagonistas: ['extensor_dedos'],
  clinica: 'Su doble inervación explica la "mano en garra" cubital. Su tendón es el origen de los lumbricales. La avulsión de su tendón es el "dedo de jersey" (rugby).',
});
add('flexor_largo_pulgar', {
  nombre: 'Flexor largo del pulgar', latin: 'M. flexor pollicis longus', region: 'miembro_superior', grupo: 'Antebrazo anterior — capa profunda', capa: 3,
  origen: 'Cara anterior del radio y membrana interósea adyacente.',
  insercion: 'Base de la falange distal del pulgar (cara palmar).',
  oh: ['radio'], ih: ['falange_distal_mano_1'],
  inervacion: 'Nervio interóseo anterior (rama del mediano) (C7-C8).',
  irrigacion: 'Arteria interósea anterior.',
  accion: 'Flexiona la articulación interfalángica del pulgar (y también la MCF y CMC).',
  sinergistas: ['oponente_pulgar'], antagonistas: ['extensor_largo_pulgar'],
  clinica: 'La lesión del nervio interóseo anterior impide hacer el signo de "OK" (pinza en lágrima).',
});
add('pronador_cuadrado', {
  nombre: 'Pronador cuadrado', latin: 'M. pronator quadratus', region: 'miembro_superior', grupo: 'Antebrazo anterior — capa profunda', capa: 3,
  origen: 'Cuarto distal de la cara anterior del cúbito.',
  insercion: 'Cuarto distal de la cara anterior del radio.',
  oh: ['cubito'], ih: ['radio'],
  inervacion: 'Nervio interóseo anterior (mediano) (C8-T1).',
  irrigacion: 'Arteria interósea anterior.',
  accion: 'Principal pronador del antebrazo; mantiene unidos radio y cúbito distalmente.',
  sinergistas: ['pronador_redondo'], antagonistas: ['supinador', 'biceps_braquial'],
  clinica: 'Es el músculo más profundo de la parte distal del antebrazo anterior.',
});
add('braquiorradial', {
  nombre: 'Braquiorradial (supinador largo)', latin: 'M. brachioradialis', region: 'miembro_superior', grupo: 'Antebrazo posterior — grupo lateral (radial)', capa: 1,
  origen: 'Dos tercios proximales de la cresta supracondílea lateral del húmero.',
  insercion: 'Cara lateral del extremo distal del radio, proximal a la apófisis estiloides.',
  oh: ['humero'], ih: ['radio'],
  inervacion: 'Nervio radial (C5-C6).',
  irrigacion: 'Arteria recurrente radial.',
  accion: 'Flexiona el codo, sobre todo con el antebrazo en semipronación (posición "de beber una jarra"). Lleva el antebrazo a posición neutra.',
  sinergistas: ['biceps_braquial', 'braquial'], antagonistas: ['triceps_braquial'],
  clinica: 'Aunque está en el compartimento extensor (nervio radial), es flexor del codo. Reflejo braquiorradial (estilorradial, C5-C6).',
});
add('extensor_radial_largo_carpo', {
  nombre: 'Extensor radial largo del carpo', latin: 'M. extensor carpi radialis longus', region: 'miembro_superior', grupo: 'Antebrazo posterior — grupo lateral (radial)', capa: 1,
  origen: 'Tercio distal de la cresta supracondílea lateral del húmero.',
  insercion: 'Cara dorsal de la base del 2.º metacarpiano.',
  oh: ['humero'], ih: ['metacarpiano_2'],
  inervacion: 'Nervio radial (C6-C7).',
  irrigacion: 'Arteria recurrente radial y radial.',
  accion: 'Extiende y abduce (desviación radial) la muñeca. Fundamental para cerrar el puño con fuerza.',
  sinergistas: ['extensor_radial_corto_carpo', 'flexor_radial_carpo'], antagonistas: ['flexor_cubital_carpo'],
  clinica: 'La parálisis de los extensores (lesión del nervio radial) produce la "mano caída".',
});
add('extensor_radial_corto_carpo', {
  nombre: 'Extensor radial corto del carpo', latin: 'M. extensor carpi radialis brevis', region: 'miembro_superior', grupo: 'Antebrazo posterior — capa superficial', capa: 1,
  origen: 'Epicóndilo lateral del húmero (tendón extensor común).',
  insercion: 'Cara dorsal de la base del 3.er metacarpiano.',
  oh: ['humero'], ih: ['metacarpiano_3'],
  inervacion: 'Rama profunda del nervio radial (C7-C8).',
  irrigacion: 'Arteria radial.',
  accion: 'Extiende y abduce la muñeca.',
  sinergistas: ['extensor_radial_largo_carpo', 'extensor_cubital_carpo'], antagonistas: ['flexor_radial_carpo'],
  clinica: 'Es el tendón principalmente afectado en la epicondilitis lateral ("codo de tenista").',
});
add('extensor_dedos', {
  nombre: 'Extensor de los dedos (extensor común)', latin: 'M. extensor digitorum', region: 'miembro_superior', grupo: 'Antebrazo posterior — capa superficial', capa: 1,
  origen: 'Epicóndilo lateral del húmero (tendón extensor común).',
  insercion: 'Expansiones extensoras de los dedos 2.º a 5.º: falanges medias y distales (cara dorsal).',
  oh: ['humero'], ih: ['falange_media_mano_2', 'falange_media_mano_3', 'falange_media_mano_4', 'falange_media_mano_5', 'falange_distal_mano_2', 'falange_distal_mano_3', 'falange_distal_mano_4', 'falange_distal_mano_5'],
  inervacion: 'Nervio interóseo posterior (rama profunda del radial) (C7-C8).',
  irrigacion: 'Arteria interósea posterior.',
  accion: 'Extiende los dedos 2-5 (sobre todo en las metacarpofalángicas) y ayuda a extender la muñeca.',
  sinergistas: ['extensor_radial_corto_carpo'], antagonistas: ['flexor_superficial_dedos', 'flexor_profundo_dedos'],
  clinica: 'Sus tendones se unen por conexiones intertendinosas, por lo que es difícil extender el anular aisladamente.',
});
add('extensor_cubital_carpo', {
  nombre: 'Extensor cubital del carpo (cubital posterior)', latin: 'M. extensor carpi ulnaris', region: 'miembro_superior', grupo: 'Antebrazo posterior — capa superficial', capa: 1,
  origen: 'Epicóndilo lateral del húmero y borde posterior del cúbito.',
  insercion: 'Base del 5.º metacarpiano (cara dorsal medial).',
  oh: ['humero', 'cubito'], ih: ['metacarpiano_5'],
  inervacion: 'Nervio interóseo posterior (C7-C8).',
  irrigacion: 'Arteria interósea posterior.',
  accion: 'Extiende y aduce (desviación cubital) la muñeca.',
  sinergistas: ['flexor_cubital_carpo', 'extensor_radial_corto_carpo'], antagonistas: ['flexor_radial_carpo'],
  clinica: 'Su tendinitis o subluxación produce dolor en el borde cubital de la muñeca (tenistas).',
});
add('anconeo', {
  nombre: 'Ancóneo', latin: 'M. anconeus', region: 'miembro_superior', grupo: 'Antebrazo posterior — capa superficial', capa: 1,
  origen: 'Cara posterior del epicóndilo lateral del húmero.',
  insercion: 'Cara lateral del olécranon y parte superior de la cara posterior del cúbito.',
  oh: ['humero'], ih: ['cubito'],
  inervacion: 'Nervio radial (C7-T1).',
  irrigacion: 'Arteria interósea recurrente.',
  accion: 'Ayuda al tríceps a extender el codo; estabiliza la articulación y abduce el cúbito en la pronación.',
  sinergistas: ['triceps_braquial'], antagonistas: ['braquial'],
  clinica: 'Pequeño músculo triangular que se usa como colgajo local en el codo.',
});
add('supinador', {
  nombre: 'Supinador (supinador corto)', latin: 'M. supinator', region: 'miembro_superior', grupo: 'Antebrazo posterior — capa profunda', capa: 3,
  origen: 'Epicóndilo lateral, ligamentos colateral radial y anular, cresta del supinador del cúbito.',
  insercion: 'Caras lateral, posterior y anterior del tercio proximal del radio.',
  oh: ['humero', 'cubito'], ih: ['radio'],
  inervacion: 'Rama profunda del nervio radial (C7-C8), que lo atraviesa.',
  irrigacion: 'Arterias recurrente radial e interósea recurrente.',
  accion: 'Supina el antebrazo (en supinación lenta y sin resistencia, o con el codo extendido).',
  sinergistas: ['biceps_braquial'], antagonistas: ['pronador_redondo', 'pronador_cuadrado'],
  clinica: 'La arcada de Fröhse, en su borde proximal, puede comprimir el nervio interóseo posterior (síndrome del supinador).',
});
add('abductor_largo_pulgar', {
  nombre: 'Abductor largo del pulgar', latin: 'M. abductor pollicis longus', region: 'miembro_superior', grupo: 'Antebrazo posterior — capa profunda (músculos del pulgar)', capa: 2,
  origen: 'Caras posteriores del cúbito, del radio y de la membrana interósea.',
  insercion: 'Base del 1.er metacarpiano (cara lateral).',
  oh: ['cubito', 'radio'], ih: ['metacarpiano_1'],
  inervacion: 'Nervio interóseo posterior (C7-C8).',
  irrigacion: 'Arteria interósea posterior.',
  accion: 'Abduce y extiende el pulgar en la articulación carpometacarpiana; ayuda a la desviación radial de la muñeca.',
  sinergistas: ['extensor_corto_pulgar', 'abductor_corto_pulgar'], antagonistas: ['aductor_pulgar'],
  clinica: 'Junto al extensor corto del pulgar forma el 1.er compartimento extensor: su tenosinovitis es la enfermedad de De Quervain (prueba de Finkelstein).',
});
add('extensor_corto_pulgar', {
  nombre: 'Extensor corto del pulgar', latin: 'M. extensor pollicis brevis', region: 'miembro_superior', grupo: 'Antebrazo posterior — capa profunda (músculos del pulgar)', capa: 2,
  origen: 'Cara posterior del radio y membrana interósea.',
  insercion: 'Base de la falange proximal del pulgar (cara dorsal).',
  oh: ['radio'], ih: ['falange_proximal_mano_1'],
  inervacion: 'Nervio interóseo posterior (C7-C8).',
  irrigacion: 'Arteria interósea posterior.',
  accion: 'Extiende la falange proximal del pulgar y la articulación carpometacarpiana.',
  sinergistas: ['extensor_largo_pulgar', 'abductor_largo_pulgar'], antagonistas: ['flexor_largo_pulgar'],
  clinica: 'Forma el límite anterior (lateral) de la tabaquera anatómica.',
});
add('extensor_largo_pulgar', {
  nombre: 'Extensor largo del pulgar', latin: 'M. extensor pollicis longus', region: 'miembro_superior', grupo: 'Antebrazo posterior — capa profunda (músculos del pulgar)', capa: 2,
  origen: 'Tercio medio de la cara posterior del cúbito y membrana interósea.',
  insercion: 'Base de la falange distal del pulgar (cara dorsal).',
  oh: ['cubito'], ih: ['falange_distal_mano_1'],
  inervacion: 'Nervio interóseo posterior (C7-C8).',
  irrigacion: 'Arteria interósea posterior.',
  accion: 'Extiende todas las articulaciones del pulgar; ayuda a aducirlo y a extender la muñeca.',
  sinergistas: ['extensor_corto_pulgar'], antagonistas: ['flexor_largo_pulgar'],
  clinica: 'Su tendón rodea el tubérculo de Lister y puede romperse semanas después de una fractura de Colles. Forma el límite posterior de la tabaquera anatómica.',
});

// ================================ MANO ================================
add('abductor_corto_pulgar', {
  nombre: 'Abductor corto del pulgar', latin: 'M. abductor pollicis brevis', region: 'miembro_superior', grupo: 'Mano — eminencia tenar', capa: 1,
  origen: 'Retináculo flexor y tubérculos del escafoides y del trapecio.',
  insercion: 'Cara lateral de la base de la falange proximal del pulgar.',
  oh: ['escafoides', 'trapecio'], ih: ['falange_proximal_mano_1'],
  inervacion: 'Rama recurrente (motora) del nervio mediano (C8-T1).',
  irrigacion: 'Rama palmar superficial de la arteria radial.',
  accion: 'Abduce el pulgar (lo separa de la palma en dirección anterior); ayuda a la oposición.',
  sinergistas: ['abductor_largo_pulgar', 'oponente_pulgar'], antagonistas: ['aductor_pulgar'],
  clinica: 'Su atrofia es un signo del síndrome del túnel carpiano avanzado (compresión del nervio mediano).',
});
add('oponente_pulgar', {
  nombre: 'Oponente del pulgar', latin: 'M. opponens pollicis', region: 'miembro_superior', grupo: 'Mano — eminencia tenar', capa: 2,
  origen: 'Retináculo flexor y tubérculo del trapecio.',
  insercion: 'Todo el borde lateral del 1.er metacarpiano.',
  oh: ['trapecio'], ih: ['metacarpiano_1'],
  inervacion: 'Rama recurrente del nervio mediano (C8-T1).',
  irrigacion: 'Rama palmar superficial de la arteria radial.',
  accion: 'Opone el pulgar: lo flexiona y rota medialmente para tocar la punta de los demás dedos.',
  sinergistas: ['abductor_corto_pulgar', 'flexor_largo_pulgar'],
  clinica: 'La oposición es el movimiento más característico de la mano humana; su pérdida (lesión del mediano) produce la "mano de simio".',
});
add('aductor_pulgar', {
  nombre: 'Aductor del pulgar', latin: 'M. adductor pollicis', region: 'miembro_superior', grupo: 'Mano — compartimento aductor', capa: 2,
  origen: 'Cabeza oblicua: bases del 2.º y 3.er metacarpianos, grande y trapezoide. Cabeza transversa: cara anterior del cuerpo del 3.er metacarpiano.',
  insercion: 'Cara medial de la base de la falange proximal del pulgar (sesamoideo medial).',
  oh: ['metacarpiano_2', 'metacarpiano_3', 'grande', 'trapezoide'], ih: ['falange_proximal_mano_1'],
  inervacion: 'Rama profunda del nervio cubital (C8-T1).',
  irrigacion: 'Arco palmar profundo.',
  accion: 'Aduce el pulgar (lo acerca a la palma); da fuerza a la pinza.',
  sinergistas: ['oponente_pulgar'], antagonistas: ['abductor_corto_pulgar', 'abductor_largo_pulgar'],
  clinica: 'El signo de Froment (flexión compensadora del pulgar al sujetar un papel) indica parálisis del aductor por lesión del nervio cubital.',
});
add('abductor_menique', {
  nombre: 'Abductor del meñique', latin: 'M. abductor digiti minimi', region: 'miembro_superior', grupo: 'Mano — eminencia hipotenar', capa: 1,
  origen: 'Pisiforme y tendón del flexor cubital del carpo.',
  insercion: 'Cara medial de la base de la falange proximal del 5.º dedo.',
  oh: ['pisiforme'], ih: ['falange_proximal_mano_5'],
  inervacion: 'Rama profunda del nervio cubital (C8-T1).',
  irrigacion: 'Rama palmar profunda de la arteria cubital.',
  accion: 'Abduce el meñique y ayuda a flexionar su falange proximal.',
  sinergistas: ['interoseos_dorsales'],
  clinica: 'Se atrofia en lesiones del nervio cubital (canal de Guyon o codo).',
});
add('lumbricales', {
  nombre: 'Lumbricales de la mano', latin: 'Mm. lumbricales manus', region: 'miembro_superior', grupo: 'Mano — músculos cortos (palma)', capa: 2,
  origen: 'Tendones del flexor profundo de los dedos (en la palma).',
  insercion: 'Bordes laterales de las expansiones extensoras de los dedos 2.º a 5.º.',
  oh: [], ih: ['falange_proximal_mano_2', 'falange_proximal_mano_3', 'falange_proximal_mano_4', 'falange_proximal_mano_5'],
  inervacion: '1.º y 2.º: nervio mediano. 3.º y 4.º: rama profunda del nervio cubital.',
  irrigacion: 'Arcos palmares superficial y profundo.',
  accion: 'Flexionan las articulaciones metacarpofalángicas y extienden las interfalángicas (posición de "escribir" o "de lumbricales").',
  sinergistas: ['interoseos_dorsales'], antagonistas: ['flexor_profundo_dedos'],
  clinica: 'Son únicos por originarse en un tendón. Su parálisis (con los interóseos) produce la mano en garra.',
});
add('interoseos_dorsales', {
  nombre: 'Interóseos dorsales de la mano', latin: 'Mm. interossei dorsales manus', region: 'miembro_superior', grupo: 'Mano — músculos cortos (interóseos)', capa: 2,
  origen: 'Caras adyacentes de los cinco metacarpianos (músculos bipeniformes, 4 en total).',
  insercion: 'Bases de las falanges proximales y expansiones extensoras de los dedos 2.º-4.º.',
  oh: range('metacarpiano_', 1, 5), ih: ['falange_proximal_mano_2', 'falange_proximal_mano_3', 'falange_proximal_mano_4'],
  inervacion: 'Rama profunda del nervio cubital (C8-T1).',
  irrigacion: 'Arco palmar profundo y arterias metacarpianas dorsales.',
  accion: 'Abducen los dedos respecto al eje del 3.er dedo (DAB: Dorsales ABducen); flexionan las MCF y extienden las interfalángicas.',
  sinergistas: ['lumbricales', 'abductor_menique'],
  clinica: 'Se exploran pidiendo separar los dedos contra resistencia (nervio cubital). Su atrofia marca los espacios entre metacarpianos en el dorso de la mano.',
});

// ================================ CADERA ================================
add('psoas_mayor', {
  nombre: 'Psoas mayor', latin: 'M. psoas major', region: 'miembro_inferior', grupo: 'Cadera — iliopsoas (pared posterior del abdomen)', capa: 3,
  origen: 'Caras laterales de los cuerpos de T12-L5 y discos intervertebrales; apófisis transversas de L1-L5.',
  insercion: 'Trocánter menor del fémur (tendón común con el ilíaco).',
  oh: ['t12', 'l1', 'l2', 'l3', 'l4', 'l5'], ih: ['femur'],
  inervacion: 'Ramos anteriores de los nervios lumbares L1-L3.',
  irrigacion: 'Arterias lumbares, iliolumbar y circunfleja femoral medial.',
  accion: 'Con el ilíaco (iliopsoas) es el flexor más potente de la cadera. Flexiona el tronco sobre el muslo (sentarse desde decúbito) y lateralmente la columna lumbar.',
  sinergistas: ['iliaco', 'recto_femoral', 'sartorio', 'tensor_fascia_lata'], antagonistas: ['gluteo_mayor', 'biceps_femoral', 'semitendinoso'],
  clinica: 'El signo del psoas (dolor al extender la cadera) indica inflamación retroperitoneal (apendicitis retrocecal). Los abscesos del psoas descienden por su vaina hasta el muslo.',
});
add('iliaco', {
  nombre: 'Ilíaco', latin: 'M. iliacus', region: 'miembro_inferior', grupo: 'Cadera — iliopsoas', capa: 3,
  origen: 'Fosa ilíaca (dos tercios superiores), cresta ilíaca interna, ala del sacro y ligamentos sacroilíacos anteriores.',
  insercion: 'Tendón del psoas mayor y trocánter menor del fémur.',
  oh: ['coxal', 'sacro'], ih: ['femur'],
  inervacion: 'Nervio femoral (L2-L3).',
  irrigacion: 'Ramas ilíacas de la arteria iliolumbar y circunfleja ilíaca profunda.',
  accion: 'Flexiona la cadera y estabiliza la articulación coxofemoral (junto al psoas).',
  sinergistas: ['psoas_mayor', 'recto_femoral'], antagonistas: ['gluteo_mayor'],
  clinica: 'La contractura del iliopsoas produce una actitud en flexión de cadera (prueba de Thomas).',
});
add('gluteo_mayor', {
  nombre: 'Glúteo mayor', latin: 'M. gluteus maximus', region: 'miembro_inferior', grupo: 'Región glútea — capa superficial', capa: 1,
  origen: 'Cara glútea del ilion por detrás de la línea glútea posterior, cara dorsal del sacro y del cóccix, ligamento sacrotuberoso y fascia toracolumbar.',
  insercion: 'Tracto iliotibial (mayoría de las fibras) y tuberosidad glútea del fémur.',
  oh: ['coxal', 'sacro', 'coccix'], ih: ['femur'],
  inervacion: 'Nervio glúteo inferior (L5-S2).',
  irrigacion: 'Arterias glúteas inferior y superior.',
  accion: 'Principal extensor de la cadera (levantarse de una silla, subir escaleras, correr); rota lateralmente el muslo; estabiliza la rodilla en extensión vía tracto iliotibial.',
  sinergistas: ['biceps_femoral', 'semitendinoso', 'semimembranoso', 'aductor_mayor'], antagonistas: ['psoas_mayor', 'iliaco', 'recto_femoral'],
  clinica: 'Es el músculo más voluminoso del cuerpo. Las inyecciones intramusculares se ponen en el cuadrante superolateral de la nalga para evitar el nervio ciático.',
});
add('gluteo_medio', {
  nombre: 'Glúteo medio', latin: 'M. gluteus medius', region: 'miembro_inferior', grupo: 'Región glútea — capa intermedia', capa: 2,
  origen: 'Cara glútea del ilion entre las líneas glúteas anterior y posterior.',
  insercion: 'Cara lateral del trocánter mayor del fémur.',
  oh: ['coxal'], ih: ['femur'],
  inervacion: 'Nervio glúteo superior (L4-S1).',
  irrigacion: 'Arteria glútea superior.',
  accion: 'Abduce y rota medialmente el muslo; sobre todo, estabiliza la pelvis en el apoyo monopodal (evita que caiga la pelvis del lado opuesto al andar).',
  sinergistas: ['gluteo_menor', 'tensor_fascia_lata'], antagonistas: ['aductor_largo', 'aductor_mayor', 'gracil'],
  clinica: 'Su debilidad (lesión del nervio glúteo superior, displasia de cadera) produce el signo de Trendelenburg y la marcha "de pato".',
});
add('gluteo_menor', {
  nombre: 'Glúteo menor', latin: 'M. gluteus minimus', region: 'miembro_inferior', grupo: 'Región glútea — capa profunda', capa: 3,
  origen: 'Cara glútea del ilion entre las líneas glúteas anterior e inferior.',
  insercion: 'Cara anterior del trocánter mayor del fémur.',
  oh: ['coxal'], ih: ['femur'],
  inervacion: 'Nervio glúteo superior (L4-S1).',
  irrigacion: 'Arteria glútea superior.',
  accion: 'Abduce y rota medialmente el muslo; estabiliza la pelvis durante la marcha.',
  sinergistas: ['gluteo_medio', 'tensor_fascia_lata'], antagonistas: ['aductor_largo'],
  clinica: 'Las tendinopatías de los glúteos medio y menor causan el "síndrome doloroso del trocánter mayor".',
});
add('tensor_fascia_lata', {
  nombre: 'Tensor de la fascia lata', latin: 'M. tensor fasciae latae', region: 'miembro_inferior', grupo: 'Región glútea / muslo lateral', capa: 1,
  origen: 'Espina ilíaca anterosuperior (EIAS) y parte anterior de la cresta ilíaca.',
  insercion: 'Tracto iliotibial, que se inserta en el tubérculo de Gerdy (cóndilo lateral de la tibia).',
  oh: ['coxal'], ih: ['tibia'],
  inervacion: 'Nervio glúteo superior (L4-S1).',
  irrigacion: 'Arterias glútea superior y circunfleja femoral lateral.',
  accion: 'Abduce, flexiona y rota medialmente el muslo; tensa el tracto iliotibial y estabiliza la rodilla en extensión.',
  sinergistas: ['gluteo_medio', 'gluteo_menor', 'psoas_mayor'], antagonistas: ['aductor_largo'],
  clinica: 'La fricción del tracto iliotibial sobre el epicóndilo femoral lateral causa el "síndrome de la cintilla iliotibial" (rodilla del corredor).',
});
add('piriforme', {
  nombre: 'Piriforme (piramidal de la pelvis)', latin: 'M. piriformis', region: 'miembro_inferior', grupo: 'Región glútea — rotadores laterales', capa: 3,
  origen: 'Cara anterior (pélvica) del sacro (S2-S4) y ligamento sacrotuberoso.',
  insercion: 'Borde superior del trocánter mayor del fémur.',
  oh: ['sacro'], ih: ['femur'],
  inervacion: 'Nervio del piriforme (ramos de S1-S2).',
  irrigacion: 'Arterias glúteas superior e inferior.',
  accion: 'Rota lateralmente el muslo extendido y lo abduce cuando está flexionado; estabiliza la cabeza femoral.',
  sinergistas: ['obturador_interno', 'cuadrado_femoral', 'gluteo_mayor'], antagonistas: ['gluteo_menor', 'tensor_fascia_lata'],
  clinica: 'Es la llave de la región glútea: el nervio ciático sale por debajo de él. Su contractura puede comprimir el ciático (síndrome del piriforme).',
});
add('obturador_interno', {
  nombre: 'Obturador interno', latin: 'M. obturator internus', region: 'miembro_inferior', grupo: 'Región glútea — rotadores laterales', capa: 3,
  origen: 'Cara interna (pélvica) de la membrana obturatriz y huesos que rodean el agujero obturador.',
  insercion: 'Cara medial del trocánter mayor (fosa trocantérica), tras salir de la pelvis por el agujero ciático menor.',
  oh: ['coxal'], ih: ['femur'],
  inervacion: 'Nervio del obturador interno (L5-S2).',
  irrigacion: 'Arterias pudenda interna y obturatriz.',
  accion: 'Rota lateralmente el muslo extendido; lo abduce en flexión; estabiliza la cadera.',
  sinergistas: ['piriforme', 'cuadrado_femoral'],
  clinica: 'Su fascia forma el conducto pudendo (de Alcock), por donde pasan los vasos y nervio pudendos.',
});
add('cuadrado_femoral', {
  nombre: 'Cuadrado femoral (crural)', latin: 'M. quadratus femoris', region: 'miembro_inferior', grupo: 'Región glútea — rotadores laterales', capa: 3,
  origen: 'Borde lateral de la tuberosidad isquiática.',
  insercion: 'Tubérculo cuadrado de la cresta intertrocantérea del fémur.',
  oh: ['coxal'], ih: ['femur'],
  inervacion: 'Nervio del cuadrado femoral (L4-S1).',
  irrigacion: 'Arteria circunfleja femoral medial.',
  accion: 'Rota lateralmente el muslo y estabiliza la cabeza femoral.',
  sinergistas: ['piriforme', 'obturador_interno', 'gluteo_mayor'],
  clinica: 'Bajo él discurre la arteria circunfleja femoral medial, principal irrigación de la cabeza femoral.',
});

// ================================ MUSLO ================================
add('sartorio', {
  nombre: 'Sartorio', latin: 'M. sartorius', region: 'miembro_inferior', grupo: 'Muslo — compartimento anterior', capa: 1,
  origen: 'Espina ilíaca anterosuperior (EIAS).',
  insercion: 'Parte superior de la cara medial de la tibia (pata de ganso).',
  oh: ['coxal'], ih: ['tibia'],
  inervacion: 'Nervio femoral (L2-L3).',
  irrigacion: 'Arteria femoral (ramas musculares).',
  accion: 'Flexiona, abduce y rota lateralmente el muslo; flexiona la rodilla y rota medialmente la pierna (postura "del sastre", sentado con las piernas cruzadas).',
  sinergistas: ['gracil', 'semitendinoso', 'psoas_mayor'], antagonistas: ['gluteo_mayor'],
  clinica: 'Es el músculo más largo del cuerpo. Delimita el triángulo femoral (de Scarpa) y cubre el conducto aductor (de Hunter).',
});
add('recto_femoral', {
  nombre: 'Recto femoral (cuádriceps)', latin: 'M. rectus femoris', region: 'miembro_inferior', grupo: 'Muslo — compartimento anterior (cuádriceps femoral)', capa: 1,
  origen: 'Cabeza directa: espina ilíaca anteroinferior (EIAI). Cabeza refleja: surco por encima del acetábulo.',
  insercion: 'Base de la rótula y, mediante el ligamento rotuliano, tuberosidad de la tibia.',
  oh: ['coxal'], ih: ['rotula', 'tibia'],
  inervacion: 'Nervio femoral (L2-L4).',
  irrigacion: 'Arteria circunfleja femoral lateral.',
  accion: 'Extiende la rodilla y flexiona la cadera (único componente biarticular del cuádriceps). Clave para patear.',
  sinergistas: ['vasto_lateral', 'vasto_medial', 'vasto_intermedio', 'psoas_mayor'], antagonistas: ['biceps_femoral', 'semitendinoso', 'semimembranoso', 'gluteo_mayor'],
  clinica: 'Reflejo rotuliano (L3-L4). Se lesiona con frecuencia en deportes con sprints o patadas (fútbol).',
});
add('vasto_lateral', {
  nombre: 'Vasto lateral (cuádriceps)', latin: 'M. vastus lateralis', region: 'miembro_inferior', grupo: 'Muslo — compartimento anterior (cuádriceps femoral)', capa: 1,
  origen: 'Trocánter mayor, labio lateral de la línea áspera y línea intertrocantérea.',
  insercion: 'Base y borde lateral de la rótula y, vía ligamento rotuliano, tuberosidad tibial.',
  oh: ['femur'], ih: ['rotula', 'tibia'],
  inervacion: 'Nervio femoral (L2-L4).',
  irrigacion: 'Arteria circunfleja femoral lateral y femoral profunda.',
  accion: 'Extiende la rodilla.',
  sinergistas: ['recto_femoral', 'vasto_medial', 'vasto_intermedio'], antagonistas: ['biceps_femoral'],
  clinica: 'Es el mayor componente del cuádriceps. Lugar habitual de inyecciones intramusculares en lactantes y de biopsias musculares.',
});
add('vasto_medial', {
  nombre: 'Vasto medial (cuádriceps)', latin: 'M. vastus medialis', region: 'miembro_inferior', grupo: 'Muslo — compartimento anterior (cuádriceps femoral)', capa: 1,
  origen: 'Línea intertrocantérea y labio medial de la línea áspera.',
  insercion: 'Base y borde medial de la rótula y, vía ligamento rotuliano, tuberosidad tibial.',
  oh: ['femur'], ih: ['rotula', 'tibia'],
  inervacion: 'Nervio femoral (L2-L4).',
  irrigacion: 'Arterias femoral y femoral profunda.',
  accion: 'Extiende la rodilla; sus fibras oblicuas distales (VMO) estabilizan la rótula evitando su desplazamiento lateral.',
  sinergistas: ['recto_femoral', 'vasto_lateral', 'vasto_intermedio'], antagonistas: ['semitendinoso', 'semimembranoso'],
  clinica: 'Forma la "gota" medial sobre la rodilla. Se atrofia rápidamente tras lesiones o cirugías de rodilla; su debilidad favorece la luxación rotuliana.',
});
add('vasto_intermedio', {
  nombre: 'Vasto intermedio (cuádriceps)', latin: 'M. vastus intermedius', region: 'miembro_inferior', grupo: 'Muslo — compartimento anterior (cuádriceps femoral)', capa: 3,
  origen: 'Caras anterior y lateral de la diáfisis del fémur.',
  insercion: 'Base de la rótula (cara profunda del tendón del cuádriceps) y tuberosidad tibial.',
  oh: ['femur'], ih: ['rotula', 'tibia'],
  inervacion: 'Nervio femoral (L2-L4).',
  irrigacion: 'Arterias circunfleja femoral lateral y femoral profunda.',
  accion: 'Extiende la rodilla.',
  sinergistas: ['recto_femoral', 'vasto_lateral', 'vasto_medial'], antagonistas: ['biceps_femoral'],
  clinica: 'Está cubierto por el recto femoral. Bajo él, el músculo articular de la rodilla tensa la bolsa suprarrotuliana.',
});
add('pectineo', {
  nombre: 'Pectíneo', latin: 'M. pectineus', region: 'miembro_inferior', grupo: 'Muslo — compartimento medial (aductores)', capa: 2,
  origen: 'Línea pectínea (pecten) del pubis.',
  insercion: 'Línea pectínea del fémur, por debajo del trocánter menor.',
  oh: ['coxal'], ih: ['femur'],
  inervacion: 'Nervio femoral (L2-L3) y a veces nervio obturador.',
  irrigacion: 'Arterias circunfleja femoral medial y obturatriz.',
  accion: 'Aduce y flexiona el muslo.',
  sinergistas: ['aductor_largo', 'aductor_corto', 'psoas_mayor'], antagonistas: ['gluteo_medio'],
  clinica: 'Forma parte del suelo del triángulo femoral. Su doble inervación refleja su posición de transición entre compartimentos.',
});
add('aductor_largo', {
  nombre: 'Aductor largo (mediano)', latin: 'M. adductor longus', region: 'miembro_inferior', grupo: 'Muslo — compartimento medial (aductores)', capa: 1,
  origen: 'Cuerpo del pubis, por debajo de la cresta púbica.',
  insercion: 'Tercio medio del labio medial de la línea áspera del fémur.',
  oh: ['coxal'], ih: ['femur'],
  inervacion: 'Nervio obturador, rama anterior (L2-L4).',
  irrigacion: 'Arterias femoral profunda y obturatriz.',
  accion: 'Aduce el muslo; ayuda a flexionarlo y rotarlo.',
  sinergistas: ['aductor_corto', 'aductor_mayor', 'gracil', 'pectineo'], antagonistas: ['gluteo_medio', 'gluteo_menor', 'tensor_fascia_lata'],
  clinica: 'Es el aductor que más se lesiona ("pubalgia" o distensión inguinal en futbolistas). Forma el borde medial del triángulo femoral.',
});
add('aductor_corto', {
  nombre: 'Aductor corto (menor)', latin: 'M. adductor brevis', region: 'miembro_inferior', grupo: 'Muslo — compartimento medial (aductores)', capa: 2,
  origen: 'Cuerpo y rama inferior del pubis.',
  insercion: 'Línea pectínea y parte proximal de la línea áspera del fémur.',
  oh: ['coxal'], ih: ['femur'],
  inervacion: 'Nervio obturador (L2-L4).',
  irrigacion: 'Arterias femoral profunda, circunfleja femoral medial y obturatriz.',
  accion: 'Aduce el muslo y ayuda a flexionarlo.',
  sinergistas: ['aductor_largo', 'aductor_mayor'], antagonistas: ['gluteo_medio'],
  clinica: 'Las ramas anterior y posterior del nervio obturador discurren delante y detrás de él.',
});
add('aductor_mayor', {
  nombre: 'Aductor mayor', latin: 'M. adductor magnus', region: 'miembro_inferior', grupo: 'Muslo — compartimento medial (aductores)', capa: 2,
  origen: 'Porción aductora: rama inferior del pubis y rama del isquion. Porción isquiotibial: tuberosidad isquiática.',
  insercion: 'Porción aductora: tuberosidad glútea, línea áspera y línea supracondílea medial. Porción isquiotibial: tubérculo del aductor del fémur.',
  oh: ['coxal'], ih: ['femur'],
  inervacion: 'Porción aductora: nervio obturador (L2-L4). Porción isquiotibial: porción tibial del nervio ciático (L4).',
  irrigacion: 'Arterias femoral, femoral profunda y obturatriz.',
  accion: 'Aduce el muslo. La porción aductora lo flexiona y la isquiotibial lo extiende.',
  sinergistas: ['aductor_largo', 'aductor_corto', 'gracil'], antagonistas: ['gluteo_medio', 'gluteo_menor'],
  clinica: 'El hiato del aductor permite el paso de los vasos femorales a la fosa poplítea. Es el aductor más grande.',
});
add('gracil', {
  nombre: 'Grácil (recto interno)', latin: 'M. gracilis', region: 'miembro_inferior', grupo: 'Muslo — compartimento medial (aductores)', capa: 1,
  origen: 'Cuerpo y rama inferior del pubis.',
  insercion: 'Parte superior de la cara medial de la tibia (pata de ganso).',
  oh: ['coxal'], ih: ['tibia'],
  inervacion: 'Nervio obturador (L2-L3).',
  irrigacion: 'Arterias femoral profunda y circunfleja femoral medial.',
  accion: 'Aduce el muslo; flexiona la rodilla y rota medialmente la pierna.',
  sinergistas: ['sartorio', 'semitendinoso', 'aductor_largo'], antagonistas: ['gluteo_medio'],
  clinica: 'Es el aductor más superficial y el único biarticular. Se usa como injerto de tendón (ligamento cruzado anterior) o colgajo muscular.',
});
add('biceps_femoral', {
  nombre: 'Bíceps femoral (isquiotibial)', latin: 'M. biceps femoris', region: 'miembro_inferior', grupo: 'Muslo — compartimento posterior (isquiotibiales)', capa: 1,
  origen: 'Cabeza larga: tuberosidad isquiática. Cabeza corta: labio lateral de la línea áspera y línea supracondílea lateral del fémur.',
  insercion: 'Cara lateral de la cabeza del peroné (y cóndilo lateral de la tibia).',
  oh: ['coxal', 'femur'], ih: ['perone', 'tibia'],
  inervacion: 'Cabeza larga: porción tibial del nervio ciático (L5-S2). Cabeza corta: porción peronea común del ciático (L5-S2).',
  irrigacion: 'Arterias perforantes de la femoral profunda y glútea inferior.',
  accion: 'Flexiona la rodilla y rota lateralmente la pierna flexionada. La cabeza larga extiende la cadera.',
  sinergistas: ['semitendinoso', 'semimembranoso', 'gluteo_mayor'], antagonistas: ['recto_femoral', 'vasto_lateral'],
  clinica: 'Las roturas de isquiotibiales son muy frecuentes en velocistas. Su tendón es el límite superolateral de la fosa poplítea; el nervio peroneo común discurre medial a él.',
});
add('semitendinoso', {
  nombre: 'Semitendinoso (isquiotibial)', latin: 'M. semitendinosus', region: 'miembro_inferior', grupo: 'Muslo — compartimento posterior (isquiotibiales)', capa: 1,
  origen: 'Tuberosidad isquiática (tendón común con la cabeza larga del bíceps femoral).',
  insercion: 'Parte superior de la cara medial de la tibia (pata de ganso).',
  oh: ['coxal'], ih: ['tibia'],
  inervacion: 'Porción tibial del nervio ciático (L5-S2).',
  irrigacion: 'Arterias perforantes de la femoral profunda.',
  accion: 'Extiende la cadera, flexiona la rodilla y rota medialmente la pierna flexionada.',
  sinergistas: ['semimembranoso', 'biceps_femoral', 'gracil', 'sartorio'], antagonistas: ['recto_femoral', 'vasto_medial'],
  clinica: 'Su largo tendón se usa (junto al del grácil) como injerto para reconstruir el ligamento cruzado anterior.',
});
add('semimembranoso', {
  nombre: 'Semimembranoso (isquiotibial)', latin: 'M. semimembranosus', region: 'miembro_inferior', grupo: 'Muslo — compartimento posterior (isquiotibiales)', capa: 2,
  origen: 'Tuberosidad isquiática (impresión superolateral).',
  insercion: 'Cara posterior del cóndilo medial de la tibia; expansiones que forman el ligamento poplíteo oblicuo.',
  oh: ['coxal'], ih: ['tibia'],
  inervacion: 'Porción tibial del nervio ciático (L5-S2).',
  irrigacion: 'Arterias perforantes de la femoral profunda.',
  accion: 'Extiende la cadera, flexiona la rodilla y rota medialmente la pierna flexionada.',
  sinergistas: ['semitendinoso', 'biceps_femoral'], antagonistas: ['recto_femoral'],
  clinica: 'El quiste de Baker (poplíteo) suele originarse en la bolsa entre el semimembranoso y el gastrocnemio medial.',
});

// ================================ PIERNA ================================
add('tibial_anterior', {
  nombre: 'Tibial anterior', latin: 'M. tibialis anterior', region: 'miembro_inferior', grupo: 'Pierna — compartimento anterior', capa: 1,
  origen: 'Cóndilo lateral y mitad superior de la cara lateral de la tibia; membrana interósea.',
  insercion: 'Caras medial e inferior del cuneiforme medial y base del 1.er metatarsiano.',
  oh: ['tibia'], ih: ['cuneiforme_medial', 'metatarsiano_1'],
  inervacion: 'Nervio peroneo profundo (L4-L5).',
  irrigacion: 'Arteria tibial anterior.',
  accion: 'Flexiona dorsalmente el tobillo e invierte el pie; sostiene el arco longitudinal medial.',
  sinergistas: ['extensor_largo_dedos', 'extensor_largo_hallux', 'tibial_posterior'], antagonistas: ['gastrocnemio', 'soleo', 'peroneo_largo'],
  clinica: 'Su parálisis (lesión del nervio peroneo) produce "pie caído" y marcha en estepaje. Afectado en el síndrome compartimental anterior y en las "periostitis" del corredor.',
});
add('extensor_largo_dedos', {
  nombre: 'Extensor largo de los dedos', latin: 'M. extensor digitorum longus', region: 'miembro_inferior', grupo: 'Pierna — compartimento anterior', capa: 1,
  origen: 'Cóndilo lateral de la tibia, tres cuartos superiores de la cara medial del peroné y membrana interósea.',
  insercion: 'Falanges medias y distales de los dedos 2.º a 5.º (expansiones extensoras).',
  oh: ['tibia', 'perone'], ih: ['falange_media_pie_2', 'falange_media_pie_3', 'falange_media_pie_4', 'falange_media_pie_5', 'falange_distal_pie_2', 'falange_distal_pie_3', 'falange_distal_pie_4', 'falange_distal_pie_5'],
  inervacion: 'Nervio peroneo profundo (L5-S1).',
  irrigacion: 'Arteria tibial anterior.',
  accion: 'Extiende los dedos 2-5 y flexiona dorsalmente el tobillo; evierte el pie.',
  sinergistas: ['tibial_anterior', 'extensor_corto_dedos'], antagonistas: ['flexor_largo_dedos', 'flexor_corto_dedos'],
  clinica: 'Su porción inferior (tercer peroneo, inconstante) se inserta en el 5.º metatarsiano.',
});
add('extensor_largo_hallux', {
  nombre: 'Extensor largo del dedo gordo', latin: 'M. extensor hallucis longus', region: 'miembro_inferior', grupo: 'Pierna — compartimento anterior', capa: 2,
  origen: 'Parte media de la cara medial del peroné y membrana interósea.',
  insercion: 'Base de la falange distal del dedo gordo (cara dorsal).',
  oh: ['perone'], ih: ['falange_distal_pie_1'],
  inervacion: 'Nervio peroneo profundo (L5-S1).',
  irrigacion: 'Arteria tibial anterior.',
  accion: 'Extiende el dedo gordo y flexiona dorsalmente el tobillo.',
  sinergistas: ['tibial_anterior', 'extensor_largo_dedos'], antagonistas: ['flexor_largo_hallux'],
  clinica: 'La fuerza de extensión del dedo gordo explora la raíz L5 (hernia discal L4-L5). El pulso pedio se palpa lateral a su tendón.',
});
add('peroneo_largo', {
  nombre: 'Peroneo (fibular) largo', latin: 'M. fibularis (peroneus) longus', region: 'miembro_inferior', grupo: 'Pierna — compartimento lateral', capa: 1,
  origen: 'Cabeza y dos tercios superiores de la cara lateral del peroné.',
  insercion: 'Base del 1.er metatarsiano y cuneiforme medial (tras cruzar la planta por el surco del cuboides).',
  oh: ['perone', 'tibia'], ih: ['metatarsiano_1', 'cuneiforme_medial'],
  inervacion: 'Nervio peroneo superficial (L5-S2).',
  irrigacion: 'Arterias tibial anterior y peronea.',
  accion: 'Evierte el pie y flexiona plantarmente el tobillo; sostiene los arcos longitudinal lateral y transverso.',
  sinergistas: ['peroneo_corto', 'gastrocnemio'], antagonistas: ['tibial_anterior', 'tibial_posterior'],
  clinica: 'Junto al tibial anterior forma un "estribo" que sostiene el pie. Sus tendones pasan por detrás del maléolo lateral y pueden luxarse.',
});
add('peroneo_corto', {
  nombre: 'Peroneo (fibular) corto', latin: 'M. fibularis (peroneus) brevis', region: 'miembro_inferior', grupo: 'Pierna — compartimento lateral', capa: 2,
  origen: 'Dos tercios inferiores de la cara lateral del peroné.',
  insercion: 'Tuberosidad de la base del 5.º metatarsiano.',
  oh: ['perone'], ih: ['metatarsiano_5'],
  inervacion: 'Nervio peroneo superficial (L5-S2).',
  irrigacion: 'Arteria peronea.',
  accion: 'Evierte el pie y ayuda a la flexión plantar; protege del esguince en inversión.',
  sinergistas: ['peroneo_largo'], antagonistas: ['tibial_anterior', 'tibial_posterior'],
  clinica: 'En los esguinces de tobillo por inversión puede arrancar la base del 5.º metatarsiano (fractura por avulsión).',
});
add('gastrocnemio', {
  nombre: 'Gastrocnemio (gemelos)', latin: 'M. gastrocnemius', region: 'miembro_inferior', grupo: 'Pierna — compartimento posterior superficial (tríceps sural)', capa: 1,
  origen: 'Cabeza medial: cara poplítea del fémur por encima del cóndilo medial. Cabeza lateral: cara lateral del cóndilo lateral del fémur.',
  insercion: 'Cara posterior del calcáneo mediante el tendón calcáneo (de Aquiles).',
  oh: ['femur'], ih: ['calcaneo'],
  inervacion: 'Nervio tibial (S1-S2).',
  irrigacion: 'Arterias surales (de la poplítea).',
  accion: 'Flexiona plantarmente el tobillo (ponerse de puntillas, saltar, correr) y flexiona la rodilla.',
  sinergistas: ['soleo', 'plantar', 'peroneo_largo', 'tibial_posterior'], antagonistas: ['tibial_anterior', 'extensor_largo_dedos'],
  clinica: 'Reflejo aquíleo (S1). La rotura del tendón de Aquiles (prueba de Thompson positiva) es frecuente en deportistas de mediana edad. "Pierna de tenista": rotura de la cabeza medial.',
});
add('soleo', {
  nombre: 'Sóleo (tríceps sural)', latin: 'M. soleus', region: 'miembro_inferior', grupo: 'Pierna — compartimento posterior superficial (tríceps sural)', capa: 2,
  origen: 'Cara posterior de la cabeza y cuello del peroné, línea del sóleo y borde medial de la tibia, y arco tendinoso del sóleo.',
  insercion: 'Cara posterior del calcáneo mediante el tendón calcáneo (de Aquiles).',
  oh: ['tibia', 'perone'], ih: ['calcaneo'],
  inervacion: 'Nervio tibial (S1-S2).',
  irrigacion: 'Arterias poplítea, tibial posterior y peronea.',
  accion: 'Flexiona plantarmente el tobillo; mantiene la postura en bipedestación (evita que el cuerpo caiga hacia delante).',
  sinergistas: ['gastrocnemio', 'plantar'], antagonistas: ['tibial_anterior'],
  clinica: 'Es el "segundo corazón": su contracción bombea la sangre venosa de la pierna (bomba muscular). Sus venas son un lugar frecuente de trombosis venosa profunda.',
});
add('plantar', {
  nombre: 'Plantar (delgado plantar)', latin: 'M. plantaris', region: 'miembro_inferior', grupo: 'Pierna — compartimento posterior superficial', capa: 2,
  origen: 'Extremo inferior de la línea supracondílea lateral del fémur.',
  insercion: 'Cara posterior del calcáneo (con el tendón de Aquiles o medial a él).',
  oh: ['femur'], ih: ['calcaneo'],
  inervacion: 'Nervio tibial (S1-S2).',
  irrigacion: 'Arteria poplítea (surales).',
  accion: 'Ayuda débilmente al gastrocnemio a flexionar el tobillo y la rodilla.',
  sinergistas: ['gastrocnemio', 'soleo'],
  clinica: 'Falta en un 6-8 % de las personas. Su tendón largo y fino se usa como injerto.',
});
add('popliteo', {
  nombre: 'Poplíteo', latin: 'M. popliteus', region: 'miembro_inferior', grupo: 'Pierna — compartimento posterior profundo', capa: 3,
  origen: 'Cara lateral del cóndilo lateral del fémur y menisco lateral.',
  insercion: 'Cara posterior de la tibia, por encima de la línea del sóleo.',
  oh: ['femur'], ih: ['tibia'],
  inervacion: 'Nervio tibial (L4-S1).',
  irrigacion: 'Arterias geniculares inferiores (de la poplítea).',
  accion: 'Desbloquea la rodilla extendida (rota lateralmente el fémur sobre la tibia fija) para iniciar la flexión; flexiona débilmente la rodilla.',
  sinergistas: ['semitendinoso', 'semimembranoso'],
  clinica: 'Es "la llave" de la rodilla. Tracciona del menisco lateral para protegerlo durante la flexión.',
});
add('tibial_posterior', {
  nombre: 'Tibial posterior', latin: 'M. tibialis posterior', region: 'miembro_inferior', grupo: 'Pierna — compartimento posterior profundo', capa: 3,
  origen: 'Membrana interósea y caras posteriores de la tibia y del peroné.',
  insercion: 'Tuberosidad del navicular, cuneiformes, cuboides y bases de los metatarsianos 2.º-4.º.',
  oh: ['tibia', 'perone'], ih: ['navicular', 'cuneiforme_medial', 'cuneiforme_intermedio', 'cuneiforme_lateral', 'cuboides', 'metatarsiano_2', 'metatarsiano_3', 'metatarsiano_4'],
  inervacion: 'Nervio tibial (L4-L5).',
  irrigacion: 'Arteria peronea y tibial posterior.',
  accion: 'Invierte el pie y flexiona plantarmente el tobillo; principal soporte dinámico del arco longitudinal medial.',
  sinergistas: ['tibial_anterior', 'gastrocnemio'], antagonistas: ['peroneo_largo', 'peroneo_corto'],
  clinica: 'Su disfunción o rotura es la causa más frecuente de pie plano adquirido del adulto. Su tendón pasa por detrás del maléolo medial ("Tom, Dick and Harry": Tibial, flexor Digitorum, arteria, nervio, flexor Hallucis).',
});
add('flexor_largo_dedos', {
  nombre: 'Flexor largo de los dedos', latin: 'M. flexor digitorum longus', region: 'miembro_inferior', grupo: 'Pierna — compartimento posterior profundo', capa: 3,
  origen: 'Cara posterior de la tibia, por debajo de la línea del sóleo.',
  insercion: 'Bases de las falanges distales de los dedos 2.º a 5.º (cara plantar).',
  oh: ['tibia'], ih: ['falange_distal_pie_2', 'falange_distal_pie_3', 'falange_distal_pie_4', 'falange_distal_pie_5'],
  inervacion: 'Nervio tibial (S2-S3).',
  irrigacion: 'Arteria tibial posterior.',
  accion: 'Flexiona los dedos 2-5 (agarre del suelo al caminar); ayuda a la flexión plantar e inversión del pie.',
  sinergistas: ['flexor_corto_dedos', 'tibial_posterior'], antagonistas: ['extensor_largo_dedos'],
  clinica: 'Su tendón cruza superficialmente al del tibial posterior en la pierna distal ("quiasma crural").',
});
add('flexor_largo_hallux', {
  nombre: 'Flexor largo del dedo gordo', latin: 'M. flexor hallucis longus', region: 'miembro_inferior', grupo: 'Pierna — compartimento posterior profundo', capa: 3,
  origen: 'Dos tercios inferiores de la cara posterior del peroné y membrana interósea.',
  insercion: 'Base de la falange distal del dedo gordo (cara plantar).',
  oh: ['perone'], ih: ['falange_distal_pie_1'],
  inervacion: 'Nervio tibial (S2-S3).',
  irrigacion: 'Arteria peronea.',
  accion: 'Flexiona el dedo gordo (impulso final o "despegue" de la marcha); ayuda a la flexión plantar y sostiene el arco medial.',
  sinergistas: ['flexor_largo_dedos', 'gastrocnemio'], antagonistas: ['extensor_largo_hallux'],
  clinica: 'Su tendinitis es típica de bailarines de ballet (posición en punta). Pasa por un surco en el astrágalo y bajo el sustentáculo del calcáneo.',
});

// ================================ PIE ================================
add('extensor_corto_dedos', {
  nombre: 'Extensor corto de los dedos (pedio)', latin: 'M. extensor digitorum brevis', region: 'miembro_inferior', grupo: 'Pie — dorso', capa: 1,
  origen: 'Cara superolateral del calcáneo y retináculo extensor inferior.',
  insercion: 'Tendones del extensor largo de los dedos 2-4 y base de la falange proximal del dedo gordo (extensor corto del hallux).',
  oh: ['calcaneo'], ih: ['falange_proximal_pie_1', 'falange_proximal_pie_2', 'falange_proximal_pie_3', 'falange_proximal_pie_4'],
  inervacion: 'Nervio peroneo profundo (L5-S1).',
  irrigacion: 'Arteria dorsal del pie (pedia) y tarsiana lateral.',
  accion: 'Ayuda a extender los dedos 1-4.',
  sinergistas: ['extensor_largo_dedos', 'extensor_largo_hallux'], antagonistas: ['flexor_corto_dedos'],
  clinica: 'Es el único músculo del dorso del pie; forma una pequeña prominencia blanda delante del maléolo lateral que no debe confundirse con edema.',
});
add('abductor_hallux', {
  nombre: 'Abductor del dedo gordo', latin: 'M. abductor hallucis', region: 'miembro_inferior', grupo: 'Pie — planta, 1.ª capa', capa: 1,
  origen: 'Apófisis medial de la tuberosidad del calcáneo, retináculo flexor y aponeurosis plantar.',
  insercion: 'Cara medial de la base de la falange proximal del dedo gordo.',
  oh: ['calcaneo'], ih: ['falange_proximal_pie_1'],
  inervacion: 'Nervio plantar medial (S2-S3).',
  irrigacion: 'Arteria plantar medial.',
  accion: 'Abduce y flexiona el dedo gordo; sostiene el arco longitudinal medial.',
  sinergistas: ['flexor_largo_hallux'],
  clinica: 'Bajo él discurren los vasos y nervios plantares (túnel del tarso).',
});
add('flexor_corto_dedos', {
  nombre: 'Flexor corto de los dedos', latin: 'M. flexor digitorum brevis', region: 'miembro_inferior', grupo: 'Pie — planta, 1.ª capa', capa: 1,
  origen: 'Apófisis medial de la tuberosidad del calcáneo y aponeurosis plantar.',
  insercion: 'Ambos lados de las falanges medias de los dedos 2.º a 5.º.',
  oh: ['calcaneo'], ih: ['falange_media_pie_2', 'falange_media_pie_3', 'falange_media_pie_4', 'falange_media_pie_5'],
  inervacion: 'Nervio plantar medial (S2-S3).',
  irrigacion: 'Arterias plantares medial y lateral.',
  accion: 'Flexiona los dedos 2-5 (articulaciones interfalángicas proximales); sostiene los arcos del pie.',
  sinergistas: ['flexor_largo_dedos'], antagonistas: ['extensor_largo_dedos', 'extensor_corto_dedos'],
  clinica: 'Se sitúa justo por encima de la aponeurosis plantar (fascitis plantar).',
});
add('abductor_menique_pie', {
  nombre: 'Abductor del 5.º dedo del pie', latin: 'M. abductor digiti minimi pedis', region: 'miembro_inferior', grupo: 'Pie — planta, 1.ª capa', capa: 1,
  origen: 'Apófisis medial y lateral de la tuberosidad del calcáneo y aponeurosis plantar.',
  insercion: 'Cara lateral de la base de la falange proximal del 5.º dedo.',
  oh: ['calcaneo'], ih: ['falange_proximal_pie_5'],
  inervacion: 'Nervio plantar lateral (S2-S3).',
  irrigacion: 'Arteria plantar lateral.',
  accion: 'Abduce y flexiona el 5.º dedo; sostiene el arco lateral.',
  sinergistas: ['peroneo_corto'],
  clinica: 'El atrapamiento de la primera rama del nervio plantar lateral (nervio de Baxter) causa dolor en el talón.',
});

export const MUSCLES = M;
