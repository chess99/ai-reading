import manifest from '@/public/build-manifest.json';

export const buildVersion = manifest.version;
export const appVersion = manifest.appVersion;
export const libraryVersion = manifest.contentVersion;

export function getContentVersion(url: string): string {
  return (manifest.content as Record<string, { hash: string }>)[url]?.hash ?? '';
}
