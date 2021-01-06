import React from 'react'
import './Header.css'
import './Header_Responsive.css'
import { Link } from 'react-router-dom'

export default function Header () {
  return (
    <div id='header-container'>
      <div id='link-container'>
        <div className='dropdown'>
          <span>
            <Link to='/'>Homepage</Link>
          </span>
        </div>
        <div className='dropdown'>
          <span>
            <Link to='/alloy'>Alloy</Link>
          </span>
        </div>
        <div className='dropdown'>
          <span>
            <Link to='/steelgrade'>Steelgrade</Link>
          </span>
        </div>
        <div className='dropdown'>
          <span>
            <Link to='/analysis'>Analysis</Link>
          </span>
        </div>
        <div className='dropdown'>
          <span>
            <Link to='/calculate'>Calculate</Link>
          </span>
        </div>
      </div>
    </div>
  )
}
