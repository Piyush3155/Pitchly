import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    RefreshControl,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
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

  const loadTeams = async () => {
    try {
      const data = await fetchCountries();
      // Filter out non-test playing nations or very small ones if needed,
      // but for now let's just show them all sorted by popularity/name
      // Just rudimentary sort by name
      const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
      setCountries(sorted);
      setFilteredCountries(sorted);
    } catch (error) {
      console.error("Error loading teams:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTeams();
    setRefreshing(false);
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const renderTeamItem = ({ item }: { item: Country }) => (
    <TouchableOpacity
      className={`mx-2 mb-4 p-4 items-center justify-center rounded-2xl flex-1 h-32 ${
        isDark ? "bg-gray-800" : "bg-white"
      } shadow-md shadow-black/5 elevation-3`}
    >
      <View className="w-16 h-16 rounded-full items-center justify-center mb-3 overflow-hidden border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        {getCountryFlag(item.name) ? (
          <Image
            source={{ uri: getCountryFlag(item.name)! }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <ThemedText className="text-2xl">🛡️</ThemedText>
        )}
      </View>
      <ThemedText className="font-bold text-center text-xs" numberOfLines={2}>
        {item.name}
      </ThemedText>
    </TouchableOpacity>
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

          <View className="flex-row items-center bg-white/20 rounded-xl px-3 py-2">
            <Ionicons name="search" size={18} color="rgba(255,255,255,0.7)" />
            <TextInput
              className="flex-1 ml-2 text-white font-medium"
              placeholder="Find a team..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={searchQuery}
              onChangeText={onSearch}
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => onSearch("")}>
                <Ionicons name="close-circle" size={18} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={CricketColors.primary[500]} />
        </View>
      ) : (
        <FlatList
          data={filteredCountries}
          renderItem={renderTeamItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={{
            padding: 10,
            paddingBottom: 100,
            paddingTop: 20,
          }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={CricketColors.primary[500]}
            />
          }
          ListEmptyComponent={
            <View className="items-center mt-20 opacity-50">
              <ThemedText>No teams found</ThemedText>
            </View>
          }
        />
      )}
    </ThemedView>
  );
}
