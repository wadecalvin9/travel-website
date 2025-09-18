#!/usr/bin/env node

const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

console.log("🚀 Setting up Travel Connect Expeditions...\n")

// Check if .env.local exists
const envPath = path.join(process.cwd(), ".env.local")
if (!fs.existsSync(envPath)) {
  console.log("⚠️  No .env.local file found.")
  console.log("📝 Please create .env.local with the following variables:\n")
  console.log("# Database (Required)")
  console.log('DATABASE_URL="your-neon-database-url"')
  console.log("")
  console.log("# Redis Cache (Optional but recommended)")
  console.log('KV_REST_API_URL="your-upstash-redis-url"')
  console.log('KV_REST_API_TOKEN="your-upstash-redis-token"')
  console.log("")
  console.log("# Session Security (Auto-generated if not provided)")
  console.log('SECRET_COOKIE_PASSWORD="your-32-character-secret"')
  console.log("")
  console.log("# Auto-setup (Optional)")
  console.log('AUTO_SETUP="true"  # Set to false to disable auto-setup')
  console.log("")
  process.exit(1)
}

try {
  // Install dependencies
  console.log("📦 Installing dependencies...")
  execSync("npm install", { stdio: "inherit" })

  // Build the project
  console.log("🔨 Building project...")
  execSync("npm run build", { stdio: "inherit" })

  console.log("\n✅ Setup completed successfully!")
  console.log("\n🎉 Your Travel Connect Expeditions site is ready!")
  console.log("\n📋 Next steps:")
  console.log("1. Make sure your DATABASE_URL is set in .env.local")
  console.log("2. Run: npm run dev")
  console.log("3. Visit: http://localhost:3000")
  console.log("4. The site will auto-setup with sample data on first visit")
  console.log("\n🔐 Default admin login:")
  console.log("Email: admin@travelconnect.com")
  console.log("Password: admin123")
} catch (error) {
  console.error("❌ Setup failed:", error.message)
  process.exit(1)
}
