import React from "react";
import { ScrollView } from "react-native";
import { ThemedText } from "./themed-text";
import { ThemedView } from "./themed-view";

interface Batsman {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  dismissal?: string;
}

interface Bowler {
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

interface ScorecardProps {
  battingTeam: string;
  bowlingTeam: string;
  batsmen: Batsman[];
  bowlers: Bowler[];
  totalRuns: number;
  totalWickets: number;
  totalOvers: number;
}

export function Scorecard({
  battingTeam,
  bowlingTeam,
  batsmen,
  bowlers,
  totalRuns,
  totalWickets,
  totalOvers,
}: ScorecardProps) {
  return (
    <ScrollView className="flex-1 p-4">
      <ThemedView className="mb-6">
        <ThemedText type="subtitle" className="mb-3">
          {battingTeam} Batting
        </ThemedText>

        <ThemedView className="flex-row bg-gray-100 py-2 px-1 border-b border-gray-300">
          <ThemedText className="flex-2 text-left text-sm">Batsman</ThemedText>
          <ThemedText className="flex-1 text-center text-sm">R</ThemedText>
          <ThemedText className="flex-1 text-center text-sm">B</ThemedText>
          <ThemedText className="flex-1 text-center text-sm">4s</ThemedText>
          <ThemedText className="flex-1 text-center text-sm">6s</ThemedText>
          <ThemedText className="flex-1 text-center text-sm">SR</ThemedText>
        </ThemedView>

        {batsmen.map((batsman, index) => (
          <ThemedView
            key={index}
            className="flex-row py-2 px-1 border-b border-gray-100"
          >
            <ThemedText
              className={`flex-2 text-left text-sm ${batsman.isOut ? "line-through text-gray-500" : ""}`}
            >
              {batsman.name}
              {batsman.dismissal && ` (${batsman.dismissal})`}
            </ThemedText>
            <ThemedText className="flex-1 text-center text-sm">
              {batsman.runs}
            </ThemedText>
            <ThemedText className="flex-1 text-center text-sm">
              {batsman.balls}
            </ThemedText>
            <ThemedText className="flex-1 text-center text-sm">
              {batsman.fours}
            </ThemedText>
            <ThemedText className="flex-1 text-center text-sm">
              {batsman.sixes}
            </ThemedText>
            <ThemedText className="flex-1 text-center text-sm">
              {batsman.strikeRate}
            </ThemedText>
          </ThemedView>
        ))}

        <ThemedView className="flex-row py-3 px-1 bg-gray-200 border-t-2 border-gray-300">
          <ThemedText className="flex-2 text-left text-sm font-bold">
            Total: {totalRuns}/{totalWickets} ({totalOvers} overs)
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView className="mb-6">
        <ThemedText type="subtitle" className="mb-3">
          {bowlingTeam} Bowling
        </ThemedText>

        <ThemedView className="flex-row bg-gray-100 py-2 px-1 border-b border-gray-300">
          <ThemedText className="flex-2 text-left text-sm">Bowler</ThemedText>
          <ThemedText className="flex-1 text-center text-sm">O</ThemedText>
          <ThemedText className="flex-1 text-center text-sm">M</ThemedText>
          <ThemedText className="flex-1 text-center text-sm">R</ThemedText>
          <ThemedText className="flex-1 text-center text-sm">W</ThemedText>
          <ThemedText className="flex-1 text-center text-sm">Econ</ThemedText>
        </ThemedView>

        {bowlers.map((bowler, index) => (
          <ThemedView
            key={index}
            className="flex-row py-2 px-1 border-b border-gray-100"
          >
            <ThemedText className="flex-2 text-left text-sm">
              {bowler.name}
            </ThemedText>
            <ThemedText className="flex-1 text-center text-sm">
              {bowler.overs}
            </ThemedText>
            <ThemedText className="flex-1 text-center text-sm">
              {bowler.maidens}
            </ThemedText>
            <ThemedText className="flex-1 text-center text-sm">
              {bowler.runs}
            </ThemedText>
            <ThemedText className="flex-1 text-center text-sm">
              {bowler.wickets}
            </ThemedText>
            <ThemedText className="flex-1 text-center text-sm">
              {bowler.economy}
            </ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    </ScrollView>
  );
}
