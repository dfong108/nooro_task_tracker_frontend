import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '../../../../../apiConfig';
import {forwardHeaders, responseFrom} from "@/utils/apiUtils";

type Params = { params: { id: string } };

const {serverBaseUrl} = API_CONFIG;

// Get Task by ID - GET /api/tasks/[id]
export async function GET(req: NextRequest, { params }: Params) {
  const url = new URL(req.url);
  const target = `${serverBaseUrl}/api/tasks/${encodeURIComponent(params.id)}${url.search}`;
  const res = await fetch(target, {
    method: 'GET',
    headers: forwardHeaders(req),
    cache: 'no-store',
  });
  const body = await res.text();
  return responseFrom(res, body);
}

// Replace Task - PUT /api/tasks/[id]
export async function PUT(req: NextRequest, { params }: Params) {
  const url = new URL(req.url);
  const target = `${serverBaseUrl}/api/tasks/${encodeURIComponent(params.id)}${url.search}`;
  const body = await req.text();
  const res = await fetch(target, {
    method: 'PUT',
    headers: forwardHeaders(req, true),
    body,
  });
  const resBody = await res.text();
  return responseFrom(res, resBody);
}

// Update Task - PATCH /api/tasks/[id]
export async function PATCH(req: NextRequest, { params }: Params) {
  const url = new URL(req.url);
  const body = await req.text();
  
  const id = params.id;
  const target = `${serverBaseUrl}/api/tasks/${encodeURIComponent(id)}${url.search}/complete`;
  
  console.log("PATCH", {
    url,
    target,
    params, id,
    body,
  });
  
  const res = await fetch(target, {
    method: 'PATCH',
    headers: forwardHeaders(req, true),
    body,
  });
  
  const resBody = await res.text();
  console.log("PATCH Response", {res, resBody})
  return responseFrom(res, resBody);
}