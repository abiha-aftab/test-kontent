const zlib = require('zlib')

// Just enough of the ZIP format to read kontent-backup.zip without adding a
// dependency: the central directory, then stored or deflated entries.
const END_OF_CENTRAL_DIRECTORY = 0x06054b50
const CENTRAL_FILE_HEADER = 0x02014b50
const LOCAL_FILE_HEADER = 0x04034b50

const findEndOfCentralDirectory = (buffer) => {
  // The record is 22 bytes plus an optional comment of up to 64 KiB.
  const stop = Math.max(0, buffer.length - 22 - 0xffff)
  for (let offset = buffer.length - 22; offset >= stop; offset -= 1) {
    if (buffer.readUInt32LE(offset) === END_OF_CENTRAL_DIRECTORY) return offset
  }
  throw new Error('Not a ZIP archive: end of central directory not found')
}

const readZip = (buffer) => {
  const eocd = findEndOfCentralDirectory(buffer)
  const count = buffer.readUInt16LE(eocd + 10)
  let offset = buffer.readUInt32LE(eocd + 16)
  const entries = new Map()

  for (let index = 0; index < count; index += 1) {
    if (buffer.readUInt32LE(offset) !== CENTRAL_FILE_HEADER) {
      throw new Error(`Corrupt ZIP central directory at byte ${offset}`)
    }
    const method = buffer.readUInt16LE(offset + 10)
    const compressedSize = buffer.readUInt32LE(offset + 20)
    const nameLength = buffer.readUInt16LE(offset + 28)
    const extraLength = buffer.readUInt16LE(offset + 30)
    const commentLength = buffer.readUInt16LE(offset + 32)
    const localOffset = buffer.readUInt32LE(offset + 42)
    const name = buffer.toString('utf8', offset + 46, offset + 46 + nameLength)
    offset += 46 + nameLength + extraLength + commentLength

    if (!name.endsWith('/')) {
      entries.set(name, { method, compressedSize, localOffset })
    }
  }

  const read = (name) => {
    const entry = entries.get(name)
    if (!entry) throw new Error(`${name} is not in the archive`)
    const { method, compressedSize, localOffset } = entry
    if (buffer.readUInt32LE(localOffset) !== LOCAL_FILE_HEADER) {
      throw new Error(`Corrupt ZIP local header for ${name}`)
    }
    const dataStart =
      localOffset +
      30 +
      buffer.readUInt16LE(localOffset + 26) +
      buffer.readUInt16LE(localOffset + 28)
    const data = buffer.subarray(dataStart, dataStart + compressedSize)
    if (method === 0) return Buffer.from(data)
    if (method === 8) return zlib.inflateRawSync(data)
    throw new Error(`${name} uses unsupported ZIP compression ${method}`)
  }

  return {
    names: () => [...entries.keys()],
    read,
    readJson: (name) => JSON.parse(read(name).toString('utf8')),
  }
}

module.exports = { readZip }
