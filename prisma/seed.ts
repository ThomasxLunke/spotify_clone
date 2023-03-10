import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
import { artistsData } from './songsData'

const prisma = new PrismaClient()

const run = async () => {
  await Promise.all(
    artistsData.map(async (artist) => {
      // upsert = CREATE OR UDAPTE
      return prisma.artist.upsert({
        // if
        where: { name: artist.name },
        // then
        update: {},
        // else
        create: {
          name: artist.name,
          songs: {
            create: artist.songs.map((song) => ({
              name: song.name,
              duration: song.duration,
              url: song.url,
            })),
          },
        },
      })
    })
  )

  const salt = bcrypt.genSaltSync()
  const user = await prisma.user.upsert({
    where: { email: 'user@test.com' },
    update: {},
    create: {
      firstName:'Thomas',
      lastName: 'Sidambarom',
      email: 'user@test.com',
      password: bcrypt.hashSync('password', salt),
    },
  })

  const songs = await prisma.song.findMany({})
  await Promise.all(
    new Array(10).fill(1).map(async (_, i) => {
      // we use create here bcs there is no @unique attribute to do an update (except "id" but there is no items in the db)
      return prisma.playlist.create({
        data: {
          name: `Playlist ${i + 1}`,
          user: {
            connect: { id: user.id },
          },
          songs: {
            connect: songs.map((song) => ({
              id: song.id,
            })),
          },
        },
      })
    })
  )
}

run()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
