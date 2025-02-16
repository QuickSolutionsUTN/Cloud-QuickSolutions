import { React, useEffect, useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { Controller } from 'react-hook-form';
import envioService from "../../../services/apiEnviosService";


const ApiDeliveryForm = ({ formData, control, errors }) => {

  const [localidades, setLocalidades] = useState([]);

  useEffect(() => {
    handlegetLocalidades();
  }, []);

  const handlegetLocalidades = async () => {
    try {
      const response = await envioService.getLocalidades();
      console.log("Localidades:", response);
      setLocalidades(response);
    }
    catch (error) {
      console.error("❌ Error al obtener las localidades:", error);
    }
  }

  const provincias = [...new Set(localidades.map((loc) => JSON.stringify(loc.provincia)))].map((p) => JSON.parse(p));

  const [provinciaSeleccionada, setProvinciaSeleccionada] = useState(
    formData?.logisticsData.stateId || ""
  );
  const [localidadSeleccionada, setLocalidadSeleccionada] = useState(
    formData?.logisticsData.cityId || ""
  );
  const [localidadesFiltradas, setLocalidadesFiltradas] = useState([]);

  useEffect(() => {
    if (provinciaSeleccionada) {
      const filteredLocalidades = localidades.filter(
        (localidad) => localidad.provincia.id === parseInt(provinciaSeleccionada)
      );
      console.log("Localidades filtradas:", filteredLocalidades);
      setLocalidadesFiltradas(filteredLocalidades);
    } else {
      setLocalidadesFiltradas([]);
    }
  }, [localidades, provinciaSeleccionada]);

  return (
    <div className="mt-3">
      <Form className="mt-3" >
        <Row>
          <Col>
            <Controller name="logisticsData.stateId" control={control} defaultValue={formData?.logisticsData.stateId || ''} render={({ field }) => (
              <Form.Group className="mt-2">
                <Form.Label >Provincia</Form.Label>
                <Form.Select
                  {...field}
                  type="select"
                  id="provincia"
                  value={provinciaSeleccionada}
                  onChange={(e) => {
                    setProvinciaSeleccionada(e.target.value);
                    field.onChange(e.target.value);
                  }}>

                  <option value="">Seleccione una provincia</option>
                  {provincias.map((provincia) => (
                    <option key={provincia.id} value={provincia.id}>
                      {provincia.nombre}
                    </option>
                  ))}
                </Form.Select>
                {errors.state && <small className="text-danger">Este campo es obligatorio</small>}
              </Form.Group>)} />
          </Col>
          <Col>
            <Controller name="logisticsData.cityId" defaultValue={formData?.logisticsData.cityId || ''} control={control} render={({ field }) => (
              <Form.Group className="mt-2">
                <Form.Label >Localidad</Form.Label>
                <Form.Select
                  {...field}
                  type="select"
                  id="localidad"
                  value={localidadSeleccionada}
                  onChange={(e) => {
                    setLocalidadSeleccionada(e.target.value);
                    field.onChange(e.target.value);
                  }}
                  disabled={!provinciaSeleccionada}
                >

                  <option value="">Seleccione una localidad</option>
                  {localidadesFiltradas.map((localidad) => (
                    <option key={localidad.id} value={localidad.id}>
                      {localidad.nombre}
                    </option>
                  ))}
                </Form.Select>
                {errors.city && <small className="text-danger">Este campo es obligatorio</small>}
              </Form.Group>)} />
          </Col>
        </Row>

        <Row className="mt-2">
          <Col >
            <Controller name="logisticsData.street" control={control} defaultValue={formData?.logisticsData.street || ''} render={({ field }) => (
              <Form.Group>
                <Form.Label>Calle</Form.Label>
                <Form.Control
                  {...field}
                  type="text"
                  onChange={(e) => field.onChange(e.target.value)} />
                {errors.street && <small className="text-danger">Este campo es obligatorio</small>}
              </Form.Group>)} />

          </Col>
          <Col>
            <Controller name="logisticsData.number" control={control} render={({ field }) => (
              <Form.Group controlId="number">
                <Form.Label>Numero</Form.Label>
                <Form.Control
                  {...field}
                  type="text"
                  onChange={(e) => field.onChange(e.target.value)} />
                {errors.number && <small className="text-danger">Este campo es obligatorio</small>}
              </Form.Group>)} />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col>
            <Controller name="logisticsData.floor" control={control} render={({ field }) => (
              <Form.Group>
                <Form.Label>Piso</Form.Label>
                <Form.Control
                  {...field}
                  type="text"
                  onChange={(e) => field.onChange(e.target.value)} />
              </Form.Group>)} />
          </Col>
          <Col>
            <Controller name="logisticsData.apartment" control={control} render={({ field }) => (
              <Form.Group >
                <Form.Label>Departamento</Form.Label>
                <Form.Control
                  {...field}
                  type="text"
                  onChange={(e) => field.onChange(e.target.value)} />
              </Form.Group>)} />
          </Col>
          <Col>
            <Controller name="logisticsData.zipCode" control={control} render={({ field }) => (
              <Form.Group >
                <Form.Label>Código Postal</Form.Label>
                <Form.Control
                  {...field}
                  type="text"
                  onChange={(e) => field.onChange(e.target.value)} />
                {errors.zipCode && <small className="text-danger">Este campo es obligatorio</small>}
              </Form.Group>)} />
          </Col>
        </Row>
      </Form>
    </div >
  );
}

export default ApiDeliveryForm;