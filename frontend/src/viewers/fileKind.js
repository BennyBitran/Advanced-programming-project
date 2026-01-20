const IMAGE_EXT_TO_MIME = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
  bmp: "image/bmp",
  svg: "image/svg+xml",
};

export function getFileExtension(fileName) {
  const safeName = String(fileName || "");
  const dotIndex = safeName.lastIndexOf(".");
  if (dotIndex <= 0 || dotIndex === safeName.length - 1) return "";
  return safeName.slice(dotIndex + 1).toLowerCase();
}

export function getFileKind(fileName, content = "") {
  const text = String(content || "");
  if (text.startsWith("data:image/")) return "image";

  const ext = getFileExtension(fileName);
  if (ext && IMAGE_EXT_TO_MIME[ext]) return "image";

  return "text";
}

export function canEditFile(fileName) {
  return getFileKind(fileName) === "text";
}

export function getImageSrc(fileName, content) {
  const raw = String(content || "");
  if (!raw) return null;

  if (raw.startsWith("data:image/")) return raw;

  const ext = getFileExtension(fileName);
  const mime = IMAGE_EXT_TO_MIME[ext];
  if (!mime) return null;

  // If backend stored raw base64 (without data URL), build a data URL.
  const compact = raw.replace(/\s+/g, "");
  if (!/^[A-Za-z0-9+/=]+$/.test(compact)) return null;

  return `data:${mime};base64,${compact}`;
}

