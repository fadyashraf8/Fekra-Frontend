/**
 * Combines API address fields into a single formatted string ("street, city, zipcode").
 * Requirement 5: Combine API address fields into a single string (street, city, zipcode).
 * 
 * @param {Object} address - Address object from API containing street, suite, city, zipcode
 * @returns {string} Formatted address string
 */
export const formatAddress = (address) => {
  if (!address) return 'Address not available';

  const { street, city, zipcode } = address;
  const parts = [];

  if (street) parts.push(street);
  if (city) parts.push(city);
  if (zipcode) parts.push(zipcode);

  return parts.length > 0 ? parts.join(', ') : 'Address not available';
};
