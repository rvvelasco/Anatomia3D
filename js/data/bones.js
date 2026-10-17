// Base de datos de huesos. Las inserciones musculares de cada hueso se calculan
// automáticamente a partir de js/data/muscles.js.
// articulaciones: [idHueso, 'nombre de la articulación (tipo)']

const B = {};

// ============================ CRÁNEO Y CARA ============================
B.frontal = {
  nombre: 'Hueso frontal', latin: 'Os frontale', region: 'cabeza', clase: 'Plano (neurocráneo)', bilateral: false,
  descripcion: 'Forma la frente, el techo de las órbitas y la parte anterior de la bóveda craneal. Contiene los senos frontales.',
  partes: ['Escama frontal', 'Arcos superciliares', 'Glabela', 'Bordes y agujeros (escotaduras) supraorbitarios', 'Porción orbitaria (techo de la órbita)', 'Senos frontales', 'Apófisis cigomática del frontal', 'Espina nasal'],
  articulaciones: [['parietal', 'Sutura coronal'], ['esfenoides', 'Sutura esfenofrontal'], ['nasal', 'Sutura frontonasal'], ['maxilar', 'Sutura frontomaxilar'], ['cigomatico', 'Sutura frontocigomática']],
  clinica: 'El punto bregma (unión de sutura coronal y sagital) corresponde a la fontanela anterior del recién nacido, que se cierra hacia los 18-24 meses. La sinusitis frontal produce dolor sobre la frente.',
};
B.parietal = {
  nombre: 'Hueso parietal', latin: 'Os parietale', region: 'cabeza', clase: 'Plano (neurocráneo)', bilateral: true,
  descripcion: 'Par de huesos cuadriláteros que forman la mayor parte del techo y las paredes laterales del cráneo.',
  partes: ['Eminencia (tuber) parietal', 'Líneas temporales superior e inferior', 'Agujero parietal', 'Surco del seno sagital superior', 'Surcos de la arteria meníngea media (cara interna)'],
  articulaciones: [['parietal', 'Sutura sagital (con el contralateral)'], ['frontal', 'Sutura coronal'], ['occipital', 'Sutura lambdoidea'], ['temporal', 'Sutura escamosa'], ['esfenoides', 'Sutura esfenoparietal']],
  clinica: 'El pterion (unión de frontal, parietal, temporal y esfenoides) es la zona más delgada del cráneo; bajo él pasa la arteria meníngea media, cuya rotura provoca un hematoma epidural.',
};
B.temporal = {
  nombre: 'Hueso temporal', latin: 'Os temporale', region: 'cabeza', clase: 'Irregular (neurocráneo)', bilateral: true,
  descripcion: 'Forma la parte inferolateral del cráneo. Aloja los órganos del oído medio e interno y participa en la articulación temporomandibular.',
  partes: ['Porción escamosa', 'Apófisis cigomática', 'Fosa mandibular y tubérculo articular', 'Porción petrosa (peñasco)', 'Apófisis mastoides', 'Conducto auditivo externo', 'Apófisis estiloides', 'Agujero estilomastoideo'],
  articulaciones: [['mandibula', 'Articulación temporomandibular (sinovial bicondílea)'], ['parietal', 'Sutura escamosa'], ['occipital', 'Sutura occipitomastoidea'], ['esfenoides', 'Sutura esfenoescamosa'], ['cigomatico', 'Sutura temporocigomática']],
  clinica: 'La mastoiditis es una complicación de la otitis media. Las fracturas del peñasco pueden producir otorragia, otolicuorrea y parálisis facial (el nervio facial recorre el conducto facial).',
};
B.occipital = {
  nombre: 'Hueso occipital', latin: 'Os occipitale', region: 'cabeza', clase: 'Plano/irregular (neurocráneo)', bilateral: false,
  descripcion: 'Forma la parte posterior e inferior del cráneo. Presenta el agujero magno, por donde el encéfalo se continúa con la médula espinal.',
  partes: ['Escama occipital', 'Protuberancia occipital externa (inion)', 'Líneas nucales suprema, superior e inferior', 'Agujero magno (foramen magnum)', 'Cóndilos occipitales', 'Conducto del nervio hipogloso', 'Porción basilar (clivus)'],
  articulaciones: [['c1', 'Articulación atlantooccipital (sinovial elipsoidea)'], ['parietal', 'Sutura lambdoidea'], ['temporal', 'Sutura occipitomastoidea'], ['esfenoides', 'Sincondrosis esfenooccipital']],
  clinica: 'La herniación de las amígdalas cerebelosas a través del agujero magno (malformación de Chiari o hipertensión intracraneal) puede comprimir el tronco encefálico.',
};
B.esfenoides = {
  nombre: 'Hueso esfenoides', latin: 'Os sphenoidale', region: 'cabeza', clase: 'Irregular (neurocráneo)', bilateral: false,
  descripcion: 'Hueso impar con forma de mariposa situado en el centro de la base del cráneo. Articula con todos los huesos del neurocráneo. En el modelo se ven sus alas mayores en las sienes y su cuerpo en la base.',
  partes: ['Cuerpo (seno esfenoidal)', 'Silla turca (aloja la hipófisis)', 'Alas mayores', 'Alas menores', 'Apófisis pterigoides (láminas medial y lateral)', 'Conducto óptico', 'Fisura orbitaria superior', 'Agujeros redondo, oval y espinoso'],
  articulaciones: [['frontal', 'Sutura esfenofrontal'], ['parietal', 'Sutura esfenoparietal'], ['temporal', 'Sutura esfenoescamosa'], ['occipital', 'Sincondrosis esfenooccipital'], ['cigomatico', 'Sutura esfenocigomática']],
  clinica: 'Los adenomas de hipófisis crecen desde la silla turca y pueden comprimir el quiasma óptico (hemianopsia bitemporal). Se accede a ellos por vía transesfenoidal.',
};
B.nasal = {
  nombre: 'Hueso nasal', latin: 'Os nasale', region: 'cabeza', clase: 'Plano (viscerocráneo)', bilateral: true,
  descripcion: 'Pequeños huesos rectangulares que forman el puente (dorso) de la nariz.',
  partes: ['Borde superior (sutura frontonasal)', 'Borde inferior (unión al cartílago nasal)', 'Agujero vascular'],
  articulaciones: [['nasal', 'Sutura internasal'], ['frontal', 'Sutura frontonasal'], ['maxilar', 'Sutura nasomaxilar']],
  clinica: 'Son los huesos de la cara que se fracturan con más frecuencia.',
};
B.maxilar = {
  nombre: 'Maxilar', latin: 'Maxilla', region: 'cabeza', clase: 'Irregular neumático (viscerocráneo)', bilateral: true,
  descripcion: 'Forma el maxilar superior: aloja los dientes superiores, el suelo de la órbita, parte del paladar duro y las paredes de la cavidad nasal. Contiene el seno maxilar, el mayor de los senos paranasales.',
  partes: ['Cuerpo (seno maxilar)', 'Apófisis frontal', 'Apófisis cigomática', 'Apófisis alveolar (alvéolos dentarios)', 'Apófisis palatina', 'Agujero infraorbitario', 'Espina nasal anterior'],
  articulaciones: [['maxilar', 'Sutura intermaxilar'], ['frontal', 'Sutura frontomaxilar'], ['nasal', 'Sutura nasomaxilar'], ['cigomatico', 'Sutura cigomaticomaxilar']],
  clinica: 'Las fracturas de Le Fort (I, II y III) clasifican las fracturas del tercio medio facial. Las raíces de los molares superiores están muy próximas al seno maxilar.',
};
B.cigomatico = {
  nombre: 'Hueso cigomático (malar)', latin: 'Os zygomaticum', region: 'cabeza', clase: 'Irregular (viscerocráneo)', bilateral: true,
  descripcion: 'Forma el pómulo y la pared lateral de la órbita. Junto con la apófisis cigomática del temporal forma el arco cigomático.',
  partes: ['Cara lateral (malar)', 'Apófisis frontal', 'Apófisis temporal', 'Agujero cigomaticofacial'],
  articulaciones: [['frontal', 'Sutura frontocigomática'], ['temporal', 'Sutura temporocigomática'], ['maxilar', 'Sutura cigomaticomaxilar'], ['esfenoides', 'Sutura esfenocigomática']],
  clinica: 'La fractura del complejo cigomático (en "trípode") produce aplanamiento del pómulo y puede atrapar el músculo masetero o el temporal, limitando la apertura bucal.',
};
B.mandibula = {
  nombre: 'Mandíbula', latin: 'Mandibula', region: 'cabeza', clase: 'Irregular (viscerocráneo)', bilateral: false,
  descripcion: 'El hueso más grande y fuerte de la cara y el único móvil del cráneo. Aloja los dientes inferiores.',
  partes: ['Cuerpo', 'Sínfisis y protuberancia mentoniana', 'Agujero mentoniano', 'Rama', 'Ángulo mandibular (gonion)', 'Apófisis coronoides', 'Cóndilo (cabeza y cuello)', 'Escotadura mandibular', 'Agujero mandibular y língula', 'Línea milohioidea', 'Espinas mentonianas'],
  articulaciones: [['temporal', 'Articulación temporomandibular (ATM), sinovial bicondílea con disco articular']],
  clinica: 'Las fracturas suelen ser dobles (forma de anillo con el cráneo). La luxación anterior de la ATM bloquea la boca abierta. El nervio alveolar inferior entra por el agujero mandibular (bloqueo dental).',
};
B.hioides = {
  nombre: 'Hueso hioides', latin: 'Os hyoideum', region: 'cuello', clase: 'Irregular', bilateral: false,
  descripcion: 'Hueso en forma de U situado en el cuello a la altura de C3. Es el único hueso del cuerpo que no se articula con ningún otro: está suspendido por músculos y ligamentos (ligamento estilohioideo).',
  partes: ['Cuerpo', 'Astas mayores', 'Astas menores'],
  articulaciones: [],
  clinica: 'Su fractura es típica de la estrangulación manual. Sirve de anclaje a la lengua y a los músculos supra e infrahioideos que participan en la deglución.',
};

// ============================ COLUMNA ============================
const VERT_INFO = {
  c: { reg: 'Cervical', lat: 'Vertebra cervicalis', region: 'cuello', d: 'Vértebra cervical: cuerpo pequeño y ancho, agujero vertebral grande y triangular, apófisis transversas con agujero transverso (por donde pasa la arteria vertebral) y apófisis espinosa corta y bífida.' },
  t: { reg: 'Torácica', lat: 'Vertebra thoracica', region: 'torax', d: 'Vértebra torácica: cuerpo en forma de corazón con fositas costales para las cabezas de las costillas, apófisis transversas con fositas para los tubérculos costales y apófisis espinosa larga e inclinada hacia abajo.' },
  l: { reg: 'Lumbar', lat: 'Vertebra lumbalis', region: 'abdomen', d: 'Vértebra lumbar: la más robusta, con cuerpo grande en forma de riñón, apófisis espinosa cuadrilátera horizontal y apófisis mamilares y accesorias. Soporta la mayor carga de la columna.' },
};
const VERT_EXTRA = {
  c1: { nombre: 'Atlas (C1)', descripcion: 'Primera vértebra cervical. No tiene cuerpo ni apófisis espinosa: es un anillo formado por un arco anterior, un arco posterior y dos masas laterales que sostienen el cráneo.', partes: ['Arco anterior y tubérculo anterior', 'Arco posterior y tubérculo posterior', 'Masas laterales', 'Carillas articulares superiores (para los cóndilos occipitales)', 'Fosita del diente', 'Surco de la arteria vertebral', 'Agujeros transversos'], clinica: 'La fractura de Jefferson (estallido del atlas) se produce por carga axial (p. ej., zambullidas). La articulación atlantooccipital permite el movimiento de "sí".' },
  c2: { nombre: 'Axis (C2)', descripcion: 'Segunda vértebra cervical. Su característica es la apófisis odontoides (diente), que actúa como pivote sobre el que gira el atlas.', partes: ['Diente (apófisis odontoides)', 'Cuerpo', 'Carillas articulares superiores', 'Apófisis espinosa grande y bífida', 'Agujeros transversos'], clinica: 'Las fracturas de la odontoides y la "fractura del ahorcado" (espondilolistesis traumática de C2) son lesiones graves. La articulación atlantoaxial permite el movimiento de "no".' },
  c7: { nombre: 'Vértebra prominente (C7)', descripcion: 'Séptima vértebra cervical; su apófisis espinosa es larga, no bífida y se palpa fácilmente en la base del cuello, por lo que se usa como referencia para contar vértebras.', clinica: 'Referencia de superficie: al flexionar el cuello es la apófisis espinosa más saliente. Sus agujeros transversos suelen no contener la arteria vertebral.' },
  t1: { clinica: 'Tiene una fosita costal completa para la 1.ª costilla y una semifosita para la 2.ª.' },
  t12: { clinica: 'Vértebra de transición toracolumbar; es un lugar frecuente de fracturas por compresión.' },
  l4: { clinica: 'La línea que une las crestas ilíacas (línea de Tuffier) pasa por L4-L5: referencia para la punción lumbar.' },
  l5: { clinica: 'Es la vértebra que más frecuentemente sufre espondilólisis/espondilolistesis. La hernia discal L5-S1 comprime la raíz S1 (ciática).' },
};
const SPINE_ORDER = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11', 't12', 'l1', 'l2', 'l3', 'l4', 'l5'];
SPINE_ORDER.forEach((id, i) => {
  const r = id[0];
  const n = id.slice(1);
  const info = VERT_INFO[r];
  const ex = VERT_EXTRA[id] || {};
  const art = [];
  if (i > 0) art.push([SPINE_ORDER[i - 1], 'Disco intervertebral (sínfisis) y articulaciones cigapofisarias (sinoviales planas)']);
  if (i < SPINE_ORDER.length - 1) art.push([SPINE_ORDER[i + 1], 'Disco intervertebral (sínfisis) y articulaciones cigapofisarias (sinoviales planas)']);
  if (id === 'c1') {
    art.length = 0;
    art.push(['occipital', 'Articulación atlantooccipital (sinovial elipsoidea)'], ['c2', 'Articulación atlantoaxial (sinovial trocoide/plana)']);
  }
  if (id === 'c2') art[0] = ['c1', 'Articulación atlantoaxial (sinovial trocoide/plana)'];
  if (id === 'l5') art.push(['sacro', 'Articulación lumbosacra (disco L5-S1)']);
  if (r === 't') {
    const k = parseInt(n, 10);
    art.push(['costilla_' + k, 'Articulación costovertebral y costotransversa']);
    if (k <= 9) art.push(['costilla_' + (k + 1), 'Articulación de la cabeza de la costilla (semifosita inferior)']);
  }
  B[id] = {
    nombre: ex.nombre || `Vértebra ${info.reg.toLowerCase()} ${r.toUpperCase()}${n}`,
    latin: `${info.lat} ${['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][parseInt(n, 10)]}`,
    region: info.region, grupo: 'Columna vertebral', clase: 'Irregular', bilateral: false,
    descripcion: ex.descripcion || info.d,
    partes: ex.partes || ['Cuerpo vertebral', 'Pedículos', 'Láminas', 'Agujero vertebral', 'Apófisis espinosa', 'Apófisis transversas', 'Apófisis articulares superiores e inferiores', ...(r === 'c' ? ['Agujeros transversos', 'Uncus (apófisis unciformes)'] : r === 't' ? ['Fositas costales del cuerpo', 'Fositas costales transversas'] : ['Apófisis mamilares y accesorias'])],
    articulaciones: art,
    clinica: ex.clinica || (r === 'c' ? 'La columna cervical es la más móvil y la más vulnerable a los traumatismos por latigazo.' : r === 't' ? 'La región torácica es la menos móvil gracias a las costillas; la cifosis torácica es su curvatura normal.' : 'La región lumbar soporta la mayor parte del peso corporal; la lordosis lumbar es su curvatura normal y es asiento frecuente de hernias discales.'),
  };
});
B.sacro = {
  nombre: 'Sacro', latin: 'Os sacrum', region: 'abdomen', grupo: 'Columna vertebral', clase: 'Irregular (5 vértebras fusionadas)', bilateral: false,
  descripcion: 'Hueso triangular formado por la fusión de las 5 vértebras sacras. Encaja entre los dos coxales formando la pared posterior de la pelvis y transmite el peso del cuerpo a los miembros inferiores.',
  partes: ['Base y promontorio', 'Alas del sacro', 'Agujeros sacros anteriores y posteriores', 'Cresta sacra media', 'Carillas auriculares', 'Hiato sacro', 'Vértice'],
  articulaciones: [['l5', 'Articulación lumbosacra'], ['coxal', 'Articulación sacroilíaca (sinovial plana/sindesmosis)'], ['coccix', 'Articulación sacrococcígea (sínfisis)']],
  clinica: 'El hiato sacro es la vía de acceso para la anestesia epidural caudal. La disfunción sacroilíaca es causa frecuente de lumbalgia.',
};
B.coccix = {
  nombre: 'Cóccix', latin: 'Os coccygis', region: 'abdomen', grupo: 'Columna vertebral', clase: 'Irregular (3-5 vértebras rudimentarias)', bilateral: false,
  descripcion: 'Pequeño hueso triangular al final de la columna, vestigio de la cola. Sirve de inserción a músculos del suelo pélvico y al glúteo mayor.',
  partes: ['Base', 'Astas coccígeas', 'Vértice'],
  articulaciones: [['sacro', 'Articulación sacrococcígea (sínfisis)']],
  clinica: 'La coccigodinia (dolor en el cóccix) suele deberse a caídas sentado o al parto.',
};

// ============================ TÓRAX ============================
B.esternon = {
  nombre: 'Esternón', latin: 'Sternum', region: 'torax', clase: 'Plano', bilateral: false,
  descripcion: 'Hueso plano y alargado en la línea media anterior del tórax, formado por manubrio, cuerpo y apófisis xifoides. Protege el corazón y sirve de anclaje a las costillas verdaderas.',
  partes: ['Manubrio', 'Escotadura yugular', 'Escotaduras claviculares', 'Ángulo esternal (de Louis) — nivel de la 2.ª costilla', 'Cuerpo', 'Escotaduras costales', 'Apófisis xifoides'],
  articulaciones: [['clavicula', 'Articulación esternoclavicular (sinovial en silla de montar con disco)'], ['costilla_1', 'Sincondrosis esternocostal (1.ª)'], ['costilla_2', 'Articulación esternocostal'], ['costilla_3', 'Articulación esternocostal'], ['costilla_4', 'Articulación esternocostal'], ['costilla_5', 'Articulación esternocostal'], ['costilla_6', 'Articulación esternocostal'], ['costilla_7', 'Articulación esternocostal']],
  clinica: 'El ángulo esternal es la referencia para contar costillas (2.ª costilla) y marca el nivel T4-T5 (bifurcación traqueal, arco aórtico). La médula ósea esternal puede biopsiarse. Las compresiones de la RCP se aplican sobre la mitad inferior del esternón.',
};
for (let n = 1; n <= 12; n++) {
  const tipo = n <= 7 ? 'verdadera (vertebroesternal)' : n <= 10 ? 'falsa (vertebrocondral)' : 'flotante (vertebral)';
  const art = [['t' + n, 'Articulaciones costovertebral (cabeza) y costotransversa (tubérculo)']];
  if (n >= 2 && n <= 10) art.push(['t' + (n - 1), 'Articulación de la cabeza de la costilla (semifosita superior)']);
  if (n <= 7) art.push(['esternon', n === 1 ? 'Sincondrosis esternocostal (cartílago costal)' : 'Articulación esternocostal (sinovial plana, vía cartílago costal)']);
  else if (n <= 10) art.push(['costilla_' + (n - 1), 'Articulación intercondral (cartílago costal a la costilla superior)']);
  const extra = {
    1: { d: 'La más corta, ancha y curvada. Es plana horizontalmente y presenta el tubérculo del escaleno anterior y los surcos de la vena y arteria subclavias.', c: 'Una costilla cervical o una 1.ª costilla anómala puede comprimir el plexo braquial y la arteria subclavia (síndrome del desfiladero torácico).' },
    2: { d: 'Más larga que la 1.ª; presenta la tuberosidad del serrato anterior. Se articula a nivel del ángulo esternal.', c: 'Se localiza palpando el ángulo esternal: es la referencia para contar las demás costillas.' },
    11: { d: 'Costilla flotante: su extremo anterior termina libre en la musculatura abdominal. No tiene cuello ni tubérculo marcados.', c: 'Las costillas flotantes son más móviles y menos propensas a fracturarse, pero sus fracturas pueden lesionar riñón o bazo.' },
    12: { d: 'Costilla flotante, la más corta. Su extremo termina en la musculatura de la pared posterior del abdomen.', c: 'Referencia para el abordaje quirúrgico del riñón; su fractura puede lesionar el riñón.' },
  }[n];
  B['costilla_' + n] = {
    nombre: `Costilla ${n}.ª`, latin: `Costa ${['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'][n]}`, region: 'torax', grupo: 'Costillas', clase: 'Plano (curvo)', bilateral: true,
    descripcion: `Costilla ${tipo}. ${extra ? extra.d : 'Costilla típica: cabeza con dos carillas, cuello, tubérculo, ángulo costal y cuerpo con surco costal en el borde inferior (por donde discurre el paquete vasculonervioso intercostal: vena, arteria y nervio).'}`,
    partes: ['Cabeza (carillas articulares)', 'Cuello', 'Tubérculo', 'Ángulo costal', 'Cuerpo', 'Surco costal', 'Extremo esternal (unión al cartílago costal)'],
    articulaciones: art,
    clinica: extra ? extra.c : 'Las costillas medias (5.ª-9.ª) son las que más se fracturan. Las agujas se introducen por el borde superior de la costilla para evitar el paquete vasculonervioso (toracocentesis).',
  };
}

// ============================ MIEMBRO SUPERIOR ============================
B.clavicula = {
  nombre: 'Clavícula', latin: 'Clavicula', region: 'miembro_superior', grupo: 'Cintura escapular', clase: 'Largo (en forma de S)', bilateral: true,
  descripcion: 'Hueso largo en forma de S que une el esternón con la escápula. Actúa como puntal que mantiene el miembro superior separado del tórax.',
  partes: ['Extremo esternal', 'Extremo acromial', 'Cuerpo', 'Tubérculo conoideo', 'Línea trapezoidea', 'Surco del subclavio', 'Impresión del ligamento costoclavicular'],
  articulaciones: [['esternon', 'Articulación esternoclavicular (sinovial en silla de montar con disco)'], ['escapula', 'Articulación acromioclavicular (sinovial plana)']],
  clinica: 'Es el hueso que más se fractura (caídas sobre la mano extendida), generalmente en la unión del tercio medio y lateral. El fragmento medial sube por el esternocleidomastoideo y el lateral baja por el peso del brazo.',
};
B.escapula = {
  nombre: 'Escápula (omóplato)', latin: 'Scapula', region: 'miembro_superior', grupo: 'Cintura escapular', clase: 'Plano', bilateral: true,
  descripcion: 'Hueso plano triangular situado en la cara posterior del tórax (entre la 2.ª y la 7.ª costilla). Forma la parte posterior de la cintura escapular y sirve de inserción a 17 músculos.',
  partes: ['Espina de la escápula', 'Acromion', 'Apófisis coracoides', 'Cavidad glenoidea', 'Tubérculos supraglenoideo e infraglenoideo', 'Fosas supraespinosa e infraespinosa', 'Fosa subescapular', 'Bordes medial, lateral y superior', 'Ángulos superior, inferior y lateral', 'Escotadura escapular'],
  articulaciones: [['clavicula', 'Articulación acromioclavicular (sinovial plana)'], ['humero', 'Articulación glenohumeral (sinovial esferoidea)']],
  clinica: 'La "escápula alada" aparece cuando se lesiona el nervio torácico largo (parálisis del serrato anterior). La escotadura escapular puede atrapar el nervio supraescapular.',
};
B.humero = {
  nombre: 'Húmero', latin: 'Humerus', region: 'miembro_superior', grupo: 'Brazo', clase: 'Largo', bilateral: true,
  descripcion: 'Hueso del brazo; el más largo del miembro superior. Se articula con la escápula en el hombro y con el radio y el cúbito en el codo.',
  partes: ['Cabeza humeral', 'Cuello anatómico', 'Cuello quirúrgico', 'Tubérculo mayor (troquíter)', 'Tubérculo menor (troquín)', 'Surco intertubercular (bicipital)', 'Tuberosidad deltoidea', 'Surco del nervio radial', 'Epicóndilo lateral', 'Epitróclea (epicóndilo medial)', 'Cóndilo: tróclea y capítulo (cóndilo humeral)', 'Fosas olecraniana, coronoidea y radial'],
  articulaciones: [['escapula', 'Articulación glenohumeral (sinovial esferoidea)'], ['cubito', 'Articulación humerocubital (sinovial troclear)'], ['radio', 'Articulación humerorradial (sinovial esferoidea)']],
  clinica: 'Fracturas y nervios en riesgo: cuello quirúrgico → nervio axilar; diáfisis (surco radial) → nervio radial (mano caída); supracondílea → arteria braquial y nervio mediano; epitróclea → nervio cubital ("hueso de la risa").',
};
B.radio = {
  nombre: 'Radio', latin: 'Radius', region: 'miembro_superior', grupo: 'Antebrazo', clase: 'Largo', bilateral: true,
  descripcion: 'Hueso lateral del antebrazo (del lado del pulgar). Su extremo distal es ancho y forma la mayor parte de la articulación de la muñeca; gira alrededor del cúbito en la pronación y supinación.',
  partes: ['Cabeza del radio', 'Cuello', 'Tuberosidad del radio', 'Borde interóseo', 'Apófisis estiloides radial', 'Tubérculo dorsal (de Lister)', 'Escotadura cubital', 'Carillas para escafoides y semilunar'],
  articulaciones: [['humero', 'Articulación humerorradial'], ['cubito', 'Articulaciones radiocubitales proximal y distal (sinoviales trocoides) y membrana interósea'], ['escafoides', 'Articulación radiocarpiana (elipsoidea)'], ['semilunar', 'Articulación radiocarpiana (elipsoidea)']],
  clinica: 'La fractura de Colles (radio distal con desplazamiento dorsal, deformidad "en dorso de tenedor") es la fractura más frecuente del adulto mayor. En niños es típica la "pronación dolorosa" (subluxación de la cabeza del radio).',
};
B.cubito = {
  nombre: 'Cúbito (ulna)', latin: 'Ulna', region: 'miembro_superior', grupo: 'Antebrazo', clase: 'Largo', bilateral: true,
  descripcion: 'Hueso medial del antebrazo (del lado del meñique). Su extremo proximal, grande, forma con el húmero la articulación del codo.',
  partes: ['Olécranon', 'Apófisis coronoides', 'Escotadura troclear', 'Escotadura radial', 'Tuberosidad del cúbito', 'Cresta del supinador', 'Cabeza del cúbito', 'Apófisis estiloides cubital'],
  articulaciones: [['humero', 'Articulación humerocubital (troclear)'], ['radio', 'Articulaciones radiocubitales proximal y distal']],
  clinica: 'El olécranon forma la punta del codo y se fractura en caídas sobre el codo. La fractura de Monteggia combina fractura de cúbito y luxación de la cabeza del radio.',
};
const CARP = {
  escafoides: ['Escafoides', 'Os scaphoideum', 'Hueso más lateral de la fila proximal del carpo, con forma de barca. Su tubérculo se palpa en la tabaquera anatómica.', [['radio', 'Radiocarpiana'], ['semilunar', 'Intercarpiana'], ['trapecio', 'Mediocarpiana'], ['trapezoide', 'Mediocarpiana'], ['grande', 'Mediocarpiana']], 'Es el hueso del carpo que más se fractura (caída sobre la mano extendida). Su irrigación entra por distal, por lo que el fragmento proximal puede sufrir necrosis avascular. Dolor en la tabaquera anatómica = sospecha de fractura.'],
  semilunar: ['Semilunar', 'Os lunatum', 'Hueso central de la fila proximal, con forma de media luna.', [['radio', 'Radiocarpiana'], ['escafoides', 'Intercarpiana'], ['piramidal', 'Intercarpiana'], ['grande', 'Mediocarpiana'], ['ganchoso', 'Mediocarpiana']], 'Es el hueso del carpo que más se luxa (hacia palmar), pudiendo comprimir el nervio mediano. La enfermedad de Kienböck es su necrosis avascular.'],
  piramidal: ['Piramidal', 'Os triquetrum', 'Hueso de forma piramidal en la parte medial de la fila proximal.', [['semilunar', 'Intercarpiana'], ['pisiforme', 'Articulación del pisiforme'], ['ganchoso', 'Mediocarpiana']], 'Segundo hueso del carpo en frecuencia de fractura (fracturas por avulsión dorsal).'],
  pisiforme: ['Pisiforme', 'Os pisiforme', 'Pequeño hueso sesamoideo (con forma de guisante) situado en el tendón del flexor cubital del carpo, sobre la cara palmar del piramidal.', [['piramidal', 'Articulación del pisiforme']], 'Se palpa en la base de la eminencia hipotenar. Forma junto al gancho del ganchoso el canal de Guyon, por donde pasan el nervio y la arteria cubitales.'],
  trapecio: ['Trapecio', 'Os trapezium', 'Hueso más lateral de la fila distal; se articula en silla de montar con el 1.er metacarpiano, lo que permite la oposición del pulgar.', [['escafoides', 'Mediocarpiana'], ['trapezoide', 'Intercarpiana'], ['metacarpiano_1', 'Articulación carpometacarpiana del pulgar (en silla de montar)'], ['metacarpiano_2', 'Carpometacarpiana']], 'La rizartrosis (artrosis trapeciometacarpiana) es muy frecuente en mujeres mayores.'],
  trapezoide: ['Trapezoide', 'Os trapezoideum', 'Pequeño hueso en cuña de la fila distal, entre el trapecio y el grande.', [['escafoides', 'Mediocarpiana'], ['trapecio', 'Intercarpiana'], ['grande', 'Intercarpiana'], ['metacarpiano_2', 'Carpometacarpiana']], 'Es el hueso del carpo que menos se fractura.'],
  grande: ['Grande (hueso capitato)', 'Os capitatum', 'El hueso más grande del carpo, en el centro de la fila distal; su cabeza encaja en la concavidad formada por escafoides y semilunar.', [['escafoides', 'Mediocarpiana'], ['semilunar', 'Mediocarpiana'], ['trapezoide', 'Intercarpiana'], ['ganchoso', 'Intercarpiana'], ['metacarpiano_2', 'Carpometacarpiana'], ['metacarpiano_3', 'Carpometacarpiana'], ['metacarpiano_4', 'Carpometacarpiana']], 'Es el primer hueso del carpo en osificarse (útil para estimar la edad ósea).'],
  ganchoso: ['Ganchoso', 'Os hamatum', 'Hueso cuneiforme en la parte medial de la fila distal, con una apófisis en forma de gancho (gancho del ganchoso) en su cara palmar.', [['semilunar', 'Mediocarpiana'], ['piramidal', 'Mediocarpiana'], ['grande', 'Intercarpiana'], ['metacarpiano_4', 'Carpometacarpiana'], ['metacarpiano_5', 'Carpometacarpiana']], 'La fractura del gancho del ganchoso es típica de golfistas y jugadores de béisbol, y puede afectar al nervio cubital.'],
};
for (const [id, [nombre, latin, d, art, c]] of Object.entries(CARP)) {
  B[id] = { nombre, latin, region: 'miembro_superior', grupo: 'Carpo (muñeca)', clase: 'Corto', bilateral: true, descripcion: d, partes: [], articulaciones: art, clinica: c };
}
const DEDO_MANO = { 1: 'pulgar', 2: 'índice', 3: 'medio (corazón)', 4: 'anular', 5: 'meñique' };
for (let f = 1; f <= 5; f++) {
  const art = [];
  const carp = { 1: ['trapecio'], 2: ['trapecio', 'trapezoide', 'grande'], 3: ['grande'], 4: ['grande', 'ganchoso'], 5: ['ganchoso'] }[f];
  carp.forEach((c) => art.push([c, f === 1 ? 'Articulación carpometacarpiana del pulgar (en silla de montar)' : 'Articulación carpometacarpiana (sinovial plana)']));
  if (f > 2) art.push(['metacarpiano_' + (f - 1), 'Articulación intermetacarpiana']);
  if (f >= 2 && f < 5) art.push(['metacarpiano_' + (f + 1), 'Articulación intermetacarpiana']);
  art.push(['falange_proximal_mano_' + f, 'Articulación metacarpofalángica (sinovial condílea)']);
  B['metacarpiano_' + f] = {
    nombre: `${['', '1.er', '2.º', '3.er', '4.º', '5.º'][f]} metacarpiano (${DEDO_MANO[f]})`, latin: `Os metacarpi ${['', 'I', 'II', 'III', 'IV', 'V'][f]}`, region: 'miembro_superior', grupo: 'Metacarpo', clase: 'Largo (en miniatura)', bilateral: true,
    descripcion: f === 1 ? 'El metacarpiano del pulgar es el más corto y robusto; está rotado 90° respecto a los demás, lo que permite la oposición.' : `Hueso largo de la palma correspondiente al dedo ${DEDO_MANO[f]}. Presenta base (proximal), cuerpo y cabeza (forma los nudillos).`,
    partes: ['Base', 'Cuerpo (diáfisis)', 'Cabeza'],
    articulaciones: art,
    clinica: f === 5 ? 'La "fractura del boxeador" afecta al cuello del 5.º metacarpiano al golpear con el puño cerrado.' : f === 1 ? 'La fractura de Bennett es una fractura-luxación intraarticular de la base del 1.er metacarpiano.' : 'Las cabezas de los metacarpianos forman los nudillos al cerrar el puño.',
  };
  const segs = f === 1 ? ['proximal', 'distal'] : ['proximal', 'media', 'distal'];
  segs.forEach((sg, k) => {
    const id = `falange_${sg}_mano_${f}`;
    const a = [];
    a.push(k === 0 ? ['metacarpiano_' + f, 'Articulación metacarpofalángica (condílea)'] : [`falange_${segs[k - 1]}_mano_${f}`, 'Articulación interfalángica (troclear)']);
    if (k < segs.length - 1) a.push([`falange_${segs[k + 1]}_mano_${f}`, 'Articulación interfalángica (troclear)']);
    B[id] = {
      nombre: `Falange ${sg} del ${DEDO_MANO[f]}`, latin: `Phalanx ${sg === 'proximal' ? 'proximalis' : sg === 'media' ? 'media' : 'distalis'} digiti manus ${['', 'I', 'II', 'III', 'IV', 'V'][f]}`,
      region: 'miembro_superior', grupo: 'Falanges de la mano', clase: 'Largo (en miniatura)', bilateral: true,
      descripcion: sg === 'distal' ? 'Falange terminal: su extremo presenta la tuberosidad ungueal, que sostiene el pulpejo y la uña.' : `Falange ${sg}: base, cuerpo y cabeza en forma de polea (tróclea) para la articulación interfalángica.`,
      partes: sg === 'distal' ? ['Base', 'Cuerpo', 'Tuberosidad de la falange distal'] : ['Base', 'Cuerpo', 'Cabeza (tróclea)'],
      articulaciones: a,
      clinica: sg === 'distal' ? 'El "dedo en martillo" es la rotura o avulsión del tendón extensor en la base de la falange distal.' : f === 1 ? 'El pulgar solo tiene dos falanges.' : 'Las fracturas de falanges son muy frecuentes en accidentes laborales y deportivos.',
    };
  });
}

// ============================ MIEMBRO INFERIOR ============================
B.coxal = {
  nombre: 'Hueso coxal (ilíaco)', latin: 'Os coxae', region: 'miembro_inferior', grupo: 'Cintura pélvica', clase: 'Plano/irregular', bilateral: true,
  descripcion: 'Hueso grande e irregular formado por la fusión de tres huesos (ilion, isquion y pubis) en el acetábulo hacia los 16 años. Los dos coxales y el sacro forman la pelvis.',
  partes: ['Ilion: ala, cresta ilíaca, fosa ilíaca', 'Espinas ilíacas anterosuperior (EIAS) y anteroinferior (EIAI)', 'Espinas ilíacas posterosuperior y posteroinferior', 'Acetábulo (cavidad cotiloidea)', 'Isquion: tuberosidad isquiática, espina ciática', 'Escotaduras ciáticas mayor y menor', 'Pubis: cuerpo, ramas superior e inferior, tubérculo púbico, cresta y línea pectínea', 'Agujero obturador', 'Línea arqueada', 'Carilla auricular'],
  articulaciones: [['sacro', 'Articulación sacroilíaca'], ['femur', 'Articulación coxofemoral o de la cadera (sinovial esferoidea)'], ['coxal', 'Sínfisis del pubis (cartilaginosa secundaria)']],
  clinica: 'La EIAS y la cresta ilíaca son referencias palpables (punto de McBurney, injertos óseos de cresta). Las fracturas del anillo pélvico pueden causar hemorragias graves. La tuberosidad isquiática soporta el peso al sentarnos.',
};
B.femur = {
  nombre: 'Fémur', latin: 'Femur', region: 'miembro_inferior', grupo: 'Muslo', clase: 'Largo', bilateral: true,
  descripcion: 'El hueso más largo, pesado y resistente del cuerpo (≈1/4 de la talla). Transmite el peso del cuerpo desde la cadera hasta la tibia.',
  partes: ['Cabeza femoral y fóvea (ligamento redondo)', 'Cuello femoral (ángulo cervicodiafisario ≈125°)', 'Trocánter mayor', 'Trocánter menor', 'Línea y cresta intertrocantéreas', 'Línea áspera (labios medial y lateral)', 'Tuberosidad glútea', 'Línea pectínea', 'Cóndilos medial y lateral', 'Epicóndilos', 'Tubérculo del aductor', 'Fosa intercondílea', 'Cara rotuliana (tróclea femoral)'],
  articulaciones: [['coxal', 'Articulación coxofemoral (sinovial esferoidea)'], ['tibia', 'Articulación femorotibial (rodilla, bicondílea)'], ['rotula', 'Articulación femororrotuliana']],
  clinica: 'La fractura del cuello femoral en ancianos puede interrumpir la irrigación de la cabeza (arterias circunflejas) y causar necrosis avascular. En la fractura de cadera el miembro queda acortado y en rotación externa.',
};
B.rotula = {
  nombre: 'Rótula (patela)', latin: 'Patella', region: 'miembro_inferior', grupo: 'Rodilla', clase: 'Sesamoideo', bilateral: true,
  descripcion: 'El hueso sesamoideo más grande del cuerpo, incluido en el tendón del cuádriceps. Protege la rodilla y aumenta el brazo de palanca del cuádriceps.',
  partes: ['Base (superior)', 'Vértice (inferior)', 'Cara anterior', 'Cara articular (carillas medial y lateral)'],
  articulaciones: [['femur', 'Articulación femororrotuliana (sinovial plana/troclear)']],
  clinica: 'La luxación rotuliana suele ser lateral (el vasto medial oblicuo la estabiliza). El síndrome femoropatelar es causa frecuente de dolor anterior de rodilla.',
};
B.tibia = {
  nombre: 'Tibia', latin: 'Tibia', region: 'miembro_inferior', grupo: 'Pierna', clase: 'Largo', bilateral: true,
  descripcion: 'Hueso medial y principal de la pierna; soporta el peso del cuerpo. Su cara medial y su borde anterior son subcutáneos (espinilla).',
  partes: ['Meseta tibial (cóndilos medial y lateral)', 'Eminencia intercondílea', 'Tuberosidad tibial', 'Tubérculo de Gerdy', 'Borde anterior (cresta)', 'Línea del sóleo', 'Maléolo medial', 'Escotadura peronea'],
  articulaciones: [['femur', 'Articulación de la rodilla (femorotibial)'], ['perone', 'Articulaciones tibioperoneas proximal (plana) y distal (sindesmosis)'], ['astragalo', 'Articulación talocrural o del tobillo (troclear)']],
  clinica: 'Al ser subcutánea, sus fracturas son a menudo abiertas. La enfermedad de Osgood-Schlatter es una apofisitis de la tuberosidad tibial en adolescentes deportistas. El "síndrome de estrés tibial medial" (periostitis) es común en corredores.',
};
B.perone = {
  nombre: 'Peroné (fíbula)', latin: 'Fibula', region: 'miembro_inferior', grupo: 'Pierna', clase: 'Largo', bilateral: true,
  descripcion: 'Hueso largo y delgado lateral de la pierna. No soporta peso significativo, pero sirve de inserción muscular y forma el maléolo lateral del tobillo.',
  partes: ['Cabeza y vértice', 'Cuello', 'Cuerpo', 'Maléolo lateral', 'Fosa maleolar'],
  articulaciones: [['tibia', 'Articulaciones tibioperoneas proximal y distal'], ['astragalo', 'Articulación talocrural (tobillo)']],
  clinica: 'El nervio peroneo común rodea el cuello del peroné: su lesión (fractura, yeso apretado) produce "pie caído" y marcha en estepaje. El peroné se usa como injerto óseo vascularizado.',
};
const TARS = {
  astragalo: ['Astrágalo (talus)', 'Talus', 'Hueso que transmite el peso de la tibia al resto del pie. No tiene inserciones musculares. Su cuerpo presenta la tróclea que encaja en la mortaja tibioperonea.', [['tibia', 'Articulación talocrural (tobillo)'], ['perone', 'Articulación talocrural (tobillo)'], ['calcaneo', 'Articulación subastragalina (talocalcánea)'], ['navicular', 'Articulación talonavicular (parte de la de Chopart)']], 'La mayor parte de su superficie está cubierta de cartílago, por lo que su irrigación es precaria: las fracturas del cuello pueden producir necrosis avascular.'],
  calcaneo: ['Calcáneo', 'Calcaneus', 'El hueso más grande del pie; forma el talón. Su tuberosidad posterior recibe el tendón calcáneo (de Aquiles).', [['astragalo', 'Articulación subastragalina'], ['cuboides', 'Articulación calcaneocuboidea (parte de la de Chopart)']], 'Se fractura en caídas desde altura sobre los talones (a menudo junto con vértebras lumbares). La fascitis plantar produce dolor en su tuberosidad.'],
  navicular: ['Navicular (escafoides tarsiano)', 'Os naviculare', 'Hueso en forma de barca en el lado medial del pie, entre el astrágalo y las cuñas. Su tuberosidad se palpa en el borde medial del pie.', [['astragalo', 'Talonavicular'], ['cuneiforme_medial', 'Cuneonavicular'], ['cuneiforme_intermedio', 'Cuneonavicular'], ['cuneiforme_lateral', 'Cuneonavicular']], 'Su tuberosidad recibe al tibial posterior; un navicular accesorio puede causar dolor medial.'],
  cuboides: ['Cuboides', 'Os cuboideum', 'Hueso cúbico en el borde lateral del pie. Presenta un surco para el tendón del peroneo largo.', [['calcaneo', 'Calcaneocuboidea'], ['cuneiforme_lateral', 'Cuneocuboidea'], ['metatarsiano_4', 'Tarsometatarsiana'], ['metatarsiano_5', 'Tarsometatarsiana']], 'Fracturas "en cascanueces" por compresión entre calcáneo y metatarsianos.'],
  cuneiforme_medial: ['Cuneiforme medial (1.ª cuña)', 'Os cuneiforme mediale', 'La mayor de las tres cuñas; se articula con el 1.er metatarsiano.', [['navicular', 'Cuneonavicular'], ['cuneiforme_intermedio', 'Intercuneiforme'], ['metatarsiano_1', 'Tarsometatarsiana'], ['metatarsiano_2', 'Tarsometatarsiana']], 'Recibe al tibial anterior y parte del peroneo largo (estribo que sostiene el arco).'],
  cuneiforme_intermedio: ['Cuneiforme intermedio (2.ª cuña)', 'Os cuneiforme intermedium', 'La más pequeña de las cuñas; su posición retrasada forma una mortaja para la base del 2.º metatarsiano.', [['navicular', 'Cuneonavicular'], ['cuneiforme_medial', 'Intercuneiforme'], ['cuneiforme_lateral', 'Intercuneiforme'], ['metatarsiano_2', 'Tarsometatarsiana']], 'La lesión de Lisfranc (articulación tarsometatarsiana) afecta a esta zona.'],
  cuneiforme_lateral: ['Cuneiforme lateral (3.ª cuña)', 'Os cuneiforme laterale', 'Cuña situada entre la intermedia y el cuboides.', [['navicular', 'Cuneonavicular'], ['cuneiforme_intermedio', 'Intercuneiforme'], ['cuboides', 'Cuneocuboidea'], ['metatarsiano_2', 'Tarsometatarsiana'], ['metatarsiano_3', 'Tarsometatarsiana'], ['metatarsiano_4', 'Tarsometatarsiana']], 'Forma parte del arco transverso del pie.'],
};
for (const [id, [nombre, latin, d, art, c]] of Object.entries(TARS)) {
  B[id] = { nombre, latin, region: 'miembro_inferior', grupo: 'Tarso (tobillo y pie)', clase: 'Corto', bilateral: true, descripcion: d, partes: [], articulaciones: art, clinica: c };
}
const DEDO_PIE = { 1: 'dedo gordo (hallux)', 2: '2.º dedo', 3: '3.er dedo', 4: '4.º dedo', 5: '5.º dedo (meñique)' };
for (let n = 1; n <= 5; n++) {
  const art = [];
  const tars = { 1: ['cuneiforme_medial'], 2: ['cuneiforme_medial', 'cuneiforme_intermedio', 'cuneiforme_lateral'], 3: ['cuneiforme_lateral'], 4: ['cuneiforme_lateral', 'cuboides'], 5: ['cuboides'] }[n];
  tars.forEach((t) => art.push([t, 'Articulación tarsometatarsiana (de Lisfranc)']));
  if (n > 1) art.push(['metatarsiano_' + (n - 1), 'Articulación intermetatarsiana']);
  if (n < 5) art.push(['metatarsiano_' + (n + 1), 'Articulación intermetatarsiana']);
  art.push(['falange_proximal_pie_' + n, 'Articulación metatarsofalángica (condílea)']);
  B['metatarsiano_' + n] = {
    nombre: `${['', '1.er', '2.º', '3.er', '4.º', '5.º'][n]} metatarsiano`, latin: `Os metatarsi ${['', 'I', 'II', 'III', 'IV', 'V'][n]}`, region: 'miembro_inferior', grupo: 'Metatarso', clase: 'Largo (en miniatura)', bilateral: true,
    descripcion: n === 1 ? 'El más corto y grueso; su cabeza apoya sobre dos huesos sesamoideos y soporta gran parte del peso en el despegue de la marcha.' : n === 5 ? 'Presenta en su base una tuberosidad prominente (palpable en el borde lateral del pie) donde se inserta el peroneo corto.' : 'Hueso largo del metatarso con base, cuerpo y cabeza.',
    partes: n === 5 ? ['Base', 'Tuberosidad del 5.º metatarsiano', 'Cuerpo', 'Cabeza'] : ['Base', 'Cuerpo', 'Cabeza'],
    articulaciones: art,
    clinica: n === 5 ? 'Fracturas de su base: por avulsión (peroneo corto, en esguinces de tobillo) o fractura de Jones (zona de mala irrigación, consolida mal).' : n === 2 ? 'Es el que más sufre fracturas por estrés ("fractura del soldado o de marcha").' : n === 1 ? 'El hallux valgus (juanete) es la desviación lateral del dedo gordo con prominencia de la cabeza del 1.er metatarsiano.' : 'Los metatarsianos centrales pueden sufrir fracturas por estrés.',
  };
  const segs = n === 1 ? ['proximal', 'distal'] : ['proximal', 'media', 'distal'];
  segs.forEach((sg, k) => {
    const a = [];
    a.push(k === 0 ? ['metatarsiano_' + n, 'Articulación metatarsofalángica'] : [`falange_${segs[k - 1]}_pie_${n}`, 'Articulación interfalángica (troclear)']);
    if (k < segs.length - 1) a.push([`falange_${segs[k + 1]}_pie_${n}`, 'Articulación interfalángica (troclear)']);
    B[`falange_${sg}_pie_${n}`] = {
      nombre: `Falange ${sg} del ${DEDO_PIE[n]}`, latin: `Phalanx ${sg === 'proximal' ? 'proximalis' : sg === 'media' ? 'media' : 'distalis'} digiti pedis ${['', 'I', 'II', 'III', 'IV', 'V'][n]}`,
      region: 'miembro_inferior', grupo: 'Falanges del pie', clase: 'Largo (en miniatura)', bilateral: true,
      descripcion: `Falange ${sg} del ${DEDO_PIE[n]}. Las falanges del pie son más cortas que las de la mano.`,
      partes: ['Base', 'Cuerpo', sg === 'distal' ? 'Tuberosidad distal' : 'Cabeza (tróclea)'],
      articulaciones: a,
      clinica: n === 1 ? 'El dedo gordo solo tiene dos falanges. La gota afecta típicamente a la articulación metatarsofalángica del hallux (podagra).' : 'Los dedos en martillo y en garra son deformidades frecuentes por desequilibrio muscular o calzado inadecuado.',
    };
  });
}

export const BONES = B;
