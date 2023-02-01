import formatDuration from "format-duration";


export const formatTime = (timeInSecond = 0) => {
    return formatDuration(timeInSecond * 1000)
}


export const formatDtae = (date: Date) => {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}
