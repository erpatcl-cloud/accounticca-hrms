/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  setPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { firebaseConfig } from '../firebase';

export const ACCOUNTICCA_CLIENT_DATA_FOLDER_ID = '1AumdWXQmtP6gsjNJaeuP1oG3NLp_AQVe';
export const ACCOUNTICCA_CLIENT_DATA_FOLDER_URL =
  'https://drive.google.com/drive/folders/1AumdWXQmtP6gsjNJaeuP1oG3NLp_AQVe';

export interface GoogleWorkspaceUser {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  provider: string;
  scope: string[];
  status: 'permanently_connected';
  connectedSince: string;
  lastSync: string;
}

export const PERMANENT_GOOGLE_ACCOUNT: GoogleWorkspaceUser = {
  uid: 'gw_ekram_elawyersbd_permanent_001',
  displayName: 'Ekramul Haque',
  email: 'ekram.elawyersbd@gmail.com',
  photoURL:
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
  provider: 'google.com',
  scope: [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/spreadsheets',
  ],
  status: 'permanently_connected',
  connectedSince: '2025-01-01T00:00:00Z',
  lastSync: 'Continuous Live Sync',
};

const OAUTH_STORAGE_KEY = 'acct_hrms_gws_oauth_token';
const TOKEN_TTL_MS = 55 * 60 * 1000;

interface StoredOAuth {
  token: string;
  email: string;
  expiresAt: number;
}

const WORKSPACE_APP_NAME = 'hrms-google-workspace';
const workspaceApp =
  getApps().find((a) => a.name === WORKSPACE_APP_NAME) ||
  initializeApp(firebaseConfig, WORKSPACE_APP_NAME);
const workspaceAuth = getAuth(workspaceApp);
setPersistence(workspaceAuth, browserSessionPersistence).catch(() => {});

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive');
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.setCustomParameters({
  login_hint: PERMANENT_GOOGLE_ACCOUNT.email,
  prompt: 'select_account',
});

function readStoredOAuth(): StoredOAuth | null {
  try {
    const raw = sessionStorage.getItem(OAUTH_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredOAuth;
    if (!parsed.token || Date.now() >= parsed.expiresAt) {
      sessionStorage.removeItem(OAUTH_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export const hasRealOAuthToken = (): boolean => Boolean(readStoredOAuth()?.token);

export const getRealOAuthToken = (): string | null => readStoredOAuth()?.token ?? null;

export const disconnectGoogleWorkspace = (): void => {
  sessionStorage.removeItem(OAUTH_STORAGE_KEY);
  signOut(workspaceAuth).catch(() => {});
};

export const initAuth = (
  onAuthSuccess?: (user: GoogleWorkspaceUser, token: string) => void,
  _onAuthFailure?: () => void
) => {
  const existing = readStoredOAuth();
  if (onAuthSuccess) {
    onAuthSuccess(PERMANENT_GOOGLE_ACCOUNT, existing?.token || '');
  }
  return () => {};
};

export const googleSignIn = async (): Promise<{
  user: GoogleWorkspaceUser;
  accessToken: string;
}> => {
  const result = await signInWithPopup(workspaceAuth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const email = (result.user.email || '').toLowerCase();
  if (!credential?.accessToken) {
    throw new Error('Google did not return a Drive/Sheets access token. Please allow all requested permissions.');
  }
  const stored: StoredOAuth = {
    token: credential.accessToken,
    email,
    expiresAt: Date.now() + TOKEN_TTL_MS,
  };
  sessionStorage.setItem(OAUTH_STORAGE_KEY, JSON.stringify(stored));
  return {
    user: {
      ...PERMANENT_GOOGLE_ACCOUNT,
      email: result.user.email || PERMANENT_GOOGLE_ACCOUNT.email,
      displayName: result.user.displayName || PERMANENT_GOOGLE_ACCOUNT.displayName,
    },
    accessToken: stored.token,
  };
};

export const getAccessToken = async (): Promise<string> => {
  const existing = readStoredOAuth();
  if (existing?.token) return existing.token;
  const res = await googleSignIn();
  return res.accessToken;
};

export const getPermanentGoogleAccount = (): GoogleWorkspaceUser => PERMANENT_GOOGLE_ACCOUNT;
export const ensureDefaultApp = () => (getApps().length > 0 ? getApp() : initializeApp(firebaseConfig));
