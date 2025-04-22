export const formatStorage = (bytes) => {
  if (bytes >= 1_000_000_000) return (bytes / 1_000_000_000).toFixed(2) + " GB";
  if (bytes >= 1_000_000) return (bytes / 1_000_000).toFixed(2) + " MB";
  if (bytes >= 1_000) return (bytes / 1_000).toFixed(2) + " KB";
  return bytes + " B";
};
