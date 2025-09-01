import { TagVariant } from "./types";

/**
 * Date utility functions for Tag component
 */

/**
 * Get the difference in days between two dates
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of days (positive if date1 is after date2)
 */
export const getDaysDifference = (date1: Date, date2: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
  const firstDate = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const secondDate = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  
  return Math.round((firstDate.getTime() - secondDate.getTime()) / oneDay);
};

/**
 * Format date as "11 Sep" format
 * @param date - Date to format
 * @returns Formatted date string
 */
export const formatDateShort = (date: Date): string => {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  const day = date.getDate();
  const month = months[date.getMonth()];
  
  return `${day} ${month}`;
};

/**
 * Get tag variant based on due date logic
 * @param dueDate - Task due date
 * @param currentDate - Current date (defaults to now)
 * @returns Tag variant to use
 */
export const getTagVariant = (dueDate: Date, currentDate: Date = new Date()): TagVariant => {
  const daysDiff = getDaysDifference(dueDate, currentDate);
  
  if (daysDiff < 0) {
    // Past due date
    return "red";
  } else if (daysDiff === 0 || daysDiff === 1) {
    // Today or tomorrow
    return "yellow";
  } else {
    // 2+ days in future
    return "green";
  }
};

/**
 * Get tag text based on due date logic
 * @param dueDate - Task due date
 * @param currentDate - Current date (defaults to now)
 * @returns Tag text to display
 */
export const getTagText = (dueDate: Date, currentDate: Date = new Date()): string => {
  const daysDiff = getDaysDifference(dueDate, currentDate);
  
  if (daysDiff < 0) {
    // Past due date
    const absDiff = Math.abs(daysDiff);
    if (absDiff === 1) {
      return "Yesterday";
    } else {
      return formatDateShort(dueDate);
    }
  } else if (daysDiff === 0) {
    // Today
    return "Today";
  } else if (daysDiff === 1) {
    // Tomorrow
    return "Tomorrow";
  } else {
    // 2+ days in future
    return formatDateShort(dueDate);
  }
};