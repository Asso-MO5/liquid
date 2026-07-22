import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'node:crypto'
import { promisify, promisify as promisifyZlib } from 'node:util'
import { gunzip, gzip } from 'node:zlib'
import { serverEnv } from '~/env/server'

const gzipAsync = promisifyZlib(gzip)
const gunzipAsync = promisifyZlib(gunzip)

const scryptAsync = promisify(scrypt)

export async function encrypt(text: string): Promise<string> {
  const algorithm = 'aes-256-gcm'
  const key = (await scryptAsync(
    serverEnv.ENCRYPTION_KEY || 'default-key-change-me',
    'salt',
    32,
  )) as Buffer
  const iv = randomBytes(16)

  const textBuffer = Buffer.from(text, 'utf8')
  const compressed = await gzipAsync(textBuffer)

  const cipher = createCipheriv(algorithm, key, iv)
  cipher.setAAD(Buffer.from('complaint-data'))

  let encrypted = cipher.update(compressed)
  encrypted = Buffer.concat([encrypted, cipher.final()])

  const authTag = cipher.getAuthTag()

  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`
}

export async function decrypt(encryptedData: string): Promise<string> {
  const algorithm = 'aes-256-gcm'
  const key = (await scryptAsync(
    serverEnv.ENCRYPTION_KEY || 'default-key-change-me',
    'salt',
    32,
  )) as Buffer

  const parts = encryptedData.split(':')
  if (parts.length !== 3) {
    throw new Error(
      `Format de données invalide. Attendu: iv:authTag:encrypted, reçu: ${parts.length} parties`,
    )
  }

  const [ivHex, authTagHex, encrypted] = parts
  const iv = Buffer.from(ivHex, 'hex')
  const authTag = Buffer.from(authTagHex, 'hex')
  const encryptedBuffer = Buffer.from(encrypted, 'hex')

  const decipher = createDecipheriv(algorithm, key, iv)
  decipher.setAAD(Buffer.from('complaint-data'))
  decipher.setAuthTag(authTag)

  let decrypted = decipher.update(encryptedBuffer)
  decrypted = Buffer.concat([decrypted, decipher.final()])

  try {
    const decompressed = await gunzipAsync(decrypted)
    return decompressed.toString('utf8')
  } catch (_error) {
    return decrypted.toString('utf8')
  }
}
