import React from 'react';
import CustomCarousel from '../components/main/carousel.jsx';
import { Player } from '@lottiefiles/react-lottie-player';
import delivery from '../assets/images/Truck delivery service.json';


export default function HomePage() {
  return (
    <>
      <div className='carousel'>
        <CustomCarousel />
      </div>
      <main>
        <Player
          autoplay
          loop
          src={delivery}
          style={{ height: '300px', width: '300px' }}
        />
      </main>
    </>
  );
}