import React from 'react'
import logo from '../Assets/logo.webp'
const IntroScreen = () => {
  return (
    <div className='initial_screen'>
      <div>
          <img src={logo} alt='logo' className='logo'/>
          <h1>Messenger</h1>
          <p>Fell Free To Share</p>
      </div>
    </div>
  )
}

export default IntroScreen
