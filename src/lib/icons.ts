import {
  Heart, Shield, Zap, Globe, Users, BookOpen, MessageCircle, Library, KanbanSquare,
  CalendarRange, Lightbulb, Target, Star, Sparkles, Eye, Fingerprint,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Heart, Shield, Zap, Globe, Users, BookOpen, MessageCircle, Library, KanbanSquare,
  CalendarRange, Lightbulb, Target, Star, Sparkles, Eye, Fingerprint,
};

export function getIcon(name: string | null, fallback: LucideIcon = Heart): LucideIcon {
  if (!name) return fallback;
  return iconMap[name] || fallback;
}
