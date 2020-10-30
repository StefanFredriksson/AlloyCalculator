import React, { useState } from 'react'
import { flash as flashState } from './FlashState'

export const FlashMessageContext = React.createContext(flashState)

const Store = ({ children }) => {
  const [flash, setFlash] = useState(flashState)

  return (
    <FlashMessageContext.Provider value={[flash, setFlash]}>
      {children}
    </FlashMessageContext.Provider>
  )
}

export default Store
