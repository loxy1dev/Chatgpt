import { NextRequest, NextResponse } from 'next/server';
import { githubJson } from '@/lib/github';

export async function POST(req:NextRequest){
 const b=await req.json(); const {owner,repo,path,content,message,branch}=b;
 if(!owner||!repo||!path||typeof content!=='string'||!message) return NextResponse.json({error:'owner, repo, path, content and message are required'},{status:400});
 try{
  const existing=await githubJson<any>(`/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(branch||'main')}`).catch(()=>null);
  const url=`/repos/${owner}/${repo}/contents/${path}`;
  const r=await (await import('@/lib/github')).github(url,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,content:Buffer.from(content).toString('base64'),branch:branch||'main',...(existing?.sha?{sha:existing.sha}:{})})});
  if(!r.ok) return NextResponse.json({error:await r.text()},{status:r.status});
  return NextResponse.json(await r.json());
 }catch(e){return NextResponse.json({error:String(e)},{status:500});}
}
