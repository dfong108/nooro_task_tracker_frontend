
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
  const url = new URL(req.url);
  const target = `${serverBaseUrl}/api/tasks${url.search}`;
  
  const taskData = await req.json();
  
  const res = await fetch(target, {
    method: 'POST',
    headers: {
      ...forwardHeaders(req, true),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  
  const resBody = await res.text();
  console.log("Create Task Response", {
    status: res.status,
    headers: Object.fromEntries(res.headers.entries()),
    body: resBody
  });
  
  return responseFrom(res, resBody);
}