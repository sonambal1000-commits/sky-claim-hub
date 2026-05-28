import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "pl", label: "Polski", flag: "🇵🇱" },
  { code: "hu", label: "Magyar", flag: "🇭🇺" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
] as const;

export type Lang = (typeof LANGUAGES)[number]["code"];

type Dict = Record<string, string>;

const T: Record<Lang, Dict> = {
  en: {
    heroTitle: "Baggage claims,",
    heroAccent: "beautifully simple.",
    heroSub: "Damaged or missing bag? We'll guide you through a calm, 3-minute claim — designed for the airport floor, not a desktop.",
    ctaStart: "Start a claim",
    ctaTrack: "Track an existing claim",
    howItWorks: "How it works",
    step1: "Find your flight",
    step2: "Choose claim type",
    step3: "Describe the damage",
    step4: "Add photos",
    step5: "Review & submit",
    sFlight: "Flight",
    sType: "Claim type",
    sDetails: "Bag details",
    sPhotos: "Photos",
    sReview: "Review",
    back: "Back",
    continue: "Continue",
    submit: "Submit my claim",
  },
  es: {
    heroTitle: "Reclamaciones de equipaje,",
    heroAccent: "increíblemente sencillas.",
    heroSub: "¿Maleta dañada o perdida? Te guiamos en una reclamación tranquila de 3 minutos.",
    ctaStart: "Iniciar reclamación",
    ctaTrack: "Seguir una reclamación",
    howItWorks: "Cómo funciona",
    step1: "Encuentra tu vuelo",
    step2: "Elige el tipo",
    step3: "Describe el daño",
    step4: "Añade fotos",
    step5: "Revisa y envía",
    sFlight: "Vuelo",
    sType: "Tipo",
    sDetails: "Detalles",
    sPhotos: "Fotos",
    sReview: "Revisar",
    back: "Atrás",
    continue: "Continuar",
    submit: "Enviar reclamación",
  },
  fr: {
    heroTitle: "Réclamations bagages,",
    heroAccent: "élégamment simples.",
    heroSub: "Bagage endommagé ou perdu ? Nous vous guidons en 3 minutes.",
    ctaStart: "Déposer une réclamation",
    ctaTrack: "Suivre une réclamation",
    howItWorks: "Comment ça marche",
    step1: "Trouvez votre vol",
    step2: "Type de réclamation",
    step3: "Décrivez les dégâts",
    step4: "Ajoutez des photos",
    step5: "Vérifiez et envoyez",
    sFlight: "Vol",
    sType: "Type",
    sDetails: "Détails",
    sPhotos: "Photos",
    sReview: "Vérifier",
    back: "Retour",
    continue: "Continuer",
    submit: "Envoyer ma réclamation",
  },
  de: {
    heroTitle: "Gepäckreklamationen,",
    heroAccent: "wunderschön einfach.",
    heroSub: "Beschädigtes oder verlorenes Gepäck? In 3 Minuten erledigt.",
    ctaStart: "Reklamation starten",
    ctaTrack: "Reklamation verfolgen",
    howItWorks: "So funktioniert es",
    step1: "Flug finden",
    step2: "Art wählen",
    step3: "Schaden beschreiben",
    step4: "Fotos hinzufügen",
    step5: "Prüfen & senden",
    sFlight: "Flug",
    sType: "Art",
    sDetails: "Details",
    sPhotos: "Fotos",
    sReview: "Prüfen",
    back: "Zurück",
    continue: "Weiter",
    submit: "Reklamation senden",
  },
  it: {
    heroTitle: "Reclami bagaglio,",
    heroAccent: "splendidamente semplici.",
    heroSub: "Bagaglio danneggiato o smarrito? Ti guidiamo in 3 minuti.",
    ctaStart: "Avvia reclamo",
    ctaTrack: "Traccia un reclamo",
    howItWorks: "Come funziona",
    step1: "Trova il volo",
    step2: "Tipo di reclamo",
    step3: "Descrivi il danno",
    step4: "Aggiungi foto",
    step5: "Rivedi e invia",
    sFlight: "Volo",
    sType: "Tipo",
    sDetails: "Dettagli",
    sPhotos: "Foto",
    sReview: "Rivedi",
    back: "Indietro",
    continue: "Continua",
    submit: "Invia reclamo",
  },
  pl: {
    heroTitle: "Reklamacje bagażu,",
    heroAccent: "pięknie proste.",
    heroSub: "Uszkodzony lub zgubiony bagaż? Przeprowadzimy Cię w 3 minuty.",
    ctaStart: "Rozpocznij reklamację",
    ctaTrack: "Śledź reklamację",
    howItWorks: "Jak to działa",
    step1: "Znajdź lot",
    step2: "Wybierz typ",
    step3: "Opisz uszkodzenie",
    step4: "Dodaj zdjęcia",
    step5: "Sprawdź i wyślij",
    sFlight: "Lot",
    sType: "Typ",
    sDetails: "Szczegóły",
    sPhotos: "Zdjęcia",
    sReview: "Sprawdź",
    back: "Wstecz",
    continue: "Dalej",
    submit: "Wyślij reklamację",
  },
  hu: {
    heroTitle: "Poggyászkárigények,",
    heroAccent: "gyönyörűen egyszerűen.",
    heroSub: "Sérült vagy elveszett poggyász? 3 perc alatt végigvezetünk.",
    ctaStart: "Igénylés indítása",
    ctaTrack: "Igénylés követése",
    howItWorks: "Hogyan működik",
    step1: "Járat keresése",
    step2: "Típus választása",
    step3: "Sérülés leírása",
    step4: "Fotók hozzáadása",
    step5: "Ellenőrzés és küldés",
    sFlight: "Járat",
    sType: "Típus",
    sDetails: "Részletek",
    sPhotos: "Fotók",
    sReview: "Ellenőrzés",
    back: "Vissza",
    continue: "Tovább",
    submit: "Igénylés küldése",
  },
  pt: {
    heroTitle: "Reclamações de bagagem,",
    heroAccent: "lindamente simples.",
    heroSub: "Bagagem danificada ou perdida? Guiamos você em 3 minutos.",
    ctaStart: "Iniciar reclamação",
    ctaTrack: "Acompanhar reclamação",
    howItWorks: "Como funciona",
    step1: "Encontre seu voo",
    step2: "Escolha o tipo",
    step3: "Descreva o dano",
    step4: "Adicione fotos",
    step5: "Revise e envie",
    sFlight: "Voo",
    sType: "Tipo",
    sDetails: "Detalhes",
    sPhotos: "Fotos",
    sReview: "Revisar",
    back: "Voltar",
    continue: "Continuar",
    submit: "Enviar reclamação",
  },
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: keyof typeof T.en) => string };
const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("eagle.lang") : null;
    if (stored && LANGUAGES.some((l) => l.code === stored)) setLangState(stored as Lang);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("eagle.lang", l);
  };

  const t = (k: keyof typeof T.en) => T[lang][k] ?? T.en[k];
  return <I18nCtx.Provider value={{ lang, setLang, t }}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
