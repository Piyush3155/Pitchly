import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ErrorState } from "@/components/error-state";
import { MatchCard } from "@/components/match-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Skeleton } from "@/components/ui/skeleton";
import { CricketColors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  fetchCurrentMatches,
  groupMatchesBySeries,
  initializeCountries,
  isMatchLive,
  Match,
} from "@/services/cricapi";

interface MatchGroup {
  seriesName: string;
  matches: Match[];
}

export default function LiveScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMatches = useCallback(async () => {
    try {
      setError(null);
      await initializeCountries();
      const data = await fetchCurrentMatches();
      const liveMatches = data.filter((m) => isMatchLive(m.status));
      setMatches(liveMatches);
    } catch (err) {
      console.error("Error loading matches:", err);
      setError("Failed to load live matches. Please check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadMatches();
  }, [loadMatches]);

  useEffect(() => {
    loadMatches();
    const interval = setInterval(loadMatches, 60000);
    return () => clearInterval(interval);
  }, [loadMatches]);

  const renderSkeleton = () => (
    <View className="px-5 pt-8 gap-6">
      {[1, 2].map((i) => (
        <View key={i} className="gap-4">
          <Skeleton width={150} height={20} />
          <Skeleton width="100%" height={160} borderRadius={24} />
        </View>
      ))}
    </View>
  );

  return (
    <ThemedView className="flex-1">
      {/* Premium Header */}
      <View style={{ paddingTop: insets.top }}>
        <LinearGradient
          colors={
            isDark
              ? CricketColors.gradients.headerDark
              : CricketColors.gradients.header
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-5 pb-6 pt-4 rounded-b-3xl shadow-lg z-10"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-red-500 mr-3 animate-pulse border-2 border-white/20" />
              <ThemedText className="text-2xl font-bold text-white tracking-tight">
                Live Coverage
              </ThemedText>
            </View>
            <View className="bg-white/20 px-3 py-1 rounded-full border border-white/30 backdrop-blur-md">
              <ThemedText className="text-white text-xs font-bold">
                {refreshing ? "UPDATING..." : `${matches.length} ON AIR`}
              </ThemedText>
            </View>
          </View>
        </LinearGradient>
      </View>

      {error && !loading && !refreshing && matches.length === 0 ? (
        <View className="flex-1 justify-center px-6">
          <ErrorState message={error} onRetry={loadMatches} />
        </View>
      ) : loading && !refreshing ? (
        renderSkeleton()
      ) : (
        <ScrollView
          className="flex-1 -mt-4 bg-transparent"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 100,
            paddingTop: 24,
            flexGrow: 1,
          }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={CricketColors.primary[500]}
              colors={[CricketColors.primary[500]]}
            />
          }
        >
          {matches.length === 0 ? (
            <Animated.View
              entering={FadeInUp.duration(600)}
              className="flex-1 items-center justify-center px-8"
            >
              <View className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full items-center justify-center mb-6">
                {/* <ThemedText className="text-4xl opacity-50">📡</ThemedText> */}
              </View>
              <ThemedText className="text-xl font-bold mb-2 text-center">
                No Live Matches
              </ThemedText>
              <ThemedText className="text-sm opacity-50 text-center leading-6">
                There is no live cricket action at the moment.{"\n"}Check the
                schedule for upcoming games.
              </ThemedText>

              <Link href="/matches" asChild>
                <TouchableOpacity className="mt-8 w-60 items-center justify-center bg-green-600 px-4 py-3 rounded-full shadow-md shadow-green-600/20 active:opacity-90">
                  <ThemedText className="text-white font-bold text-sm text-center">
                    View Upcoming Fixtures
                  </ThemedText>
                </TouchableOpacity>
              </Link>
            </Animated.View>
          ) : (
            <View>
              {groupMatchesBySeries(matches).map((group: MatchGroup, index) => (
                <Animated.View
                  key={group.seriesName}
                  className="mb-6"
                  entering={FadeInDown.delay(index * 100).duration(500)}
                >
                  {/* Series Header */}
                  <View className="flex-row items-center px-6 py-2 mb-3">
                    <ThemedText className="text-xs font-bold uppercase tracking-widest opacity-50 flex-1">
                      {group.seriesName}
                    </ThemedText>
                  </View>

                  {/* Matches in this series */}
                  {group.matches.map((match) => (
                    <Link key={match.id} href={`/match/${match.id}`} asChild>
                      <MatchCard data={match as any} showSeries={false} />
                    </Link>
                  ))}
                </Animated.View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </ThemedView>
  );
}
