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
  resultSet: boolean;
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

// Scorecard types
export interface BattingEntry {
  batsman: { id: string; name: string };
  dismissal: string;
  "dismissal-text": string;
  r: number;
  b: number;
  "4s": number;
  "6s": number;
  sr: number;
}

export interface BowlingEntry {
  bowler: { id: string; name: string };
  o: number;
  m: number;
  r: number;
  w: number;
  eco: number;
  "0s"?: number;
  "4s"?: number;
  "6s"?: number;
  wd?: number;
  nb?: number;
}

export interface ScorecardInning {
  inning: string;
  battingOrder?: string[];
  batting: BattingEntry[];
  bowling: BowlingEntry[];
  extras?: {
    r: number;
    b?: number;
    lb?: number;
    w?: number;
    nb?: number;
    p?: number;
  };
  totalRuns?: number;
  totalWickets?: number;
  totalOvers?: number;
  equation?: string;
}

export interface MatchScorecard {
  id: string;
  name: string;
  matchType: string;
  status: string;
  venue: string;
  date: string;
  dateTimeGMT: string;
  teams: string[];
  score?: MatchScore[];
  tpiScore?: string;
  series_id: string;
  fantasyEnabled: boolean;
  resultSet: boolean;
  teamInfo?: TeamInfo[];
  scorecard: ScorecardInning[];
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
    let allMatches: Match[] = [];
    let offset = 0;
    // Fetch up to 3 pages to get more matches
    for (let i = 0; i < 3; i++) {
      const response = await fetch(
        `${BASE_URL}/matches?apikey=${CRICAPI_KEY}&offset=${offset}`,
      );
      const data = await response.json();

      if (data.status === "success" && data.data && Array.isArray(data.data)) {
        allMatches = [...allMatches, ...data.data];
        if (data.data.length < 25) break;
        offset += 25;
      } else {
        break;
      }
    }

    if (allMatches.length > 0) {
      setCache(cacheKey, allMatches);
      return allMatches;
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
    let allMatches: Match[] = [];
    let offset = 0;
    // Fetch up to 3 pages (75 matches) to ensure we get all live games
    // while respecting API rate limits
    for (let i = 0; i < 3; i++) {
      const response = await fetch(
        `${BASE_URL}/currentMatches?apikey=${CRICAPI_KEY}&offset=${offset}`,
      );
      const data = await response.json();

      if (data.status === "success" && data.data && Array.isArray(data.data)) {
        allMatches = [...allMatches, ...data.data];
        if (data.data.length < 25) break; // No more pages
        offset += 25;
      } else {
        break;
      }
    }

    if (allMatches.length > 0) {
      setCache(cacheKey, allMatches);
      return allMatches;
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

// Fetch full match scorecard
export async function fetchMatchScorecard(
  matchId: string,
): Promise<MatchScorecard | null> {
  const cacheKey = `match-scorecard-${matchId}`;
  const cached = getCached<MatchScorecard>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `${BASE_URL}/match_scorecard?apikey=${CRICAPI_KEY}&id=${matchId}`,
    );
    const data = await response.json();

    if (data.status === "success" && data.data) {
      setCache(cacheKey, data.data);
      return data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching match scorecard:", error);
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

// Extract series/tournament name from match name
// Match name format: "Team1 vs Team2, MatchDetail, SeriesName Year"
export function getSeriesName(match: Match): string {
  if (!match.name) return "Other Matches";
  const parts = match.name.split(", ");
  // The series name is usually everything after "Team1 vs Team2, MatchDetail,"
  if (parts.length >= 3) {
    // Join from 2nd part onwards (skip "Team1 vs Team2")
    // But the 2nd part might be "3rd Match" / "Final" etc.
    // The actual series name is typically the last 1-2 parts
    return parts.slice(2).join(", ");
  }
  if (parts.length === 2) {
    return parts[1];
  }
  return "Other Matches";
}

// Group matches by series/tournament
export interface MatchGroup {
  seriesName: string;
  matches: Match[];
}

export function groupMatchesBySeries(matches: Match[]): MatchGroup[] {
  const groupMap = new Map<string, Match[]>();

  matches.forEach((match) => {
    // First try using series_id for grouping, fall back to name extraction
    const seriesName = getSeriesName(match);
    if (!groupMap.has(seriesName)) {
      groupMap.set(seriesName, []);
    }
    groupMap.get(seriesName)!.push(match);
  });

  return Array.from(groupMap.entries()).map(([seriesName, matches]) => ({
    seriesName,
    matches,
  }));
}

// Get match type badge color
export function getMatchTypeBadgeColor(matchType: string): string {
  if (!matchType) return "#6b7280";
  const lower = matchType.toLowerCase();

  if (lower.includes("test") || lower.includes("first class")) return "#dc2626"; // red
  if (lower.includes("odi") || lower.includes("list a")) return "#2563eb"; // blue
  if (lower.includes("t20")) return "#16a34a"; // green
  if (lower.includes("t10")) return "#f97316"; // orange

  return "#6b7280"; // gray
}

// Check if match is live
export function isMatchLive(status: string): boolean {
  if (!status) return false;
  const lower = status.toLowerCase();

  // Exclude completed matches first
  if (
    lower.includes("won by") ||
    lower.includes("match drawn") ||
    lower.includes("no result") ||
    lower.includes("abandoned") ||
    lower.includes("match starts at") ||
    lower.includes("scheduled")
  ) {
    return false;
  }

  const liveKeywords = [
    "live",
    "match started",
    "innings break",
    "day ", // "Day 2" etc - note the space to avoid matching "today" etc
    "session",
    "batting",
    "bowling",
    "lunch",
    "tea break",
    "stumps",
    "rain delay",
    "wet outfield",
    "toss",
    "elected to",
    "opt to",
    "trail by",
    "lead by",
    "need ",
    "require ",
    "break",
  ];
  return liveKeywords.some((keyword) => lower.includes(keyword));
}

// Check if match is upcoming
export function isMatchUpcoming(status: string): boolean {
  if (!status) return false;
  const lower = status.toLowerCase();
  const upcomingKeywords = [
    "not started",
    "scheduled",
    "upcoming",
    "match starts at",
    "starts at",
  ];
  return upcomingKeywords.some((keyword) => lower.includes(keyword));
}

// Check if match is completed/recent
export function isMatchCompleted(status: string): boolean {
  if (!status) return false;
  const lower = status.toLowerCase();
  const completedKeywords = [
    "won by",
    "won the",
    "drawn",
    "draw",
    "tied",
    "no result",
    "abandoned",
    "match tied",
  ];
  return completedKeywords.some((keyword) => lower.includes(keyword));
}
