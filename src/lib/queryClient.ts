import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { localApi } from "./localApi";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) { const text = (await res.text()) || res.statusText; throw new Error(`${res.status}: ${text}`); }
}

export async function apiRequest(method: string, url: string, data?: unknown): Promise<Response> {
  // Preserve compatibility with one legacy call that used (url, method, data).
  if (method.startsWith("/")) [method, url] = [url, method];
  const res = await localApi(method, url, data);
  await throwIfResNotOk(res); return res;
}

export const getQueryFn: <T>(options: { on401: "returnNull" | "throw" }) => QueryFunction<T> =
  ({ on401 }) => async ({ queryKey }) => {
    const res = await localApi("GET", queryKey[0] as string);
    if (on401 === "returnNull" && res.status === 401) return null as T;
    await throwIfResNotOk(res); return await res.json();
  };

export const queryClient = new QueryClient({ defaultOptions: { queries: { queryFn: getQueryFn({on401:"throw"}), refetchInterval:false, refetchOnWindowFocus:false, staleTime:Infinity, retry:false }, mutations:{retry:false} } });
