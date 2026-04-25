// apps/web/lib/tokens.ts
import crypto from "crypto"

/**
 * Create a secure token with expiration
 * @param hoursValid - Number of hours the token should be valid
 * @returns The token, hashed version, and expiration date
 */
export function createSecureToken(hoursValid: number = 1) {
  // Create random token
  const token = crypto.randomBytes(32).toString("hex")

  // Hash the token for storage
  const hashed = crypto.createHash("sha256").update(token).digest("hex")

  // Calculate expiration
  const expires = new Date()
  expires.setHours(expires.getHours() + hoursValid)

  return { token, hashed, expires }
}

/**
 * Verify a token against its hash
 * @param token - The raw token to verify
 * @param hashed - The hashed token stored in database
 * @returns True if token matches
 */
export function verifyToken(token: string, hashed: string): boolean {
  const tokenHash = crypto.createHash("sha256").update(token).digest("hex")
  return tokenHash === hashed
}

/**
 * Check if a token has expired
 * @param expires - The expiration date
 * @returns True if token is expired
 */
export function isTokenExpired(expires: Date): boolean {
  return new Date() > expires
}

/**
 * Generate a random verification token
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex")
}
