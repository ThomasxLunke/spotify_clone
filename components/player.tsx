/* eslint-disable jsx-a11y/aria-proptypes */
import {
  ButtonGroup,
  Box,
  IconButton,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderTrack,
  RangeSliderThumb,
  Center,
  Flex,
  Text,
} from '@chakra-ui/react'

// lib for music
import ReactHowler from 'react-howler'
import { useEffect, useRef, useState } from 'react'
import {
  MdShuffle,
  MdSkipPrevious,
  MdSkipNext,
  MdOutlinePlayCircleFilled,
  MdOutlinePauseCircleFilled,
  MdOutlineRepeat,
} from 'react-icons/md'

import { useStoreActions, useStoreState } from 'easy-peasy'
import { formatTime } from '../lib/formatters'

const Player = ({ songs, activeSong }) => {
  const [playing, setPlaying] = useState(true)
  const [index, setIndex] = useState(
    songs.findIndex((s) => s.id === activeSong.id)
  )
  const [seek, setSeek] = useState(0.0)
  const [isSeeking, setIsSeeking] = useState(false)
  const [repeat, setRepeat] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [duration, setDuration] = useState(0.0)
  const soundRef = useRef(null)
  const repeatRef = useRef(repeat)
  const setActiveSong = useStoreActions((state: any) => state.changeActiveSong)
  
  const volumeLevel = useStoreState((state:any) => state.volumeLevel )
  
  
  useEffect(() => {
    let timerId

    if (playing && !isSeeking) {
      const f = () => {
        setSeek(soundRef.current.seek())
        timerId = requestAnimationFrame(f)
      }

      timerId = requestAnimationFrame(f)
      return () => cancelAnimationFrame(timerId)
    }
    cancelAnimationFrame(timerId)
  }, [playing, isSeeking])

  useEffect(() => {
    setActiveSong(songs[index])
  }, [index, setActiveSong, songs])

  useEffect(() => {
    repeatRef.current = repeat
  }, [repeat])

  const setPlayState = (value) => {
    setPlaying(value)
  }

  const setShuffleState = (value) => {
    setShuffle(value)
  }

  const setRepeatState = (value) => {
    setRepeat(value)
  }

  const prevSong = () => {
    setIndex((state) => {
      return state ? state - 1 : songs.length - 1
    })
  }

  const nextSong = () => {
    setIndex((state) => {
      if (shuffle) {
        const next = Math.floor(Math.random() * songs.length)
        if (next === state) {
          return nextSong()
        }
        return next
      }
      return state === songs.length - 1 ? 0 : state + 1
    })
  }

  const onEnd = () => {
    if (repeatRef.current) {
      // UI
      setSeek(0)
      // update the song ReactHowler
      soundRef.current.seek(0)
    } else {
      nextSong()
    }
  }

  const onLoad = () => {
    // update the song ReactHowler
    const songDuration = soundRef.current.duration()
    // UI
    setDuration(songDuration)
  }

  const onSeek = (e) => {
    // UI
    setSeek(parseFloat(e[0]))
    // update the song ReactHowler
    soundRef.current.seek(e[0])
  }

  return (
    <Box>
      <Box>
        <ReactHowler
          ref={soundRef}
          playing={playing}
          src={activeSong?.url}
          onLoad={onLoad}
          onEnd={onEnd}
          volume={volumeLevel}
        />
      </Box>

      <Center color="gray.600">
        <ButtonGroup>
          <IconButton
            outline="none"
            variant="link"
            aria-label="shuffle"
            fontSize="24px"
            color={shuffle ? 'white' : 'gray.600'}
            icon={<MdShuffle />}
            onClick={() => setShuffleState(!shuffle)}
          />
          <IconButton
            outline="none"
            variant="link"
            aria-label="previous"
            fontSize="24px"
            icon={<MdSkipPrevious />}
            onClick={prevSong}
          />
          {playing ? (
            <IconButton
              outline="none"
              variant="link"
              aria-label="pause"
              fontSize="40px"
              color="white"
              icon={<MdOutlinePauseCircleFilled />}
              onClick={() => setPlayState(false)}
            />
          ) : (
            <IconButton
              outline="none"
              variant="link"
              aria-label="play"
              fontSize="40px"
              color="white"
              icon={<MdOutlinePlayCircleFilled />}
              onClick={() => setPlayState(true)}
            />
          )}

          <IconButton
            outline="none"
            variant="link"
            aria-label="next"
            fontSize="24px"
            icon={<MdSkipNext />}
            onClick={nextSong}
          />
          <IconButton
            outline="none"
            variant="link"
            aria-label="repeat"
            fontSize="24px"
            icon={<MdOutlineRepeat />}
            color={repeat ? 'white' : 'gray.600'}
            onClick={() => setRepeatState(!repeat)}
          />
        </ButtonGroup>
      </Center>
      <Box color="gray.600">
        <Flex justify="center" align="center">
          <Box width="10%">
            <Text fontSize="xs">{formatTime(seek)}</Text>
          </Box>
          <Box width="80%">
            <RangeSlider
              aria-label={['min', 'max']}
              step={0.1}
              min={0}
              id="player-range"
              max={duration ? (duration.toFixed(2) as unknown as number) : 0}
              onChange={onSeek}
              value={[seek]}
              onChangeStart={() => setIsSeeking(true)}
              onChangeEnd={() => setIsSeeking(false)}
            >
              {/* 
                RangeSliderTrack = barre du fond sombre
                RangeSliderFilledTrack = barre qui défile */}
              <RangeSliderTrack bg="gray.800">
                <RangeSliderFilledTrack bg="gray.600" />
              </RangeSliderTrack>
              <RangeSliderThumb index={0} />
            </RangeSlider>
          </Box>
          <Box width="10%" textAlign="right">
            <Text fontSize="xs">{formatTime(duration)}</Text>
          </Box>
        </Flex>
      </Box>
    </Box>
  )
}

export default Player
