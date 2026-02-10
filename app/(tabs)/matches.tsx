import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MatchCard } from "@/components/match-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
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
  MatchGroup,
} from "@/services/cricapi";

const TABS = ["Live", "Upcoming", "Recent"];

export default function MatchesScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [activeTab, setActiveTab] = useState("Live");
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<MatchGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadMatches = async () => {
    try {
      await initializeCountries();
      const data = await fetchMatches();
      setAllMatches(data);
      filterMatches(data, activeTab, searchQuery);
    } catch (error) {
      console.error("Error loading matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterMatches = (matches: Match[], tab: string, query: string) => {
    let filtered = matches;

    // Filter by Tab
    filtered = filtered.filter((match) => {
      if (tab === "Live") {
        return isMatchLive(match.status);
      } else if (tab === "Upcoming") {
        return isMatchUpcoming(match.status);
      } else {
        // Recent
        return isMatchCompleted(match.status) || match.resultSet;
      }
    });

    // Filter by Query
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.series_id.toLowerCase().includes(q) ||
          m.venue.toLowerCase().includes(q) ||
          m.teams.some((t) => t.toLowerCase().includes(q)),
      );
    }

    setFilteredMatches(groupMatchesBySeries(filtered));
  };

  const onTabChange = (tab: string) => {
    setActiveTab(tab);
    filterMatches(allMatches, tab, searchQuery);
  };

  const onSearch = (text: string) => {
    setSearchQuery(text);
    filterMatches(allMatches, activeTab, text);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMatches();
    setRefreshing(false);
  }, [activeTab, searchQuery]);

  useEffect(() => {
    loadMatches();
  }, []);

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
          className="px-5 pb-4 pt-3 rounded-b-3xl shadow-sm z-10"
        >
          <View className="flex-row items-center justify-between mb-4">
            <ThemedText className="text-xl font-bold text-white tracking-tight">
              Fixture Center
            </ThemedText>
            <TouchableOpacity className="bg-white/20 p-2 rounded-full">
              <Ionicons name="filter" size={20} color="white" />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View className="flex-row items-center bg-white/20 rounded-xl px-3 py-2 mb-4">
            <Ionicons name="search" size={18} color="rgba(255,255,255,0.7)" />
            <TextInput
              placeholder="Search matches, teams, series..."
              placeholderTextColor="rgba(255,255,255,0.7)"
              className="flex-1 ml-2 text-white font-medium"
              value={searchQuery}
              onChangeText={onSearch}
            />
          </View>

          {/* Tabs */}
          <View className="flex-row bg-black/10 p-1 rounded-xl">
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  className={`flex-1 items-center py-2 rounded-lg ${
                    isActive ? "bg-background shadow-sm" : ""
                  }`}
                  onPress={() => onTabChange(tab)}
                >
                  <ThemedText
                    className={`text-xs font-bold ${
                      isActive
                        ? isDark
                          ? "text-gray-900"
                          : "text-green-700"
                        : "text-white/70"
                    }`}
                  >
                    {tab}
                  </ThemedText>
                </TouchableOpacity>
              );
            })}
          </View>
        </LinearGradient>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={CricketColors.primary[500]} />
        </View>
      ) : (
        <ScrollView
          className="flex-1 -mt-2 bg-transparent"
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={CricketColors.primary[500]}
            />
          }
        >
          {filteredMatches.length === 0 ? (
            <View className="items-center py-20 opacity-50">
              <Ionicons
                name="documents-outline"
                size={64}
                color={isDark ? "white" : "black"}
              />
              <ThemedText className="mt-4 font-medium">
                No matches found
              </ThemedText>
            </View>
          ) : (
            filteredMatches.map((group) => (
              <View key={group.seriesName} className="mb-6">
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
              </View>
            ))
          )}
        </ScrollView>
      )}
    </ThemedView>
  );
}
