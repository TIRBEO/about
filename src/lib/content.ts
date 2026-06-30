import { supabase } from "./supabase";

export interface NavItem {
  icon?: string;
  title: string;
  description?: string;
  href: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export interface SiteConfig {
  site_name: string;
  tagline: string | null;
  logo_url: string;
  seo_title: string;
  seo_description: string;
  social_links: Record<string, string>;
  site_url?: string;
  nav?: NavGroup[];
}

export interface Section {
  id: string;
  page_slug: string;
  type: string;
  title: string | null;
  subtitle: string | null;
  body: string | null;
  metadata: Record<string, unknown>;
  sort_order: number;
}

export interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  color: string | null;
  sort_order: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string | null;
  bio: string | null;
  avatar_url: string | null;
  color: string | null;
  social_links: Record<string, string>;
  sort_order: number;
}

export interface TimelineEvent {
  id: string;
  year: string;
  event: string;
  description: string | null;
  sort_order: number;
}

export interface FooterSection {
  id: string;
  title: string;
  sort_order: number;
  links: { id: string; label: string; href: string }[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: "live" | "coming_soon";
  sort_order: number;
}

export interface JobOpening {
  id: string;
  title: string;
  type: string;
  location: string;
  status: "open" | "coming_soon";
  sort_order: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sort_order: number;
}

export interface ContactInfo {
  id: string;
  department: string;
  email: string;
  sort_order: number;
}

export async function getSiteConfig(): Promise<SiteConfig | null> {
  const { data } = await supabase.from("site_config").select("*").single();
  return data;
}

export async function getSections(pageSlug: string): Promise<Section[]> {
  const { data } = await supabase
    .from("sections")
    .select("*")
    .eq("page_slug", pageSlug)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return (data as Section[]) || [];
}

export async function getFeatures(sectionId: string): Promise<Feature[]> {
  const { data } = await supabase
    .from("features")
    .select("*")
    .eq("section_id", sectionId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return (data as Feature[]) || [];
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  const { data } = await supabase
    .from("team_members")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return (data as TeamMember[]) || [];
}

export async function getTimelineEvents(): Promise<TimelineEvent[]> {
  const { data } = await supabase
    .from("timeline_events")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return (data as TimelineEvent[]) || [];
}

export async function getFooterTree(): Promise<FooterSection[]> {
  const { data: sections } = await supabase.from("footer_sections").select("*").order("sort_order", { ascending: true });
  const { data: links } = await supabase.from("footer_links").select("*").eq("is_active", true).order("sort_order", { ascending: true });
  if (!sections) return [];
  return sections.map((s: FooterSection & { id: string }) => ({
    ...s,
    links: (links || []).filter((l: { section_id: string }) => l.section_id === s.id).map(({ id, label, href }: { id: string; label: string; href: string }) => ({ id, label, href })),
  }));
}

export async function getProducts(): Promise<Product[]> {
  const { data } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return (data as Product[]) || [];
}

export async function getJobOpenings(): Promise<JobOpening[]> {
  const { data } = await supabase
    .from("job_openings")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return (data as JobOpening[]) || [];
}

export async function getFAQs(): Promise<FAQ[]> {
  const { data } = await supabase
    .from("faqs")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  return (data as FAQ[]) || [];
}

export async function getContactInfo(): Promise<ContactInfo[]> {
  const { data } = await supabase
    .from("contact_info")
    .select("*")
    .order("sort_order", { ascending: true });
  return (data as ContactInfo[]) || [];
}
