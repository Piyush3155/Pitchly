import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Image,
    RefreshControl,
    ScrollView,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
    Country,
    fetchCountries,
    initializeCountries
} from "@/services/cricapi";

export default function TeamsScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      await initializeCountries();
      const data = await fetchCountries();
      // Filter out countries without flags or names
      const validCountries = data.filter((c) => c.name && c.genericFlag);
      // Sort alphabetically
      validCountries.sort((a, b) => a.name.localeCompare(b.name));

      setCountries(validCountries);
      setFilteredCountries(validCountries);
    } catch (error) {
      console.error("Error loading teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = countries.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries(countries);
    }
  }, [searchQuery, countries]);

  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View
        style={{ paddingTop: insets.top }}
        className={`px-5 pb-4 ${isDark ? "bg-gray-900" : "bg-green-600"}`}
      >
        <View className="flex-row items-center justify-between pt-3 mb-4">
          <ThemedText className="text-xl font-bold text-white">
            Teams & Nations
          </ThemedText>
        </View>

        {/* Search Bar */}
        <View
          className={`flex-row items-center px-4 py-2 rounded-xl ${isDark ? "bg-gray-800" : "bg-white/20"}`}
        >
          <Ionicons
            name="search"
            size={20}
            color={isDark ? "#9ca3af" : "white"}
          />
          <TextInput
            placeholder="Search teams..."
            placeholderTextColor={isDark ? "#9ca3af" : "rgba(255,255,255,0.7)"}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{ color: isDark ? "white" : "white" }}
            className="flex-1 ml-2 text-base"
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons
                name="close-circle"
                size={20}
                color={isDark ? "#9ca3af" : "white"}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#00A651" />
          <ThemedText className="mt-4 opacity-60">Loading teams...</ThemedText>
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
            <ThemedText className="text-base font-bold mb-3">
              All Cricket Nations ({filteredCountries.length})
            </ThemedText>

            {filteredCountries.length === 0 ? (
              <View className="items-center py-20">
                <ThemedText className="text-5xl mb-4">🌍</ThemedText>
                <ThemedText className="text-lg font-semibold mb-2">
                  No Teams Found
                </ThemedText>
              </View>
            ) : (
              <View className="flex-row flex-wrap justify-between">
                {filteredCountries.map((country) => (
                  <TouchableOpacity
                    key={country.id}
                    className={`w-[48%] p-4 mb-3 rounded-xl items-center ${
                      isDark ? "bg-gray-800" : "bg-white"
                    } shadow-md shadow-black/5 elevation-2`}
                  >
                    <View className="w-16 h-12 mb-3 rounded shadow-sm overflow-hidden bg-gray-100">
                      <Image
                        source={{ uri: country.genericFlag }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    </View>
                    <ThemedText
                      className="font-semibold text-center text-sm"
                      numberOfLines={2}
                    >
                      {country.name}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Bottom Spacer for Tab Bar */}
          <View className="h-24" />
        </ScrollView>
      )}
    </ThemedView>
  );
}
