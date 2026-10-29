/**
 * Biblioteca de ícones do Breathe. Re-exporta a lib INTEIRA do lucide-react
 * (centenas de ícones), para você escolher qualquer um ao montar interfaces:
 *   import { Heart, Wind, Baby } from "@breathe-ds/ui/components/icons";
 * Os ícones usam `currentColor` e aceitam `size`/`strokeWidth`. Os componentes
 * do DS recebem ícones por slot, então injete o que quiser.
 */
export * from "lucide-react";

import {
  House, Wind, Activity, Baby, Search, Users, GraduationCap, BookOpen, Info,
  MapPin, Phone, Mail, MessageCircle, AtSign, Video, Play, Pause, Volume2,
  Quote, Menu, X, ChevronDown, ArrowUpRight, Globe,
} from "lucide-react";

/* Aliases semânticos dos ícones usados pela família (os "principais"). */
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

/* Mapa dos usados (principais) — nome → componente. */
export const used = {
  Home: IconHome, Wind: IconWind, Activity: IconActivity, Baby: IconBaby,
  Search: IconSearch, Users: IconUsers, GraduationCap: IconGraduationCap,
  Book: IconBook, Info: IconInfo, MapPin: IconMapPin, Phone: IconPhone,
  Mail: IconMail, Message: IconMessage, Instagram: IconInstagram,
  Video: IconVideo, Play: IconPlay, Pause: IconPause, Volume2: IconVolume2,
  Quote: IconQuote, Menu: IconMenu, X: IconX, ChevronDown: IconChevronDown,
  ArrowUpRight: IconArrowUpRight, Globe: IconGlobe,
};
