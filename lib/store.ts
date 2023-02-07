import {createStore, action} from "easy-peasy"


export const store = createStore({
    activeSongs:[],
    activeSong: null,
    volumeLevel: 0.5,
    changeActiveSongs: action((state: any,payload) => {
        state.activeSongs = payload
    }),
    changeActiveSong: action((state: any,payload) => {
        state.activeSong = payload
    }),
    changeVolumeLevel: action((state: any,payload) => {
        state.volumeLevel = payload
    })
})