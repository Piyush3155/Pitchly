import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
    BattingEntry,
    BowlingEntry,
    fetchMatchScorecard,
    getMatchTypeBadgeColor,
    initializeCountries,
    isMatchLive,
    MatchScorecard,
    ScorecardInning,
} from "@/services/cricapi";

const DETAIL_TABS = ["Info", "Scorecard"];

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [matchData, setMatchData] = useState<MatchScorecard | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [activeInning, setActiveInning] = useState(0);

  useEffect(() => {
    loadMatchData();
  }, [id]);

  const loadMatchData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      await initializeCountries();
      const data = await fetchMatchScorecard(id);
      setMatchData(data);
    } catch (error) {
      console.error("Error loading match data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatScoreStr = (s?: { r: number; w: number; o: number }) =>
    s ? `${s.r}/${s.w} (${s.o} ov)` : "";

  const getTeamImg = (teamName: string) => {
    const info = matchData?.teamInfo?.find(
      (t) =>
        t.name.toLowerCase() === teamName.toLowerCase() ||
        t.shortname.toLowerCase() === teamName.toLowerCase(),
    );
    return info?.img || null;
  };

  const getTeamShort = (teamName: string) => {
    const info = matchData?.teamInfo?.find(
      (t) =>
        t.name.toLowerCase() === teamName.toLowerCase() ||
        t.shortname.toLowerCase() === teamName.toLowerCase(),
    );
    return info?.shortname || teamName.substring(0, 3).toUpperCase();
  };

  if (loading) {
    return (
      <ThemedView className="flex-1">
        <View
          style={{ paddingTop: insets.top }}
          className={`px-4 pb-3 ${isDark ? "bg-gray-900" : "bg-green-600"}`}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center pt-3"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
            <ThemedText className="text-white text-lg font-semibold ml-2">
              Match Details
            </ThemedText>
          </TouchableOpacity>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00A651" />
          <ThemedText className="mt-4 opacity-60">
            Loading match details...
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  if (!matchData) {
    return (
      <ThemedView className="flex-1">
        <View
          style={{ paddingTop: insets.top }}
          className={`px-4 pb-3 ${isDark ? "bg-gray-900" : "bg-green-600"}`}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center pt-3"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
            <ThemedText className="text-white text-lg font-semibold ml-2">
              Match Details
            </ThemedText>
          </TouchableOpacity>
        </View>
        <View className="flex-1 items-center justify-center p-8">
          <ThemedText className="text-5xl mb-4">😔</ThemedText>
          <ThemedText className="text-lg font-semibold mb-2 text-center">
            Scorecard Unavailable
          </ThemedText>
          <ThemedText className="text-sm opacity-60 text-center">
            Detailed scorecard data is not available for this match. This may
            require a premium API plan.
          </ThemedText>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-6 bg-green-600 px-6 py-3 rounded-full"
          >
            <ThemedText className="text-white font-semibold">
              Go Back
            </ThemedText>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  const live = isMatchLive(matchData.status);
  const team1 = matchData.teams?.[0] || "Team 1";
  const team2 = matchData.teams?.[1] || "Team 2";

  const score1 =
    matchData.score?.find((s) => s.inning.includes(team1)) ||
    matchData.score?.[0];
  const score2 =
    matchData.score?.find((s) => s.inning.includes(team2)) ||
    matchData.score?.[1];

  const scorecard = matchData.scorecard || [];

  // ===================== Render Helpers =====================

  const renderBattingRow = (entry: BattingEntry, index: number) => (
    <View
      key={`bat-${index}`}
      className={`flex-row items-center py-2.5 px-3 border-b ${
        isDark ? "border-gray-700" : "border-gray-100"
      }`}
    >
      <View className="flex-1 mr-2">
        <ThemedText className="text-sm font-medium" numberOfLines={1}>
          {entry.batsman?.name || "Unknown"}
        </ThemedText>
        <ThemedText className="text-xs opacity-50 mt-0.5" numberOfLines={1}>
          {entry["dismissal-text"] || entry.dismissal || "batting"}
        </ThemedText>
      </View>
      <ThemedText className="w-8 text-center text-sm font-bold">
        {entry.r ?? 0}
      </ThemedText>
      <ThemedText className="w-8 text-center text-xs opacity-60">
        {entry.b ?? 0}
      </ThemedText>
      <ThemedText className="w-8 text-center text-xs opacity-60">
        {entry["4s"] ?? 0}
      </ThemedText>
      <ThemedText className="w-8 text-center text-xs opacity-60">
        {entry["6s"] ?? 0}
      </ThemedText>
      <ThemedText className="w-12 text-center text-xs opacity-60">
        {entry.sr?.toFixed(1) ?? "0.0"}
      </ThemedText>
    </View>
  );

  const renderBowlingRow = (entry: BowlingEntry, index: number) => (
    <View
      key={`bowl-${index}`}
      className={`flex-row items-center py-2.5 px-3 border-b ${
        isDark ? "border-gray-700" : "border-gray-100"
      }`}
    >
      <View className="flex-1 mr-2">
        <ThemedText className="text-sm font-medium" numberOfLines={1}>
          {entry.bowler?.name || "Unknown"}
        </ThemedText>
      </View>
      <ThemedText className="w-8 text-center text-xs opacity-60">
        {entry.o ?? 0}
      </ThemedText>
      <ThemedText className="w-8 text-center text-xs opacity-60">
        {entry.m ?? 0}
      </ThemedText>
      <ThemedText className="w-8 text-center text-sm font-bold">
        {entry.r ?? 0}
      </ThemedText>
      <ThemedText className="w-8 text-center text-sm font-bold text-green-600">
        {entry.w ?? 0}
      </ThemedText>
      <ThemedText className="w-12 text-center text-xs opacity-60">
        {entry.eco?.toFixed(1) ?? "0.0"}
      </ThemedText>
    </View>
  );

  const renderInningsScorecard = (inning: ScorecardInning) => {
    const batting = inning.batting || [];
    const bowling = inning.bowling || [];

    return (
      <View key={inning.inning} className="mb-2">
        {/* Batting Section */}
        <View
          className={`rounded-xl overflow-hidden mb-4 ${
            isDark ? "bg-gray-800" : "bg-white"
          } shadow-sm shadow-black/5 elevation-2`}
        >
          <View
            className={`px-3 py-2.5 flex-row items-center justify-between ${
              isDark ? "bg-gray-700" : "bg-green-50"
            }`}
          >
            <ThemedText className="text-sm font-bold text-green-600">
              🏏 Batting
            </ThemedText>
          </View>

          {/* Batting Header */}
          <View
            className={`flex-row items-center py-2 px-3 border-b ${
              isDark
                ? "bg-gray-700/50 border-gray-600"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <ThemedText className="flex-1 text-xs font-semibold opacity-50">
              BATTER
            </ThemedText>
            <ThemedText className="w-8 text-center text-xs font-semibold opacity-50">
              R
            </ThemedText>
            <ThemedText className="w-8 text-center text-xs font-semibold opacity-50">
              B
            </ThemedText>
            <ThemedText className="w-8 text-center text-xs font-semibold opacity-50">
              4s
            </ThemedText>
            <ThemedText className="w-8 text-center text-xs font-semibold opacity-50">
              6s
            </ThemedText>
            <ThemedText className="w-12 text-center text-xs font-semibold opacity-50">
              SR
            </ThemedText>
          </View>

          {/* Batting Rows */}
          {batting.length > 0 ? (
            batting.map((b, i) => renderBattingRow(b, i))
          ) : (
            <View className="p-4 items-center">
              <ThemedText className="text-sm opacity-50">
                No batting data available
              </ThemedText>
            </View>
          )}

          {/* Extras & Total */}
          {inning.extras && (
            <View
              className={`px-3 py-2 border-t ${
                isDark ? "border-gray-600" : "border-gray-200"
              }`}
            >
              <ThemedText className="text-xs opacity-60">
                Extras: {inning.extras.r ?? 0} (b {inning.extras.b ?? 0}, lb{" "}
                {inning.extras.lb ?? 0}, w {inning.extras.w ?? 0}, nb{" "}
                {inning.extras.nb ?? 0})
              </ThemedText>
            </View>
          )}

          <View
            className={`px-3 py-2.5 border-t ${
              isDark
                ? "border-gray-600 bg-gray-700/30"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <ThemedText className="text-sm font-bold">
              Total: {inning.totalRuns ?? "—"}/{inning.totalWickets ?? "—"} (
              {inning.totalOvers ?? "—"} ov)
            </ThemedText>
          </View>
        </View>

        {/* Bowling Section */}
        <View
          className={`rounded-xl overflow-hidden mb-4 ${
            isDark ? "bg-gray-800" : "bg-white"
          } shadow-sm shadow-black/5 elevation-2`}
        >
          <View
            className={`px-3 py-2.5 flex-row items-center ${
              isDark ? "bg-gray-700" : "bg-red-50"
            }`}
          >
            <ThemedText className="text-sm font-bold text-red-500">
              🎯 Bowling
            </ThemedText>
          </View>

          {/* Bowling Header */}
          <View
            className={`flex-row items-center py-2 px-3 border-b ${
              isDark
                ? "bg-gray-700/50 border-gray-600"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <ThemedText className="flex-1 text-xs font-semibold opacity-50">
              BOWLER
            </ThemedText>
            <ThemedText className="w-8 text-center text-xs font-semibold opacity-50">
              O
            </ThemedText>
            <ThemedText className="w-8 text-center text-xs font-semibold opacity-50">
              M
            </ThemedText>
            <ThemedText className="w-8 text-center text-xs font-semibold opacity-50">
              R
            </ThemedText>
            <ThemedText className="w-8 text-center text-xs font-semibold opacity-50">
              W
            </ThemedText>
            <ThemedText className="w-12 text-center text-xs font-semibold opacity-50">
              ECO
            </ThemedText>
          </View>

          {/* Bowling Rows */}
          {bowling.length > 0 ? (
            bowling.map((b, i) => renderBowlingRow(b, i))
          ) : (
            <View className="p-4 items-center">
              <ThemedText className="text-sm opacity-50">
                No bowling data available
              </ThemedText>
            </View>
          )}
        </View>
      </View>
    );
  };

  // ===================== Tab Content =====================

  const renderInfoTab = () => (
    <View className="p-4">
      {/* Match Info Card */}
      <View
        className={`rounded-xl overflow-hidden mb-4 ${
          isDark ? "bg-gray-800" : "bg-white"
        } shadow-sm shadow-black/5 elevation-2`}
      >
        <View className={`px-4 py-3 ${isDark ? "bg-gray-700" : "bg-gray-50"}`}>
          <ThemedText className="text-sm font-bold opacity-70">
            MATCH INFO
          </ThemedText>
        </View>

        <View className="p-4">
          <InfoRow label="Match" value={matchData.name} />
          <InfoRow label="Format" value={matchData.matchType?.toUpperCase()} />
          <InfoRow label="Venue" value={matchData.venue} />
          <InfoRow
            label="Date"
            value={new Date(
              matchData.dateTimeGMT || matchData.date,
            ).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          />
          <InfoRow label="Status" value={matchData.status} isStatus />
        </View>
      </View>

      {/* All Innings Summary */}
      {matchData.score && matchData.score.length > 0 && (
        <View
          className={`rounded-xl overflow-hidden mb-4 ${
            isDark ? "bg-gray-800" : "bg-white"
          } shadow-sm shadow-black/5 elevation-2`}
        >
          <View
            className={`px-4 py-3 ${isDark ? "bg-gray-700" : "bg-gray-50"}`}
          >
            <ThemedText className="text-sm font-bold opacity-70">
              INNINGS SUMMARY
            </ThemedText>
          </View>
          <View className="p-4">
            {matchData.score.map((s, i) => (
              <View
                key={i}
                className={`flex-row justify-between items-center py-2.5 ${
                  i < matchData.score!.length - 1
                    ? `border-b ${isDark ? "border-gray-700" : "border-gray-100"}`
                    : ""
                }`}
              >
                <ThemedText
                  className="text-sm font-medium flex-1"
                  numberOfLines={1}
                >
                  {s.inning}
                </ThemedText>
                <ThemedText className="text-base font-bold">
                  {s.r}/{s.w} ({s.o} ov)
                </ThemedText>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Team Info */}
      {matchData.teamInfo && matchData.teamInfo.length > 0 && (
        <View
          className={`rounded-xl overflow-hidden mb-4 ${
            isDark ? "bg-gray-800" : "bg-white"
          } shadow-sm shadow-black/5 elevation-2`}
        >
          <View
            className={`px-4 py-3 ${isDark ? "bg-gray-700" : "bg-gray-50"}`}
          >
            <ThemedText className="text-sm font-bold opacity-70">
              TEAMS
            </ThemedText>
          </View>
          <View className="p-4 flex-row justify-around">
            {matchData.teamInfo.map((team, i) => (
              <View key={i} className="items-center">
                {team.img ? (
                  <Image
                    source={{ uri: team.img }}
                    className="w-16 h-16 rounded-full mb-2"
                    resizeMode="contain"
                  />
                ) : (
                  <View
                    className={`w-16 h-16 rounded-full items-center justify-center mb-2 ${
                      isDark ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <ThemedText className="text-2xl font-bold">
                      {team.name.charAt(0)}
                    </ThemedText>
                  </View>
                )}
                <ThemedText className="text-sm font-semibold">
                  {team.name}
                </ThemedText>
                <ThemedText className="text-xs opacity-50">
                  {team.shortname}
                </ThemedText>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  const renderScorecardTab = () => {
    if (scorecard.length === 0) {
      return (
        <View className="p-4 items-center py-20">
          <ThemedText className="text-5xl mb-4">📊</ThemedText>
          <ThemedText className="text-lg font-semibold mb-2">
            Scorecard Not Available
          </ThemedText>
          <ThemedText className="text-sm opacity-60 text-center">
            Detailed scorecard data is not yet available for this match.
          </ThemedText>
        </View>
      );
    }

    return (
      <View className="p-4">
        {/* Innings Tabs */}
        {scorecard.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          >
            <View className="flex-row gap-2">
              {scorecard.map((inn, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setActiveInning(i)}
                  className={`px-4 py-2 rounded-full ${
                    activeInning === i
                      ? "bg-green-600"
                      : isDark
                        ? "bg-gray-700"
                        : "bg-gray-200"
                  }`}
                >
                  <ThemedText
                    className={`text-xs font-semibold ${
                      activeInning === i ? "text-white" : ""
                    }`}
                    numberOfLines={1}
                  >
                    {inn.inning || `Innings ${i + 1}`}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        )}

        {/* Active Innings Scorecard */}
        {scorecard[activeInning] &&
          renderInningsScorecard(scorecard[activeInning])}
      </View>
    );
  };

  // ===================== Main Render =====================

  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View
        style={{ paddingTop: insets.top }}
        className={`px-4 pb-0 ${isDark ? "bg-gray-900" : "bg-green-600"}`}
      >
        {/* Back Button & Title */}
        <View className="flex-row items-center justify-between pt-3 pb-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center"
          >
            <Ionicons name="arrow-back" size={24} color="white" />
            <ThemedText className="text-white text-base font-semibold ml-2">
              Back
            </ThemedText>
          </TouchableOpacity>
          <View className="flex-row items-center">
            {live && (
              <View className="bg-red-500 px-2 py-1 rounded mr-2">
                <ThemedText className="text-xs font-bold text-white">
                  ● LIVE
                </ThemedText>
              </View>
            )}
            <View
              style={{
                backgroundColor: getMatchTypeBadgeColor(matchData.matchType),
              }}
              className="px-2 py-1 rounded"
            >
              <ThemedText className="text-xs font-bold text-white uppercase">
                {matchData.matchType}
              </ThemedText>
            </View>
          </View>
        </View>

        {/* Score Summary */}
        <View className="pb-4 pt-2">
          <View className="flex-row items-center justify-between mb-3">
            {/* Team 1 */}
            <View className="flex-row items-center flex-1">
              {getTeamImg(team1) ? (
                <Image
                  source={{ uri: getTeamImg(team1)! }}
                  className="w-8 h-8 rounded-full mr-2"
                  resizeMode="contain"
                />
              ) : (
                <View className="w-8 h-8 rounded-full items-center justify-center mr-2 bg-white/20">
                  <ThemedText className="text-white font-bold">
                    {team1.charAt(0)}
                  </ThemedText>
                </View>
              )}
              <ThemedText
                className="text-white font-bold text-sm flex-1"
                numberOfLines={1}
              >
                {getTeamShort(team1)}
              </ThemedText>
            </View>
            <ThemedText className="text-white font-bold text-lg mx-2">
              {score1 ? formatScoreStr(score1) : "—"}
            </ThemedText>
          </View>

          <View className="flex-row items-center justify-between">
            {/* Team 2 */}
            <View className="flex-row items-center flex-1">
              {getTeamImg(team2) ? (
                <Image
                  source={{ uri: getTeamImg(team2)! }}
                  className="w-8 h-8 rounded-full mr-2"
                  resizeMode="contain"
                />
              ) : (
                <View className="w-8 h-8 rounded-full items-center justify-center mr-2 bg-white/20">
                  <ThemedText className="text-white font-bold">
                    {team2.charAt(0)}
                  </ThemedText>
                </View>
              )}
              <ThemedText
                className="text-white font-bold text-sm flex-1"
                numberOfLines={1}
              >
                {getTeamShort(team2)}
              </ThemedText>
            </View>
            <ThemedText className="text-white font-bold text-lg mx-2">
              {score2 ? formatScoreStr(score2) : "—"}
            </ThemedText>
          </View>

          {/* Status */}
          <View className="mt-2">
            <ThemedText className="text-white/80 text-xs text-center">
              {matchData.status}
            </ThemedText>
          </View>
        </View>

        {/* Detail Tabs */}
        <View className="flex-row">
          {DETAIL_TABS.map((tab, index) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(index)}
              className={`flex-1 items-center pb-3 border-b-2 ${
                activeTab === index ? "border-white" : "border-transparent"
              }`}
            >
              <ThemedText
                className={`text-sm font-semibold ${
                  activeTab === index ? "text-white" : "text-white/50"
                }`}
              >
                {tab}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Tab Content */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {activeTab === 0 && renderInfoTab()}
        {activeTab === 1 && renderScorecardTab()}

        {/* Bottom Spacer */}
        <View className="h-24" />
      </ScrollView>
    </ThemedView>
  );
}

// Helper component for match info rows
function InfoRow({
  label,
  value,
  isStatus,
}: {
  label: string;
  value?: string;
  isStatus?: boolean;
}) {
  if (!value) return null;
  return (
    <View className="flex-row py-2 border-b border-gray-100/30">
      <ThemedText className="text-sm opacity-50 w-20">{label}</ThemedText>
      <ThemedText
        className={`text-sm font-medium flex-1 ${isStatus ? "text-green-600" : ""}`}
      >
        {value}
      </ThemedText>
    </View>
  );
}
