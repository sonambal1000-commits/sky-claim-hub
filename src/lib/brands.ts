export const LUGGAGE_BRANDS = [
  "Samsonite", "American Tourister", "Tumi", "Rimowa", "Antler", "Delsey",
  "Eastpak", "Kipling", "Briggs & Riley", "Travelpro", "Victorinox", "Away",
  "IT Luggage", "Carlton", "Pierre Cardin", "Heys", "Lipault", "Eminent",
  "Roncato", "Polo", "Echolac", "Tripp", "John Lewis", "Marks & Spencer",
  "Next", "Primark", "Mountain Warehouse", "Karabar", "Aerolite", "Cabin Max",
  "Slazenger", "Dunlop", "Constellation", "Revelation", "Linea", "Skyway",
  "Olympia", "Olympia USA", "Calvin Klein", "Tommy Hilfiger", "Michael Kors",
  "Coach", "Kate Spade", "Herschel", "Fjällräven", "The North Face",
  "Osprey", "Patagonia", "Deuter", "Lowe Alpine", "Berghaus", "Karrimor",
  "Regatta", "Trespass", "Other",
] as const;

export type LuggageBrand = (typeof LUGGAGE_BRANDS)[number];
