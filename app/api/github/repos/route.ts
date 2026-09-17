import { NextResponse } from 'next/server';
import { githubJson } from '@/lib/github';
export async function GET(){ try { return NextResponse.json(await githubJson('/user/repos?sort=updated&per_page=100')); } catch(e){ return NextResponse.json({error:String(e)},{status:401}); } }
