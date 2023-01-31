// we verify here if a user is authenticated before serving pages


import jwt from 'jsonwebtoken'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from './prisma'

export const validateRoute = (handler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // destructured with { ... } from "req.cookies"
    // and then rename it with ": token"
    // it's equivalent to : const token = req.cookies.SPOTIFY_ACCESS_TOKEN
    const { SPOTIFY_ACCESS_TOKEN: token } = req.cookies

    if (token) {
      let user

      try {
        const { id } = jwt.verify(token, 'hello')
        user = await prisma.user.findUnique({
          where: { id },
        })

        if (!user) {
          throw new Error('Not real user')
        }
      } catch (error) {
        res.status(401)
        res.json({ error: 'Not Authorized' })
        return
      }

      return handler(req, res, user)
    }

    res.status(401)
    res.json({ error: 'Not Authorized' })

  }
}
