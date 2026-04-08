import mongoose from "mongoose";
import { ApiError } from "./errorMiddleware.js";

/**
 * Validates required fields in request body
 */
export const validateRequired = (requiredFields) => (req, _res, next) => {
    const missing = requiredFields.filter((field) => {
        const value = req.body[field];
        return value === undefined || value === null || value === "";
    });

    if (missing.length > 0) {
        throw new ApiError(400, `Eksik alanlar: ${missing.join(", ")}`);
    }

    next();
};

/**
 * Validates MongoDB ObjectId in params
 */
export const validateObjectId = (paramName = "id") => (req, _res, next) => {
    const id = req.params[paramName];

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, `Geçersiz ${paramName} formatı.`);
    }

    next();
};

/**
 * Validates enum values
 */
export const validateEnum = (field, allowedValues) => (req, _res, next) => {
    const value = req.body[field];

    if (value !== undefined && !allowedValues.includes(value)) {
        throw new ApiError(400, `${field} için geçerli değerler: ${allowedValues.join(", ")}`);
    }

    next();
};