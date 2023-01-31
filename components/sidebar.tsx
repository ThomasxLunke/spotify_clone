import NextImage from 'next/image'
import NextLink from 'next/link'

import {
  Box,
  List,
  ListItem,
  Divider,
  LinkBox,
  LinkOverlay,
} from '@chakra-ui/layout'

import {
  MdHome,
  MdSearch,
  MdLibraryMusic,
  MdPlaylistAdd,
  MdFavorite,
} from 'react-icons/md'
import MenuItem from './menuItem'

const navMenu = [
  {
    name: 'Home',
    icon: MdHome,
    route: '/',
  },
  {
    name: 'Search',
    icon: MdSearch,
    route: '/search',
  },
  {
    name: 'Your Library',
    icon: MdLibraryMusic,
    route: '/library',
  },
]

const musicMenu = [
  {
    name: 'Create Playlist',
    icon: MdPlaylistAdd,
    route: '/',
  },
  {
    name: 'Favorites',
    icon: MdFavorite,
    route: '/favorites',
  },
]

const playLists = new Array(30).fill(1).map((_, i) => `Playlist ${i + 1}`)

const Sidebar = () => {
  return (
    <Box
      width="100%"
      height="calc(100vh - 100px)"
      bg="black"
      paddingX="5px"
      color="gray"
    >
      <Box paddingY="20px" height="100%">
        <Box width="200px" marginBottom="20px" paddingX="20px">
          <NextImage src="/logo_spotify.svg" height={60} width={200} />
        </Box>

        <Box marginBottom="20px">
          <MenuItem menuItem={navMenu} />
        </Box>

        <Box marginTop="20px" marginBottom="20px">
          <MenuItem menuItem={musicMenu} />
        </Box>

        <Divider color="gray.800" />

        <Box height="66%" overflow="auto" paddingY="20px">
          <List spacing={2}>
            {playLists.map(
              (playlist) => (
                <ListItem paddingX="20px" key={playlist}>
                  <LinkBox>
                    <NextLink
                      href="/"
                      passHref /* === pass "href" to the child component (here the child of NextLink) */
                    >
                      <LinkOverlay>
                        {playlist}
                      </LinkOverlay>
                    </NextLink>
                  </LinkBox>
                </ListItem>
              )
            )}
          </List>
        </Box>
      </Box>
    </Box>
  )
}

export default Sidebar
