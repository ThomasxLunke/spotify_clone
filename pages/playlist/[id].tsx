import GradientLayout from '../../components/gradientLayout'
import { validateToken } from '../../lib/auth'
import prisma from '../../lib/prisma'
import SongsTable from '../../components/songsTable'

const getBGColor = (id) => {
  const colors = [
    'red',
    'green',
    'blue',
    'orange',
    'purple',
    'gray',
    'teal',
    'yellow',
  ]

  return colors[id - 1] || colors[Math.floor(Math.random() * colors.length)]
}

const Playlist = ({ playlist }) => {
  const color = getBGColor(playlist.id)
  return (
    <GradientLayout
      image={`https://picsum.photos/400?random=${playlist.id}`}
      color={color}
      title={playlist.name}
      subtitle="playlist"
      description={`${playlist.songs.length} songs`}
      roundImage={false}
    >
      <SongsTable songs={playlist.songs} />
    </GradientLayout>
  )
}

/* What are edge functions in Nextjs?

    Edge functions allow developers to run their code at the servers distributed globally. 
    This means your code will be executed at the location that is closest to your user. 
    You can think of edge functions as the serverless functions which are run at the CDN 
    infrastructure. 
    
*/
export const getServerSideProps = async ({ query, req }) => {
  const { id } = validateToken(req.cookies.SPOTIFY_ACCESS_TOKEN)
  const [playlist] = await prisma.playlist.findMany({
    // take the playlist with the good id ([id].tsx) and good userId ...
    where: {
      // conversion of query.id to a number (bcs it's initially a string but in db it's a Int)
      id: +query.id,
      userId: id,
    },
    // ... and include with this all the songs of the playlist ...
    include: {
      songs: {
        // ... and then give me all the artists of the songs : their names and ids
        include: {
          artist: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
    },
  })

  return {
    props: { playlist },
  }
}

export default Playlist
