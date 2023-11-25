import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: 'YOUR_GOOGLE_CLIENT_ID',
      clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
    }),
    FacebookProvider({
      clientId: 'YOUR_GOOGLE_CLIENT_ID',
      clientSecret: 'YOUR_GOOGLE_CLIENT_SECRET',
    }),
    
  ],
});