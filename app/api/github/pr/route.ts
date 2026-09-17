import {NextRequest,NextResponse} from 'next/server';
import {github} from '@/lib/github';
export async function POST(req:NextRequest){try{const {owner,repo,head,base='main',title,body=''}=await req.json();const r=await github(`/repos/${owner}/${repo}/pulls`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({head,base,title,body})});if(!r.ok)return NextResponse.json({error:await r.text()},{status:r.status});return NextResponse.json(await r.json())}catch(e){return NextResponse.json({error:String(e)},{status:500})}}
