const CRICAPI_KEY = "d5fe580e-9355-4b17-8214-87cb1a59e35f";
const BASE_URL = "https://api.cricapi.com/v1";

// Simple cache to reduce API calls
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

function getCached<T>(key: string): T | null {
  const cached = cache[key];
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`Using cached data for: ${key}`);
    return cached.data as T;
  }
  return null;
}

function setCache(key: string, data: any): void {
  cache[key] = { data, timestamp: Date.now() };
}

// ==================== TYPES ====================

export interface Country {
  id: string;
  name: string;
  genericFlag: string; // Flag image URL
}

export interface Series {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  odi: number;
  t20: number;
  test: number;
  squads: number;
  matches: number;
}

export interface MatchScore {
  r: number; // runs
  w: number; // wickets
  o: number; // overs
  inning: string;
}

export interface Match {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue: string;
  date: string;
  dateTimeGMT: string;
  teams: string[];
  score?: MatchScore[];
  series_id: string;
  fantasyEnabled: boolean;
  teamInfo?: TeamInfo[];
}

export interface TeamInfo {
  name: string;
  shortname: string;
  img: string;
}

export interface Player {
  id: string;
  name: string;
  country: string;
}

export interface PlayerInfo {
  id: string;
  name: string;
  dateOfBirth?: string;
  role?: string;
  battingStyle?: string;
  bowlingStyle?: string;
  placeOfBirth?: string;
  country?: string;
}

export interface SeriesInfo {
  info: {
    id: string;
    name: string;
    startdate: string;
    enddate: string;
    odi: number;
    t20: number;
    test: number;
    squads: number;
    matches: number;
  };
  matchList: Match[];
}

// ==================== API FUNCTIONS ====================

// Fetch all countries with flags
export async function fetchCountries(): Promise<Country[]> {
  const cacheKey = "countries";
  const cached = getCached<Country[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `${BASE_URL}/countries?apikey=${CRICAPI_KEY}&offset=0`,
    );
    const data = await response.json();

    if (data.status === "success" && data.data) {
      setCache(cacheKey, data.data);
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
}

// Fetch all series
export async function fetchSeries(search?: string): Promise<Series[]> {
  const cacheKey = search ? `series-${search}` : "series";
  const cached = getCached<Series[]>(cacheKey);
  if (cached) return cached;

  try {
    let url = `${BASE_URL}/series?apikey=${CRICAPI_KEY}&offset=0`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "success" && data.data) {
      setCache(cacheKey, data.data);
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching series:", error);
    return [];
  }
}

// Fetch series info by ID
export async function fetchSeriesInfo(
  seriesId: string,
): Promise<SeriesInfo | null> {
  const cacheKey = `series-info-${seriesId}`;
  const cached = getCached<SeriesInfo>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `${BASE_URL}/series_info?apikey=${CRICAPI_KEY}&id=${seriesId}`,
    );
    const data = await response.json();

    if (data.status === "success" && data.data) {
      setCache(cacheKey, data.data);
      return data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching series info:", error);
    return null;
  }
}

// Fetch all matches
export async function fetchMatches(): Promise<Match[]> {
  const cacheKey = "matches";
  const cached = getCached<Match[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `${BASE_URL}/matches?apikey=${CRICAPI_KEY}&offset=0`,
    );
    const data = await response.json();

    if (data.status === "success" && data.data) {
      setCache(cacheKey, data.data);
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching matches:", error);
    return [];
  }
}

// Fetch current/live matches
export async function fetchCurrentMatches(): Promise<Match[]> {
  const cacheKey = "current-matches";
  const cached = getCached<Match[]>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `${BASE_URL}/currentMatches?apikey=${CRICAPI_KEY}&offset=0`,
    );
    const data = await response.json();

    if (data.status === "success" && data.data) {
      setCache(cacheKey, data.data);
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching current matches:", error);
    return [];
  }
}

// Fetch match info by ID
export async function fetchMatchInfo(matchId: string): Promise<Match | null> {
  const cacheKey = `match-info-${matchId}`;
  const cached = getCached<Match>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `${BASE_URL}/match_info?apikey=${CRICAPI_KEY}&id=${matchId}`,
    );
    const data = await response.json();

    if (data.status === "success" && data.data) {
      setCache(cacheKey, data.data);
      return data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching match info:", error);
    return null;
  }
}

// Fetch all players
export async function fetchPlayers(search?: string): Promise<Player[]> {
  const cacheKey = search ? `players-${search}` : "players";
  const cached = getCached<Player[]>(cacheKey);
  if (cached) return cached;

  try {
    let url = `${BASE_URL}/players?apikey=${CRICAPI_KEY}&offset=0`;
    if (search) {
      url += `&search=${encodeURIComponent(search)}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === "success" && data.data) {
      setCache(cacheKey, data.data);
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching players:", error);
    return [];
  }
}

// Fetch player info by ID
export async function fetchPlayerInfo(
  playerId: string,
): Promise<PlayerInfo | null> {
  const cacheKey = `player-info-${playerId}`;
  const cached = getCached<PlayerInfo>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `${BASE_URL}/players_info?apikey=${CRICAPI_KEY}&id=${playerId}`,
    );
    const data = await response.json();

    if (data.status === "success" && data.data) {
      setCache(cacheKey, data.data);
      return data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching player info:", error);
    return null;
  }
}

// ==================== HELPER FUNCTIONS ====================

// Store countries for flag lookup
let countriesCache: Country[] = [];

export async function initializeCountries(): Promise<void> {
  if (countriesCache.length === 0) {
    countriesCache = await fetchCountries();
  }
}

export function getCountryFlag(countryName: string): string | null {
  const country = countriesCache.find(
    (c) => c.name.toLowerCase() === countryName.toLowerCase(),
  );
  return country?.genericFlag || null;
}

export function getCountryFlagById(countryId: string): string | null {
  const country = countriesCache.find((c) => c.id === countryId);
  return country?.genericFlag || null;
}

// Format date for display
export function formatMatchDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Format score for display
export function formatScore(score?: MatchScore[]): string {
  if (!score || score.length === 0) return "Yet to bat";

  return score.map((s) => `${s.r}/${s.w} (${s.o})`).join(" | ");
}

// Get match type badge color
export function getMatchTypeBadgeColor(matchType: string): string {
  switch (matchType?.toLowerCase()) {
    case "test":
      return "#dc2626"; // red
    case "odi":
      return "#2563eb"; // blue
    case "t20":
      return "#16a34a"; // green
    default:
      return "#6b7280"; // gray
  }
}

// Check if match is live
export function isMatchLive(status: string): boolean {
  const liveKeywords = [
    "live",
    "innings break",
    "day",
    "session",
    "batting",
    "bowling",
  ];
  return liveKeywords.some((keyword) =>
    status?.toLowerCase().includes(keyword),
  );
}

// Check if match is upcoming
export function isMatchUpcoming(status: string): boolean {
  const upcomingKeywords = ["not started", "scheduled", "upcoming"];
  return upcomingKeywords.some((keyword) =>
    status?.toLowerCase().includes(keyword),
  );
}
