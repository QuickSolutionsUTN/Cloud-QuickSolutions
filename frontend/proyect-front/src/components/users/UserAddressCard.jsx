import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import './userCardsStyles.css';

const AddressCard = ({ street, province, locality, zipCode, floor, department, onClick, selected }) => {
  const classNames = ['text-center', 'address-card'];
  if (selected) classNames.push('selected');
  if (onClick) classNames.push('clickable');

  return (
    <Card className={classNames.join(' ')} onClick={onClick} role={onClick ? 'button' : undefined}>
      <Card.Body>
        <Card.Title className="fw-bold fs-4 address-card-title text-start">Domicilio</Card.Title>
        <Card.Text className="address-card-text text-start">
          <strong>Direccion:</strong> {street}
        </Card.Text>
        <Card.Text className="address-card-text text-start">
          <strong>Provincia:</strong> {province}
        </Card.Text>
        <Card.Text className="address-card-text text-start">
          <strong>Localidad:</strong> {locality}
        </Card.Text>
        <Card.Text className="address-card-text text-start">
          <strong>CP:</strong> {zipCode}
        </Card.Text>
        <Card.Text className="address-card-text text-start">
          <strong>Piso:</strong> {floor}
        </Card.Text>
        <Card.Text className="address-card-text text-start">
          <strong>Departamento:</strong> {department}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default AddressCard;