import React from 'react'
import './Navbar.css'
import navlogo from '../../assets/logo copy.png'
import navProfile from '../../assets/nav-profile.svg'
const Navbar = () => {
  return (
    <div className='navbar'>
      <img src={navlogo} alt="" className="nav-logo" />
      <br />
      <span className='cntr'>Admin Panel</span>
      <img src={navProfile} alt="" className='nav-profile' />
      
    </div>
  )
}

export default Navbar
