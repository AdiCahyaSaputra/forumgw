type TResponse = {
  status: number;
  message: string;
};

export const sendTRPCResponse = <T = void>(response: TResponse, data?: T) => {
  return {
    ...response,
    data: data || [],
  };
};

export const getBaseUrl = () => {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";
  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;
  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;
  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

export const setAccessToken = async (token: string) => {
  const req = await fetch(`${getBaseUrl()}/api-cookie`, {
    method: "POST",
    body: JSON.stringify({
      token,
    }),
  });

  const res = await req.json();

  if (res.status === 200) return { isSuccess: true };

  return { isSuccess: false };
};

export const destroyAccessToken = async () => {
  const req = await fetch(`${getBaseUrl()}/api-cookie`, {
    method: "DELETE",
  });

  const res = await req.json();

  if (res.status === 200) return { isSuccess: true };

  return { isSuccess: false };
};
