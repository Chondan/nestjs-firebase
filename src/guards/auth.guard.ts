import * as admin from 'firebase-admin';
import {
  CanActivate,
  ContextType,
  ExecutionContext,
  Inject,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
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
  private readonly firebaseAdmin: typeof admin | undefined;

  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { request } = AuthGuard.getRequestContext(context);

    // ----- No Auth -----
    // Checked before the admin SDK so a misconfigured provider cannot block public routes.
    const isPublic = this.reflector.getAllAndOverride<boolean>(publicSymbol, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    if (!this.firebaseAdmin) {
      throw new InternalServerErrorException(
        'Firebase Admin is not configured',
      );
    }

    // ----- Auth -----
    const authorization = request.headers.authorization;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    const token = authorization.slice('Bearer '.length).trim();

    try {
      // true = also reject tokens issued before a password change, a disabled account or
      // revokeRefreshTokens(), instead of honouring them for up to an hour.
      request.user = await this.firebaseAdmin.auth().verifyIdToken(token, true);

      return true;
    } catch (err) {
      const code = (err as { code?: string }).code ?? 'unknown';
      console.error(`[AuthGuard] verifyIdToken failed: ${code}`);

      // An unreachable identity provider is an outage, not bad credentials.
      if (
        code === 'auth/network-request-failed' ||
        code === 'auth/internal-error'
      ) {
        throw new ServiceUnavailableException();
      }

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
