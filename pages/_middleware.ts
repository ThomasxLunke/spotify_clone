// Block certain pages if you are not authenticated
// this a edge function : it tooks place between the server and the client 
    // WEB CLIENT ===> SERVICE WORKER (where this function is) ===> server
// the goal here, is to check if a user is authenticated before accessising certain routes ("signedPages")

import { NextResponse } from 'next/server'

const signedinPages = ['/', '/playlist', '/library']

export default function middleware(req) {
  if (signedinPages.find((p) => p === req.nextUrl.pathname)) {
    const token = req.cookies.SPOTIFY_ACCESS_TOKEN

    if (!token) {
      return NextResponse.redirect("/signin")
    }
  }
}
