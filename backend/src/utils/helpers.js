import AdminSetting from "../models/AdminSetting.js";

/**
 * Parses Turkish price format to number
 */
export const parsePrice = (value) => {
    const normalized = String(value ?? "")
        .replace(/[^\d,.-]/g, "")
        .replace(/\./g, "")
        .replace(",", ".");

    const numberValue = Number(normalized);
    return Number.isNaN(numberValue) ? null : numberValue;
};

/**
 * Parses date string to Date object
 */
export const parseDate = (value) => {
    if (!value) return null;
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

/**
 * Generates a reference number with prefix
 */
export const generateRef = (prefix) => `${prefix}-${Math.floor(1000 + Math.random() * 9000)}`;

/**
 * Normalizes features array from various input formats
 */
export const normalizeFeatures = (value) => {
    if (value === undefined || value === null) return [];

    if (Array.isArray(value)) {
        return value.map((item) => String(item ?? "").trim()).filter(Boolean);
    }

    if (typeof value === "string") {
        return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
    }

    return [];
};

/**
 * Gets or creates main admin settings
 */
export const getMainSettings = async () => {
    let settings = await AdminSetting.findOne({ key: "main" });

    if (!settings) {
        settings = await AdminSetting.create({ key: "main" });
    }

    return settings;
};

/**
 * Parses boolean input from various formats
 */
export const parseBooleanInput = (value, fieldLabel) => {
    if (typeof value === "boolean") return value;

    if (typeof value === "string") {
        if (value.toLowerCase() === "true") return true;
        if (value.toLowerCase() === "false") return false;
    }

    throw new Error(`${fieldLabel} için geçerli bir boolean değer giriniz.`);
};

/**
 * Escapes regex special characters
 */
export const escapeRegex = (value) => String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Creates conversation message object
 */
export const createConversationMessage = (sender, text) => ({
    sender,
    text: String(text || "").trim(),
    createdAt: new Date(),
});