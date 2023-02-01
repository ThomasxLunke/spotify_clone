import { Box, Flex, Text } from '@chakra-ui/layout'
import { Image } from '@chakra-ui/react'
import GradientLayout from '../components/gradientLayout'
import { useMe } from '../lib/hooks'
import prisma from '../lib/prisma'

const Home = ({ artists }) => {
  const {user} = useMe()

  return (
    <GradientLayout
      image="profile_picture.jpg"
      color="pink"
      title={`${user?.firstName} ${user?.lastName}` }
      subtitle="Profile"
      description={`${user?.playlistsCount} playlist`}
      roundImage
    >
      <Box color="white" paddingX="40px">
        <Box marginBottom="40px">
          <Text fontSize="2xl" fontWeight="bold">
            Top artist this month
          </Text>
          <Text fontSize="md">Only visible to you</Text>
        </Box>
        <Flex>
          {artists.map((artist) => (
            <Box paddingX="10px" width="15%" key={artist.id}>
              <Box bg="gray.900" borderRadius="4px" padding="15px" width="100%" height="100%">
                <Image
                  src="https://api.lorem.space/image/album?w=150&h=150"
                  borderRadius="100%"
                />
                <Box marginTop="20px">
                  <Text fontSize="large">{artist.name}</Text>
                  <Text fontSize="x-small">Artist</Text>
                </Box>


              </Box>
            </Box>
          ))}
        </Flex>
      </Box>
    </GradientLayout>
  )
}

// function is called when the page is rendered.
// It run on server side, not client side
// so it will be rendered when we request a page (it's not a state
// that get rendered in client side in real time)
export const getServerSideProps = async () => {
  const artists = await prisma.artist.findMany({})
  return {
    props: { artists },
  }
}

export default Home
