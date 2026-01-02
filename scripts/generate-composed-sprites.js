import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration
const BASE_DIR = path.join(__dirname, '../public/pixel-museum/entities')
const OUTPUT_DIR = path.join(BASE_DIR, 'composed')
const MAX_COMBINATIONS = 50

// Couleurs pour les vêtements et cheveux
const WEAR_COLORS = [
  [14, 105, 46],   // Vert
  [20, 78, 186],   // Bleu
  [52, 53, 54],    // Gris foncé
  [255, 156, 255], // Rose
  [122, 23, 23],   // Rouge foncé
  [171, 21, 61],   // Rouge
  [173, 166, 19],  // Jaune-vert
  [255, 200, 0],   // Jaune
  [128, 0, 128],   // Violet
  [0, 128, 128],   // Cyan
  [255, 140, 0],   // Orange foncé
  [139, 69, 19],   // Marron
  [255, 192, 203], // Rose clair
  [0, 191, 255],   // Bleu ciel
  [50, 205, 50],   // Vert clair
  [255, 20, 147],  // Rose profond
  [255, 165, 0],   // Orange
  [75, 0, 130],    // Indigo
  [220, 20, 60],   // Rouge cramoisi
  [0, 100, 0],     // Vert foncé
]

const HAIR_COLORS = [
  [36, 35, 36],    // Noir
  [118, 128, 28],  // Vert olive
  [212, 90, 8],    // Orange
  [42, 48, 168],   // Bleu foncé
  [139, 90, 43],   // Marron
  [255, 200, 150], // Blond
  [200, 150, 100], // Châtain
  [255, 220, 177], // Blond clair
  [80, 50, 30],    // Brun foncé
  [150, 100, 50],  // Châtain foncé
]

async function applyColorToGrayscale(imagePath, color, outputPath) {
  const [r, g, b] = color

  const image = sharp(imagePath)

  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const pixels = new Uint8Array(data.length)
  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3]

    if (alpha > 0) {
      const gray = (data[i] + data[i + 1] + data[i + 2]) / 3
      const factor = gray / 255

      pixels[i] = Math.round(r * factor)     // R
      pixels[i + 1] = Math.round(g * factor) // G
      pixels[i + 2] = Math.round(b * factor) // B
      pixels[i + 3] = alpha                  // A
    } else {
      pixels[i] = 0
      pixels[i + 1] = 0
      pixels[i + 2] = 0
      pixels[i + 3] = 0
    }
  }

  await sharp(pixels, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .png()
    .toFile(outputPath)
}

async function composeSpriteSheet(
  bodyPath,
  coloredWearPath,
  coloredHairPath,
  animationData,
  outputPath
) {
  const body = sharp(bodyPath)
  const wear = sharp(coloredWearPath)
  const hair = sharp(coloredHairPath)

  const bodyMeta = await body.metadata()
  const wearMeta = await wear.metadata()
  const hairMeta = await hair.metadata()

  console.log(`   📐 Dimensions - Body: ${bodyMeta.width}x${bodyMeta.height}, Wear: ${wearMeta.width}x${wearMeta.height}, Hair: ${hairMeta.width}x${hairMeta.height}`)

  const frameWidth = 32
  const frameHeight = 40
  const totalFrames = animationData.frames.length

  const sheetWidth = totalFrames * frameWidth
  const sheetHeight = frameHeight

  const composedFrames = []

  for (let i = 0; i < totalFrames; i++) {
    const frame = animationData.frames[i]
    const frameX = frame.frame.x
    const frameY = frame.frame.y

    const bodyValid = frameX + frameWidth <= bodyMeta.width && frameY + frameHeight <= bodyMeta.height
    const wearValid = frameX + frameWidth <= wearMeta.width && frameY + frameHeight <= wearMeta.height
    const hairValid = frameX + frameWidth <= hairMeta.width && frameY + frameHeight <= hairMeta.height

    if (!bodyValid || !wearValid || !hairValid) {
      console.error(`   ⚠️  Frame ${i}: Coordonnées invalides (x:${frameX}, y:${frameY})`)
      console.error(`      Body: ${bodyValid ? 'OK' : 'INVALIDE'}, Wear: ${wearValid ? 'OK' : 'INVALIDE'}, Hair: ${hairValid ? 'OK' : 'INVALIDE'}`)
      throw new Error(`Coordonnées invalides pour le frame ${i}`)
    }

    const bodyFrame = await body
      .clone()
      .extract({
        left: frameX,
        top: frameY,
        width: frameWidth,
        height: frameHeight,
      })
      .ensureAlpha()
      .raw()
      .toBuffer()

    const wearFrame = await wear
      .clone()
      .extract({
        left: frameX,
        top: frameY,
        width: frameWidth,
        height: frameHeight,
      })
      .ensureAlpha()
      .raw()
      .toBuffer()

    const hairFrame = await hair
      .clone()
      .extract({
        left: frameX,
        top: frameY,
        width: frameWidth,
        height: frameHeight,
      })
      .ensureAlpha()
      .raw()
      .toBuffer()

    const composedFrame = new Uint8Array(frameWidth * frameHeight * 4)

    for (let y = 0; y < frameHeight; y++) {
      for (let x = 0; x < frameWidth; x++) {
        const idx = (y * frameWidth + x) * 4

        composedFrame[idx] = bodyFrame[idx]
        composedFrame[idx + 1] = bodyFrame[idx + 1]
        composedFrame[idx + 2] = bodyFrame[idx + 2]
        composedFrame[idx + 3] = bodyFrame[idx + 3]

        if (wearFrame[idx + 3] > 0) {
          const alpha = wearFrame[idx + 3] / 255
          composedFrame[idx] = Math.round(
            composedFrame[idx] * (1 - alpha) + wearFrame[idx] * alpha
          )
          composedFrame[idx + 1] = Math.round(
            composedFrame[idx + 1] * (1 - alpha) + wearFrame[idx + 1] * alpha
          )
          composedFrame[idx + 2] = Math.round(
            composedFrame[idx + 2] * (1 - alpha) + wearFrame[idx + 2] * alpha
          )
          composedFrame[idx + 3] = Math.max(composedFrame[idx + 3], wearFrame[idx + 3])
        }

        if (hairFrame[idx + 3] > 0) {
          const alpha = hairFrame[idx + 3] / 255
          composedFrame[idx] = Math.round(
            composedFrame[idx] * (1 - alpha) + hairFrame[idx] * alpha
          )
          composedFrame[idx + 1] = Math.round(
            composedFrame[idx + 1] * (1 - alpha) + hairFrame[idx + 1] * alpha
          )
          composedFrame[idx + 2] = Math.round(
            composedFrame[idx + 2] * (1 - alpha) + hairFrame[idx + 2] * alpha
          )
          composedFrame[idx + 3] = Math.max(composedFrame[idx + 3], hairFrame[idx + 3])
        }
      }
    }

    composedFrames.push(composedFrame)
  }

  const finalSheet = new Uint8Array(sheetWidth * sheetHeight * 4)

  for (let i = 0; i < totalFrames; i++) {
    const frameData = composedFrames[i]
    const offsetX = i * frameWidth

    for (let y = 0; y < frameHeight; y++) {
      for (let x = 0; x < frameWidth; x++) {
        const srcIdx = (y * frameWidth + x) * 4
        const dstIdx = (y * sheetWidth + (offsetX + x)) * 4

        finalSheet[dstIdx] = frameData[srcIdx]
        finalSheet[dstIdx + 1] = frameData[srcIdx + 1]
        finalSheet[dstIdx + 2] = frameData[srcIdx + 2]
        finalSheet[dstIdx + 3] = frameData[srcIdx + 3]
      }
    }
  }

  await sharp(finalSheet, {
    raw: {
      width: sheetWidth,
      height: sheetHeight,
      channels: 4,
    },
  })
    .png()
    .toFile(outputPath)
}

async function generateComposedSprites() {
  console.log('🎨 Génération des sprites composés...')
  await fs.mkdir(OUTPUT_DIR, { recursive: true })

  const bodyPath = path.join(BASE_DIR, 'sagwa.png')
  const wearPath = path.join(BASE_DIR, 'sagwa_wear.png')
  const hairPath = path.join(BASE_DIR, 'sagwa_hair.png')
  const jsonPath = path.join(BASE_DIR, 'sagwa.json')

  try {
    await fs.access(bodyPath)
    await fs.access(wearPath)
    await fs.access(hairPath)
    await fs.access(jsonPath)
  } catch (error) {
    console.error('❌ Fichiers sources introuvables:', error.message)
    process.exit(1)
  }

  const jsonContent = await fs.readFile(jsonPath, 'utf-8')
  const animationData = JSON.parse(jsonContent)

  let combinationCount = 0

  for (const hairColor of HAIR_COLORS) {
    for (const wearColor of WEAR_COLORS) {
      if (combinationCount >= MAX_COMBINATIONS) break

      const comboId = `sagwa_composed_${combinationCount + 1}`
      console.log(`\n📦 Génération ${comboId}...`)
      console.log(`   Cheveux: [${hairColor.join(', ')}]`)
      console.log(`   Vêtements: [${wearColor.join(', ')}]`)
      const tempWearPath = path.join(OUTPUT_DIR, `temp_wear_${combinationCount}.png`)
      const tempHairPath = path.join(OUTPUT_DIR, `temp_hair_${combinationCount}.png`)

      try {
        console.log('   🎨 Application des couleurs...')
        await applyColorToGrayscale(wearPath, wearColor, tempWearPath)
        await applyColorToGrayscale(hairPath, hairColor, tempHairPath)

        console.log('   🖼️  Composition des layers frame par frame...')
        const outputPath = path.join(OUTPUT_DIR, `${comboId}.png`)
        await composeSpriteSheet(
          bodyPath,
          tempWearPath,
          tempHairPath,
          animationData,
          outputPath
        )

        await fs.unlink(tempWearPath).catch(() => { })
        await fs.unlink(tempHairPath).catch(() => { })

        combinationCount++
        console.log(`   ✅ ${comboId} généré avec succès!`)
      } catch (error) {
        console.error(`   ❌ Erreur lors de la génération de ${comboId}:`, error.message)
        await fs.unlink(tempWearPath).catch(() => { })
        await fs.unlink(tempHairPath).catch(() => { })
      }
    }
    if (combinationCount >= MAX_COMBINATIONS) break
  }

  console.log(`\n✨ Génération terminée! ${combinationCount} sprites composés créés dans ${OUTPUT_DIR}`)
}

generateComposedSprites().catch(console.error)

