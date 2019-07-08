import util from 'util';
import { Strategy } from 'passport-strategy';

function GraphQLLocalStrategy(verify: VefiryOptions) {
  Strategy.call(this);
  this.name = 'graphql-local';
  this.verify = verify;
}

util.inherits(GraphQLLocalStrategy, Strategy);

GraphQLLocalStrategy.prototype.authenticate = function authenticate(req: Express.Request, options: VefiryOptions) {
  const { username, email, password } = options;

  const done = (err: any, user: any, info: any) => {
    if (err) { return this.error(err); }
    if (!user) { return this.fail(info); }
    return this.success(user, info);
  };

  this.verify(username || email, password, done);
};

export default GraphQLLocalStrategy;


interface VefiryOptions {
  username?: string;
  email?: string;
  password: string;
  done: (err: any, user: any, info: any) => void;
}