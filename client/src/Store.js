import React, { useState } from 'react'
import { flash as flashState } from './FlashState'

const hostUrl = `https://${window.location.hostname}:5001`
export const FlashMessageContext = React.createContext(flashState)
export const HostContext = React.createContext(hostUrl)

const Store = ({ children }) => {
  const [flash, setFlash] = useState(flashState)
  const [host, setHost] = useState(hostUrl)

  return (
    <HostContext.Provider value={[host, setHost]}>
      <FlashMessageContext.Provider value={[flash, setFlash]}>
        {children}
      </FlashMessageContext.Provider>
    </HostContext.Provider>
  )
}

export default Store
