import { List, ListItem, LinkBox,LinkOverlay, ListIcon, } from "@chakra-ui/layout"
import NextLink from "next/link"


const MenuItem = ({menuItem}) => {
  return (
    <List spacing={2}>
      {menuItem.map((menu: { name: string; route: string; icon: any }) => (
        <ListItem paddingX="20px" fontSize="20px" key={menu.name}>
          <LinkBox>
            <NextLink
              href={menu.route}
              passHref /* === pass "href" to the child component (here the child of NextLink) */
            >
              <LinkOverlay>
                <ListIcon as={menu.icon} color="white" marginRight="20px" />
                {menu.name}
              </LinkOverlay>
            </NextLink>
          </LinkBox>
        </ListItem>
      ))}
    </List>
  )
}

export default MenuItem
