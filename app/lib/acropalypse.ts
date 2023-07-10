import fs from "fs"
import path from "path"

const PNG_MAGIC = new Uint8Array([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a
])
const IEND_MAGIC = new TextEncoder().encode("IEND")

const JPEG_MAGIC = new Uint8Array([0xff, 0xd8])
const EOI_MAGIC = new Uint8Array([0xff, 0xd9])

const SOS_MARKER = 0xffda

const WEBP_MAGIC = new TextEncoder().encode("RIFF")

const AVIF_MAGIC = new TextEncoder().encode("ftypavif")
const MDAT_BOX = new TextEncoder().encode("mdat")

/**
 * Find a sequence of bytes in a Uint8Array
 */
function indexOfSequence(haystack: any, needle: any, startIndex = 0) {
  let index = haystack.indexOf(needle[0], startIndex)
  outer: while (true) {
    if (needle.length === 1 || index === -1) {
      return index
    }

    let i = index
    for (let j = 0; j < needle.length && i < haystack.length; i++, j++) {
      if (haystack[i] !== needle[j]) {
        index += 1
        continue outer
      }
    }
    return i === index + needle.length ? index : -1
  }
}

export function toArrayBuffer(buf: any) {
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
}

/**
 * Check if bytes end with a valid PNG IEND
 *
 * @param {Uint8Array} - bytes to check
 */
function hasValidPngIEND(trailer: any) {
  let view = new DataView(trailer)

  let iendPos = trailer.byteLength - 8

  let iendSize = view.getUint32(iendPos - 4)
  let iendCsum = view.getUint32(iendPos + 4)

  return iendSize == 0 && iendCsum == 0xae426082
}

function parsePng(pngData: any) {
  let uint8Array = new Uint8Array(pngData)

  if (!uint8Array.slice(0, PNG_MAGIC.length).every((v, i) => v == PNG_MAGIC[i]))
    throw new Error("Not a PNG file!")

  let pos = PNG_MAGIC.length

  let view = new DataView(pngData)

  // loop through segments until we find an IEND chunk
  while (true) {
    let size = view.getInt32(pos)
    pos += 4

    let ctype = uint8Array.slice(pos, pos + 4)
    pos += 4

    // ignore the body
    pos += size

    pos += 4

    // if we found an IEND chunk, assume the remaining data is a trailer
    if (ctype.every((char, i) => char === IEND_MAGIC[i])) {
      break
    }
  }

  let trailer = pngData.slice(pos)

  return trailer.byteLength > 0 && hasValidPngIEND(trailer)
    ? trailer.byteLength
    : 0
}

function parseJpeg(jpegData: any) {
  const uint8Array = new Uint8Array(jpegData)
  if (
    !uint8Array.slice(0, JPEG_MAGIC.length).every((v, i) => v == JPEG_MAGIC[i])
  )
    throw new Error("Not a JPEG file!")

  let view = new DataView(jpegData)
  let pos = JPEG_MAGIC.length

  while (true) {
    let marker = view.getUint16(pos)
    pos += 2

    let segmentSize = view.getUint16(pos)
    // we do not add 2 because the size prefix includes the size of the size prefix
    pos += segmentSize

    if (marker === SOS_MARKER) {
      // this will be the last segment before entropy coded segment
      break
    }
  }

  let eoiMarkerPos = indexOfSequence(new Uint8Array(jpegData), EOI_MAGIC, pos)

  if (eoiMarkerPos === -1) throw new Error("No EOI marker found!")

  let trailer = uint8Array.slice(eoiMarkerPos + 2)

  // check if there is any trailing data that has a valid EOI chunk
  return trailer.byteLength > 0 &&
    trailer.slice(-2).every((v, i) => v == EOI_MAGIC[i])
    ? trailer.byteLength
    : 0
}

function parseWebp(webpData: any) {
  const uint8Array = new Uint8Array(webpData)
  if (
    !uint8Array.slice(0, WEBP_MAGIC.length).every((v, i) => v == WEBP_MAGIC[i])
  )
    throw new Error("Not a WebP file!")

  let view = new DataView(webpData)
  let pos = WEBP_MAGIC.length

  let fileSize = view.getUint32(pos, true) + 8

  if (webpData.length < fileSize) {
    throw new Error("WebP file is too short")
  }

  return webpData.byteLength > fileSize ? webpData.byteLength - fileSize : 0
}

function parseAvif(avifData: any) {
  if (indexOfSequence(new Uint8Array(avifData), AVIF_MAGIC) !== 4)
    throw new Error("Not an AVIF file!")

  const uint8Array = new Uint8Array(avifData)

  let pos = 0
  let view = new DataView(avifData)

  while (true) {
    if (pos > avifData.length) throw new Error("AVIF box is truncated")
    let boxSize = view.getUint32(pos, false)

    if (uint8Array.slice(pos + 4, pos + 8).every((v, i) => v == MDAT_BOX[i])) {
      pos += boxSize
      break
    }
    pos += boxSize
  }

  return avifData.byteLength > pos ? avifData.byteLength - pos : 0
}

export function parseImage(data: any) {
  if (indexOfSequence(new Uint8Array(data), PNG_MAGIC) === 0) {
    console.log("PNG", data)
    return parsePng(data)
  } else if (indexOfSequence(new Uint8Array(data), JPEG_MAGIC) === 0) {
    return parseJpeg(data)
  } else if (indexOfSequence(new Uint8Array(data), WEBP_MAGIC) === 0) {
    return parseWebp(data)
  } else if (indexOfSequence(new Uint8Array(data), AVIF_MAGIC) === 4) {
    return parseAvif(data)
  }

  throw new Error("Unrecognized format")
}

export function parseAllImages() {
  // in storage directory, find all files that end with .png, .jpg, .jpeg, .webp, .avif
  for (let file of fs.readdirSync(config.storage)) {
    // check if .png, .jpg, .jpeg, .webp, .avif
    if (
      ![".png", ".jpg", ".jpeg", ".webp", ".avif"].includes(path.extname(file))
    )
      continue
    try {
      // convert to ArrayBuffer
      // parseImage
      console.log(parseImage(fs.readFileSync(path.join(config.storage, file))))
    } catch (e) {
      console.error(e)
    }
  }
}
