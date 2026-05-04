import type { Request, Response } from 'express';

export type TrpcContextOptions = {
  req: Request;
  res: Response;
};

export const createContext = async (opts: TrpcContextOptions) => ({
  req: opts.req,
  res: opts.res,
});

export type Context = Awaited<ReturnType<typeof createContext>>;
