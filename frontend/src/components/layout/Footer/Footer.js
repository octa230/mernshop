import React from 'react'
import './Footer.css'

export default function Footer() {
  return (
    <footer id='footer'>
        <div className='leftFooter'>
        <h4>Download our collection</h4>
        <p>Download App for Android and IOS mobile phone</p>
      </div>

      <div className='midFooter'>
        <h1>Flowershop</h1>
        <h6>useful Links</h6>
        <p>High Qulaity flowers</p>
        <p>Copyrights 2022 &copy; M-maloba</p>
      </div>

      <div className='rightFooter'>
        <h4>Follow Us</h4>
        <a href='https://instagram.com'>instagram</a>
        <a href='https://youtube.com'>Youtube</a>
        <a href='https://facebook.com'>Facebook</a>
      </div>
    </footer>  
  )
}
