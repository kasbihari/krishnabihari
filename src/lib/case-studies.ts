import type { Lang } from '../i18n';

/**
 * Case-study content, keyed by project slug, per language.
 *
 * A project gets a case-study page when its slugified title appears in
 * CASE_STUDY_SLUGS. Content is written from real engineering work only —
 * no invented metrics, client numbers, or outcomes.
 *
 * The Veyxo case study intentionally stays high-level: it communicates
 * what the product is and what it does without exposing the internal
 * architecture, orchestration, prompts, or implementation details.
 */

export type CaseStudyFeature = { title: string; body: string };
export type CaseStudyChallenge = { title: string; body: string };

export type CaseStudy = {
  slug: string;
  seoTitle: string;
  role: string;
  year: string;
  overview: string[];
  problem: string[];
  solution: string[];
  architecture: string[];
  keyFeatures: CaseStudyFeature[];
  technology: string[];
  challenges: CaseStudyChallenge[];
  outcome: string[];
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const veyxo: Record<Lang, CaseStudy> = {
  en: {
    slug: 'veyxo',
    seoTitle: 'Veyxo — AI Employee Platform | Krishna Bihari',
    role: 'Founder · Full-Stack & AI Engineer',
    year: '2024 — now',
    overview: [
      'Veyxo is an AI employee platform that handles customer-facing communication and business workflows. It acts as a 24/7 fixed contact point for businesses — answering calls, managing appointments, and resolving routine customer interactions so the team can focus on work that needs a human.',
      'Veyxo is designed to expand across digital channels such as WhatsApp, web chat, email and forms, with voice and SMS as the current communication channels.',
    ],
    problem: [
      'Businesses spend significant time on repetitive customer interactions: calls, appointment requests, rescheduling, questions, and follow-ups. Missed calls and long wait times cost customers, and routine work keeps staff from higher-value tasks.',
      'Traditional automation often handles only one narrow channel or one predefined workflow. The gap is a system that combines conversational AI with real business actions.',
    ],
    solution: [
      'I built Veyxo as an AI employee rather than a chatbot. It does not merely respond to customers — it understands intent, takes action inside the business, and updates the systems behind the interaction.',
      'Veyxo combines AI-powered communication with business integrations and workflow automation to handle customer interactions from initial contact through task completion or human handoff.',
    ],
    architecture: [
      'AI conversation — natural-language customer interaction across channels',
      'Communication infrastructure — voice and messaging channels',
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
        body: 'Routine operational tasks handled end-to-end instead of only generating responses.',
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
      'Veyxo evolved from an AI communication concept into a production-oriented AI employee platform designed to handle real customer interactions and business workflows.',
      'The platform demonstrates how conversational AI can be connected to actual business operations instead of being limited to answering questions.',
    ],
  },

  nl: {
    slug: 'veyxo',
    seoTitle: 'Veyxo — AI-employeeproject | Krishna Bihari',
    role: 'Oprichter · Full-Stack & AI Engineer',
    year: '2024 — nu',
    overview: [
      'Veyxo is een AI-employeeproject dat klantgerichte communicatie en bedrijfsprocessen afhandelt. Het fungeert als een 24/7 vast contactpunt voor bedrijven — het beantwoordt oproepen, beheert afspraken en lost routinematige klantinteracties op, zodat het team zich kan richten op werk dat een mens nodig heeft.',
      'Veyxo is ontworpen om uit te breiden naar digitale kanalen zoals WhatsApp, webchat, e-mail en formulieren, met spraak en SMS als de huidige communicatiekanalen.',
    ],
    problem: [
      'Bedrijven besteden veel tijd aan herhaalde klantinteracties: oproepen, afspraakverzoeken, verplaatsingen, vragen en follow-ups. Gemiste oproepen en lange wachttijden kosten klanten, en routinematig werk houdt medewerkers weg van waardevollere taken.',
      'Traditionele automatisering pakt vaak slechts één smal kanaal of één vooraf gedefinieerde workflow aan. De behoefte is een systeem dat conversationele AI combineert met echte bedrijfsacties.',
    ],
    solution: [
      'Ik heb Veyxo gebouwd als een AI-employee in plaats van een chatbot. Het reageert niet alleen op klanten — het begrijpt intentie, voert acties uit binnen het bedrijf en werkt de systemen achter de interactie bij.',
      'Veyxo combineert AI-gestuurde communicatie met bedrijfsintegraties en workflowautomatisering om klantinteracties af te handelen van het eerste contact tot taakvoltooiing of menselijke overdracht.',
    ],
    architecture: [
      'AI-gesprek — natuurlijke klantinteractie in natuurlijke taal via meerdere kanalen',
      'Communicatie-infrastructuur — spraak- en berichtenkanalen',
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
      'Veyxo is ge\u00EBvolueerd van een AI-communicatieconcept naar een productiegericht AI-employeeproject dat is ontworpen om echte klantinteracties en bedrijfsprocessen af te handelen.',
      'Het project laat zien hoe conversationele AI kan worden verbonden met echte bedrijfsactiviteiten in plaats van beperkt te blijven tot het beantwoorden van vragen.',
    ],
  },

  es: {
    slug: 'veyxo',
    seoTitle: 'Veyxo — Plataforma de empleado de IA | Krishna Bihari',
    role: 'Fundador · Ingeniero Full-Stack & IA',
    year: '2024 — ahora',
    overview: [
      'Veyxo es una plataforma de empleado de IA que gestiona la comunicación con clientes y los flujos de trabajo del negocio. Actúa como un punto de contacto fijo 24/7 para las empresas: atiende llamadas, gestiona citas y resuelve interacciones rutinarias con clientes para que el equipo pueda centrarse en el trabajo que requiere una persona.',
      'Veyxo está diseñado para expandirse a canales digitales como WhatsApp, chat web, correo electrónico y formularios, con voz y SMS como canales de comunicación actuales.',
    ],
    problem: [
      'Las empresas dedican mucho tiempo a interacciones repetitivas con clientes: llamadas, solicitudes de citas, reprogramaciones, preguntas y seguimientos. Las llamadas perdidas y las largas esperas cuestan clientes, y el trabajo rutinario aleja al personal de tareas de mayor valor.',
      'La automatización tradicional suele manejar solo un canal limitado o un flujo de trabajo predefinido. La necesidad es un sistema que combine IA conversacional con acciones empresariales reales.',
    ],
    solution: [
      'Construí Veyxo como un empleado de IA, no como un chatbot. No solo responde a los clientes: comprende la intención, actúa dentro del negocio y actualiza los sistemas detrás de la interacción.',
      'Veyxo combina comunicación impulsada por IA con integraciones empresariales y automatización de flujos de trabajo para gestionar las interacciones con clientes desde el primer contacto hasta la finalización de la tarea o la transferencia a una persona.',
    ],
    architecture: [
      'Conversación con IA — interacción natural con el cliente en varios canales',
      'Infraestructura de comunicación — canales de voz y mensajería',
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
      'Veyxo evolucionó de un concepto de comunicación con IA a una plataforma de empleado de IA orientada a producción, diseñada para gestionar interacciones reales con clientes y flujos de trabajo empresariales.',
      'La plataforma demuestra cómo la IA conversacional puede conectarse a operaciones empresariales reales en lugar de limitarse a responder preguntas.',
    ],
  },
};

const caseStudies: Record<string, Partial<Record<Lang, CaseStudy>>> = {
  veyxo,
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
