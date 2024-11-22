const moment = require('moment');
const mongoose = require('mongoose');

// Constants
const DEFAULT_LIMIT = 10;
const DATE_FORMAT = "YYYY-MM-DDTHH:mm:ss";

// Helper Functions
/**
 * Validates and parses a date string.
 * @param {string} dateString - The date string to validate.
 * @returns {Date} - The parsed date.
 * @throws Will throw an error if the date is invalid.
 */
const validateDate = (dateString) => {
    const date = moment(dateString, DATE_FORMAT, true).utc();
    if (!date.isValid()) {
        throw new Error("Invalid date format. Expected format is YYYY-MM-DDTHH:mm:ss");
    }
    return date.toDate();
};

/**
 * Parses pagination parameters and calculates skip value.
 * @param {number|string} page - The current page number.
 * @param {number|string} limit - The number of items per page.
 * @returns {object} - Parsed page, limit, and skip values.
 */
const parsePaginationParams = (page, limit) => {
    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || DEFAULT_LIMIT;
    const skip = (parsedPage - 1) * parsedLimit;
    return { parsedPage, parsedLimit, skip };
};

/**
 * Validates if a string is a valid MongoDB ObjectId.
 * @param {string} id - The ID to validate.
 * @returns {boolean} - True if valid, false otherwise.
 */
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

module.exports = {
    validateDate,
    parsePaginationParams,
    validateObjectId
};
