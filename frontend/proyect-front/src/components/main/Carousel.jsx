import Carousel from 'react-bootstrap/Carousel';
import slide1 from '../../assets/images/slide1.jpg';
import slide2 from '../../assets/images/slide1.jpg';
import slide3 from '../../assets/images/slide1.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './carousel.css';

export default function CustomCarousel() {
  return (
    <Carousel data-bs-theme="dark">
      <Carousel.Item>
        <img src={slide1} alt="First slide"/>
        <Carousel.Caption>
          <h3>First slide label</h3>
          <p></p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src={slide2} alt="Second slide"/>
        <Carousel.Caption>
          <h3>Second slide label</h3>
          <p></p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img src={slide3} alt="Third slide"/>
        <Carousel.Caption>
          <h3>Third slide label</h3>
          <p></p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}