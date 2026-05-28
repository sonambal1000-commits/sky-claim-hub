/**
 * Shared demo data for staff & airline dashboards.
 */
export type StaffStatus =
  | "Submitted" | "Under Review" | "Awaiting Info" | "Awaiting Airline"
  | "Approved Repair" | "Approved Replacement" | "Completed" | "Rejected";

export const STATUS_TONE: Record<StaffStatus, string> = {
  "Submitted":              "bg-blue-500/15 text-blue-600 dark:text-blue-300",
  "Under Review":           "bg-amber-500/15 text-amber-600 dark:text-amber-300",
  "Awaiting Info":          "bg-purple-500/15 text-purple-600 dark:text-purple-300",
  "Awaiting Airline":       "bg-indigo-500/15 text-indigo-600 dark:text-indigo-300",
  "Approved Repair":        "bg-teal-500/15 text-teal-600 dark:text-teal-300",
  "Approved Replacement":   "bg-cyan-500/15 text-cyan-600 dark:text-cyan-300",
  "Completed":              "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  "Rejected":               "bg-rose-500/15 text-rose-600 dark:text-rose-300",
};

export const TRANSITIONS: Record<StaffStatus, StaffStatus[]> = {
  "Submitted":            ["Under Review", "Rejected"],
  "Under Review":         ["Awaiting Info", "Awaiting Airline", "Approved Repair", "Approved Replacement", "Rejected"],
  "Awaiting Info":        ["Under Review", "Rejected"],
  "Awaiting Airline":     ["Under Review", "Approved Repair", "Approved Replacement", "Rejected"],
  "Approved Repair":      ["Completed", "Rejected"],
  "Approved Replacement": ["Completed", "Rejected"],
  "Completed":            [],
  "Rejected":             [],
};

export type AirlineName = "easyJet" | "Air Peace" | "Malaysia Airlines" | "Thai Airways" | "Oman Air";

export const AIRLINE_META: Record<AirlineName, { iata: string; color: string }> = {
  "easyJet":           { iata: "EZY", color: "#FF6600" },
  "Air Peace":         { iata: "P4",  color: "#006400" },
  "Malaysia Airlines": { iata: "MH",  color: "#C8102E" },
  "Thai Airways":      { iata: "TG",  color: "#6B0F8C" },
  "Oman Air":          { iata: "WY",  color: "#8B0000" },
};

export type DemoClaim = {
  ref: string;
  airline: AirlineName;
  passenger: string;
  type: string;
  status: StaffStatus;
  slaHours: number;
  handler: string;
  amount?: number;
  flight: string;
  route: string;
  date: string;
};

export const DEMO_CLAIMS: DemoClaim[] = [
  { ref: "EC-260527-4821", airline: "easyJet",           passenger: "Sarah Mitchell",  type: "Damaged suitcase",   status: "Under Review",        slaHours:  4, handler: "Aoife K.",  amount: 240, flight: "U2 8472", route: "LGW → PMI", date: "22 May 2026" },
  { ref: "EC-260527-4799", airline: "easyJet",           passenger: "James O'Connor",  type: "Lost contents",      status: "Awaiting Info",       slaHours: 18, handler: "Nuala D.",  amount: 410, flight: "U2 2138", route: "STN → AGP", date: "21 May 2026" },
  { ref: "EC-260526-4612", airline: "Air Peace",         passenger: "Adaeze Okafor",   type: "Damaged contents",   status: "Approved Repair",     slaHours: 36, handler: "Marek W.",  amount: 185, flight: "P4 7104", route: "LOS → ABV", date: "20 May 2026" },
  { ref: "EC-260526-4598", airline: "easyJet",           passenger: "Tomás Pérez",     type: "Damaged suitcase",   status: "Submitted",           slaHours: 23, handler: "—",         amount: 0,   flight: "U2 5512", route: "LTN → ALC", date: "20 May 2026" },
  { ref: "EC-260525-4410", airline: "Malaysia Airlines", passenger: "Nurul Hisham",    type: "Lost suitcase",      status: "Approved Replacement",slaHours: 60, handler: "Aoife K.",  amount: 620, flight: "MH 0002", route: "KUL → LHR", date: "19 May 2026" },
  { ref: "EC-260524-4322", airline: "Thai Airways",      passenger: "Suthida Kraisri", type: "Damaged contents",   status: "Completed",           slaHours: 96, handler: "Nuala D.",  amount: 95,  flight: "TG 0916", route: "BKK → LHR", date: "18 May 2026" },
  { ref: "EC-260524-4288", airline: "Oman Air",          passenger: "Yousef Al-Balushi",type: "Damaged suitcase",  status: "Rejected",            slaHours: 70, handler: "Marek W.",  amount: 0,   flight: "WY 0101", route: "MCT → LHR", date: "18 May 2026" },
  { ref: "EC-260523-4150", airline: "easyJet",           passenger: "Andrei Popescu",  type: "Lost contents",      status: "Under Review",        slaHours:  7, handler: "Aoife K.",  amount: 320, flight: "U2 3344", route: "LGW → OTP", date: "17 May 2026" },
];

export function slaTone(hours: number): { dot: string; text: string; pill: string } {
  if (hours < 8)  return { dot: "bg-rose-500",   text: "text-rose-600 dark:text-rose-300",   pill: "bg-rose-500/15"   };
  if (hours < 24) return { dot: "bg-amber-500",  text: "text-amber-600 dark:text-amber-300", pill: "bg-amber-500/15"  };
  return                  { dot: "bg-emerald-500",text: "text-emerald-600 dark:text-emerald-300", pill: "bg-emerald-500/15" };
}

export function formatSla(hours: number): string {
  if (hours < 1) return "<1h";
  if (hours < 48) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}
