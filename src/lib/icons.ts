import {
  Heart, Shield, Zap, Globe, Users, BookOpen, MessageCircle, Library, KanbanSquare,
  CalendarRange, Lightbulb, Target, Star, Sparkles, Eye, Fingerprint,
  Code, Palette, GraduationCap, Building2, Blocks,
  type LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Heart, Shield, Zap, Globe, Users, BookOpen, MessageCircle, Library, KanbanSquare,
  CalendarRange, Lightbulb, Target, Star, Sparkles, Eye, Fingerprint,
  Code, Palette, GraduationCap, Building2, Blocks,
};

export function getIcon(name: string | null, fallback: LucideIcon = Blocks): LucideIcon {
  if (!name) return fallback;
  return iconMap[name] || fallback;
}
