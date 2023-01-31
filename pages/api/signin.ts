import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import { NextApiRequest, NextApiResponse } from 'next'
import prisma from '../../lib/prisma'

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        time: Date.now(),
      },
      'hello',
      { expiresIn: '8h' }
    )

    res.setHeader(
      'Set-Cookie',
      cookie.serialize('SPOTIFY_ACCESS_TOKEN', token, {
        httpOnly: true, // access only via HTTP (more secure)
        maxAge: 8 * 60 * 60, // how many time the cookie remain
        path: '/', // what routes have access to the cookie
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      })
    )

    res.json(user)
  }

  else {
    res.status(401)
    res.json({error: "Email or Password is wrong"})
  }
}
