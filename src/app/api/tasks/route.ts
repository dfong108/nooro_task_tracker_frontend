
import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '../../../../apiConfig';
import {forwardHeaders, responseFrom} from "@/utils/apiUtils";

const { serverBaseUrl } = API_CONFIG;



// Get All Tasks - GET /api/tasks
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const target = `${serverBaseUrl}/api/tasks${url.search}`;
  const res = await fetch(target, {
    method: 'GET',
    headers: forwardHeaders(req),
    cache: 'no-store',
  });
  
  const body = await res.text();
  console.log("Get all Tasks", {
    url,
    target,
    status: res.status,
    headers: Object.fromEntries(res.headers.entries()),
    body
  });
  
  return responseFrom(res, body);
}


// Create Task - POST /api/tasks
export async function POST(req: NextRequest) {
  const body = await req.text();
  const target = `${serverBaseUrl}/api/tasks`;
  
  const res = await fetch(target, {
    method: 'POST',
    headers: {
      ...forwardHeaders(req),
      'Content-Type': 'application/json',
    },
    body,
  });
  
  const responseBody = await res.text();
  console.log("Create Task", {
    target,
    status: res.status,
    body: responseBody
  });
  
  return responseFrom(res, responseBody);
}
