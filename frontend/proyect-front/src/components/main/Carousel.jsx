import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';
import './carousel.css';
import { Card, CardBody, Button } from 'react-bootstrap';

export default function CustomCarousel() {
  const handleScrollToMaintenance = () => {
    const element = document.getElementById('maintenance-more-info');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  const handleScrollToRepair = () => {
    const element = document.getElementById('repair-more-info');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <Carousel data-bs-theme="dark" className='custom-carousel'>
      <Carousel.Item >
        <div className='maintenance'>
          <Card>
            <CardBody>
              <Card.Title>MANTENIMIENTO</Card.Title>
              <Card.Subtitle>Por qué hacerlo?</Card.Subtitle>
              <Card.Text>
                Realizar mantenimiento ayuda a evitar fallos inesperados,<br />
                reduce costos a largo plazo y garantiza un mejor rendimiento<br /> y durabilidad de los equipos.
                <br /><br />
                <Button variant="outline-secondary" onClick={handleScrollToMaintenance}>CONOCER MÁS</Button>
              </Card.Text>
            </CardBody>
          </Card>
        </div>
      </Carousel.Item>

      <Carousel.Item>
        <div className='repair'>
          <Card>
            <CardBody>
              <Card.Title>REPARACIÓN</Card.Title>
              <Card.Subtitle>Por qué elegirnos?</Card.Subtitle>
              <Card.Text>
              Ofrecemos soluciones rápidas y efectivas para reparar <br />
              tus equipos en óptimas condiciones maximizando la vida útil <br />
              de tus herramientas
              <br /><br />
                <Button variant="outline-dark" onClick={handleScrollToRepair}>CONOCER MÁS</Button>
              </Card.Text>
            </CardBody>
          </Card>
        </div>
      </Carousel.Item>

    </Carousel>
  );
}