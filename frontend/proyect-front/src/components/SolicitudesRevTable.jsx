import Table from 'react-bootstrap/Table';

function SolicitudesRevisionT() {
  return (
    <Table striped bordered hover variant="light">
      <thead>
        <tr>
          <th>Equipo Id</th>
          <th>Descripcion</th>
          <th>Categoria</th>
          <th>Fecha</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1111</td>
          <td>Grupo Electrogeno</td>
          <td>Electricidad</td>
          <td>15/09/2024</td>
          <td>Finalizada</td>
        </tr>
        <tr>
          <td>2222</td>
          <td>Elevador de tijera</td>
          <td>Construccion</td>
          <td>1/10/2024</td>
          <td>En proceso</td>
        </tr>
        <tr>
          <td>3333</td>
          <td>Aspiradora Industrial</td>
          <td>Electrodomesticos</td>
          <td>09/10/2024</td>
          <td>Iniciada</td>
        </tr>
      </tbody>
    </Table>
  );
}

export default SolicitudesRevisionT;