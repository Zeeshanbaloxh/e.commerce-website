import React from 'react'
import './NewsLetter.css'

const NewsLetter = () => {
  return (
    <div className='news-letter'>
        <h1>Get Exclusive <span>Offers</span> On Your <span>Email</span></h1>
        <p>Subscribe to our <span>newletter</span> and stay updated</p>
        <div>
            <input type="email" placeholder='Your email id'/>
            <button>Subscribe</button>
        </div>
    </div>
  )
}

export default NewsLetter