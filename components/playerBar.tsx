import { Box, Flex, Text } from '@chakra-ui/layout'
import { useStoreState, useStoreActions } from 'easy-peasy'
import { MdVolumeDownAlt, MdVolumeOff, MdVolumeUp } from 'react-icons/md'
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Center,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import Player from './player'

const PlayerBar = () => {
  const songs = useStoreState((state: any) => state.activeSongs)
  const activeSong = useStoreState((state: any) => state.activeSong)
  const setVolumeLevel = useStoreActions(
    (state: any) => state.changeVolumeLevel
  )
  const volumeLevel = useStoreState((state: any) => state.volumeLevel)
  const [volumeIcon, setVolumeIcon] = useState(<MdVolumeDownAlt />)
  const [isShown, setIsShown] = useState(false)

  useEffect(() => {
    if (volumeLevel === 0.0) setVolumeIcon(<MdVolumeOff />)
    if (volumeLevel <= 0.5 && volumeLevel !== 0.0)
      setVolumeIcon(<MdVolumeDownAlt />)
    if (volumeLevel > 0.5) setVolumeIcon(<MdVolumeUp />)
  }, [volumeLevel, setVolumeLevel])

  return (
    <Box height="100px" width="100vw" bg="gray.900" padding="10px">
      <Flex align="center">
        {activeSong ? (
          <Box padding="20px" color="white" width="30%">
            <Text fontSize="large">{activeSong.name}</Text>
            <Text fontSize="x-small">{activeSong.artist.name}</Text>
          </Box>
        ) : null}

        <Box width="40%">
          {activeSong ? <Player songs={songs} activeSong={activeSong} /> : null}
        </Box>

        <Box width="30%">
          {activeSong ? (
            <Flex align="center" justify="end">
              <Box
                paddingY="20px"
                fontSize="20px"
                color={isShown ? 'white' : 'gray.600'}
                onMouseEnter={() => setIsShown(true)}
                onMouseLeave={() => setIsShown(false)}
              >
                {volumeIcon}
              </Box>
              <Box
                width="150px"
                padding="20px"
                onMouseEnter={() => setIsShown(true)}
                onMouseLeave={() => setIsShown(false)}
              >
                <Center>
                  <Slider
                    aria-label="slider-ex-1"
                    min={0.0}
                    max={1.0}
                    step={0.01}
                    onChangeEnd={(val) => setVolumeLevel(val)}
                    defaultValue={0.5}
                  >
                    <SliderTrack bg="gray.800">
                      <SliderFilledTrack bg={isShown ? 'green.600' : 'white'} />
                    </SliderTrack>
                    <SliderThumb
                      index={0}
                      size="sm"
                      display={isShown ? 'block' : 'none'}
                    />
                  </Slider>
                </Center>
              </Box>
            </Flex>
          ) : null}
        </Box>
      </Flex>
    </Box>
  )
}

export default PlayerBar
