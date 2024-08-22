
import { serpingApiConfig } from "serping/types";

const regions = ["us-east-1"] as const;
const locales = ['es', 'en', 'de', 'fr', 'it', 'nl', 'pl', 'pt', 'sv', 'tr', 'ru', 'zh', 'ja', "ko"] as const;
const defaultLocale = "es" as const;
const devices = ["desktop", "mobile"] as const;


export type RegionType = typeof regions[number];
export type LocaleType = typeof locales[number];
export type DeviceType = typeof devices[number];
export type SerpingApiType = Record<RegionType, serpingApiConfig>

const serpingApi: Record<RegionType, { apiKey: string; }> = {
  "us-east-1": {
    apiKey: process.env.SERPING_US_EAST_1_API_KEY!
  }
}
export const appConfig = {
  appDomain: "serpchecking.com",
  appName: "SERP Checking",
  appDescription: "SERP Checking",
  gaId: process.env.NEXT_PUBLIC_GA_ID,
  i18n: {
    locales,
    defaultLocale,
    labels: {
      "es": "Español",
      "en": "English",
      "de": "Deutsch",
      "fr": "Français",
      "it": "Italian",
      "pt": "Português",
      "nl": "Nederlands",
      "pl": "Polski",
      "sv": "Svenska",
      "tr": "Türkçe",
      "ru": "Русский",
      "ja": "日本語",
      "zh": "中文",
      "ko": "한국어"
    } as Record<LocaleType, string>
  },
  regions,
  devices,
  serpingApi
}
