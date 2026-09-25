import type { Lang } from '../i18n';

/**
 * Case-study content, keyed by project slug, per language.
 *
 * A project gets a case-study page when its slugified title appears in
 * CASE_STUDY_SLUGS. Content is written from real engineering work only —
 * no invented metrics, client numbers, or outcomes.
 */

export type CaseStudyFeature = { title: string; body: string };
export type CaseStudyChallenge = { title: string; body: string };

export type CaseStudy = {
  slug: string;
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

const veyro: Record<Lang, CaseStudy> = {
  en: {
    slug: 'veyro-agent',
    role: 'Founder · Full-Stack & AI Engineer',
    year: '2024 — now',
    overview: [
      'Veyro Agent is an AI-powered voice automation platform for building business receptionists and voice automations. It handles inbound and outbound calls through Twilio and ElevenLabs with configurable conversation flows, dynamic customer context, appointment scheduling, SMS actions, human handoff, call routing, and real-time monitoring.',
      'It is designed as a reusable platform that adapts to different businesses, workflows, and communication requirements — not a one-off callbot.',
    ],
    problem: [
      'Businesses lose revenue and trust when calls go unanswered or customers wait. Repetitive inquiries consume staff time, and personal communication does not scale — especially in processes like debt collection, appointment handling, and customer service, where consistency, compliance, and availability matter.',
      'Off-the-shelf IVR menus feel impersonal, while fully manual handling does not scale. The gap is a voice agent that sounds human, follows business rules, and plugs into real workflows.',
    ],
    solution: [
      'I built a platform where an AI voice agent is configured per business rather than hardcoded per use case. Conversation flows, customer context, scheduling, actions, and handoff rules are all configurable through the platform.',
      'The platform is deployed for a real client: the Korenhof AI callbot automates debt-collection calls — it reads case files, schedules calls within calling hours, validates identity over the phone, offers payment arrangements, and alerts staff in real time via Slack.',
    ],
    architecture: [
      'Node.js + React — platform core and configuration UI',
      'Twilio Voice API + Media Streams — telephony and real-time audio',
      'WebSocket bridge — connects Twilio Media Stream to ElevenLabs Conversational AI, converting μ-law 8 kHz ↔ PCM 16 kHz in memory with gain and noise gating',
      'ElevenLabs Conversational AI — the voice agent itself',
      'PostgreSQL + Prisma ORM — conversations, context, scheduling, and state',
      'REST API — configuration, monitoring, and integrations',
    ],
    keyFeatures: [
      {
        title: 'AI voice interaction',
        body: 'Natural conversation with interruption handling — the caller can speak over the agent and the flow adapts.',
      },
      {
        title: 'Automation',
        body: 'Inbound and outbound calls handled end-to-end, from dialling to closing, without a human in the loop.',
      },
      {
        title: 'Scheduling',
        body: 'Calls planned within business hours with pacing, retry logic for no-answer and busy lines, and queue control.',
      },
      {
        title: 'Customer context',
        body: 'Dynamic context per caller — case data, history, and amounts — injected into the conversation.',
      },
      {
        title: 'Integrations',
        body: 'Twilio, ElevenLabs, Slack alerts, and payment links (Mollie) wired into the call flow.',
      },
      {
        title: 'Human handoff',
        body: 'Transfer to a person when the AI reaches its limits, with the conversation state carried along.',
      },
    ],
    technology: [
      'Node.js',
      'React',
      'TypeScript',
      'Twilio Voice API',
      'ElevenLabs Conversational AI',
      'WebSocket',
      'PostgreSQL',
      'Prisma ORM',
      'REST API',
    ],
    challenges: [
      {
        title: 'Real-time audio bridging',
        body: 'Twilio and ElevenLabs speak different audio formats. The bridge converts μ-law 8 kHz ↔ PCM 16 kHz in memory with gain and noise gating, keeping latency low enough for natural conversation.',
      },
      {
        title: 'Conversation flow design',
        body: 'Business rules — identity validation, payment arrangements, retries — must be expressed as configurable flows, not hardcoded scripts, so the platform stays reusable across businesses.',
      },
      {
        title: 'Identity validation over voice',
        body: 'Birth-date verification via DTMF with a maximum of two attempts before a safe close, so sensitive processes stay compliant.',
      },
      {
        title: 'Graceful call termination',
        body: 'A call must end exactly once: the closing message plays, the call terminates, and the max-duration message must not play afterwards. Double closings were a real bug class that needed a dedicated fix.',
      },
      {
        title: 'Production reliability',
        body: 'Headless operation under PM2, retry logic for unanswered and busy calls, and real-time Slack alerts so process health is visible without watching logs.',
      },
    ],
    outcome: [
      'Active development. The platform is in production for a real client deployment — the Korenhof AI callbot — automating debt-collection calls with AI voice, smart scheduling, identity validation, and payment arrangements.',
      'Development continues as the platform expands to more businesses and workflows.',
    ],
  },

  nl: {
    slug: 'veyro-agent',
    role: 'Oprichter · Full-Stack & AI Engineer',
    year: '2024 — nu',
    overview: [
      'Veyro Agent is een AI-gestuurd voice-automatiseringsplatform voor het bouwen van AI-receptionisten en voice-automatiseringen. Het verwerkt inkomende en uitgaande gesprekken via Twilio en ElevenLabs met configureerbare gespreksflows, dynamische klantcontext, afspraakplanning, SMS-acties, menselijke overdracht, gespreksroutering en realtime monitoring.',
      'Het is ontworpen als een herbruikbaar platform dat zich aanpast aan verschillende bedrijven, workflows en communicatiebehoeften — geen eenmalige callbot.',
    ],
    problem: [
      'Bedrijven verliezen omzet en vertrouwen wanneer oproepen onbeantwoord blijven of klanten moeten wachten. Herhaalde vragen kosten personeel tijd, en persoonlijke communicatie schaalt niet — zeker niet in processen zoals debiteurenbeheer, afspraken en klantenservice, waar consistentie, compliance en beschikbaarheid belangrijk zijn.',
      'Standaard IVR-menu\u2019s voelen onpersoonlijk, terwijl volledig handmatige afhandeling niet schaalt. De behoefte is een voiceagent die menselijk klinkt, bedrijfsregels volgt en aansluit op echte workflows.',
    ],
    solution: [
      'Ik heb een platform gebouwd waarin een AI-voiceagent per bedrijf wordt geconfigureerd in plaats van per use case te worden vastgelegd. Gespreksflows, klantcontext, planning, acties en overdrachtsregels zijn allemaal configureerbaar via het platform.',
      'Het platform is ingezet voor een echte klant: de Korenhof-callbot automatiseert debiteurenbeheer — hij leest dossiers, plant gesprekken binnen beluren, valideert identiteit via de telefoon, biedt betalingsregelingen aan en waarschuwt medewerkers realtime via Slack.',
    ],
    architecture: [
      'Node.js + React — platformkern en configuratie-UI',
      'Twilio Voice API + Media Streams — telefonie en realtime audio',
      'WebSocket-bridge — verbindt Twilio Media Stream met ElevenLabs Conversational AI, converteert \u03BC-law 8 kHz \u2194 PCM 16 kHz in-memory met gain en noise gate',
      'ElevenLabs Conversational AI — de voiceagent zelf',
      'PostgreSQL + Prisma ORM — gesprekken, context, planning en status',
      'REST API — configuratie, monitoring en integraties',
    ],
    keyFeatures: [
      {
        title: 'AI-steminteractie',
        body: 'Natuurlijk gesprek met interruptie-afhandeling — de beller kan door de agent heen praten en de flow past zich aan.',
      },
      {
        title: 'Automatisering',
        body: 'Inkomende en uitgaande gesprekken end-to-end afgehandeld, van bellen tot afsluiten, zonder mens in de loop.',
      },
      {
        title: 'Planning',
        body: 'Gesprekken gepland binnen beluren met pacing, herkansingslogica voor niet-beantwoorde en bezette lijnen, en wachtrijbeheer.',
      },
      {
        title: 'Klantcontext',
        body: 'Dynamische context per beller — dossiergegevens, geschiedenis en bedragen — ingevoegd in het gesprek.',
      },
      {
        title: 'Integraties',
        body: 'Twilio, ElevenLabs, Slack-alerts en betaallinks (Mollie) gekoppeld aan de gespreksflow.',
      },
      {
        title: 'Menselijke overdracht',
        body: 'Doorschakelen naar een medewerker wanneer de AI zijn grenzen bereikt, met behoud van de gesprekscontext.',
      },
    ],
    technology: [
      'Node.js',
      'React',
      'TypeScript',
      'Twilio Voice API',
      'ElevenLabs Conversational AI',
      'WebSocket',
      'PostgreSQL',
      'Prisma ORM',
      'REST API',
    ],
    challenges: [
      {
        title: 'Realtime audio-bridging',
        body: 'Twilio en ElevenLabs gebruiken verschillende audioformaten. De bridge converteert \u03BC-law 8 kHz \u2194 PCM 16 kHz in-memory met gain en noise gate, met voldoende lage latentie voor een natuurlijk gesprek.',
      },
      {
        title: 'Gespreksflow-ontwerp',
        body: 'Bedrijfsregels — identiteitsvalidatie, betalingsregelingen, herkansingen — moeten als configureerbare flows worden uitgedrukt, niet als hardcoded scripts, zodat het platform herbruikbaar blijft.',
      },
      {
        title: 'Identiteitsvalidatie via stem',
        body: 'Geboortedatumverificatie via DTMF met maximaal twee pogingen v\u00F3\u00F3r een veilige afsluiting, zodat gevoelige processen compliant blijven.',
      },
      {
        title: 'Nette gespreksbe\u00EBindiging',
        body: 'Een gesprek moet exact \u00E9\u00E9n keer eindigen: de afsluitboodschap wordt uitgesproken, het gesprek wordt be\u00EBindigd en de max-duur boodschap mag daarna niet meer afspelen. Dubbele afsluitingen waren een echte bugklasse die een gerichte fix nodig had.',
      },
      {
        title: 'Productiebetrouwbaarheid',
        body: 'Headless operatie onder PM2, herkansingslogica voor niet-beantwoorde en bezette oproepen, en realtime Slack-alerts zodat procesgezondheid zichtbaar is zonder logs te volgen.',
      },
    ],
    outcome: [
      'Actieve ontwikkeling. Het platform draait in productie voor een echte klantimplementatie — de Korenhof-callbot — die debiteurenbeheer automatiseert met AI-stem, slimme planning, identiteitsvalidatie en betalingsregelingen.',
      'De ontwikkeling gaat door terwijl het platform zich uitbreidt naar meer bedrijven en workflows.',
    ],
  },

  es: {
    slug: 'veyro-agent',
    role: 'Fundador · Ingeniero Full-Stack & IA',
    year: '2024 — ahora',
    overview: [
      'Veyro Agent es una plataforma de automatización de voz impulsada por IA para construir recepcionistas y automatizaciones de voz para empresas. Gestiona llamadas entrantes y salientes a través de Twilio y ElevenLabs con flujos de conversación configurables, contexto dinámico del cliente, programación de citas, acciones por SMS, transferencia a un humano, enrutamiento de llamadas y monitorización en tiempo real.',
      'Está diseñado como una plataforma reutilizable que se adapta a diferentes negocios, flujos de trabajo y necesidades de comunicación — no un callbot de un solo uso.',
    ],
    problem: [
      'Las empresas pierden ingresos y confianza cuando las llamadas quedan sin responder o los clientes esperan. Las consultas repetitivas consumen tiempo del personal y la comunicación personal no escala — especialmente en procesos como el cobro de deudas, la gestión de citas y el servicio al cliente, donde importan la coherencia, el cumplimiento y la disponibilidad.',
      'Los menús IVR genéricos resultan impersonales, mientras que la gestión totalmente manual no escala. La necesidad es un agente de voz que suene humano, siga reglas de negocio y se conecte a flujos de trabajo reales.',
    ],
    solution: [
      'Construí una plataforma donde un agente de voz con IA se configura por negocio en lugar de codificarse para cada caso de uso. Los flujos de conversación, el contexto del cliente, la programación, las acciones y las reglas de transferencia son configurables a través de la plataforma.',
      'La plataforma está desplegada para un cliente real: el callbot de Korenhof automatiza las llamadas de cobro de deudas — lee los expedientes, programa llamadas dentro del horario de llamadas, valida la identidad por teléfono, ofrece acuerdos de pago y alerta al personal en tiempo real vía Slack.',
    ],
    architecture: [
      'Node.js + React — núcleo de la plataforma e interfaz de configuración',
      'Twilio Voice API + Media Streams — telefonía y audio en tiempo real',
      'Puente WebSocket — conecta Twilio Media Stream con ElevenLabs Conversational AI, convirtiendo μ-law 8 kHz ↔ PCM 16 kHz en memoria con ganancia y noise gate',
      'ElevenLabs Conversational AI — el propio agente de voz',
      'PostgreSQL + Prisma ORM — conversaciones, contexto, programación y estado',
      'REST API — configuración, monitorización e integraciones',
    ],
    keyFeatures: [
      {
        title: 'Interacción de voz con IA',
        body: 'Conversación natural con gestión de interrupciones — el interlocutor puede hablar por encima del agente y el flujo se adapta.',
      },
      {
        title: 'Automatización',
        body: 'Llamadas entrantes y salientes gestionadas de principio a fin, desde la marcación hasta el cierre, sin una persona en el bucle.',
      },
      {
        title: 'Programación',
        body: 'Llamadas planificadas dentro del horario con ritmo, lógica de reintentos para líneas sin respuesta u ocupadas, y control de cola.',
      },
      {
        title: 'Contexto del cliente',
        body: 'Contexto dinámico por llamada — expediente, historial e importes — inyectado en la conversación.',
      },
      {
        title: 'Integraciones',
        body: 'Twilio, ElevenLabs, alertas de Slack y enlaces de pago (Mollie) conectados al flujo de llamada.',
      },
      {
        title: 'Transferencia a un humano',
        body: 'Derivar a una persona cuando la IA llega a sus límites, conservando el estado de la conversación.',
      },
    ],
    technology: [
      'Node.js',
      'React',
      'TypeScript',
      'Twilio Voice API',
      'ElevenLabs Conversational AI',
      'WebSocket',
      'PostgreSQL',
      'Prisma ORM',
      'REST API',
    ],
    challenges: [
      {
        title: 'Puente de audio en tiempo real',
        body: 'Twilio y ElevenLabs usan formatos de audio distintos. El puente convierte μ-law 8 kHz ↔ PCM 16 kHz en memoria con ganancia y noise gate, manteniendo una latencia lo bastante baja para una conversación natural.',
      },
      {
        title: 'Diseño de flujos de conversación',
        body: 'Las reglas de negocio — validación de identidad, acuerdos de pago, reintentos — deben expresarse como flujos configurables, no como guiones codificados, para que la plataforma siga siendo reutilizable.',
      },
      {
        title: 'Validación de identidad por voz',
        body: 'Verificación de fecha de nacimiento mediante DTMF con un máximo de dos intentos antes de un cierre seguro, para que los procesos sensibles sigan cumpliendo la normativa.',
      },
      {
        title: 'Terminación correcta de la llamada',
        body: 'Una llamada debe terminar exactamente una vez: se pronuncia el mensaje de cierre, la llamada finaliza y el mensaje de duración máxima no debe reproducirse después. Los cierres dobles fueron una clase de bug real que requirió una corrección específica.',
      },
      {
        title: 'Fiabilidad en producción',
        body: 'Operación headless bajo PM2, lógica de reintentos para llamadas sin respuesta u ocupadas, y alertas de Slack en tiempo real para que la salud del proceso sea visible sin revisar logs.',
      },
    ],
    outcome: [
      'Desarrollo activo. La plataforma está en producción para un despliegue real — el callbot de Korenhof — que automatiza las llamadas de cobro de deudas con voz de IA, programación inteligente, validación de identidad y acuerdos de pago.',
      'El desarrollo continúa mientras la plataforma se expande a más negocios y flujos de trabajo.',
    ],
  },
};

const caseStudies: Record<string, Partial<Record<Lang, CaseStudy>>> = {
  'veyro-agent': veyro,
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
