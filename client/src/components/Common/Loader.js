import React from 'react'
import './Loader.css'

export default function Loader () {
  const count = new Array(20)

  for (let i = 1; i <= count.length; i++) {
    count[i - 1] = i
  }

  /*return (
    <div className='loader-container'>
      <div className='loader'>
        {count.map(c => {
          return <span style={{ '--i': c }} />
        })}
      </div>
    </div>
  )*/

  return (
    <div className='loader-container'>
      <div className='loader'>
        <span />
      </div>
    </div>
  )
}
