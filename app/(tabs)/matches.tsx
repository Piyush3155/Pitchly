import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ErrorState } from "@/components/error-state";
import { MatchCard } from "@/components/match-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Skeleton } from "@/components/ui/skeleton";
import { CricketColors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  fetchMatches,
  groupMatchesBySeries,
  initializeCountries,
  isMatchCompleted,
  isMatchLive,
  isMatchUpcoming,
  Match,
} from "@/services/cricapi";

const TABS = ["Live", "Upcoming", "Recent"];

export default function MatchesScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [activeTab, setActiveTab] = useState("Live");
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadMatches = useCallback(async () => {
    try {
      setError(null);
      await initializeCountries();
      const data = await fetchMatches();
      setAllMatches(data);
    } catch (err) {
      console.error("Error loading matches:", err);
      setError("Failed to load matches. Please check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadMatches();
    const interval = setInterval(loadMatches, 60000);
    return () => clearInterval(interval);
  }, [loadMatches]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadMatches();
  }, [loadMatches]);

  const filteredMatches = useMemo(() => {
    let result = allMatches;

    // Filter by Tab
    if (activeTab === "Live") {
      result = result.filter((m) => isMatchLive(m.status));
    } else if (activeTab === "Upcoming") {
      result = result.filter((m) => isMatchUpcoming(m.status));
    } else {
      result = result.filter((m) => isMatchCompleted(m.status) || m.resultSet);
    }

    // Filter by Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.series_id.toLowerCase().includes(q) ||
          m.venue.toLowerCase().includes(q) ||
          m.teams.some((t) => t.toLowerCase().includes(q)),
      );
    }

    return groupMatchesBySeries(result);
  }, [allMatches, activeTab, searchQuery]);

  const renderSkeleton = () => (
    <View className="px-5 pt-4 gap-6">
      {[1, 2, 3].map((i) => (
        <View key={i} className="gap-4">
          <Skeleton width={150} height={20} />
          <Skeleton width="100%" height={160} borderRadius={24} />
        </View>
      ))}
    </View>
  );

  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View style={{ paddingTop: insets.top }}>
        <LinearGradient
          colors={
            isDark
              ? CricketColors.gradients.headerDark
              : CricketColors.gradients.header
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-5 pb-8 pt-4 rounded-b-3xl shadow-lg z-10"
        >
          <View className="flex-row items-center justify-between mb-4">
            <ThemedText className="text-2xl font-bold text-white tracking-tight">
              Fixture Center
            </ThemedText>
            <TouchableOpacity className="bg-white/20 p-2 rounded-full backdrop-blur-md">
              <Ionicons name="filter" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="flex-row items-center bg-black/20 rounded-2xl px-4 py-3 mb-2 border border-white/10">
            <Ionicons name="search" size={18} color="rgba(255,255,255,0.6)" />
            <TextInput
              placeholder="Search matches, teams, series..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              className="flex-1 ml-3 text-white font-medium text-base h-full" // Added h-full to fix alignment
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ paddingVertical: 0 }} // Fix for android text input padding
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons
                  name="close-circle"
                  size={18}
                  color="rgba(255,255,255,0.6)"
                />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </View>

      {/* Tabs */}
      <View className="-mt-6 px-6 mb-2 z-20">
        <View
          className={`flex-row p-1.5 rounded-2xl shadow-sm ${isDark ? "bg-gray-800 border border-gray-700" : "bg-white"}`}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <TouchableOpacity
                key={tab}
                className={`flex-1 items-center py-2.5 rounded-xl ${
                  isActive ? "bg-green-500 shadow-sm" : "bg-transparent"
                }`}
                onPress={() => setActiveTab(tab)}
              >
                <ThemedText
                  className={`text-xs font-bold uppercase tracking-wide ${
                    isActive
                      ? "text-white"
                      : isDark
                        ? "text-gray-400"
                        : "text-gray-500"
                  }`}
                >
                  {tab}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {error && !loading && !refreshing && allMatches.length === 0 ? (
        <View className="flex-1 justify-center px-6">
          <ErrorState message={error} onRetry={loadMatches} />
        </View>
      ) : loading && !refreshing ? (
        renderSkeleton()
      ) : (
        <ScrollView
          className="flex-1 -mt-2 bg-transparent"
          contentContainerStyle={{
            paddingBottom: 100,
            paddingTop: 20,
            flexGrow: 1, // Allow content to grow to fill screen when empty
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={CricketColors.primary[500]}
              colors={[CricketColors.primary[500]]}
            />
          }
        >
          {filteredMatches.length === 0 ? (
            <Animated.View
              entering={FadeInDown.duration(500)}
              className="flex-1 items-center justify-center opacity-50 "
            >
              <Ionicons
                name="documents-outline"
                size={64}
                color={isDark ? "white" : "black"}
                className="self-center"
              />
              <ThemedText className="mt-4 font-medium self-center">
                No matches found
              </ThemedText>
              <ThemedText className="text-xs opacity-60 mt-2 self-center">
                Try adjusting your search or tabs
              </ThemedText>
            </Animated.View>
          ) : (
            filteredMatches.map((group, index) => (
              <Animated.View
                key={group.seriesName}
                className="mb-6"
                entering={FadeInDown.delay(index * 100).duration(500)}
              >
                {/* Series Header */}
                <View className="flex-row items-center px-5 py-2 mb-2">
                  <ThemedText className="text-base mr-2">🏆</ThemedText>
                  <ThemedText
                    className="text-xs font-bold uppercase tracking-wider opacity-60 flex-1"
                    numberOfLines={1}
                  >
                    {group.seriesName}
                  </ThemedText>
                </View>

                {group.matches.map((match) => (
                  <Link key={match.id} href={`/match/${match.id}`} asChild>
                    <MatchCard data={match as any} showSeries={false} />
                  </Link>
                ))}
              </Animated.View>
            ))
          )}
        </ScrollView>
      )}
    </ThemedView>
  );
}
