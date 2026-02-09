import React from "react";
import { TouchableOpacity } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

interface TeamCardProps {
  team: {
    id: string;
    name: string;
    shortName: string;
    flag?: string; // URL or emoji
    captain: string;
    coach?: string;
    matchesPlayed: number;
    wins: number;
    losses: number;
    draws: number;
    points?: number;
  };
  onPress?: () => void;
}

export function TeamCard({ team, onPress }: TeamCardProps) {
  const winPercentage =
    team.matchesPlayed > 0
      ? ((team.wins / team.matchesPlayed) * 100).toFixed(1)
      : "0.0";

  return (
    <TouchableOpacity onPress={onPress} className="my-2 mx-4">
      <ThemedView className="p-4 rounded-lg shadow-md shadow-black/10 elevation-3">
        <ThemedView className="flex-row items-center mb-3">
          <ThemedText className="text-3xl mr-3">{team.flag || "🏏"}</ThemedText>
          <ThemedView className="flex-1">
            <ThemedText type="subtitle" className="mb-0.5">
              {team.name}
            </ThemedText>
            <ThemedText className="text-sm text-gray-500">
              ({team.shortName})
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView className="flex-row mb-2">
          <ThemedText className="text-sm text-gray-500 w-16">
            Captain:
          </ThemedText>
          <ThemedText className="text-sm font-semibold flex-1">
            {team.captain}
          </ThemedText>
        </ThemedView>

        {team.coach && (
          <ThemedView className="flex-row mb-2">
            <ThemedText className="text-sm text-gray-500 w-16">
              Coach:
            </ThemedText>
            <ThemedText className="text-sm font-semibold flex-1">
              {team.coach}
            </ThemedText>
          </ThemedView>
        )}

        <ThemedView className="mt-3">
          <ThemedView className="flex-row justify-between mb-1">
            <ThemedText className="text-sm text-gray-500">Matches:</ThemedText>
            <ThemedText className="text-sm font-semibold">
              {team.matchesPlayed}
            </ThemedText>
          </ThemedView>

          <ThemedView className="flex-row justify-between mb-1">
            <ThemedText className="text-sm text-gray-500">Won:</ThemedText>
            <ThemedText className="text-sm font-semibold">
              {team.wins}
            </ThemedText>
          </ThemedView>

          <ThemedView className="flex-row justify-between mb-1">
            <ThemedText className="text-sm text-gray-500">Lost:</ThemedText>
            <ThemedText className="text-sm font-semibold">
              {team.losses}
            </ThemedText>
          </ThemedView>

          <ThemedView className="flex-row justify-between mb-1">
            <ThemedText className="text-sm text-gray-500">Draw:</ThemedText>
            <ThemedText className="text-sm font-semibold">
              {team.draws}
            </ThemedText>
          </ThemedView>

          <ThemedView className="flex-row justify-between mb-1">
            <ThemedText className="text-sm text-gray-500">Win %:</ThemedText>
            <ThemedText className="text-sm font-semibold">
              {winPercentage}%
            </ThemedText>
          </ThemedView>

          {team.points !== undefined && (
            <ThemedView className="flex-row justify-between mb-1">
              <ThemedText className="text-sm text-gray-500">Points:</ThemedText>
              <ThemedText className="text-sm font-semibold">
                {team.points}
              </ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
}
