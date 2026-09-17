import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const callback = process.env.GITHUB_CALLBACK_URL;
  if (!clientId || !callback) return new NextResponse('Missing GitHub OAuth configuration', { status:500 });
  const state = crypto.randomUUID();
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', callback);
  url.searchParams.set('scope', 'repo read:user');
  url.searchParams.set('state', state);
  const response = NextResponse.redirect(url);
  response.cookies.set('gh_oauth_state', state, { httpOnly:true, secure:true, sameSite:'lax', maxAge:600, path:'/' });
  return response;
}
