export const CURRENT_PATH_KEY = 'ai-reading:currentPath';
export const PREVIOUS_PATH_KEY = 'ai-reading:previousPath';

function isSameOriginReferrer(referrer, origin) {
  if (!referrer || !origin) return false;

  try {
    return new URL(referrer).origin === origin;
  } catch {
    return false;
  }
}

export function getStoredPreviousPath(storage) {
  if (!storage) return null;
  return storage.getItem(PREVIOUS_PATH_KEY);
}

export function updateNavigationHistory(
  storage,
  pathname,
  { isInitialLoad = false, referrer = '', origin = '' } = {},
) {
  if (!storage || !pathname) return;

  const currentPath = storage.getItem(CURRENT_PATH_KEY);
  if (currentPath === pathname) return;

  const enteredFromOutside = isInitialLoad && !isSameOriginReferrer(referrer, origin);
  if (enteredFromOutside) {
    storage.removeItem(PREVIOUS_PATH_KEY);
    storage.setItem(CURRENT_PATH_KEY, pathname);
    return;
  }

  if (currentPath) {
    storage.setItem(PREVIOUS_PATH_KEY, currentPath);
  } else {
    storage.removeItem(PREVIOUS_PATH_KEY);
  }

  storage.setItem(CURRENT_PATH_KEY, pathname);
}
