const ConfirmCloseModal = ({ isOpen, onConfirm, onCancel }) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Вы уверены, что хотите закрыть?</h2>
        <button onClick={onConfirm}>Да</button>
        <button onClick={onCancel}>Отмена</button>
      </div>
    </div>
  )
}

export default ConfirmCloseModal
