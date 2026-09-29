import type { Lang } from '../i18n';

/**
 * Case-study content, keyed by project slug, per language.
 *
 * A project gets a case-study page when its slugified title appears in
 * CASE_STUDY_SLUGS. Content is written from real engineering work only —
 * no invented metrics, client numbers, or outcomes.
 *
 * The Heyvelai case study intentionally stays high-level: it communicates
 * what the product is and what it does without exposing the internal
 * architecture, provider stack, prompts, or implementation details.
 *
 * Sections are optional; the case-study page renders only the sections
 * that contain real content.
 */

export type CaseStudyFeature = { title: string; body: string };
export type CaseStudyChallenge = { title: string; body: string };

export type CaseStudy = {
  slug: string;
  seoTitle: string;
  role: string;
  year: string;
  overview: string[];
  context?: string[];
  problem: string[];
  solution: string[];
  keyDecisions?: string[];
  architecture?: string[];
  keyFeatures?: CaseStudyFeature[];
  technology: string[];
  challenges?: CaseStudyChallenge[];
  outcome: string[];
  lessons?: string[];
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/* ────────────────────────────────────────────────────────────────
   Heyvelai — own commercial product
   High-level on purpose: no provider stack, no APIs, no prompts,
   no internal workflows, no pricing mechanics.
──────────────────────────────────────────────────────────────── */

const heyvelai: Record<Lang, CaseStudy> = {
  en: {
    slug: 'heyvelai',
    seoTitle: 'Heyvelai — AI Employee & Automation | Krishna Bihari',
    role: 'Founder · Full-Stack & AI Engineer',
    year: '2026',
    overview: [
      'Heyvelai is an AI-powered automation product that helps businesses automate customer communication and repetitive workflows. It acts as a reliable, always-on point of contact — handling routine customer interactions so teams can focus on work that needs a human.',
      'The product is built around one idea: automation should take over the repetitive work, not replace the human relationship with the customer.',
    ],
    context: [
      'I started Heyvelai because I kept seeing the same problem: businesses spend hours every day on the same calls, messages and follow-ups. The work is necessary but repetitive, and it pulls people away from the work that actually moves the business forward.',
      'I wanted to build a product that combines conversational AI with real business actions — not a chatbot that answers questions, but a system that handles the interaction end to end.',
    ],
    problem: [
      'Repetitive customer communication consumes a large share of a small business\u2019s time: answering the same questions, booking and rescheduling appointments, sending follow-ups, and chasing missed calls.',
      'Existing automation is often narrow — one channel, one scripted flow. The gap is a system that understands what the customer needs and takes action inside the business.',
    ],
    solution: [
      'Heyvelai is built as an AI employee rather than a chatbot. It understands intent, takes action inside the business, and updates the systems behind the interaction — from first contact through task completion or a human handoff.',
      'The product combines AI-powered communication with business integrations and workflow automation, designed to expand across the channels a business actually uses.',
    ],
    keyDecisions: [
      'AI employee, not chatbot — the product is framed around doing work, not answering questions. Every interaction should end in an action or a clear handoff.',
      'Human handoff by design — automation should know its limits. When a situation needs a person, the product escalates with the context the team needs.',
      'Channel-agnostic core — the conversation layer is built to work across voice and digital channels instead of being locked to one.',
      'Business integrations as the differentiator — the value is in connecting conversation to real workflows: calendars, CRMs, notifications and follow-ups.',
    ],
    architecture: [
      'AI conversation — natural-language customer interaction',
      'Communication channels — voice and messaging',
      'Business integrations — CRM, calendar, APIs and webhooks',
      'Workflow automation — appointments, follow-ups and notifications',
      'Human handoff — escalation to staff when automation should stop',
    ],
    keyFeatures: [
      {
        title: 'AI phone conversations',
        body: 'Natural, real-time voice interaction for incoming and outgoing calls, including callbacks and transfers.',
      },
      {
        title: 'Multi-channel communication',
        body: 'Voice and SMS, with confirmations, notifications and automated follow-ups.',
      },
      {
        title: 'Appointment handling',
        body: 'Customers can book, reschedule or cancel appointments and check real-time availability.',
      },
      {
        title: 'Knowledge base',
        body: 'Answers questions about services, pricing, opening hours and company information.',
      },
      {
        title: 'Business workflow automation',
        body: 'Routine operational tasks handled end to end instead of only generating responses.',
      },
      {
        title: 'Human handoff',
        body: 'Recognises when a situation needs a person and engages staff seamlessly.',
      },
      {
        title: 'Customer context',
        body: 'Maintains relevant context throughout the interaction.',
      },
      {
        title: 'Business integrations',
        body: 'Connects to CRMs, calendars, APIs and webhooks.',
      },
    ],
    technology: [
      'AI',
      'Voice AI',
      'TypeScript / JavaScript',
      'Node.js',
      'APIs',
      'Databases',
      'Automation',
      'Web applications',
    ],
    challenges: [
      {
        title: 'Reliable AI-driven interactions',
        body: 'Designing customer interactions that stay consistent, professional and on-brand across every conversation.',
      },
      {
        title: 'Multiple communication channels',
        body: 'Handling different channels without fragmenting the customer experience.',
      },
      {
        title: 'Consistent customer context',
        body: 'Maintaining relevant context across an interaction so customers never repeat themselves.',
      },
      {
        title: 'Connecting AI to business workflows',
        body: 'Turning a conversation into real actions inside the business instead of just an answer.',
      },
      {
        title: 'Reliable human handoff',
        body: 'Escalating to staff at the right moment, with the context they need to take over.',
      },
      {
        title: 'Production reliability',
        body: 'Designing for real-world operation: availability, monitoring and graceful failure.',
      },
    ],
    outcome: [
      'Heyvelai is a commercial product in active development, built to handle real customer interactions and business workflows.',
      'The product demonstrates how conversational AI can be connected to actual business operations instead of being limited to answering questions.',
    ],
    lessons: [
      'Building a product is different from building a demo — reliability, context and handoff matter more than the model behind the conversation.',
      'The hardest part is not the AI. It is designing the interaction so the customer always knows where they stand, and the business always knows what happened.',
    ],
  },

  nl: {
    slug: 'heyvelai',
    seoTitle: 'Heyvelai — AI-medewerker & Automatisering | Krishna Bihari',
    role: 'Oprichter · Full-Stack & AI Engineer',
    year: '2026',
    overview: [
      'Heyvelai is een AI-gestuurd automatiseringsproduct dat bedrijven helpt klantcommunicatie en repetitieve werkprocessen te automatiseren. Het fungeert als een betrouwbaar, altijd bereikbaar contactpunt — het handelt routinematige klantinteracties af, zodat teams zich kunnen richten op werk dat een mens nodig heeft.',
      'Het product is gebouwd rond één idee: automatisering moet het repetitieve werk overnemen, niet de menselijke relatie met de klant vervangen.',
    ],
    context: [
      'Ik ben Heyvelai gestart omdat ik steeds hetzelfde probleem zag: bedrijven besteden uren per dag aan dezelfde oproepen, berichten en follow-ups. Het werk is nodig maar repetitief, en het houdt mensen weg van het werk dat het bedrijf echt vooruithelpt.',
      'Ik wilde een product bouwen dat conversationele AI combineert met echte bedrijfsacties — geen chatbot die vragen beantwoordt, maar een systeem dat de interactie end-to-end afhandelt.',
    ],
    problem: [
      'Repetitieve klantcommunicatie kost een groot deel van de tijd van een klein bedrijf: dezelfde vragen beantwoorden, afspraken boeken en verplaatsen, follow-ups versturen en gemiste oproepen achtervolgen.',
      'Bestaande automatisering is vaak smal — één kanaal, één vast script. De behoefte is een systeem dat begrijpt wat de klant nodig heeft en actie onderneemt binnen het bedrijf.',
    ],
    solution: [
      'Heyvelai is gebouwd als een AI-medewerker in plaats van een chatbot. Het begrijpt intentie, voert acties uit binnen het bedrijf en werkt de systemen achter de interactie bij — van het eerste contact tot taakvoltooiing of een menselijke overdracht.',
      'Het product combineert AI-gestuurde communicatie met bedrijfsintegraties en workflowautomatisering, ontworpen om uit te breiden naar de kanalen die een bedrijf daadwerkelijk gebruikt.',
    ],
    keyDecisions: [
      'AI-medewerker, geen chatbot — het product draait om werk doen, niet om vragen beantwoorden. Elke interactie moet eindigen in een actie of een duidelijke overdracht.',
      'Menselijke overdracht als ontwerpprincipe — automatisering moet zijn grenzen kennen. Wanneer een situatie een persoon nodig heeft, escaleert het product met de context die het team nodig heeft.',
      'Kanaalonafhankelijke kern — de gesprekslaag is gebouwd om te werken via spraak en digitale kanalen in plaats van vast te zitten aan één kanaal.',
      'Bedrijfsintegraties als onderscheid — de waarde zit in het verbinden van gesprek met echte workflows: agenda\u2019s, CRM\u2019s, meldingen en follow-ups.',
    ],
    architecture: [
      'AI-gesprek — natuurlijke klantinteractie in natuurlijke taal',
      'Communicatiekanalen — spraak en berichten',
      'Bedrijfsintegraties — CRM, agenda, API\u2019s en webhooks',
      'Workflowautomatisering — afspraken, follow-ups en meldingen',
      'Menselijke overdracht — escalatie naar medewerkers wanneer automatisering moet stoppen',
    ],
    keyFeatures: [
      {
        title: 'AI-telefoongesprekken',
        body: 'Natuurlijke, realtime spraakinteractie voor inkomende en uitgaande oproepen, inclusief terugbelverzoeken en doorschakelen.',
      },
      {
        title: 'Meerkanaalscommunicatie',
        body: 'Spraak en SMS, met bevestigingen, meldingen en geautomatiseerde follow-ups.',
      },
      {
        title: 'Afspraakbeheer',
        body: 'Klanten kunnen afspraken boeken, verplaatsen of annuleren en realtime beschikbaarheid controleren.',
      },
      {
        title: 'Kennisbank',
        body: 'Beantwoordt vragen over diensten, prijzen, openingstijden en bedrijfsinformatie.',
      },
      {
        title: 'Workflowautomatisering',
        body: 'Routinematige operationele taken end-to-end afgehandeld in plaats van alleen antwoorden genereren.',
      },
      {
        title: 'Menselijke overdracht',
        body: 'Herkent wanneer een situatie een persoon nodig heeft en schakelt medewerkers naadloos in.',
      },
      {
        title: 'Klantcontext',
        body: 'Behoudt relevante context gedurende de hele interactie.',
      },
      {
        title: 'Bedrijfsintegraties',
        body: 'Verbindt met CRM\u2019s, agenda\u2019s, API\u2019s en webhooks.',
      },
    ],
    technology: [
      'AI',
      'Voice AI',
      'TypeScript / JavaScript',
      'Node.js',
      'API\u2019s',
      'Databases',
      'Automatisering',
      'Webapplicaties',
    ],
    challenges: [
      {
        title: 'Betrouwbare AI-gestuurde interacties',
        body: 'Klantinteracties ontwerpen die consistent, professioneel en on-brand blijven in elk gesprek.',
      },
      {
        title: 'Meerdere communicatiekanalen',
        body: 'Verschillende kanalen afhandelen zonder de klantervaring te versnipperen.',
      },
      {
        title: 'Consistente klantcontext',
        body: 'Relevante context behouden tijdens een interactie, zodat klanten zich nooit hoeven te herhalen.',
      },
      {
        title: 'AI verbinden met bedrijfsprocessen',
        body: 'Een gesprek omzetten in echte acties binnen het bedrijf in plaats van alleen een antwoord.',
      },
      {
        title: 'Betrouwbare menselijke overdracht',
        body: 'Op het juiste moment escaleren naar medewerkers, met de context die zij nodig hebben om over te nemen.',
      },
      {
        title: 'Productiebetrouwbaarheid',
        body: 'Ontwerpen voor de praktijk: beschikbaarheid, monitoring en netjes falen.',
      },
    ],
    outcome: [
      'Heyvelai is een commercieel product in actieve ontwikkeling, gebouwd om echte klantinteracties en bedrijfsprocessen af te handelen.',
      'Het product laat zien hoe conversationele AI kan worden verbonden met echte bedrijfsactiviteiten in plaats van beperkt te blijven tot het beantwoorden van vragen.',
    ],
    lessons: [
      'Een product bouwen is anders dan een demo bouwen — betrouwbaarheid, context en overdracht wegen zwaarder dan het model achter het gesprek.',
      'Het moeilijkste is niet de AI. Het is het ontwerpen van de interactie zodat de klant altijd weet waar hij staat, en het bedrijf altijd weet wat er is gebeurd.',
    ],
  },

  es: {
    slug: 'heyvelai',
    seoTitle: 'Heyvelai — Empleado de IA y Automatización | Krishna Bihari',
    role: 'Fundador · Ingeniero Full-Stack & IA',
    year: '2026',
    overview: [
      'Heyvelai es un producto de automatización impulsado por IA que ayuda a las empresas a automatizar la comunicación con clientes y los flujos de trabajo repetitivos. Actúa como un punto de contacto fiable y siempre disponible: gestiona las interacciones rutinarias para que los equipos puedan centrarse en el trabajo que requiere una persona.',
      'El producto se basa en una idea: la automatización debe encargarse del trabajo repetitivo, no sustituir la relación humana con el cliente.',
    ],
    context: [
      'Empecé Heyvelai porque veía siempre el mismo problema: las empresas pasan horas cada día con las mismas llamadas, mensajes y seguimientos. El trabajo es necesario pero repetitivo, y aleja a las personas del trabajo que realmente hace avanzar al negocio.',
      'Quería construir un producto que combine IA conversacional con acciones empresariales reales — no un chatbot que responde preguntas, sino un sistema que gestiona la interacción de principio a fin.',
    ],
    problem: [
      'La comunicación repetitiva con clientes consume gran parte del tiempo de una pequeña empresa: responder las mismas preguntas, reservar y reprogramar citas, enviar seguimientos y perseguir llamadas perdidas.',
      'La automatización existente suele ser limitada: un canal, un flujo fijo. La necesidad es un sistema que entienda lo que el cliente necesita y actúe dentro del negocio.',
    ],
    solution: [
      'Heyvelai está construido como un empleado de IA, no como un chatbot. Comprende la intención, actúa dentro del negocio y actualiza los sistemas detrás de la interacción — desde el primer contacto hasta la finalización de la tarea o la transferencia a una persona.',
      'El producto combina comunicación impulsada por IA con integraciones empresariales y automatización de flujos de trabajo, diseñado para expandirse a los canales que una empresa realmente utiliza.',
    ],
    keyDecisions: [
      'Empleado de IA, no chatbot — el producto se centra en hacer trabajo, no en responder preguntas. Cada interacción debe terminar en una acción o una transferencia clara.',
      'Transferencia a una persona por diseño — la automatización debe conocer sus límites. Cuando una situación necesita a una persona, el producto escala con el contexto que el equipo necesita.',
      'Núcleo independiente del canal — la capa de conversación está construida para funcionar en voz y canales digitales en lugar de estar limitada a uno.',
      'Integraciones empresariales como diferenciador — el valor está en conectar la conversación con flujos de trabajo reales: calendarios, CRM, notificaciones y seguimientos.',
    ],
    architecture: [
      'Conversación con IA — interacción natural con el cliente',
      'Canales de comunicación — voz y mensajería',
      'Integraciones empresariales — CRM, calendario, API y webhooks',
      'Automatización de flujos de trabajo — citas, seguimientos y notificaciones',
      'Transferencia a una persona — escalado al personal cuando la automatización debe detenerse',
    ],
    keyFeatures: [
      {
        title: 'Conversaciones telefónicas con IA',
        body: 'Interacción de voz natural y en tiempo real para llamadas entrantes y salientes, incluidas devoluciones de llamada y transferencias.',
      },
      {
        title: 'Comunicación multicanal',
        body: 'Voz y SMS, con confirmaciones, notificaciones y seguimientos automatizados.',
      },
      {
        title: 'Gestión de citas',
        body: 'Los clientes pueden reservar, reprogramar o cancelar citas y consultar la disponibilidad en tiempo real.',
      },
      {
        title: 'Base de conocimiento',
        body: 'Responde preguntas sobre servicios, precios, horarios e información de la empresa.',
      },
      {
        title: 'Automatización de flujos de trabajo',
        body: 'Tareas operativas rutinarias gestionadas de principio a fin, no solo respuestas generadas.',
      },
      {
        title: 'Transferencia a una persona',
        body: 'Reconoce cuándo una situación necesita a una persona y activa al personal sin fricción.',
      },
      {
        title: 'Contexto del cliente',
        body: 'Mantiene el contexto relevante durante toda la interacción.',
      },
      {
        title: 'Integraciones empresariales',
        body: 'Se conecta a CRM, calendarios, API y webhooks.',
      },
    ],
    technology: [
      'IA',
      'Voz con IA',
      'TypeScript / JavaScript',
      'Node.js',
      'API',
      'Bases de datos',
      'Automatización',
      'Aplicaciones web',
    ],
    challenges: [
      {
        title: 'Interacciones fiables con IA',
        body: 'Diseñar interacciones con clientes que se mantengan coherentes, profesionales y fieles a la marca en cada conversación.',
      },
      {
        title: 'Múltiples canales de comunicación',
        body: 'Gestionar distintos canales sin fragmentar la experiencia del cliente.',
      },
      {
        title: 'Contexto del cliente coherente',
        body: 'Mantener el contexto relevante durante una interacción para que los clientes no tengan que repetirse.',
      },
      {
        title: 'Conectar la IA con los flujos de trabajo',
        body: 'Convertir una conversación en acciones reales dentro del negocio, no solo en una respuesta.',
      },
      {
        title: 'Transferencia fiable a una persona',
        body: 'Escalar al personal en el momento adecuado, con el contexto que necesitan para continuar.',
      },
      {
        title: 'Fiabilidad en producción',
        body: 'Diseñar para el mundo real: disponibilidad, monitorización y fallos controlados.',
      },
    ],
    outcome: [
      'Heyvelai es un producto comercial en desarrollo activo, construido para gestionar interacciones reales con clientes y flujos de trabajo empresariales.',
      'El producto demuestra cómo la IA conversacional puede conectarse a operaciones empresariales reales en lugar de limitarse a responder preguntas.',
    ],
    lessons: [
      'Construir un producto es diferente de construir una demo: la fiabilidad, el contexto y la transferencia importan más que el modelo detrás de la conversación.',
      'La parte más difícil no es la IA. Es diseñar la interacción para que el cliente siempre sepa dónde está, y la empresa siempre sepa qué ha ocurrido.',
    ],
  },
};

/* ────────────────────────────────────────────────────────────────
   Project BLACKOUT — personal project
   Written honestly: the concept, motivation and design thinking are
   real; no specific implemented features are invented.
──────────────────────────────────────────────────────────────── */

const projectBlackout: Record<Lang, CaseStudy> = {
  en: {
    slug: 'project-blackout',
    seoTitle: 'Project BLACKOUT — Personal System & Web App | Krishna Bihari',
    role: 'Creator · Design & Development',
    year: '2026',
    overview: [
      'Project BLACKOUT is a personal web application built around discipline, progress, journaling and a gamified progression system. It is a system for making consistency visible — a place where daily actions, honest reflection and long-term progression live in one loop.',
      'It started as a tool for myself and is being built as a proper web application.',
    ],
    context: [
      'I built BLACKOUT because the tools I tried never matched how I actually work. Habit trackers reward streaks but not reflection. Journals capture thoughts but not progress. I wanted one system where the daily work and the long-term picture reinforce each other.',
      'The name comes from the idea of committing fully to a period of focused work — no distractions, no half-measures.',
    ],
    problem: [
      'Staying consistent is the hard part of any long-term goal. Motivation fades, progress is invisible, and most tools either nag or ignore you.',
      'The problem I wanted to solve was not tracking — it was staying honest with myself about what I actually did and why.',
    ],
    solution: [
      'BLACKOUT is designed around three connected layers: discipline (what you commit to), progress (what you can see), and journaling (what you reflect on). A gamified progression system ties them together, so consistency builds something visible over time.',
      'The system is being built as a personal web application, designed to be fast, private and focused — no social features, no noise.',
    ],
    keyDecisions: [
      'Progression over streaks — streaks punish a single missed day. The system is designed around progression that survives an off day, so consistency is about the long run, not perfection.',
      'Journaling as the core loop — the daily journal is where discipline becomes honest. The system is built around writing, not just checking boxes.',
      'Gamification as a reward for consistency — progression mechanics exist to make effort visible, not to manufacture motivation.',
      'Private by design — this is a personal system. No accounts, no sharing, no leaderboards.',
    ],
    architecture: [
      'Discipline — the daily commitments you make',
      'Progress — how consistent effort builds over time',
      'Journaling — the private reflection layer',
      'Gamified progression — the system that ties it together',
    ],
    keyFeatures: [
      {
        title: 'Discipline tracking',
        body: 'Commit to daily actions and keep them visible.',
      },
      {
        title: 'Progress system',
        body: 'See how consistent effort builds over time.',
      },
      {
        title: 'Journaling',
        body: 'A private space for daily reflection and honest notes.',
      },
      {
        title: 'Gamified progression',
        body: 'Consistency builds visible progression within the system.',
      },
    ],
    technology: ['Web application', 'TypeScript', 'Design', 'UX'],
    challenges: [
      {
        title: 'Scope',
        body: 'Building for yourself makes it easy to add everything. The challenge is keeping the system small enough to actually use.',
      },
      {
        title: 'Honest design',
        body: 'A discipline tool only works if it is honest. The design has to make it easy to be truthful, not easy to look good.',
      },
      {
        title: 'Motivation design',
        body: 'The line between helpful progression and manipulative gamification is thin. The system has to respect the user.',
      },
    ],
    outcome: [
      'BLACKOUT is a personal project in active development. The value is in the system itself — a place where discipline, progress and reflection reinforce each other.',
      'It is being built the way I build everything: as a real product, not a demo.',
    ],
    lessons: [
      'The best tools are the ones you build for your own problem. The requirements are honest because the user is you.',
      'A personal project is the best place to make product decisions fast — there is no stakeholder to convince, only a problem to solve.',
    ],
  },

  nl: {
    slug: 'project-blackout',
    seoTitle: 'Project BLACKOUT — Persoonlijk systeem & Webapp | Krishna Bihari',
    role: 'Maker · Ontwerp & Ontwikkeling',
    year: '2026',
    overview: [
      'Project BLACKOUT is een persoonlijke webapplicatie gebouwd rond discipline, voortgang, journaling en een gamified progressiesysteem. Het is een systeem om consistentie zichtbaar te maken — een plek waar dagelijkse acties, eerlijke reflectie en langetermijnvoortgang in één lus samenkomen.',
      'Het begon als een tool voor mezelf en wordt gebouwd als een echte webapplicatie.',
    ],
    context: [
      'Ik heb BLACKOUT gebouwd omdat de tools die ik probeerde nooit pasten bij hoe ik echt werk. Habit trackers belonen streaks maar geen reflectie. Journals leggen gedachten vast maar geen voortgang. Ik wilde één systeem waarin het dagelijkse werk en het langetermijnbeeld elkaar versterken.',
      'De naam komt van het idee om je volledig te committeren aan een periode van gefocust werk — geen afleiding, geen half werk.',
    ],
    problem: [
      'Consistent blijven is het moeilijkste deel van elk langetermijndoel. Motivatie vervaagt, voortgang is onzichtbaar, en de meeste tools zeuren of negeren je.',
      'Het probleem dat ik wilde oplossen was niet tracking — het was eerlijk blijven tegenover mezelf over wat ik echt deed en waarom.',
    ],
    solution: [
      'BLACKOUT is ontworpen rond drie verbonden lagen: discipline (waar je je aan committeert), voortgang (wat je kunt zien) en journaling (waarover je reflecteert). Een gamified progressiesysteem verbindt ze, zodat consistentie na verloop van tijd iets zichtbaars opbouwt.',
      'Het systeem wordt gebouwd als een persoonlijke webapplicatie, ontworpen om snel, privé en gefocust te zijn — geen sociale functies, geen ruis.',
    ],
    keyDecisions: [
      'Progressie boven streaks — streaks straffen één gemiste dag af. Het systeem is ontworpen rond progressie die een mindere dag overleeft, zodat consistentie over de lange termijn gaat, niet over perfectie.',
      'Journaling als kernlus — het dagelijkse journal is waar discipline eerlijk wordt. Het systeem draait om schrijven, niet alleen om vakjes aanvinken.',
      'Gamificatie als beloning voor consistentie — progressiemechanieken bestaan om inspanning zichtbaar te maken, niet om motivatie te fabriceren.',
      'Privé door ontwerp — dit is een persoonlijk systeem. Geen accounts, geen delen, geen leaderboards.',
    ],
    architecture: [
      'Discipline — de dagelijkse afspraken die je maakt',
      'Voortgang — hoe consistente inspanning zich opbouwt',
      'Journaling — de privé reflectielaag',
      'Gamified progressie — het systeem dat het verbindt',
    ],
    keyFeatures: [
      {
        title: 'Discipline bijhouden',
        body: 'Commit aan dagelijkse acties en houd ze zichtbaar.',
      },
      {
        title: 'Voortgangssysteem',
        body: 'Zie hoe consistente inspanning zich opbouwt.',
      },
      {
        title: 'Journaling',
        body: 'Een privéruimte voor dagelijkse reflectie en eerlijke notities.',
      },
      {
        title: 'Gamified progressie',
        body: 'Consistentie bouwt zichtbare progressie op binnen het systeem.',
      },
    ],
    technology: ['Webapplicatie', 'TypeScript', 'Ontwerp', 'UX'],
    challenges: [
      {
        title: 'Scope',
        body: 'Voor jezelf bouwen maakt het makkelijk om alles toe te voegen. De uitdaging is het systeem klein genoeg te houden om het echt te gebruiken.',
      },
      {
        title: 'Eerlijk ontwerp',
        body: 'Een disciplinetool werkt alleen als hij eerlijk is. Het ontwerp moet het makkelijk maken om waarheidsgetrouw te zijn, niet om er goed uit te zien.',
      },
      {
        title: 'Motivatieontwerp',
        body: 'De grens tussen behulpzame progressie en manipulatieve gamificatie is dun. Het systeem moet de gebruiker respecteren.',
      },
    ],
    outcome: [
      'BLACKOUT is een persoonlijk project in actieve ontwikkeling. De waarde zit in het systeem zelf — een plek waar discipline, voortgang en reflectie elkaar versterken.',
      'Het wordt gebouwd zoals ik alles bouw: als een echt product, niet als een demo.',
    ],
    lessons: [
      'De beste tools zijn de tools die je bouwt voor je eigen probleem. De eisen zijn eerlijk omdat de gebruiker jij bent.',
      'Een persoonlijk project is de beste plek om snel productbeslissingen te nemen — er is geen stakeholder om te overtuigen, alleen een probleem om op te lossen.',
    ],
  },

  es: {
    slug: 'project-blackout',
    seoTitle: 'Project BLACKOUT — Sistema personal y aplicación web | Krishna Bihari',
    role: 'Creador · Diseño y Desarrollo',
    year: '2026',
    overview: [
      'Project BLACKOUT es una aplicación web personal construida en torno a la disciplina, el progreso, el journaling y un sistema de progresión gamificado. Es un sistema para hacer visible la constancia: un lugar donde las acciones diarias, la reflexión honesta y la progresión a largo plazo viven en un mismo bucle.',
      'Empezó como una herramienta para mí mismo y se está construyendo como una aplicación web real.',
    ],
    context: [
      'Construí BLACKOUT porque las herramientas que probé nunca coincidían con cómo trabajo realmente. Los rastreadores de hábitos premian las rachas pero no la reflexión. Los diarios capturan pensamientos pero no progreso. Quería un sistema donde el trabajo diario y la visión a largo plazo se refuercen mutuamente.',
      'El nombre viene de la idea de comprometerse plenamente con un periodo de trabajo concentrado: sin distracciones, sin medias tintas.',
    ],
    problem: [
      'Ser constante es la parte difícil de cualquier objetivo a largo plazo. La motivación se desvanece, el progreso es invisible y la mayoría de las herramientas o te presionan o te ignoran.',
      'El problema que quería resolver no era el seguimiento — era ser honesto conmigo mismo sobre lo que realmente hacía y por qué.',
    ],
    solution: [
      'BLACKOUT está diseñado en torno a tres capas conectadas: disciplina (a lo que te comprometes), progreso (lo que puedes ver) y journaling (sobre lo que reflexionas). Un sistema de progresión gamificado las une, de modo que la constancia construye algo visible con el tiempo.',
      'El sistema se está construyendo como una aplicación web personal, diseñada para ser rápida, privada y enfocada: sin funciones sociales, sin ruido.',
    ],
    keyDecisions: [
      'Progresión sobre rachas — las rachas castigan un solo día perdido. El sistema está diseñado en torno a una progresión que sobrevive a un mal día, de modo que la constancia se trata del largo plazo, no de la perfección.',
      'Journaling como bucle central — el diario diario es donde la disciplina se vuelve honesta. El sistema se basa en escribir, no solo en marcar casillas.',
      'Gamificación como recompensa a la constancia — los mecanismos de progresión existen para hacer visible el esfuerzo, no para fabricar motivación.',
      'Privado por diseño — este es un sistema personal. Sin cuentas, sin compartir, sin clasificaciones.',
    ],
    architecture: [
      'Disciplina — los compromisos diarios que haces',
      'Progreso — cómo el esfuerzo constante se acumula',
      'Journaling — la capa privada de reflexión',
      'Progresión gamificada — el sistema que lo une todo',
    ],
    keyFeatures: [
      {
        title: 'Seguimiento de disciplina',
        body: 'Comprométete con acciones diarias y mantenlas visibles.',
      },
      {
        title: 'Sistema de progreso',
        body: 'Observa cómo el esfuerzo constante se acumula con el tiempo.',
      },
      {
        title: 'Journaling',
        body: 'Un espacio privado para la reflexión diaria y notas honestas.',
      },
      {
        title: 'Progresión gamificada',
        body: 'La constancia construye progresión visible dentro del sistema.',
      },
    ],
    technology: ['Aplicación web', 'TypeScript', 'Diseño', 'UX'],
    challenges: [
      {
        title: 'Alcance',
        body: 'Construir para ti mismo hace fácil añadirlo todo. El desafío es mantener el sistema lo bastante pequeño para usarlo de verdad.',
      },
      {
        title: 'Diseño honesto',
        body: 'Una herramienta de disciplina solo funciona si es honesta. El diseño debe facilitar ser veraz, no parecer bien.',
      },
      {
        title: 'Diseño de motivación',
        body: 'La línea entre progresión útil y gamificación manipuladora es fina. El sistema debe respetar al usuario.',
      },
    ],
    outcome: [
      'BLACKOUT es un proyecto personal en desarrollo activo. El valor está en el propio sistema: un lugar donde disciplina, progreso y reflexión se refuerzan mutuamente.',
      'Se está construyendo como construyo todo: como un producto real, no como una demo.',
    ],
    lessons: [
      'Las mejores herramientas son las que construyes para tu propio problema. Los requisitos son honestos porque el usuario eres tú.',
      'Un proyecto personal es el mejor lugar para tomar decisiones de producto rápido: no hay un interesado que convencer, solo un problema que resolver.',
    ],
  },
};

/* ────────────────────────────────────────────────────────────────
   Budget Buddy — school project (concise)
──────────────────────────────────────────────────────────────── */

const budgetBuddy: Record<Lang, CaseStudy> = {
  en: {
    slug: 'budget-buddy',
    seoTitle: 'Budget Buddy — Full-Stack Web App | Krishna Bihari',
    role: 'Developer · Full-Stack',
    year: '2026',
    overview: [
      'Budget Buddy is a full-stack application for tracking, understanding and managing personal finances. It was built as a school project at ROC Mondriaan.',
    ],
    context: [
      'The assignment was to design and build a complete full-stack application. I chose personal finance because it is a real problem with clear requirements: transactions, categories, budgets and reporting.',
    ],
    problem: [
      'Most people do not know where their money goes. The goal was a tool that makes spending visible and manageable — not a bank, but a clear picture of your own finances.',
    ],
    solution: [
      'I built a full-stack finance application with transaction management, budget categorisation, role-based user and admin access, and data visualisation — delivered through a clean interface.',
    ],
    keyDecisions: [
      'Symfony 6 with Twig and Doctrine ORM for a structured, maintainable backend.',
      'Chart.js for clear, lightweight data visualisation.',
      'Role-based access control so users and admins have clearly separated capabilities.',
    ],
    technology: [
      'Symfony',
      'PHP',
      'Twig',
      'Chart.js',
      'MySQL',
      'Doctrine ORM',
    ],
    outcome: [
      'A complete full-stack application delivered for the school project, covering the full flow from authentication to reporting.',
    ],
    lessons: [
      'This project taught me the full-stack flow end to end: data modelling, ORM, authentication, and turning data into something people can read at a glance.',
    ],
  },

  nl: {
    slug: 'budget-buddy',
    seoTitle: 'Budget Buddy — Full-stack webapp | Krishna Bihari',
    role: 'Ontwikkelaar · Full-Stack',
    year: '2026',
    overview: [
      'Budget Buddy is een full-stack applicatie voor het bijhouden, begrijpen en beheren van persoonlijke financiën. Het is gebouwd als schoolproject bij ROC Mondriaan.',
    ],
    context: [
      'De opdracht was om een complete full-stack applicatie te ontwerpen en bouwen. Ik koos voor persoonlijke financiën omdat het een echt probleem is met duidelijke eisen: transacties, categorieën, budgetten en rapportages.',
    ],
    problem: [
      'De meeste mensen weten niet waar hun geld naartoe gaat. Het doel was een tool die uitgaven zichtbaar en beheersbaar maakt — geen bank, maar een duidelijk beeld van je eigen financiën.',
    ],
    solution: [
      'Ik bouwde een full-stack financiële applicatie met transactiebeheer, budgetcategorisatie, rolgebaseerde gebruikers- en admin-toegang en datavisualisatie — geleverd via een schone interface.',
    ],
    keyDecisions: [
      'Symfony 6 met Twig en Doctrine ORM voor een gestructureerde, onderhoudbare backend.',
      'Chart.js voor duidelijke, lichte datavisualisatie.',
      'Rolgebaseerde toegangscontrole zodat gebruikers en admins duidelijk gescheiden mogelijkheden hebben.',
    ],
    technology: [
      'Symfony',
      'PHP',
      'Twig',
      'Chart.js',
      'MySQL',
      'Doctrine ORM',
    ],
    outcome: [
      'Een complete full-stack applicatie opgeleverd voor het schoolproject, van authenticatie tot rapportage.',
    ],
    lessons: [
      'Dit project leerde me de full-stack flow end-to-end: datamodellering, ORM, authenticatie en het omzetten van data in iets dat mensen in één oogopslag kunnen lezen.',
    ],
  },

  es: {
    slug: 'budget-buddy',
    seoTitle: 'Budget Buddy — Aplicación web full-stack | Krishna Bihari',
    role: 'Desarrollador · Full-Stack',
    year: '2026',
    overview: [
      'Budget Buddy es una aplicación full-stack para registrar, comprender y gestionar las finanzas personales. Se construyó como proyecto escolar en ROC Mondriaan.',
    ],
    context: [
      'La tarea era diseñar y construir una aplicación full-stack completa. Elegí las finanzas personales porque es un problema real con requisitos claros: transacciones, categorías, presupuestos e informes.',
    ],
    problem: [
      'La mayoría de la gente no sabe a dónde va su dinero. El objetivo era una herramienta que hiciera visible y manejable el gasto — no un banco, sino una imagen clara de tus propias finanzas.',
    ],
    solution: [
      'Construí una aplicación financiera full-stack con gestión de transacciones, categorización de presupuestos, acceso de usuario y administrador basado en roles y visualización de datos — entregada a través de una interfaz limpia.',
    ],
    keyDecisions: [
      'Symfony 6 con Twig y Doctrine ORM para un backend estructurado y mantenible.',
      'Chart.js para una visualización de datos clara y ligera.',
      'Control de acceso basado en roles para que usuarios y administradores tengan capacidades claramente separadas.',
    ],
    technology: [
      'Symfony',
      'PHP',
      'Twig',
      'Chart.js',
      'MySQL',
      'Doctrine ORM',
    ],
    outcome: [
      'Una aplicación full-stack completa entregada para el proyecto escolar, que cubre todo el flujo desde la autenticación hasta los informes.',
    ],
    lessons: [
      'Este proyecto me enseñó el flujo full-stack de principio a fin: modelado de datos, ORM, autenticación y convertir datos en algo que la gente pueda leer de un vistazo.',
    ],
  },
};

/* ────────────────────────────────────────────────────────────────
   SDG Dashboard — school project (concise)
──────────────────────────────────────────────────────────────── */

const sdgDashboard: Record<Lang, CaseStudy> = {
  en: {
    slug: 'sdg-dashboard',
    seoTitle: 'SDG Dashboard — Full-Stack Data Platform | Krishna Bihari',
    role: 'Developer · Full-Stack',
    year: '2026',
    overview: [
      'SDG Dashboard is a data dashboard designed to make the Sustainable Development Goals more accessible through data and interactive visualisations. It was built as a school project at ROC Mondriaan.',
    ],
    context: [
      'The assignment was to build a full-stack application around a meaningful dataset. I chose the UN Sustainable Development Goals because the data is complex, public and genuinely useful — if it can be made readable.',
    ],
    problem: [
      'SDG data is scattered and technical. The goal was to make it accessible: a dashboard where the goals, indicators and trends are understandable at a glance.',
    ],
    solution: [
      'I built a full-stack data platform with interactive charts, user authentication and CSV data export, backed by a relational database.',
    ],
    keyDecisions: [
      'Next.js with TypeScript for a typed, component-based frontend and API layer.',
      'Prisma ORM with MySQL for a clean data layer.',
      'Interactive charts as the core of the interface — the data had to be explorable, not just displayed.',
    ],
    technology: [
      'Next.js',
      'TypeScript',
      'Prisma',
      'MySQL',
      'NextAuth',
      'Recharts',
    ],
    outcome: [
      'A complete full-stack dashboard delivered for the school project, from authentication to interactive data exploration and export.',
    ],
    lessons: [
      'This project taught me how much of data work is presentation: the same numbers can be opaque or obvious depending on how they are visualised.',
    ],
  },

  nl: {
    slug: 'sdg-dashboard',
    seoTitle: 'SDG Dashboard — Full-stack dataplatform | Krishna Bihari',
    role: 'Ontwikkelaar · Full-Stack',
    year: '2026',
    overview: [
      'SDG Dashboard is een datadashboard dat de Sustainable Development Goals toegankelijker maakt via data en interactieve visualisaties. Het is gebouwd als schoolproject bij ROC Mondriaan.',
    ],
    context: [
      'De opdracht was om een full-stack applicatie te bouwen rond een betekenisvolle dataset. Ik koos voor de VN Sustainable Development Goals omdat de data complex, openbaar en echt nuttig is — als het leesbaar gemaakt kan worden.',
    ],
    problem: [
      'SDG-data is verspreid en technisch. Het doel was om het toegankelijk te maken: een dashboard waar de doelen, indicatoren en trends in één oogopslag te begrijpen zijn.',
    ],
    solution: [
      'Ik bouwde een full-stack dataplatform met interactieve grafieken, gebruikersauthenticatie en CSV-data-export, ondersteund door een relationele database.',
    ],
    keyDecisions: [
      'Next.js met TypeScript voor een getypeerde, componentgebaseerde frontend en API-laag.',
      'Prisma ORM met MySQL voor een schone datalaag.',
      'Interactieve grafieken als kern van de interface — de data moest verkend kunnen worden, niet alleen getoond.',
    ],
    technology: [
      'Next.js',
      'TypeScript',
      'Prisma',
      'MySQL',
      'NextAuth',
      'Recharts',
    ],
    outcome: [
      'Een compleet full-stack dashboard opgeleverd voor het schoolproject, van authenticatie tot interactieve dataverkenning en export.',
    ],
    lessons: [
      'Dit project leerde me hoeveel datawerk presentatie is: dezelfde cijfers kunnen ondoorzichtig of voor de hand liggend zijn, afhankelijk van hoe ze worden gevisualiseerd.',
    ],
  },

  es: {
    slug: 'sdg-dashboard',
    seoTitle: 'SDG Dashboard — Plataforma de datos full-stack | Krishna Bihari',
    role: 'Desarrollador · Full-Stack',
    year: '2026',
    overview: [
      'SDG Dashboard es un panel de datos diseñado para hacer más accesibles los Objetivos de Desarrollo Sostenible mediante datos y visualizaciones interactivas. Se construyó como proyecto escolar en ROC Mondriaan.',
    ],
    context: [
      'La tarea era construir una aplicación full-stack en torno a un conjunto de datos significativo. Elegí los Objetivos de Desarrollo Sostenible de la ONU porque los datos son complejos, públicos y realmente útiles — si se pueden hacer legibles.',
    ],
    problem: [
      'Los datos de los ODS están dispersos y son técnicos. El objetivo era hacerlos accesibles: un panel donde los objetivos, indicadores y tendencias se entiendan de un vistazo.',
    ],
    solution: [
      'Construí una plataforma de datos full-stack con gráficos interactivos, autenticación de usuarios y exportación de datos CSV, respaldada por una base de datos relacional.',
    ],
    keyDecisions: [
      'Next.js con TypeScript para un frontend y una capa de API tipados y basados en componentes.',
      'Prisma ORM con MySQL para una capa de datos limpia.',
      'Gráficos interactivos como núcleo de la interfaz: los datos debían poder explorarse, no solo mostrarse.',
    ],
    technology: [
      'Next.js',
      'TypeScript',
      'Prisma',
      'MySQL',
      'NextAuth',
      'Recharts',
    ],
    outcome: [
      'Un panel full-stack completo entregado para el proyecto escolar, desde la autenticación hasta la exploración interactiva de datos y la exportación.',
    ],
    lessons: [
      'Este proyecto me enseñó cuánto del trabajo con datos es presentación: los mismos números pueden ser opacos u obvios según cómo se visualicen.',
    ],
  },
};

const caseStudies: Record<string, Partial<Record<Lang, CaseStudy>>> = {
  heyvelai,
  'project-blackout': projectBlackout,
  'budget-buddy': budgetBuddy,
  'sdg-dashboard': sdgDashboard,
};

export const CASE_STUDY_SLUGS: ReadonlySet<string> = new Set(
  Object.keys(caseStudies),
);

export function hasCaseStudy(slug: string): boolean {
  return CASE_STUDY_SLUGS.has(slug);
}

export function getCaseStudy(slug: string, lang: Lang): CaseStudy | null {
  const entry = caseStudies[slug];
  if (!entry) return null;
  return entry[lang] ?? entry.en ?? null;
}
