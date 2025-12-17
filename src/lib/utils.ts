export function generateToken(length: number = 10): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let token = ''
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return token
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function generateAssignments(
  participantIds: string[],
  exclusions: { excluderId: string; excludedId: string }[] = []
): { giverId: string; receiverId: string }[] | null {
  if (participantIds.length < 3) {
    return null
  }

  // Create a map of exclusions for quick lookup
  const exclusionMap = new Map<string, Set<string>>()
  for (const exclusion of exclusions) {
    if (!exclusionMap.has(exclusion.excluderId)) {
      exclusionMap.set(exclusion.excluderId, new Set())
    }
    exclusionMap.get(exclusion.excluderId)!.add(exclusion.excludedId)
  }

  // Try to generate valid assignments (max 100 attempts to avoid infinite loop)
  for (let attempt = 0; attempt < 100; attempt++) {
    const shuffled = shuffleArray([...participantIds])
    const assignments: { giverId: string; receiverId: string }[] = []
    let valid = true

    for (let i = 0; i < shuffled.length; i++) {
      const giverId = shuffled[i]
      const receiverId = shuffled[(i + 1) % shuffled.length]

      // Check if this assignment violates any exclusion
      const excludedIds = exclusionMap.get(giverId)
      if (excludedIds && excludedIds.has(receiverId)) {
        valid = false
        break
      }

      assignments.push({ giverId, receiverId })
    }

    if (valid) {
      return assignments
    }
  }

  // If we couldn't find a valid assignment after many attempts, return null
  return null
}
