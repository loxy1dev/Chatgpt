import { NextRequest, NextResponse } from 'next/server';
import { githubJson } from '@/lib/github';
export async function GET(req:NextRequest){
 const owner= req.nextUrl.searchParams.get('owner'); const repo=req.nextUrl.searchParams.get('repo'); const path=req.nextUrl.searchParams.get('path') || '';
 if(!owner||!repo) return NextResponse.json({error:'owner and repo required'},{status:400});
 try { return NextResponse.json(await githubJson(`/repos/${owner}/${repo}/contents/${path}`)); } catch(e){ return NextResponse.json({error:String(e)},{status:400}); }
}
