import { NextRequest, NextResponse } from 'next/server';
import { SignJWT } from 'jose';

const secret = new TextEncoder().encode(process.env.SESSION_SECRET || 'dev-only-change-me');

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');
  const expected = req.cookies.get('gh_oauth_state')?.value;
  if (!code || !state || !expected || state !== expected) return new NextResponse('Invalid OAuth state', {status:400});
  const body = new URLSearchParams({client_id:process.env.GITHUB_CLIENT_ID!, client_secret:process.env.GITHUB_CLIENT_SECRET!, code, redirect_uri:process.env.GITHUB_CALLBACK_URL!});
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {method:'POST',headers:{Accept:'application/json','Content-Type':'application/x-www-form-urlencoded'},body});
  const token = await tokenRes.json();
  if (!token.access_token) return new NextResponse(token.error_description || 'GitHub OAuth failed', {status:400});
  const session = await new SignJWT({accessToken:token.access_token}).setProtectedHeader({alg:'dir',enc:'A256GCM'}).setIssuedAt().setExpirationTime('7d').encrypt(secret);
  const response = NextResponse.redirect(new URL('/', req.url));
  response.cookies.set('gh_session', session, {httpOnly:true,secure:true,sameSite:'lax',maxAge:60*60*24*7,path:'/'});
  response.cookies.delete('gh_oauth_state');
  return response;
}
