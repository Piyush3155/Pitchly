import React from 'react';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface Ball {
  runs: number;
  isWicket: boolean;
  isNoBall?: boolean;
  isWide?: boolean;
  isBye?: boolean;
  isLegBye?: boolean;
}

interface OverSummaryProps {
  bowler: string;
  overNumber: number;
  balls: Ball[];
  totalRuns: number;
  wickets: number;
}

export function OverSummary({ bowler, overNumber, balls, totalRuns, wickets }: OverSummaryProps) {
  const getBallDisplay = (ball: Ball) => {
    if (ball.isWicket) return 'W';
    if (ball.isNoBall) return `NB${ball.runs}`;
    if (ball.isWide) return `WD${ball.runs}`;
    if (ball.isBye) return `B${ball.runs}`;
    if (ball.isLegBye) return `LB${ball.runs}`;
    return ball.runs.toString();
  };

  return (
    <ThemedView className="p-4 m-4 rounded-lg shadow-md shadow-black/10 elevation-3">
      <ThemedView className="mb-3">
        <ThemedText className="text-lg font-semibold mb-1">
          Over {overNumber}
        </ThemedText>
        <ThemedText className="text-sm text-gray-600">Bowled by {bowler}</ThemedText>
      </ThemedView>

      <ThemedView className="flex-row flex-wrap mb-3">
        {balls.map((ball, index) => (
          <ThemedView
            key={index}
            className={`w-10 h-10 rounded-full justify-center items-center m-1 ${
              ball.isWicket
                ? 'bg-red-500'
                : ball.runs === 4
                ? 'bg-yellow-500'
                : ball.runs === 6
                ? 'bg-green-500'
                : 'bg-gray-200'
            }`}
          >
            <ThemedText className="text-sm font-bold text-white">{getBallDisplay(ball)}</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>

      <ThemedView className="items-center">
        <ThemedText className="text-base font-semibold">
          This Over: {totalRuns} runs, {wickets} wicket{wickets !== 1 ? 's' : ''}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}