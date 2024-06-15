import moment from "moment-timezone";

function isValidDate(dateString, format) {
  if (!dateString) {
    return false;
  }
  return moment(dateString, format, true).isValid();
}

function sortDates(startDate, endDate) {
  //   console.log(`startDate, endDate =============================`, startDate, endDate);
  const date1 = new Date(startDate);
  const date2 = new Date(endDate);

  if (date1.getTime() <= date2.getTime()) {
    return { $gte: date1.toISOString().slice(0, 10), $lte: date2.toISOString().slice(0, 10) };
  } else {
    return { $lte: date1.toISOString().slice(0, 10), $gte: date2.toISOString().slice(0, 10) };
  }
}

function convertToValidDate(dateString, timezone = process.env.TIME_ZONE) {
  // Parse the date string using moment-timezone
  const date = moment.tz(dateString, "DD-MM-YYYY", timezone);

  // Check if the date is valid
  if (!date.isValid()) {
    throw new Error("Invalid date format");
  }

  // Return the Date object
  return date.toDate();
}

export { isValidDate, sortDates, convertToValidDate };
