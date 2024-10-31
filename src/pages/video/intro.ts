import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ params, request, redirect }) => {
  return redirect("https://www.youtube.com", 301);
};
