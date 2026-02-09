import { ScrollView, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";

// Mock news data - replace with real API data
const mockNews = [
  {
    id: "1",
    title: "India vs Australia: Rohit Sharma leads from the front in Melbourne",
    summary:
      "Rohit Sharma scored a brilliant century as India took control of the first Test against Australia.",
    category: "Match Report",
    timeAgo: "2 hours ago",
  },
  {
    id: "2",
    title: "World Cup 2023: Australia crowned champions after thrilling final",
    summary:
      "Australia defeated India by 6 wickets in a nail-biting World Cup final at Ahmedabad.",
    category: "Tournament",
    timeAgo: "1 day ago",
  },
  {
    id: "3",
    title: "IPL 2024 Auction: Stars and surprises from the mega event",
    summary:
      "Mitchell Starc and Pat Cummins were among the big names who found new homes.",
    category: "IPL",
    timeAgo: "3 days ago",
  },
  {
    id: "4",
    title: "Young talent: Shabaaz Ahmed shines in domestic cricket",
    summary:
      "The 19-year-old pace bowler picked up 5 wickets in the Ranji Trophy match.",
    category: "Domestic",
    timeAgo: "5 days ago",
  },
];

export default function NewsScreen() {
  return (
    <ScrollView className="flex-1">
      <ThemedView className="p-5 items-center">
        <ThemedText type="title" className="text-3xl text-center mb-2">
          📰 Cricket News
        </ThemedText>
        <ThemedText className="text-base text-center opacity-70">
          Latest updates and stories
        </ThemedText>
      </ThemedView>

      <ThemedView className="p-5">
        {mockNews.map((news) => (
          <TouchableOpacity
            key={news.id}
            className="p-4 mb-4 rounded-xl shadow-md shadow-black/10 elevation-3"
            onPress={() => {
              // Navigate to news article
              console.log("Navigate to news:", news.id);
            }}
          >
            <ThemedView className="flex-row justify-between items-center mb-3">
              <ThemedView className="bg-blue-500 px-2 py-1 rounded-xl">
                <ThemedText className="text-xs font-bold text-white">
                  {news.category}
                </ThemedText>
              </ThemedView>
              <ThemedText className="text-xs text-gray-500">
                {news.timeAgo}
              </ThemedText>
            </ThemedView>

            <ThemedText type="subtitle" className="mb-2 leading-6">
              {news.title}
            </ThemedText>

            <ThemedText className="text-sm leading-5 opacity-80 mb-3">
              {news.summary}
            </ThemedText>

            <ThemedView className="flex-row items-center justify-between">
              <ThemedText className="text-sm text-blue-500 font-semibold">
                Read more
              </ThemedText>
              <IconSymbol name="chevron.right" size={16} color="#007AFF" />
            </ThemedView>
          </TouchableOpacity>
        ))}
      </ThemedView>
    </ScrollView>
  );
}
