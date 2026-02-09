import React from "react";
import { TouchableOpacity } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

interface PlayerCardProps {
  player: {
    id: string;
    name: string;
    role: string; // batsman, bowler, all-rounder, wicket-keeper
    team: string;
    stats: {
      matches: number;
      runs?: number;
      wickets?: number;
      average?: number;
      strikeRate?: number;
      economy?: number;
    };
  };
  onPress?: () => void;
}

export function PlayerCard({ player, onPress }: PlayerCardProps) {
  return (
    <TouchableOpacity onPress={onPress} className="my-2 mx-4">
      <ThemedView className="p-4 rounded-lg shadow-md shadow-black/10 elevation-3">
        <ThemedView className="mb-2">
          <ThemedText type="subtitle" className="mb-1">
            {player.name}
          </ThemedText>
          <ThemedText className="text-sm text-gray-500 capitalize">
            {player.role}
          </ThemedText>
        </ThemedView>

        <ThemedText className="text-base font-semibold mb-3">
          {player.team}
        </ThemedText>

        <ThemedView>
          <ThemedView className="flex-row justify-between mb-1">
            <ThemedText className="text-sm text-gray-500">Matches:</ThemedText>
            <ThemedText className="text-sm font-semibold">
              {player.stats.matches}
            </ThemedText>
          </ThemedView>

          {player.stats.runs !== undefined && (
            <ThemedView className="flex-row justify-between mb-1">
              <ThemedText className="text-sm text-gray-500">Runs:</ThemedText>
              <ThemedText className="text-sm font-semibold">
                {player.stats.runs}
              </ThemedText>
            </ThemedView>
          )}

          {player.stats.wickets !== undefined && (
            <ThemedView className="flex-row justify-between mb-1">
              <ThemedText className="text-sm text-gray-500">
                Wickets:
              </ThemedText>
              <ThemedText className="text-sm font-semibold">
                {player.stats.wickets}
              </ThemedText>
            </ThemedView>
          )}

          {player.stats.average !== undefined && (
            <ThemedView className="flex-row justify-between mb-1">
              <ThemedText className="text-sm text-gray-500">
                Average:
              </ThemedText>
              <ThemedText className="text-sm font-semibold">
                {player.stats.average}
              </ThemedText>
            </ThemedView>
          )}

          {player.stats.strikeRate !== undefined && (
            <ThemedView className="flex-row justify-between mb-1">
              <ThemedText className="text-sm text-gray-500">
                Strike Rate:
              </ThemedText>
              <ThemedText className="text-sm font-semibold">
                {player.stats.strikeRate}
              </ThemedText>
            </ThemedView>
          )}

          {player.stats.economy !== undefined && (
            <ThemedView className="flex-row justify-between mb-1">
              <ThemedText className="text-sm text-gray-500">
                Economy:
              </ThemedText>
              <ThemedText className="text-sm font-semibold">
                {player.stats.economy}
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
}
