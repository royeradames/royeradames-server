/* custom decorator to desconstruct the Req.User like @Body() does for Req.body */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './User.entity';

/* createParamDecorator creates a new param decorator
 * this extends the methods of a decorator class
 */

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    /*  ctx.switchToHttp().getRequest() gets access to the request body*/
    const req = ctx.switchToHttp().getRequest();
    // return the req.user
    return req.user;
  },
);
