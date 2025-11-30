import { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { Form, Button, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useBackendURL } from '../../../contexts/BackendURLContext.jsx';
import { useParams } from 'react-router-dom';
import "./approvedStep.css";

function ApprovedStep({ solicitud, nextStep, cancelStep, handleChange }) {
  const [fechaFormateada, setFechaFormateada] = useState('');
  const [idCategoria, setIdCategoria] = useState(null);
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
    const [localResumen, setLocalResumen] = useState('');
    const [selectedTasks, setSelectedTasks] = useState(new Set());


  useEffect(() => {
    // Initialize local resumen and checklist selection only when the
    // solicitud changes (different id). Avoid resetting `selectedTasks`
    // on every parent re-render (for example when typing into the resumen
    // which updates parent state) because that would clear the user's
    // checklist selections.
    const currentId = solicitud?.id ?? null;
    if (prevSolicitudId.current !== currentId) {
      setLocalResumen(solicitud?.Resumen ?? solicitud?.resumen ?? '');
      setSelectedTasks(new Set());
      prevSolicitudId.current = currentId;
    }
  }, [solicitud]);

  const prevSolicitudId = useRef(null);

  useEffect(() => {
    const checklist = solicitud.mantenimiento?.checklist || [];
    const obligatory = checklist.filter(i => i.obligatorio).map(i => i.id);
    const allObligatorySelected = obligatory.every(id => selectedTasks.has(id));
    setIsFormValid(!!(localResumen && localResumen.trim()) && allObligatorySelected);
  }, [localResumen, selectedTasks, solicitud]);

  if (!solicitud) {
    return <div>Cargando...</div>;
  }

  const handleSubmit = (event) => {
      event.preventDefault();

      // Validate obligatory tasks selected
      const checklist = solicitud.mantenimiento?.checklist || [];
      const obligatory = checklist.filter(i => i.obligatorio).map(i => i.id);
      const missingObligatory = obligatory.filter(id => !selectedTasks.has(id));

      const newErrors = {};
      if (missingObligatory.length > 0) {
        newErrors.Tasks = 'Debe seleccionar las tareas obligatorias antes de enviar el resumen.';
      }
      if (!localResumen || !localResumen.trim()) {
        newErrors.Resumen = 'El resumen del trabajo es obligatorio.';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      // Build concatenated resumen
      const performed = checklist.filter(i => selectedTasks.has(i.id)).map(i => i.descripcion);
      const notPerformed = checklist.filter(i => !selectedTasks.has(i.id)).map(i => i.descripcion);

      let finalResumen = localResumen.trim();
      finalResumen += '\n\nTareas realizadas:';
      if (performed.length === 0) finalResumen += '\n- Ninguna';
      else performed.forEach(t => { finalResumen += `\n- ${t}` });

      finalResumen += '\n\nTareas no realizadas:';
      if (notPerformed.length === 0) finalResumen += '\n- Ninguna';
      else notPerformed.forEach(t => { finalResumen += `\n- ${t}` });

      setErrors({});
      console.log('Solicitud para finalizar:', solicitud);
      console.log('Resumen final del trabajo:', finalResumen);

      // Pass both keys to keep compatibility
      nextStep({ resumen: finalResumen, Resumen: finalResumen });
    };

    const toggleTask = (id) => {
      setSelectedTasks(prev => {
        const copy = new Set(prev);
        if (copy.has(id)) copy.delete(id); else copy.add(id);
        return copy;
      });
    }

  return (
    <>
      <div className="data-container budgeted-step-container">
        <Form className='reviewed-step-form'>
          {solicitud.tipoServicio !== 'Reparación' && solicitud.mantenimiento && (
            <>
              <div className='mb-3'>
                <Form.Group controlId='mantenimiento-desc'>
                  <Form.Label className="fw-bold">Descripcion del mantenimiento</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={3}
                    type='text'
                    value={solicitud.mantenimiento?.descripcion}
                    readOnly
                  />
                </Form.Group>
              </div>
              <Form.Group className="mt-2" controlId="checklist">
                <Form.Label className="fw-bold">Checklist </Form.Label>
                <ListGroup>
                  {solicitud.mantenimiento.checklist.map(item => (
                    <ListGroup.Item key={item.id}>
                      <Form.Check
                        type="checkbox"
                        id={`task-${item.id}`}
                        label={
                          <span>
                            {item.descripcion}
                            {item.obligatorio && <strong style={{ color: '#c00' }}> (Obligatorio)</strong>}
                          </span>
                        }
                        checked={selectedTasks.has(item.id)}
                        onChange={() => toggleTask(item.id)}
                      />
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Form.Group>
            </>
          )}
          <div className='row reviewed-show'>
          <div className='col-diagnostic'>
            <Form.Group controlId='diagnostic'>
              <Form.Label className="fw-bold">Diagnostico</Form.Label>
              <Form.Control
                as='textarea'
                rows={5}
                type='text'
                value={solicitud.diagnosticoTecnico}
                readOnly
              />
            </Form.Group>
          </div>
          <div className='col-amount'>
            <Form.Group controlId='estimated-date'>
              <Form.Label className="fw-bold">Fecha estimada</Form.Label>
              <Form.Control
                type='date'
                value={solicitud.fechaEstimada ? new Date(solicitud.fechaEstimada).toISOString().split('T')[0] : ''}
                readOnly
              />
            </Form.Group>
            <Form.Group className="amount-form" controlId='amount'>
              <Form.Label className="fw-bold">Monto</Form.Label>
              <Form.Control
                type='number'
                value={solicitud.monto || ''}
                readOnly
              />
            </Form.Group>
          </div>
        </div>
        </Form>
      </div>
      <Form className='reviewed-step-form' onSubmit={handleSubmit}>
        <div className='row'>
          <div className='col-diagnostic'>
            <Form.Group controlId='diagnostic'>
              <Form.Label className="fw-bold">Resumen del trabajo</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                type='text'
                placeholder='Ingrese el resumen'
                name='Resumen'
                value={localResumen}
                onChange={(e) => { setLocalResumen(e.target.value); handleChange?.(e); }}
                required
              />
              {errors.Resumen && <p className="error-text" style={{ color: 'red', fontSize: 'small' }}>{errors.Resumen}</p>}
            </Form.Group>
          </div>
          <div className='button-group approvedStep'>
            <Button variant='danger' className='button' onClick={cancelStep}>
              Cancelar
            </Button>
            <Button variant='success' type='submit' className='button' disabled={!isFormValid}>
              Enviar resumen
            </Button>
          </div>
        </div>
      </Form>
    </>
  );
}

export default ApprovedStep;