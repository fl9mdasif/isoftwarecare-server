// Turns a title into a lowercase, hyphenated slug — shared by every module
// that stores a unique `slug` field (category, service, portfolio).
const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default slugify;
