import { Injectable } from '@nestjs/common';

type ApiEndpointGuide = {
  method: 'GET' | 'POST';
  path: string;
  description: string;
  auth?: 'Bearer access token' | 'Bearer refresh token' | 'public';
  body?: Record<string, string>;
  headers?: Record<string, string>;
};

type ApiGuide = {
  name: string;
  description: string;
  baseUrl: string;
  authentication: {
    accessToken: string;
    refreshToken: string;
  };
  endpoints: ApiEndpointGuide[];
};

@Injectable()
export class AppService {
  getHello(): ApiGuide {
    return {
      name: 'Uni Crypto API',
      description:
        'Authentication endpoints and basic usage for signup, signin, refresh token, and password reset.',
      baseUrl: 'http://localhost:8080',
      authentication: {
        accessToken: 'Send in header: Authorization: Bearer <access_token>',
        refreshToken: 'Send in header: Authorization: Bearer <refresh_token>',
      },
      endpoints: [
        {
          method: 'POST',
          path: '/auth/signup',
          auth: 'public',
          description:
            'Register a new account, then check email to activate it.',
          body: {
            email: 'user@example.com',
            password: 'StrongPass@123',
          },
        },
        {
          method: 'POST',
          path: '/auth/activate-account',
          auth: 'public',
          description: 'Activate account with email and activation code.',
          body: {
            email: 'user@example.com',
            hash: 'activation-code-from-email',
          },
        },
        {
          method: 'POST',
          path: '/auth/signin',
          auth: 'public',
          description: 'Sign in and receive access_token plus refresh_token.',
          body: {
            email: 'user@example.com',
            password: 'StrongPass@123',
          },
        },
        {
          method: 'POST',
          path: '/auth/refresh',
          auth: 'Bearer refresh token',
          description: 'Get a new access token from a valid refresh token.',
          headers: {
            Authorization: 'Bearer <refresh_token>',
          },
        },
        {
          method: 'GET',
          path: '/auth/me',
          auth: 'Bearer access token',
          description: 'Get current user profile from access token.',
          headers: {
            Authorization: 'Bearer <access_token>',
          },
        },
        {
          method: 'POST',
          path: '/auth/change-password',
          auth: 'Bearer access token',
          description: 'Change password when user is already logged in.',
          headers: {
            Authorization: 'Bearer <access_token>',
          },
          body: {
            oldPassword: 'OldPass@123',
            newPassword: 'NewPass@123',
          },
        },
        {
          method: 'POST',
          path: '/auth/forgot-password',
          auth: 'public',
          description: 'Send a password reset code to the user email.',
          body: {
            email: 'user@example.com',
          },
        },
        {
          method: 'POST',
          path: '/auth/reset-password',
          auth: 'public',
          description: 'Reset password with email, code, and new password.',
          body: {
            email: 'user@example.com',
            hash: 'reset-code-from-email',
            newPassword: 'NewPass@123',
          },
        },
        {
          method: 'POST',
          path: '/auth/logout',
          auth: 'Bearer access token',
          description: 'Revoke the current refresh token session.',
          headers: {
            Authorization: 'Bearer <access_token>',
          },
          body: {
            refreshToken: '<refresh_token>',
          },
        },
        {
          method: 'POST',
          path: '/auth/logout-all',
          auth: 'Bearer access token',
          description: 'Revoke all active sessions of the current user.',
          headers: {
            Authorization: 'Bearer <access_token>',
          },
        },
      ],
    };
  }
}
