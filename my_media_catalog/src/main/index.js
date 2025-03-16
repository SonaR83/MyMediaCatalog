import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import greeting from './functions'
import db from './database.js'

let mainWindow

function createWindow() {
  console.log(`📂 Файл базы данных: ${db.memory ? 'В памяти' : db.name}`)
  console.log('function', greeting())

  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('close', (event) => {
    event.preventDefault() // 📌 Предотвращаем закрытие, показываем модальное окно
    mainWindow.webContents.send('show-close-modal') // 📌 Отправляем в `renderer`
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.on('ping', () => console.log('pong'))

  // 📌 Слушаем команду закрытия окна (из рендера)
  ipcMain.on('close-app', () => {
    if (mainWindow) {
      mainWindow.destroy() // 📌 Теперь окно точно закроется
      mainWindow = null
    }
  })

  // 📌 Обработчик для добавления пользователя
  ipcMain.handle('add_user', async (event, username) => {
    try {
      const stmt = db.prepare('INSERT INTO users (username) VALUES (?)')
      stmt.run(username)
      return { success: true }
    } catch (error) {
      console.error('❌ Ошибка при добавлении пользователя:', error.message)
      return { success: false, error: error.message }
    }
  })

  // 📌 Обработчик для получения всех пользователей
  ipcMain.handle('get_all_users', async () => {
    try {
      const users = db.prepare('SELECT original_title, rus_title FROM movies').all()
      return { success: true, users }
    } catch (error) {
      console.error('❌ Ошибка при получении пользователей:', error.message)
      return { success: false, error: error.message }
    }
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
