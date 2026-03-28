import type { RuleRole, PhaseStep, Tip } from '../types/rules';

export const RULE_ROLES: RuleRole[] = [
  { icon: '🐺', name: 'Hombre Lobo',        type: 'wolf',    desc: 'Cada noche devoran a un aldeano. De día fingen ser villanos para evitar el linchamiento.' },
  { icon: '🌾', name: 'Aldeano',             type: 'neutral', desc: 'Sin habilidades. Sus únicos poderes son la lógica, la observación y la persuasión.' },
  { icon: '🔮', name: 'Vidente',             type: 'special', desc: 'Cada noche puede inspeccionar a un jugador y saber si es Lobo o no. Debe ser discreta.' },
  { icon: '🧪', name: 'Bruja',               type: 'special', desc: 'Posee una poción de vida y una de muerte, cada una de un solo uso.' },
  { icon: '🏹', name: 'Cazador',             type: 'special', desc: 'Al morir (día o noche) puede disparar y arrastrar consigo a otro jugador.' },
  { icon: '❤️', name: 'Cupido',              type: 'special', desc: 'La primera noche une a dos jugadores. Si uno muere, el otro muere de amor.' },
  { icon: '👧', name: 'Niña',                type: 'special', desc: 'Puede espiar a los lobos de noche. Si la descubren, muere en silencio.' },
  { icon: '🛡️', name: 'Protector',           type: 'special', desc: 'Cada noche protege a un jugador diferente de los lobos (puede ser él mismo).' },
  { icon: '🐺👑', name: 'Padre de los Lobos', type: 'wolf',   desc: 'Una vez puede infectar a la víctima nocturna convirtiéndola en lobo.' },
  { icon: '🐺❄️', name: 'Lobo Albino',        type: 'wolf',   desc: 'Va con los lobos pero su meta es ganar solo eliminando a todos.' },
  { icon: '😇', name: 'Ángel',               type: 'special', desc: 'Si es el primer linchado gana solo. Si sobrevive, puede descubrir a la Vidente.' },
  { icon: '🦊', name: 'Zorro',               type: 'special', desc: 'Puede detectar si hay un lobo entre 3 jugadores vecinos, pero pierde el poder si falla.' },
];

export const PHASE_STEPS: PhaseStep[] = [
  { isNight: true,  label: 'Fase Nocturna', title: 'El pueblo duerme',           text: 'El Narrador pide silencio total. Todos cierran los ojos.' },
  { isNight: true,  label: 'Fase Nocturna', title: 'Los Lobos se despiertan',    text: 'Los Lobos abren los ojos, señalan en silencio a su víctima y vuelven a dormir.' },
  { isNight: true,  label: 'Fase Nocturna', title: 'Roles especiales actúan',    text: 'El Narrador llama uno a uno: Vidente, Bruja, Niña... Cada uno actúa en secreto.' },
  { isNight: false, label: 'Fase Diurna',   title: 'Amanecer y anuncio',         text: 'Todos abren los ojos. El Narrador anuncia las víctimas. Los muertos no hablan.' },
  { isNight: false, label: 'Fase Diurna',   title: 'El Gran Debate',             text: 'Los vivos acusan, defienden, mienten y deducen para identificar a los Lobos.' },
  { isNight: false, label: 'Fase Diurna',   title: 'Votación y linchamiento',    text: 'El más votado es eliminado y revela su carta. En empate nadie muere.' },
  { isNight: true,  label: 'Nueva Noche',   title: 'El ciclo se repite',         text: 'Comienza una nueva noche hasta que un bando cumpla la condición de victoria.' },
];

export const TIPS: Tip[] = [
  { text: 'Si eres Vidente, no te reveles demasiado pronto: los Lobos te eliminarán la siguiente noche.' },
  { text: 'Observa el comportamiento, no solo las palabras. ¿Quién desvía el tema? ¿Quién acusa demasiado rápido?' },
  { text: 'Los Lobos deben participar activamente en el debate para no levantar sospechas.' },
  { text: 'Como aldeano básico, vota con argumentos. Votar en manada sin razón es lo que los Lobos desean.' },
  { text: 'El jugador eliminado no puede hablar ni revelar su rol. Respeta esta regla para mantener la tensión.' },
  { text: 'El Narrador debe ser imparcial y puede añadir descripciones dramáticas para enriquecer la atmósfera.' },
];
