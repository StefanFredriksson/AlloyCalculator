export const showErrorFlash = (message, setFlash) => {
  const obj = { message, visible: true, success: false }
  setFlash({ ...obj })
}

export const showSuccessFlash = (message, setFlash) => {
  const obj = { message, visible: true, success: true }
  setFlash({ ...obj })
}
