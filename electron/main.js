const { app, BrowserWindow, shell } = require("electron")
const { spawn } = require("child_process")
const path = require("path")
const http = require("http")

const PORT = 8888
const DEV = !app.isPackaged

let serverProcess = null
let mainWindow = null

// ── Database path ────────────────────────────────────────────────────────────
// In production: AppData/Roaming/<appName>/cleaning.db  (survives updates)
// In dev:        ./data/cleaning.db  (project root)
const dbPath = DEV
  ? path.join(process.cwd(), "data", "cleaning.db")
  : path.join(app.getPath("userData"), "cleaning.db")

// ── Next.js server ───────────────────────────────────────────────────────────
function startServer() {
  const env = {
    ...process.env,
    PORT: String(PORT),
    DATABASE_PATH: dbPath,
    NODE_ENV: DEV ? "development" : "production",
  }

  if (DEV) {
    // In dev, use the pre-built standalone server (run `pnpm build` first)
    const standaloneDir = path.join(process.cwd(), ".next", "standalone")
    serverProcess = spawn("node", ["server.js"], {
      cwd: standaloneDir,
      env,
      stdio: "inherit",
    })
  } else {
    // In production, use Electron's own Node runtime so we don't depend on a
    // system `node` being in PATH when launched from the Start Menu / shortcut.
    const standaloneDir = path.join(process.resourcesPath, "app", ".next", "standalone")
    const drizzleDir = path.join(process.resourcesPath, "app", "drizzle")
    serverProcess = spawn(process.execPath, ["server.js"], {
      cwd: standaloneDir,
      env: { ...env, ELECTRON_RUN_AS_NODE: "1", DRIZZLE_FOLDER: drizzleDir },
      stdio: "pipe",
    })

    serverProcess.stdout.on("data", (d) => console.log("[server]", d.toString()))
    serverProcess.stderr.on("data", (d) => console.error("[server]", d.toString()))
  }

  serverProcess.on("error", (err) => {
    console.error("Server process error:", err)
  })

  serverProcess.on("exit", (code) => {
    if (code !== 0 && mainWindow) {
      console.error(`Server exited with code ${code}`)
    }
  })
}

// ── Window ───────────────────────────────────────────────────────────────────
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    title: "Cleaning Schedule",
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  })

  // Show the window only when a real http:// page finishes loading.
  // Using .on (not .once) because did-finish-load also fires for chrome-error://
  // pages, which would consume a .once listener before the real page loads.
  mainWindow.webContents.on("did-finish-load", () => {
    if (mainWindow?.webContents.getURL().startsWith("http://")) {
      mainWindow.show()
    }
  })

  mainWindow.loadURL(`http://localhost:${PORT}`)

  // If the page fails to load (server not yet ready, crash, etc.), retry.
  // The window is hidden so chrome-error:// cross-origin restrictions don't apply.
  mainWindow.webContents.on("did-fail-load", (_event, errorCode) => {
    if (errorCode === -3) return // ERR_ABORTED – user navigated away, ignore
    setTimeout(() => {
      if (mainWindow) mainWindow.loadURL(`http://localhost:${PORT}`)
    }, 500)
  })

  // Open external links in the system browser, not Electron
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: "deny" }
  })

  mainWindow.on("closed", () => {
    mainWindow = null
  })
}

// ── App lifecycle ─────────────────────────────────────────────────────────────
function waitForServer(port, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const start = Date.now()
    function poll() {
      http
        .get(`http://localhost:${port}`, (res) => {
          res.resume()
          resolve()
        })
        .on("error", () => {
          if (Date.now() - start >= timeout) {
            reject(new Error("Timed out waiting for Next.js server to start"))
          } else {
            setTimeout(poll, 200)
          }
        })
    }
    poll()
  })
}

app.whenReady().then(async () => {
  startServer()

  // Wait for the Next.js server to be ready before opening the window
  try {
    await waitForServer(PORT, 30_000)
  } catch {
    console.error("Timed out waiting for Next.js server to start")
  }

  createWindow()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})

app.on("will-quit", () => {
  if (serverProcess) {
    serverProcess.kill()
    serverProcess = null
  }
})
