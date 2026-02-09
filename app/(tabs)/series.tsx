import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    ScrollView,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { fetchSeries, Series } from "@/services/cricapi";

export default function SeriesScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSeries = async () => {
    try {
      const data = await fetchSeries();
      // Filter out series with no start date or name
      const validSeries = data.filter((s) => s.name && s.startDate);
      // Sort by start date, most recent first
      validSeries.sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      );
      setSeries(validSeries);
    } catch (error) {
      console.error("Error loading series:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadSeries();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadSeries();
  }, []);

  // Determine series status based on dates
  const getSeriesStatus = (startDate: string, endDate: string): string => {
    if (!startDate || !endDate) return "Unknown";

    const now = new Date().getTime();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (now < start) return "Upcoming";
    if (now > end) return "Completed";
    return "Ongoing";
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Ongoing":
        return "bg-green-500";
      case "Upcoming":
        return "bg-blue-500";
      case "Completed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  // Get format from series match counts
  const getFormat = (s: Series): string => {
    const formats = [];
    if (s.odi > 0) formats.push("ODI");
    if (s.t20 > 0) formats.push("T20");
    if (s.test > 0) formats.push("Test");

    if (formats.length === 0) return "Series";
    if (formats.length === 1) return formats[0];
    return "Mixed";
  };

  const getFormatColor = (format: string): { bg: string; text: string } => {
    if (format.includes("Test"))
      return { bg: "bg-red-100", text: "text-red-600" };
    if (format.includes("ODI"))
      return { bg: "bg-blue-100", text: "text-blue-600" };
    if (format.includes("T20"))
      return { bg: "bg-purple-100", text: "text-purple-600" };
    return { bg: "bg-gray-100", text: "text-gray-600" };
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View
        style={{ paddingTop: insets.top }}
        className={`px-5 pb-4 ${isDark ? "bg-gray-900" : "bg-green-600"}`}
      >
        <View className="flex-row items-center justify-between pt-3">
          <ThemedText className="text-xl font-bold text-white">
            Series
          </ThemedText>
          <TouchableOpacity>
            <Ionicons name="calendar" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00A651" />
          <ThemedText className="mt-4 opacity-60">Loading series...</ThemedText>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#00A651"
            />
          }
        >
          <View className="p-4">
            {series.length === 0 ? (
              <View className="items-center py-20">
                <ThemedText className="text-5xl mb-4">🏆</ThemedText>
                <ThemedText className="text-lg font-semibold mb-2">
                  No Series Found
                </ThemedText>
                <ThemedText className="text-sm opacity-60 text-center">
                  No international series available.{"\n"}Pull down to refresh.
                </ThemedText>
              </View>
            ) : (
              series.map((item) => {
                const status = getSeriesStatus(item.startDate, item.endDate);
                const format = getFormat(item);
                const formatColors = getFormatColor(format);

                return (
                  <TouchableOpacity
                    key={item.id}
                    className={`mb-4 rounded-2xl overflow-hidden ${
                      isDark ? "bg-gray-800" : "bg-white"
                    } shadow-md shadow-black/8 elevation-3`}
                  >
                    {/* Series Header */}
                    <View
                      className={`px-4 py-3 ${isDark ? "bg-gray-700/50" : "bg-gray-50"}`}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center flex-1 mr-2">
                          <View
                            className={`px-2 py-0.5 rounded ${getStatusColor(status)} mr-2`}
                          >
                            <ThemedText className="text-xs font-bold text-white">
                              {status.toUpperCase()}
                            </ThemedText>
                          </View>
                          <View
                            className={`px-2 py-0.5 rounded ${formatColors.bg}`}
                          >
                            <ThemedText
                              className={`text-xs font-bold ${formatColors.text}`}
                            >
                              {format}
                            </ThemedText>
                          </View>
                        </View>
                      </View>
                    </View>

                    {/* Series Content */}
                    <View className="p-4">
                      <ThemedText className="font-bold text-base mb-3">
                        {item.name}
                      </ThemedText>

                      <View className="flex-row items-center mb-2">
                        <Ionicons
                          name="calendar-outline"
                          size={16}
                          color={isDark ? "#888" : "#666"}
                        />
                        <ThemedText className="text-sm opacity-60 ml-2">
                          {formatDate(item.startDate)} -{" "}
                          {formatDate(item.endDate)}
                        </ThemedText>
                      </View>

                      <View className="flex-row mt-2 flex-wrap">
                        {item.matches > 0 && (
                          <ThemedText className="text-xs mr-3 opacity-60 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            Matches: {item.matches}
                          </ThemedText>
                        )}
                        {item.odi > 0 && (
                          <ThemedText className="text-xs mr-3 opacity-60 bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            ODIs: {item.odi}
                          </ThemedText>
                        )}
                        {item.t20 > 0 && (
                          <ThemedText className="text-xs mr-3 opacity-60 bg-green-100 text-green-800 px-2 py-1 rounded">
                            T20s: {item.t20}
                          </ThemedText>
                        )}
                        {item.test > 0 && (
                          <ThemedText className="text-xs mr-3 opacity-60 bg-red-100 text-red-800 px-2 py-1 rounded">
                            Tests: {item.test}
                          </ThemedText>
                        )}
                      </View>

                      {/* Progress Bar for Ongoing */}
                      {status === "Ongoing" && (
                        <View className="mt-3">
                          <View
                            className={`h-2 rounded-full overflow-hidden ${
                              isDark ? "bg-gray-700" : "bg-gray-200"
                            }`}
                          >
                            <View
                              className="h-full bg-green-500 rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  ((Date.now() -
                                    new Date(item.startDate).getTime()) /
                                    (new Date(item.endDate).getTime() -
                                      new Date(item.startDate).getTime())) *
                                    100,
                                )}%`,
                              }}
                            />
                          </View>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>

          {/* Bottom Spacer for Tab Bar */}
          <View className="h-24" />
        </ScrollView>
      )}
    </ThemedView>
  );
}
