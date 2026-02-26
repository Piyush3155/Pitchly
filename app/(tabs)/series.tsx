import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ErrorState } from "@/components/error-state";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Skeleton } from "@/components/ui/skeleton";
import { CricketColors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { fetchSeries, Series } from "@/services/cricapi";

export default function SeriesScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSeriesStatus = (startDate: string, endDate: string): string => {
    if (!startDate || !endDate) return "Unknown";

    const now = new Date().getTime();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (now < start) return "Upcoming";
    if (now > end) return "Completed";
    return "Ongoing";
  };

  const loadSeries = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchSeries();
      // Sort: Ongoing first, then Upcoming, then Completed
      // Within each, sort by date
      const sorted = data.sort((a, b) => {
        const statusA = getSeriesStatus(a.startDate, a.endDate);
        const statusB = getSeriesStatus(b.startDate, b.endDate);

        const statusWeight: Record<string, number> = {
          Ongoing: 0,
          Upcoming: 1,
          Completed: 2,
          Unknown: 3,
        };

        if (statusWeight[statusA] !== statusWeight[statusB]) {
          return statusWeight[statusA] - statusWeight[statusB];
        }

        return (
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );
      });

      setSeriesList(sorted);
    } catch (err) {
      console.error("Error loading series:", err);
      setError("Failed to load series. Please check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadSeries();
  }, [loadSeries]);

  useEffect(() => {
    loadSeries();
  }, [loadSeries]);

  const getFormat = (s: Series): string => {
    const formats = [];
    if (s.odi > 0) formats.push("ODI");
    if (s.t20 > 0) formats.push("T20");
    if (s.test > 0) formats.push("Test");

    if (formats.length === 0) return "Series";
    if (formats.length === 1) return formats[0];
    return "Mixed";
  };

  const renderSkeleton = () => (
    <View className="px-4 pt-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} width="100%" height={100} borderRadius={12} />
      ))}
    </View>
  );

  const renderSeriesCard = (item: Series, index: number) => {
    const status = getSeriesStatus(item.startDate, item.endDate);

    const statusColor =
      status === "Ongoing"
        ? CricketColors.status.live
        : status === "Upcoming"
          ? CricketColors.status.upcoming
          : CricketColors.status.completed;

    return (
      <Animated.View
        key={item.id}
        entering={FadeInDown.delay(index * 50).duration(500)}
        className={`mb-4 mx-4 rounded-xl p-4 ${
          isDark ? "bg-gray-800" : "bg-white"
        } shadow-md shadow-black/5 elevation-3 border-l-4`}
        style={{ borderLeftColor: statusColor }}
      >
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1 mr-2">
            <ThemedText className="font-bold text-base leading-5">
              {item.name}
            </ThemedText>
            <ThemedText className="text-xs opacity-50 mt-1 font-medium">
              {new Date(item.startDate).toLocaleDateString()} -{" "}
              {new Date(item.endDate).toLocaleDateString()}
            </ThemedText>
          </View>
          <View
            className="px-2 py-1 rounded"
            style={{ backgroundColor: `${statusColor}20` }}
          >
            <ThemedText
              className="text-[10px] font-bold uppercase"
              style={{ color: statusColor }}
            >
              {status}
            </ThemedText>
          </View>
        </View>

        <View className="flex-row mt-3 items-center">
          <View
            className={`px-2 py-0.5 rounded mr-2 bg-gray-100 dark:bg-gray-700`}
          >
            <ThemedText className="text-[10px] font-bold opacity-70">
              {getFormat(item)}
            </ThemedText>
          </View>
          <View className="flex-1 flex-row space-x-3">
            {item.odi > 0 && (
              <ThemedText className="text-xs opacity-60">
                {item.odi} ODI
              </ThemedText>
            )}
            {item.t20 > 0 && (
              <ThemedText className="text-xs opacity-60">
                {item.t20} T20
              </ThemedText>
            )}
            {item.test > 0 && (
              <ThemedText className="text-xs opacity-60">
                {item.test} Test
              </ThemedText>
            )}
            {item.matches > 0 && !item.odi && !item.t20 && !item.test && (
              <ThemedText className="text-xs opacity-60">
                {item.matches} Matches
              </ThemedText>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

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
          className="px-5 pb-6 pt-3 rounded-b-3xl shadow-sm z-10"
        >
          <ThemedText className="text-xl font-bold text-white tracking-tight">
            Series & Tournaments
          </ThemedText>
          <View className="flex-row items-center mt-1 opacity-80">
            <Ionicons
              name="filter-circle"
              size={14}
              color="white"
              style={{ marginRight: 4 }}
            />
            <ThemedText className="text-white text-xs">
              Ordered by Status and Date
            </ThemedText>
          </View>
        </LinearGradient>
      </View>

      {error && !loading && !refreshing && seriesList.length === 0 ? (
        <View className="flex-1 justify-center px-6">
          <ErrorState message={error} onRetry={loadSeries} />
        </View>
      ) : loading && !refreshing ? (
        renderSkeleton()
      ) : (
        <ScrollView
          className="flex-1 -mt-2 bg-transparent"
          contentContainerStyle={{
            paddingBottom: 100,
            paddingTop: 20,
            flexGrow: 1, // Ensure container fills screen for centering
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
          {seriesList.length === 0 ? (
            <Animated.View
              entering={FadeInDown.duration(500)}
              className="flex-1 items-center justify-center opacity-50"
            >
              <Ionicons
                name="trophy-outline"
                size={48}
                color={isDark ? "white" : "black"}
                className="mb-4"
              />
              <ThemedText className="font-medium text-center">
                No series found
              </ThemedText>
            </Animated.View>
          ) : (
            seriesList.map((item, index) => renderSeriesCard(item, index))
          )}
        </ScrollView>
      )}
    </ThemedView>
  );
}
