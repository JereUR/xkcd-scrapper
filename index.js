import axios from 'axios'
import fs from 'fs-extra'
import { getImageSize } from './getImageSize.js'
import { log, time } from './log.js'

const endTime = time()

const { writeJSON } = fs

const INITIAL_ID_XKCD_COMICS = 2500
const MAX_ID_XKCD_COMICS = 2800

for (let id = INITIAL_ID_XKCD_COMICS; id < MAX_ID_XKCD_COMICS; id++) {
  const url = `https://xkcd.com/${id}/info.0.json`
  log(`Fetching ${url}...`)
  const { data } = await axios.get(url)
  const { num, news, transcript, img, ...restOfComic } = data
  log(`Fetched comic #${num}. Getting image dimensions...`)
  const { height, width } = await getImageSize({ url: img })
  log(`Got image dimensions: ${width}x${height}`)
  const comicToStore = {
    id,
    img,
    height,
    width,
    ...restOfComic
  }

  const jsonFile = `./comics/${id}.json`
  await writeJSON(jsonFile, comicToStore)
  log(`Wrote ${jsonFile}! ✅\n`)
}

endTime()
