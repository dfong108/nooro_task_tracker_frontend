import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '../../../../../apiConfig';
import {forwardHeaders, responseFrom} from "@/utils/apiUtils";

type Params = { params: { id: string } };

const {serverBaseUrl} = API_CONFIG;

// Get Task by ID - GET /api/tasks/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await Promise.resolve(params); // Await params
  const url = new URL(req.url);
  const target = `${serverBaseUrl}/api/tasks/${encodeURIComponent(id)}${url.search}`;
  
  const res = await fetch(target, {
    method: 'GET',
    headers: forwardHeaders(req),
    cache: 'no-store',
  });
  
  const body = await res.text();
  console.log("Get Task", { target, status: res.status, body });
  
  return responseFrom(res, body);
}

// Replace Task - PUT /api/tasks/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = await Promise.resolve(params);
  const body = await req.text();
  const target = `${serverBaseUrl}/api/tasks/${encodeURIComponent(id)}`;
  
  const res = await fetch(target, {
    method: 'PUT',
    headers: {
      ...forwardHeaders(req),
      'Content-Type': 'application/json',
    },
    body,
  });
  
  const responseBody = await res.text();
  console.log("Update Task", {
    target,
    status: res.status,
    body: responseBody
  });
  
  return responseFrom(res, responseBody);
}


// Update Task - PATCH /api/tasks/[id]
export async function PATCH(req: NextRequest, { params }: Params) {
  const url = new URL(req.url);
  const body = await req.text();
  
  const id = params.id;
  const target = `${serverBaseUrl}/api/tasks/${encodeURIComponent(id)}${url.search}/complete`;
  
  const res = await fetch(target, {
    method: 'PATCH',
    headers: forwardHeaders(req, true),
    body,
  });
  
  const resBody = await res.text();
  console.log("PATCH Response", {res, resBody})
  return responseFrom(res, resBody);
}


// Delete Task - DELETE /api/tasks/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const url = new URL(req.url);
  const id = params.id;
  const target = `${serverBaseUrl}/api/tasks/${encodeURIComponent(id)}${url.search}`;

  const res = await fetch(target, {
    method: 'DELETE',
    headers: forwardHeaders(req),
  });

  const resBody = await res.text();
  console.log("DELETE Response", { res, resBody });
  
  // For DELETE operations, we typically want to forward the status code from the backend
  return responseFrom(res, resBody);
}