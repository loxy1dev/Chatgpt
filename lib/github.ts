import { cookies } from 'next/headers';
import { jwtDecrypt } from 'jose';

const secret = new TextEncoder().encode(process.env.SESSION_SECRET || 'dev-only-change-me');

export async function getGithubToken() {
  const token = (await cookies()).get('gh_session')?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtDecrypt(token, secret);
    return typeof payload.accessToken === 'string' ? payload.accessToken : null;
  } catch { return null; }
}

export async function github(path: string, init: RequestInit = {}) {
  const token = await getGithubToken();
  if (!token) throw new Error('GitHub not connected');
  return fetch(`https://api.github.com${path}`, {
    ...init,
    headers: { Accept:'application/vnd.github+json', Authorization:`Bearer ${token}`, 'X-GitHub-Api-Version':'2022-11-28', ...(init.headers || {}) },
    cache:'no-store'
  });
}

export async function githubJson<T>(path: string, init?: RequestInit): Promise<T> {
  const r = await github(path, init);
  if (!r.ok) throw new Error(`GitHub API ${r.status}: ${await r.text()}`);
  return r.json();
}
