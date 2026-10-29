/**
 * Breathe icon library. Re-exports the ENTIRE lucide-react lib (hundreds of
 * icons), so you can pick any of them when building interfaces:
 *   import { Heart, Wind, Baby } from "@breathe-ds/ui/components/icons";
 * Icons use `currentColor` and accept `size`/`strokeWidth`. The DS components
 * take icons through slots, so inject whichever you want.
 */
export * from "lucide-react";

import {
  House, Wind, Activity, Baby, Search, Users, GraduationCap, BookOpen, Info,
  MapPin, Phone, Mail, MessageCircle, AtSign, Video, Play, Pause, Volume2,
  Quote, Menu, X, ChevronDown, ArrowUpRight, Globe,
} from "lucide-react";

/* Semantic aliases for the icons the family uses (the "core" ones). */
export const IconHome = House;
export const IconWind = Wind;
export const IconActivity = Activity;
export const IconBaby = Baby;
export const IconSearch = Search;
export const IconUsers = Users;
export const IconGraduationCap = GraduationCap;
export const IconBook = BookOpen;
export const IconInfo = Info;
export const IconMapPin = MapPin;
export const IconPhone = Phone;
export const IconMail = Mail;
export const IconMessage = MessageCircle;
export const IconInstagram = AtSign;
export const IconVideo = Video;
export const IconPlay = Play;
export const IconPause = Pause;
export const IconVolume2 = Volume2;
export const IconQuote = Quote;
export const IconMenu = Menu;
export const IconX = X;
export const IconChevronDown = ChevronDown;
export const IconArrowUpRight = ArrowUpRight;
export const IconGlobe = Globe;

/* Map of the icons in use (core) — name → component. */
export const used = {
  Home: IconHome, Wind: IconWind, Activity: IconActivity, Baby: IconBaby,
  Search: IconSearch, Users: IconUsers, GraduationCap: IconGraduationCap,
  Book: IconBook, Info: IconInfo, MapPin: IconMapPin, Phone: IconPhone,
  Mail: IconMail, Message: IconMessage, Instagram: IconInstagram,
  Video: IconVideo, Play: IconPlay, Pause: IconPause, Volume2: IconVolume2,
  Quote: IconQuote, Menu: IconMenu, X: IconX, ChevronDown: IconChevronDown,
  ArrowUpRight: IconArrowUpRight, Globe: IconGlobe,
};
