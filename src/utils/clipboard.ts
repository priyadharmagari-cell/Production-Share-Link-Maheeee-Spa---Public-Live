/**
 * Safely copies specified text to the clipboard.
 * Works even inside restrictive sandboxed iframes or HTTP contexts where navigator.clipboard might be blocked.
 */
export function safeCopyToClipboard(text: string): Promise<boolean> {
  return new Promise((resolve) => {
    // 1. Try modern navigator.clipboard first
    if (typeof navigator !== 'undefined' && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
      navigator.clipboard.writeText(text)
        .then(() => resolve(true))
        .catch((err) => {
          console.warn('Modern navigator.clipboard failed, attempting fallback...', err);
          resolve(fallbackCopyToClipboard(text));
        });
    } else {
      // 2. Fallback to older document.execCommand approach
      resolve(fallbackCopyToClipboard(text));
    }
  });
}

function fallbackCopyToClipboard(text: string): boolean {
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Prevent scrolling and keep it completely off-screen
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    textArea.remove();
    return successful;
  } catch (err) {
    console.error("Fallback clipboard copy failed:", err);
    return false;
  }
}
