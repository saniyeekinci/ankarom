// Regex patterns
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Enums
export const USER_ROLES = ["admin", "user"];
export const ORDER_STATUSES = ["Hazırlanıyor", "Kargolandı", "Teslim Edildi", "İptal Edildi"];
export const TICKET_STATUSES = ["Açık", "Yanıtlandı"];
export const TICKET_PRIORITIES = ["Düşük", "Orta", "Yüksek"];
export const DISCOUNT_TYPES = ["percent", "fixed"];
export const DEALER_STATUSES = ["Beklemede", "Onaylandı", "Reddedildi"];
export const NOTIFICATION_CHANNELS = ["site", "email", "sms"];
export const NOTIFICATION_TYPES = ["general", "support_reply"];

// Defaults
export const DEFAULT_LOW_STOCK_THRESHOLD = 10;
export const DEFAULT_USAGE_LIMIT = 50;