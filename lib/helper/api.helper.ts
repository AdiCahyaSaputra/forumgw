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
