/**
 * Local-storage backed claim store. Will be replaced by Lovable Cloud
 * persistence in the next build pass. The shape mirrors the planned DB schema
 * so the swap is mechanical.
 */

export type ClaimType =
  | "damaged_suitcase"
  | "damaged_contents"
  | "damaged_both"
  | "lost_suitcase"
  | "lost_contents"
  | "lost_both";

export type ClaimStatus =
  | "submitted"
  | "under_review"
  | "awaiting_pax"
  | "awaiting_airline"
  | "approved_repair"
  | "approved_replace"
  | "completed"
  | "rejected";

export type Claim = {
  id: string;
  reference: string;
  tenant: string;
  type: ClaimType;
  status: ClaimStatus;
  createdAt: string;
  flight: {
    bookingRef?: string;
    flightNo: string;
    date: string;
    from?: string;
    to?: string;
    pir?: string;
  };
  passenger: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  item: {
    bagType?: string;
    brand?: string;
    color?: string;
    size?: string;
    tagNo?: string;
    locks?: string;
    damageAreas?: string[];
    damageTypes?: string[];
    description?: string;
  };
  evidence: { name: string; preview: string }[];
  timeline: { status: ClaimStatus; at: string; note?: string }[];
};

const KEY = "eagle.claims";

function loadAll(): Claim[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveAll(claims: Claim[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(claims));
  }
}

export function createReference() {
  // EC-YYMMDD-XXXX
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `EC-${ymd}-${rand}`;
}

export function saveClaim(claim: Claim) {
  const all = loadAll();
  all.unshift(claim);
  saveAll(all.slice(0, 50));
}

export function findClaim(refOrId: string): Claim | undefined {
  const q = refOrId.trim().toUpperCase();
  return loadAll().find((c) => c.reference === q || c.id === q);
}

export function listClaims() {
  return loadAll();
}

export const STATUS_LABEL: Record<ClaimStatus, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  awaiting_pax: "Awaiting your info",
  awaiting_airline: "Awaiting airline",
  approved_repair: "Approved — repair",
  approved_replace: "Approved — replacement",
  completed: "Completed",
  rejected: "Rejected",
};

export const CLAIM_TYPE_LABEL: Record<ClaimType, string> = {
  damaged_suitcase: "Damaged suitcase",
  damaged_contents: "Damaged contents",
  damaged_both: "Damaged suitcase & contents",
  lost_suitcase: "Lost suitcase",
  lost_contents: "Lost contents",
  lost_both: "Lost suitcase & contents",
};
