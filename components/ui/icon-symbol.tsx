// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING: IconMapping = {
  // Navigation icons
  "house.fill": "home",
  "play.circle.fill": "play-circle-filled",
  "sportscourt.fill": "sports-cricket",
  "person.3.fill": "groups",
  "trophy.fill": "emoji-events",
  "newspaper.fill": "article",

  // Action icons
  "bell.fill": "notifications",
  magnifyingglass: "search",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "line.3.horizontal.decrease": "filter-list",
  calendar: "calendar-today",
  "location.fill": "location-on",

  // Other icons
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "list.bullet": "list",
  "person.fill": "person",
  gear: "settings",
  "star.fill": "star",
  "heart.fill": "favorite",
  xmark: "close",
  plus: "add",
  minus: "remove",
  "info.circle": "info",
  "exclamationmark.triangle": "warning",
  "checkmark.circle.fill": "check-circle",
};

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const iconName = MAPPING[name as string] || "help-outline";
  return (
    <MaterialIcons color={color} size={size} name={iconName} style={style} />
  );
}
