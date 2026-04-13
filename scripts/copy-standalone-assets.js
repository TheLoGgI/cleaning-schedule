// Copies static assets that Next.js standalone output omits.
// Must run after `next build`.
const fs = require("fs")
const path = require("path")

const root = path.join(__dirname, "..")

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`[copy] source does not exist, skipping: ${src}`)
    return
  }
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

// .next/static → .next/standalone/.next/static
copyDir(
  path.join(root, ".next", "static"),
  path.join(root, ".next", "standalone", ".next", "static")
)
console.log("[copy] .next/static → .next/standalone/.next/static")

// public → .next/standalone/public
copyDir(
  path.join(root, "public"),
  path.join(root, ".next", "standalone", "public")
)
console.log("[copy] public → .next/standalone/public")
