import Card from 'react-bootstrap/Card';
import 'bootstrap/dist/css/bootstrap.min.css';
import './userCardsStyles.css';

const UserCard = ({ user }) => {

  const formatLabel = (key) => {
    if (!key) return '';
    return key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') return <em>No especificado</em>;
    if (typeof value === 'string' && /\d{4}-\d{2}-\d{2}T?/.test(value)) {
      return value.split('T')[0];
    }
    if (typeof value === 'boolean') return value ? 'Sí' : 'No';
    return String(value);
  };

  const hiddenKeys = new Set(['id', 'rol', 'role']);

  return (
    <Card className='text-center profile-card'>
      <Card.Body>
        <Card.Title className="fw-bold fs-4 profile-card-title">Información del perfil</Card.Title>
        {user && (
          <div className='profile-details text-start'>
            {Object.entries(user)
              .filter(([key]) => !hiddenKeys.has(key))
              .map(([key, value]) => (
                typeof value !== 'object' && (
                  <div className='card-text address-card-text' key={key}>
                    <strong>{formatLabel(key)}:</strong> {formatValue(value)}
                  </div>
                )
              ))}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default UserCard;