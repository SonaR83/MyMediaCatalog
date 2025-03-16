import Versions from './components/Versions'
import { useState, useEffect } from 'react'
import ConfirmCloseModal from './components/ConfirmCloseModal'

function App() {
  const [message, setMessage] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    // 📌 Слушаем событие закрытия окна от `main.js`
    window.api.receive('show-close-modal', () => {
      setIsModalOpen(true)
    })
  }, [])

  const handleConfirmClose = () => {
    setIsModalOpen(false)
    window.api.closeWindow() // 📌 Закрываем окно через IPC
  }

  const ipcHandle = () => window.api.ping()

  const addUserHandle = async () => {
    const result = await window.api.addUser('Alice')
    if (result.success) {
      console.log('✅ Пользователь успешно добавлен')
      setMessage('Пользователь добавлен')
    } else {
      console.error('❌ Ошибка:', result.error)
      setMessage('Ошибка: ' + result.error)
    }
  }

  const fetchAllUsers = async () => {
    const result = await window.api.getAllUsers()
    if (result.success) {
      console.log('📂 Найдено фильмов:', result.users.length)
      setMessage(`📂 Найдено фильмов: ${result.users.length}`)
    } else {
      console.error('❌ Ошибка:', result.error)
      setMessage('Ошибка: ' + result.error)
    }
  }

  return (
    <div>
      <div className={isModalOpen ? 'blurred' : ''}>
        <div className="creator">Powered by electron-vite</div>
        <div className="text">
          Build an Electron app with <span className="react">React</span>
        </div>
        <p className="tip">
          Please try pressing <code>F12</code> to open the devTool
        </p>
        <div className="actions">
          <div className="action">
            <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
              Documentation
            </a>
          </div>
          <div className="action">
            <a target="_blank" rel="noreferrer" onClick={ipcHandle}>
              Send IPC
            </a>
          </div>
          <div className="db">
            <button onClick={addUserHandle}>Add User</button>
            <textarea value={message || ''} readOnly />
            <button onClick={fetchAllUsers}>Get All Users in DB</button>
          </div>
        </div>

        <Versions />
      </div>
      <ConfirmCloseModal
        isOpen={isModalOpen}
        onConfirm={handleConfirmClose}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default App
