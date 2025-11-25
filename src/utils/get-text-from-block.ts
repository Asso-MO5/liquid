type TextContent = {
  type?: string
  text?: string
  styles?: {
    bold?: boolean
    italic?: boolean
    underline?: boolean
  }
}

type Block = {
  content?: TextContent[]
}

type GetTextFromBlockProps = {
  blocks: Block[] | undefined
  maxChars?: number
}

/**
 * Convertit des blocs de texte avec styles en HTML
 * @param blocks - Tableau de blocs contenant du texte et des styles
 * @param maxChars - Nombre maximum de caractères à afficher (optionnel)
 * @returns Chaîne HTML générée
 */
export function getTextFromBlock({
  blocks,
  maxChars = Infinity,
}: GetTextFromBlockProps): string {
  if (!blocks || !Array.isArray(blocks)) return ''

  let currentCharsNum = 0
  const htmlParts: string[] = []

  for (const block of blocks) {
    if (!block.content || !Array.isArray(block.content)) continue

    const paragraphParts: string[] = []

    for (const content of block.content) {
      const { text, styles } = content
      if (!text) continue

      // Vérifier la limite de caractères
      if (currentCharsNum + text.length > maxChars) {
        const remainingChars = maxChars - currentCharsNum
        if (remainingChars > 0) {
          const truncatedText = text.substring(0, remainingChars)
          paragraphParts.push(applyStyles(truncatedText, styles))
        }
        currentCharsNum = maxChars
        break
      }

      currentCharsNum += text.length
      paragraphParts.push(applyStyles(text, styles))
    }

    // Créer un paragraphe pour chaque bloc
    if (paragraphParts.length > 0) {
      htmlParts.push(`<p>${paragraphParts.join('')}</p>`)
    }

    // Arrêter si on a atteint la limite
    if (currentCharsNum >= maxChars) break
  }

  return htmlParts.join('')
}

/**
 * Applique les styles (bold, italic, underline) à un texte
 * @param text - Texte à styliser
 * @param styles - Objet contenant les styles à appliquer
 * @returns Texte HTML avec les styles appliqués
 */
function applyStyles(text: string, styles?: TextContent['styles']): string {
  if (!styles) return escapeHtml(text)

  let styledText = escapeHtml(text)

  // Appliquer les styles dans l'ordre : bold, italic, underline
  if (styles.bold) {
    styledText = `<strong>${styledText}</strong>`
  }
  if (styles.italic) {
    styledText = `<em>${styledText}</em>`
  }
  if (styles.underline) {
    styledText = `<u>${styledText}</u>`
  }

  return styledText
}

/**
 * Échappe les caractères HTML pour éviter les injections XSS
 * @param text - Texte à échapper
 * @returns Texte échappé
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

