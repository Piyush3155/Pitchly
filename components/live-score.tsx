import React from 'react';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface LiveScoreProps {
  team1: string;
  team2: string;
  score1: string;
  score2: string;
  overs1: string;
  overs2: string;
  currentInnings: 1 | 2;
  status: string;
  target?: number;
}

export function LiveScore({
  team1,
  team2,
  score1,
  score2,
  overs1,
  overs2,
  currentInnings,
  status,
  target,
}: LiveScoreProps) {
  return (
    <ThemedView className="p-4 m-4 rounded-lg shadow-md shadow-black/10 elevation-3">
      <ThemedView className="items-center mb-4">
        <ThemedText className="text-2xl font-bold text-center mb-1">
          {team1} vs {team2}
        </ThemedText>
        <ThemedText className="text-sm text-gray-600 text-center">{status}</ThemedText>
      </ThemedView>

      <ThemedView className="flex-row justify-between">
        <ThemedView className={`flex-1 items-center p-2 rounded-md ${currentInnings === 1 ? 'bg-blue-50' : ''}`}>
          <ThemedText className="text-lg font-semibold mb-1">
            {team1}
          </ThemedText>
          <ThemedText className="text-2xl font-bold mb-0.5">{score1}</ThemedText>
          <ThemedText className="text-sm text-gray-600">({overs1})</ThemedText>
        </ThemedView>

        <ThemedView className={`flex-1 items-center p-2 rounded-md ${currentInnings === 2 ? 'bg-blue-50' : ''}`}>
          <ThemedText className="text-lg font-semibold mb-1">
            {team2}
          </ThemedText>
          <ThemedText className="text-2xl font-bold mb-0.5">{score2}</ThemedText>
          <ThemedText className="text-sm text-gray-600">({overs2})</ThemedText>
          {target && (
            <ThemedText className="text-xs text-blue-600 mt-1">Target: {target}</ThemedText>
          )}
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}