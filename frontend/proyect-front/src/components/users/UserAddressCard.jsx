import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import './userAddressCard.css';

const AddressCard = ({ street, city, state, zipCode, country }) => {
  return (
    <Card className='text-center address-card'>
      <Card.Body>
        <Card.Title className="fw-bold fs-4 address-card-title text-start">Domicilio</Card.Title>
        <Card.Text className="address-card-text text-start">
          <strong>Direccion:</strong> {street}
        </Card.Text>
        <Card.Text className="address-card-text text-start">
          <strong>Ciudad:</strong> {city}
        </Card.Text>
        <Card.Text className="address-card-text text-start">
          <strong>Provincia:</strong> {state}
        </Card.Text>
        <Card.Text className="address-card-text text-start">
          <strong>CP:</strong> {zipCode}
        </Card.Text>
        <Card.Text className="address-card-text text-start">
          <strong>Pais:</strong> {country}
        </Card.Text>
      </Card.Body>
    </Card>
  ); F
}

export default AddressCard;