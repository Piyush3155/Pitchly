import React from 'react';
import { ScrollView } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface CommentaryItem {
  id: string;
  over: number;
  ball: number;
  batsman: string;
  bowler: string;
  description: string;
  runs: number;
  isWicket: boolean;
  timestamp: string;
}

interface CommentaryProps {
  commentary: CommentaryItem[];
}

export function Commentary({ commentary }: CommentaryProps) {
  return (
    <ThemedView className="flex-1 p-4">
      <ThemedText className="text-lg font-semibold mb-4">
        Commentary
      </ThemedText>

      <ScrollView className="flex-1">
        {commentary.map((item) => (
          <ThemedView key={item.id} className="p-3 mb-2 rounded-lg border border-gray-200">
            <ThemedView className="flex-row justify-between mb-2">
              <ThemedText className="text-sm font-bold text-blue-500">
                {item.over}.{item.ball}
              </ThemedText>
              <ThemedText className="text-xs text-gray-500">{item.timestamp}</ThemedText>
            </ThemedView>

            <ThemedView className="flex-row items-center mb-2">
              <ThemedText className="text-sm font-semibold">{item.batsman}</ThemedText>
              <ThemedText className="text-xs text-gray-500 mx-2">vs</ThemedText>
              <ThemedText className="text-sm font-semibold">{item.bowler}</ThemedText>
            </ThemedView>

            <ThemedText
              className={`text-sm leading-5 mb-2 ${
                item.isWicket ? 'text-red-500 font-bold' : item.runs > 0 ? 'text-green-500' : ''
              }`}
            >
              {item.description}
            </ThemedText>

            <ThemedView className="flex-row justify-between items-center">
              {item.runs > 0 && (
                <ThemedText className="text-xs text-green-500 font-bold">
                  {item.runs} run{item.runs !== 1 ? 's' : ''}
                </ThemedText>
              )}
              {item.isWicket && (
                <ThemedText className="text-xs text-red-500 font-bold">WICKET!</ThemedText>
              )}
            </ThemedView>
          </ThemedView>
        ))}
      </ScrollView>
    </ThemedView>
  );
}