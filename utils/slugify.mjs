export default (text) => {
  // Split the filename to handle the extension separately
  let parts = text.split('.');
  let extension = '';

  if (parts.length > 1) {
    extension = parts.pop(); // Get the last part as the extension
    text = parts.join(''); // Join the remaining parts back together
  }

  // Slugify the text part of the filename
  let slugifiedText = text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars except hyphens
    .replace(/\-\-+/g, '-') // Replace multiple hyphens with a single hyphen
    .replace(/^-+/, '') // Trim hyphens from the start of the text
    .replace(/-+$/, ''); // Trim hyphens from the end of the text

  // Combine the slugified text with the extension
  return extension ? `${slugifiedText}.${extension}` : slugifiedText;
};
