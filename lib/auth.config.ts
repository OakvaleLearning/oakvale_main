import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: { signIn: '/admin/login' },
  providers: [],
  session: { strategy: 'jwt' },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith('/admin');
      const isOnLogin = nextUrl.pathname === '/admin/login';
      if (isOnLogin) {
        if (isLoggedIn) return Response.redirect(new URL('/admin', nextUrl));
        return true;
      }
      if (isOnAdmin) return isLoggedIn;
      return true;
    },
  },
} satisfies NextAuthConfig;
