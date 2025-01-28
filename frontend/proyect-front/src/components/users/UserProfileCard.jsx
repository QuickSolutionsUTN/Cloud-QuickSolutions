import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './userCardsStyles.css';

const UserCard = ({ name, image, id }) => {
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
        <Card.Text className="text-muted profile-card-text">ID: #{id}</Card.Text>
        <Button variant="primary" className="rounded-pill px-4 py-2 profile-card-btn">Editar Perfil</Button>
      </Card.Body>
    </Card>
  );

}
export default UserCard;

/*
export default function ProfileCard() {
  const [solicitud, setSolicitud] = useState(null);
  const { id: solicitudId } = useParams();
  const backendURL = useBackendURL();
  const [fechaFormateada, setFechaFormateada] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSolicitudDetails = async () => {
      try {
        console.log('Fetching solicitud details...', backendURL);
        const response = await axios.get(`${backendURL}/solicitud/${solicitudId}`);
        console.log('Solicitud details:', response.data);
        setSolicitud(response.data);
        const fechaGeneracion= new Date(response.data.fechaGeneracion);
        const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
        setFechaFormateada(fechaGeneracion.toLocaleDateString('es-ES', opciones));
      } catch (error) {
        console.error('Error fetching solicitud details:', error);
      }
    }
    fetchSolicitudDetails();
  }, [solicitudId]);

  if (!solicitud) {
    return <div>Cargando...</div>;
  }

  
  return (
    <>
      <div className="title-container space-between mb-4">
        <h2>Resumen solicitud #{solicitudId}</h2>
      </div>

      <div className="subtitle-container mb-4">
        <h4>Estado: {solicitud.estado}</h4>
        <h4>Fecha: {fechaFormateada}</h4>
      </div>
      <div className="my-4"></div>

      <Form className='data-container'>
        <div className='row my-3'>
          <div className='col-4'>
            <Form.Label>Email</Form.Label>

            <Form.Control
              type='text'
              defaultValue={solicitud.emailSolicitante}
              readOnly
            >
            </Form.Control>
          </div>
        </div>
        <div className='row my-3'>
          <div className='col-4'>
            <Form.Label>Servicio</Form.Label>
            <Form.Control
              type='text'
              defaultValue={solicitud.tipoServicio}
              readOnly
            >
            </Form.Control>
          </div>
          <div className='col-4'>
            <Form.Label>Categoria</Form.Label>
            <Form.Control
              type='text'
              value={solicitud.categoria}
              readOnly
            >
            </Form.Control>
          </div>
          <div className='col-4'>
            <Form.Label>Producto</Form.Label>
            <Form.Control
              type='text'
              value={solicitud.tipoDeProducto}
              readOnly
            >
            </Form.Control>
          </div>
        </div>

        <div className="my-4"></div>
        <div className='row'>
          <div className='col-12'>
            <Form.Group controlId='descripcion'>
            <Form.Label>Descripcion del problema</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              type='text'
              value={solicitud.descripcion}
              readOnly
              style={{ resize: 'vertical' }}
            />
            </Form.Group>
          </div>
        </div>
        <div className="my-4"></div>
      </Form>

      <div className='buttons-container'>
        <Button variant='primary' className='custom-button' onClick={() => navigate('../requests')}>Volver</Button>
        <Button variant='secondary' className='custom-button' >Editar</Button>
      </div>
    </>
  );

}*/
