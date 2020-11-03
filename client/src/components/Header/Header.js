import React from 'react'
import './Header.css'
import { Link } from 'react-router-dom'

export default function Header () {
  return (
    <div id='header-container'>
      <div id='link-container'>
        <div className='dropdown'>
          <span>Alloy</span>
          <div className='dropdown-content'>
            <Link to='/alloy/add' className='dropdown-link'>
              Add alloy
            </Link>
            <Link to='#' className='dropdown-link'>
              Delete alloy
            </Link>
          </div>
        </div>
        <div className='dropdown'>
          <span>Steelgrade</span>
          <div className='dropdown-content'>
            <Link to='/steelgrade/add' className='dropdown-link'>
              Add steelgrade
            </Link>
            <Link to='#' className='dropdown-link'>
              Delete steelgrade
            </Link>
          </div>
        </div>
        <div className='dropdown'>
          <span>Analysis</span>
          <div className='dropdown-content'>
            <Link to='/analysis/add' className='dropdown-link'>
              Add analysis
            </Link>
            <Link to='#' className='dropdown-link'>
              Delete analysis
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
