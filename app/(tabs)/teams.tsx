import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useState } from "react";
import {
    FlatList,
    RefreshControl,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ErrorState } from "@/components/error-state";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Skeleton } from "@/components/ui/skeleton";
import { CricketColors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Country, fetchCountries, getCountryFlag } from "@/services/cricapi";

export default function TeamsScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTeams = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchCountries();
      // Sort alphabetically
      const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
      setCountries(sorted);
      setFilteredCountries(sorted);
    } catch (err) {
      console.error("Error loading teams:", err);
      setError("Failed to load teams. Please check your connection.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  const onSearch = (text: string) => {
    setSearchQuery(text);
    if (text) {
      const filtered = countries.filter((c) =>
        c.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(countries);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTeams();
  }, [loadTeams]);

  const renderSkeleton = () => (
    <View className="flex-row flex-wrap justify-center p-4 gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
        <View key={i} className="mb-4 w-[28%] items-center gap-2">
          <Skeleton width={80} height={80} borderRadius={40} />
          <Skeleton width={60} height={12} />
        </View>
      ))}
    </View>
  );

  const renderTeamItem = ({
    item,
    index,
  }: {
    item: Country;
    index: number;
  }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 20).duration(500)}
      className="w-[33.33%] p-1.5"
    >
      <TouchableOpacity
        activeOpacity={0.7}
        className={`w-full p-3 items-center justify-center rounded-2xl h-36 ${
          isDark ? "bg-gray-800" : "bg-white"
        } shadow-sm shadow-black/5 elevation-2 border border-gray-100 dark:border-gray-700`}
      >
        <View className="w-16 h-16 rounded-full items-center justify-center mb-3 overflow-hidden border-2 border-white dark:border-gray-600 bg-gray-50 dark:bg-gray-900 shadow-sm relative">
          {getCountryFlag(item.name) ? (
            <Image
              source={{ uri: getCountryFlag(item.name)! }}
              className="w-full h-full"
              contentFit="cover"
              transition={500}
            />
          ) : (
            <View className="w-full h-full bg-gray-200 dark:bg-gray-700 items-center justify-center">
              <ThemedText className="text-2xl">🛡️</ThemedText>
            </View>
          )}
        </View>
        <ThemedText
          className="font-bold text-center text-xs leading-4 opacity-80"
          numberOfLines={2}
        >
          {item.name}
        </ThemedText>
      </TouchableOpacity>
    </Animated.View>
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
          className="px-5 pb-6 pt-3 rounded-b-3xl shadow-sm z-10"
        >
          <ThemedText className="text-xl font-bold text-white tracking-tight mb-4">
            World Teams
          </ThemedText>

          <View className="flex-row items-center bg-white/20 rounded-xl px-3 py-2 border border-white/10">
            <Ionicons name="search" size={18} color="rgba(255,255,255,0.7)" />
            <TextInput
              className="flex-1 ml-2 text-white font-medium text-base" // Removed h-full to rely on padding
              placeholder="Find a team..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={searchQuery}
              onChangeText={onSearch}
              autoCorrect={false}
              selectionColor="white"
              style={{ paddingVertical: 4 }} // Explicit padding for alignment
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => onSearch("")}>
                <Ionicons name="close-circle" size={18} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </View>

      {error && !loading && !refreshing && countries.length === 0 ? (
        <View className="flex-1 justify-center px-6">
          <ErrorState message={error} onRetry={loadTeams} />
        </View>
      ) : loading && !refreshing ? (
        renderSkeleton()
      ) : (
        <FlatList
          data={filteredCountries}
          renderItem={renderTeamItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={{
            padding: 8,
            paddingBottom: 100,
            paddingTop: 16,
          }}
          columnWrapperStyle={{ justifyContent: "flex-start" }} // Use standard flex-start with explicit widths
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={CricketColors.primary[500]}
              colors={[CricketColors.primary[500]]}
            />
          }
          ListEmptyComponent={
            <View className="items-center mt-20 opacity-50">
              <Ionicons
                name="people-outline"
                size={48}
                color={isDark ? "white" : "black"}
              />
              <ThemedText className="mt-4 font-medium">
                No teams found
              </ThemedText>
            </View>
          }
        />
      )}
    </ThemedView>
  );
}
