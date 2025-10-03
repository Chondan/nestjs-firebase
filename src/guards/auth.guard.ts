import * as admin from 'firebase-admin';
import {
  CanActivate,
  ContextType,
  ExecutionContext,
  Inject,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { FIREBASE_ADMIN } from '@src/modules/firebase/firebase.module';
import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: admin.auth.DecodedIdToken;
  }
}

/**
 * Marks a route as public, allowing unauthenticated access.
 * When applied to a controller method, the AuthGuard will skip authentication checks.
 */
const publicSymbol = Symbol('PUBLIC');
export const Public = () => SetMetadata(publicSymbol, true);

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject(FIREBASE_ADMIN)
  private readonly firebaseAdmin: typeof admin;
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { request, requestContext } = AuthGuard.getRequestContext(context);
    // ----- No Auth -----
    const isPublic = this.reflector.get<boolean | undefined>(
      publicSymbol,
      requestContext.getHandler(),
    );
    if (isPublic) return true;

    // ----- Auth -----
    try {
      const headers = request.headers;
      const authorization = headers['authorization'] as string;
      if (!authorization || !authorization.startsWith('Bearer '))
        throw new UnauthorizedException();

      // Validate token
      const [, token] = authorization.split(' ');
      const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(token);
      request.user = decodedToken;

      return true;
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException();
    }
  }

  static getRequestContext(context: ExecutionContext): {
    request: Request;
    requestContext: ExecutionContext;
  } {
    const contextType: ContextType & 'graphql' = context.getType();
    if (contextType === 'graphql') {
      const graphqlContext = GqlExecutionContext.create(context);
      const ctx: { req: Request } = graphqlContext.getContext();
      const request = ctx.req;
      return { request, requestContext: graphqlContext };
    }

    const httpContext = context.switchToHttp();
    const request: Request = httpContext.getRequest();
    return { request, requestContext: context };
  }
}
