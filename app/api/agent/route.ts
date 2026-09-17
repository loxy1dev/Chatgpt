import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { githubJson } from '@/lib/github';

export async function POST(req:NextRequest){
 const {owner,repo,branch='main',prompt}=await req.json();
 if(!owner||!repo||!prompt) return NextResponse.json({error:'owner, repo and prompt are required'},{status:400});
 const apiKey=process.env.OPENAI_API_KEY;
 if(!apiKey) return NextResponse.json({error:'OPENAI_API_KEY is not configured on the server.'},{status:500});
 try{
  const client=new OpenAI({apiKey});
  const tree=await githubJson<any>(`/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`);
  const files=(tree.tree||[]).filter((x:any)=>x.type==='blob' && !/node_modules|\.next|\.git\//.test(x.path)).slice(0,40);
  const contents:any[]=[];
  for(const f of files){ if((f.size||0)>50000) continue; try{ const x=await githubJson<any>(`/repos/${owner}/${repo}/contents/${encodeURIComponent(f.path)}?ref=${encodeURIComponent(branch)}`); if(x.content) contents.push({path:f.path,content:Buffer.from(x.content.replace(/\n/g,''),'base64').toString('utf8').slice(0,30000)}); }catch{} }
  const system=`You are a senior coding agent. Analyze the user's request against the repository snapshot. Return ONLY valid JSON with this exact shape: {"summary":"...","operations":[{"path":"relative/path","action":"create_or_update","content":"complete file content"}],"notes":["..."]}. Never include markdown fences. Do not modify secrets, lockfiles, .env files, node_modules, .next, or git metadata. Preserve existing behavior unless the request requires a change. If you cannot safely determine a file, return no operation and explain in notes.`;
  const input=`USER REQUEST:\n${prompt}\n\nBRANCH: ${branch}\n\nREPOSITORY FILES:\n${contents.map(x=>`--- ${x.path}\n${x.content}`).join('\n')}`;
  const completion=await client.chat.completions.create({model:process.env.OPENAI_MODEL||'gpt-5.6-luna',messages:[{role:'system',content:system},{role:'user',content:input}],temperature:0.1});
  const text=completion.choices[0]?.message?.content||'{}';
  const plan=JSON.parse(text.replace(/^```json\s*|\s*```$/g,''));
  return NextResponse.json(plan);
 }catch(e){return NextResponse.json({error:String(e)},{status:500});}
}
