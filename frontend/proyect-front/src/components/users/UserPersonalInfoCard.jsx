import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import './userPersonalInfoCard.css';

const PersonalInfoCard = ({ email, birthDate }) => {
  return (
    <Card className='text-center personal-info-card'>
      <Card.Body>
        <Card.Title className="fw-bold fs-4 personal-info-card-title text-start">Informacion Personal</Card.Title>
        <Card.Text className="personal-info-text text-start">
          <strong>Email:</strong> {email}
        </Card.Text>
        <Card.Text className="personal-info-text text-start">
          <strong>Fecha de nacimiento:</strong> {birthDate}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default PersonalInfoCard;