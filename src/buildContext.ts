import * as passport from "passport";
import * as express from "express";

const promisifiedAuthenticate = (
  req: express.Request,
  res: express.Response,
  name: string,
  options: passport.AuthenticateOptions
) =>
  new Promise((resolve, reject) =>
    passport.authenticate(
      name,
      options,
      (err: any, user: any, info: { message: string }) => {
        if (err) reject(err);
        else resolve({ user, info });
      }
    )(req, res)
  );

const promisifiedLogin = (
  req: express.Request,
  user: any,
  options: passport.AuthenticateOptions
) =>
  new Promise((resolve, reject) =>
    req.login(user, options, (err: any) => {
      if (err) reject(err);
      else resolve();
    })
  );

const buildContext = (contextParams: {
  req: express.Request;
  res: express.Response;
}) => {
  const { req, res } = contextParams;
  return {
    authenticate: (name: string, options: passport.AuthenticateOptions) =>
      promisifiedAuthenticate(req, res, name, options),
    login: (user: any, options: passport.AuthenticateOptions) =>
      promisifiedLogin(req, user, options),
    logout: () => req.logout(),
    isAuthenticated: () => req.isAuthenticated(),
    isUnauthenticated: () => req.isUnauthenticated(),
    get user() {
      return req.user;
    },
    ...contextParams
  };
};

export default buildContext;
