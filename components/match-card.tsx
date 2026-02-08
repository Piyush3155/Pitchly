import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface MatchCardProps {
  match: {
    id: string;
    team1: string;
    team2: string;
    status: string; // e.g., "LIVE", "UPCOMING", "FINISHED"
    score1?: string;
    score2?: string;
    venue: string;
    date: string;
  };
  onPress?: () => void;
}

export function MatchCard({ match, onPress }: MatchCardProps) {
  const isLive = match.status.toLowerCase() === 'live';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="my-2.5 mx-4"
    >
      <ThemedView className="p-4 rounded-xl border border-gray-200/10 shadow-lg shadow-black/5 elevation-4">
        {/* Top Section: Status and Date */}
        <View className="flex-row justify-between items-center mb-4">
          <View className={`px-2 py-1 rounded-md ${isLive ? 'bg-red-50' : 'bg-gray-100'}`}>
            <ThemedText className={`text-xs font-extrabold tracking-wide ${isLive ? 'text-red-700' : 'text-gray-600'}`}>
              {isLive ? '● LIVE' : match.status.toUpperCase()}
            </ThemedText>
          </View>
          <ThemedText className="text-xs opacity-60">{match.date}</ThemedText>
        </View>

        {/* Middle Section: Teams and Scores */}
        <View className="gap-2">
          <View className="flex-row justify-between items-center">
            <ThemedText className="text-lg font-semibold flex-1" numberOfLines={1}>
              {match.team1}
            </ThemedText>
            <ThemedText className="text-xl font-bold ml-2.5 tabular-nums">{match.score1 ?? '-'}</ThemedText>
          </View>

          <View className="flex-row justify-between items-center">
            <ThemedText className="text-lg font-semibold flex-1" numberOfLines={1}>
              {match.team2}
            </ThemedText>
            <ThemedText className="text-xl font-bold ml-2.5 tabular-nums">{match.score2 ?? '-'}</ThemedText>
          </View>
        </View>

        <View className="h-px bg-gray-200/10 my-3" />

        {/* Bottom Section: Venue */}
        <View className="flex-row items-center">
          <ThemedText className="text-sm opacity-70">📍 {match.venue}</ThemedText>
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}