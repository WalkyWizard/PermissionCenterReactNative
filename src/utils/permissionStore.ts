import { useSyncExternalStore } from 'react';

export type PermissionKey = 'camera' | 'location' | 'contacts' | 'gallery';

export interface PermissionState {
  camera: boolean | null;
  location: boolean | null;
  contacts: boolean | null;
  gallery: boolean | null;
}

let currentState: PermissionState = {
  camera: null,
  location: null,
  contacts: null,
  gallery: null,
};

const listeners = new Set<() => void>();

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

export function setPermissionStatus(key: PermissionKey, granted: boolean): void {
  if (currentState[key] !== granted) {
    currentState = {
      ...currentState,
      [key]: granted,
    };
    emitChange();
  }
}

export function getPermissionSnapshot(): PermissionState {
  return currentState;
}

export function subscribePermissions(callback: () => void): () => void {
  listeners.add(callback);
  return () => {
    listeners.delete(callback);
  };
}

export function usePermissionsState(): PermissionState {
  return useSyncExternalStore(subscribePermissions, getPermissionSnapshot, getPermissionSnapshot);
}
