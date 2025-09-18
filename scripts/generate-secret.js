// Run this script to generate a secure NEXTAUTH_SECRET
// Usage: node scripts/generate-secret.js

const crypto = require("crypto")

function generateNextAuthSecret() {
  const secret = crypto.randomBytes(32).toString("hex")
  console.log("Generated NEXTAUTH_SECRET:")
  console.log(secret)
  console.log("\nAdd this to your environment variables:")
  console.log(`NEXTAUTH_SECRET=${secret}`)
  console.log("\nFor Vercel deployment, add this in your project settings under Environment Variables.")
}

generateNextAuthSecret()
