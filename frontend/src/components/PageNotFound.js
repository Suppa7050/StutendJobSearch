import React from 'react'
import img from '../images/notfound.jpg'

export const PageNotFound = () => {
  return (
    <>
      
      <div
        className='pg d-flex justify-content-center'
        style={{
          width: '100%', // Sets the width of the div
          height: '80vh', // Adjust this height as needed to display the image fully
          backgroundImage: `url(${img})`,
          backgroundSize: 'contain', // Change to 'contain' to see the full image
          backgroundRepeat: 'no-repeat', // Prevents the image from repeating
          backgroundPosition: 'center',
        }}
      ></div>
    </>
  )
}
