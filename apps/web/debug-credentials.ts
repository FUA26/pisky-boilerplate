// Debug what credentials are being passed
// Simulate what NextAuth passes to authorize
const testCredentials = {
  email: "admin@example.com",
  password: "admin123",
}

console.log("Test credentials:", testCredentials)
console.log("Has email?", !!testCredentials.email)
console.log("Has password?", !!testCredentials.password)
console.log("Email type:", typeof testCredentials.email)
console.log("Password type:", typeof testCredentials.password)

// Test if they can be accessed as string
const email = testCredentials.email as string
const password = testCredentials.password as string
console.log("Email as string:", email)
console.log("Password as string:", password)
