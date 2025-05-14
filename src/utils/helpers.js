export const formatDate = (isoDate) => {
  const date = new Date(isoDate);

  const options = {
    year: "numeric",
    month: "short", // "May"
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true, // For AM/PM
  };

  // Format the date
  const formattedDate = date.toLocaleString("en-US", options);

  // Replace comma with " at" for the correct format
  return formattedDate.replace(",", " at");
};
