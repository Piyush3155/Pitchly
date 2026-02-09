import React from 'react';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface WicketCardProps {
  wicket: {
    id: string;
    batsman: string;
    bowler: string;
    fielder?: string;
    dismissalType: string; // bowled, caught, run out, LBW, etc.
    over: number;
    ball: number;
    score: number;
    ballsFaced: number;
  };
}

export function WicketCard({ wicket }: WicketCardProps) {
  const getDismissalDescription = () => {
    switch (wicket.dismissalType.toLowerCase()) {
      case 'bowled':
        return `${wicket.batsman} b ${wicket.bowler}`;
      case 'caught':
        return `${wicket.batsman} c ${wicket.fielder || 'fielder'} b ${wicket.bowler}`;
      case 'run out':
        return `${wicket.batsman} run out`;
      case 'lbw':
        return `${wicket.batsman} lbw b ${wicket.bowler}`;
      case 'caught and bowled':
        return `${wicket.batsman} c&b ${wicket.bowler}`;
      default:
        return `${wicket.batsman} ${wicket.dismissalType} b ${wicket.bowler}`;
    }
  };

  return (
    <ThemedView className="p-4 m-4 rounded-lg bg-red-50 border border-red-200">
      <ThemedView className="flex-row items-center mb-3">
        <ThemedText className="text-2xl mr-2">❌</ThemedText>
        <ThemedText className="text-lg font-semibold text-red-800 flex-1">
          WICKET!
        </ThemedText>
        <ThemedText className="text-sm text-red-800 font-bold">
          {wicket.over}.{wicket.ball}
        </ThemedText>
      </ThemedView>

      <ThemedText className="text-base font-semibold text-red-800 mb-3 leading-6">
        {getDismissalDescription()}
      </ThemedText>

      <ThemedView className="bg-white p-3 rounded">
        <ThemedView className="flex-row justify-between mb-1">
          <ThemedText className="text-sm text-gray-600">Runs:</ThemedText>
          <ThemedText className="text-sm font-semibold">{wicket.score}</ThemedText>
        </ThemedView>

        <ThemedView className="flex-row justify-between mb-1">
          <ThemedText className="text-sm text-gray-600">Balls:</ThemedText>
          <ThemedText className="text-sm font-semibold">{wicket.ballsFaced}</ThemedText>
        </ThemedView>

        <ThemedView className="flex-row justify-between">
          <ThemedText className="text-sm text-gray-600">Strike Rate:</ThemedText>
          <ThemedText className="text-sm font-semibold">
            {wicket.ballsFaced > 0 ? ((wicket.score / wicket.ballsFaced) * 100).toFixed(2) : '0.00'}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}