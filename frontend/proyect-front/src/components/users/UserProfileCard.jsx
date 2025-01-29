import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './userCardsStyles.css';

const UserCard = ({ name, image }) => {
  return (
    <Card className='text-center profile-card'>
      <Card.Body>
        <Card.Img
          variant='top'
          src={image}
          alt={`${name}'s profile`}
          className="rounded-top profile-card-img"
        />
        <Card.Title className="fw-bold fs-4 profile-card-title">{name}</Card.Title>
        <Button variant="primary" className="rounded-pill px-4 py-2 profile-card-btn">Editar Perfil</Button>
      </Card.Body>
    </Card>
  );

}
export default UserCard;