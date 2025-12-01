import { useEffect, useState, useRef } from "react";
import { Form, Button, ListGroup } from 'react-bootstrap';
import AnimatedButton from "../../common/AnimatedButton.jsx";
import "./approvedStep.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardCheck, faInfoCircle, faTasks } from '@fortawesome/free-solid-svg-icons';

function ApprovedStep({ solicitud, nextStep, cancelStep, handleChange }) {
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [localResumen, setLocalResumen] = useState('');
  const [selectedTasks, setSelectedTasks] = useState(new Set());


  useEffect(() => {
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
      <div className="approved-step-container fade-in-animation">
        {solicitud.tipoServicio !== 'Reparación' && solicitud.mantenimiento && (
          <div className="info-card p-4 mb-4">
            <h6 className="section-label mb-3">
              <FontAwesomeIcon icon={faTasks} className="me-2 text-primary" />
              Checklist de Verificación
            </h6>
            <div className="d-flex flex-column gap-2">
              {solicitud.mantenimiento.checklist.map(item => {
                const isChecked = selectedTasks.has(item.id);
                return (
                  <div key={item.id}
                    onClick={() => toggleTask(item.id)}
                    className={`d-flex align-items-center p-2 rounded border transition-all ${isChecked ? 'bg-primary-subtle border-primary' : 'bg-white border-light-subtle'
                      }`}
                    style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                  >
                    <div className="flex-grow-1 d-flex justify-content-between align-items-center">
                      <span className={`fw-small ${isChecked ? 'text-primary' : 'text-dark'}`}>
                        {item.descripcion}
                      </span>
                      {item.obligatorio && (
                        <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-10 rounded-pill ms-2">
                          Obligatorio
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div >
      <div className="info card p-4">
        <Form className='reviewed-step-form' onSubmit={handleSubmit}>
          <div className='row'>
            <div className='col-12'>
              <Form.Group controlId='diagnostic'>
                <Form.Label className="section-label mb-2" style={{ color: '#6f42c1' }}>
                  <FontAwesomeIcon icon={faClipboardCheck} className="me-2" />
                  Resumen de trabajo Realizado
                </Form.Label>
                <Form.Control
                  as='textarea'
                  rows={4}
                  type='text'
                  placeholder='Describa detalladamente la solución aplicada, repuestos utilizados y pruebas de funcionamiento...'
                  name='Resumen'
                  value={localResumen}
                  onChange={(e) => { setLocalResumen(e.target.value); handleChange?.(e); }} F
                  className="border-0 bg-light p-3 shadow-sm"
                  style={{ resize: 'none', borderRadius: '12px', fontSize: '0.95rem' }}
                  required
                />
                <div className="d-flex justify-content-between mt-2">
                  <Form.Text className="text-muted d-flex align-items-center">
                    <FontAwesomeIcon icon={faInfoCircle} className="me-1 small" />
                    Este resumen será enviado al cliente por email.
                  </Form.Text>

                  {errors?.Resumen && (
                    <span className="text-danger small fw-bold">
                      {errors.Resumen}
                    </span>
                  )}
                </div>
              </Form.Group>
            </div>
            <div className="row mt-4 pt-3 border-top">
              <div className='buttons-container w-100'>
                <AnimatedButton variant='danger' className='button' onClick={cancelStep}>
                  Cancelar
                </AnimatedButton>
                <AnimatedButton variant='success' type='submit' className='button' disabled={!isFormValid}>
                  Enviar resumen
                </AnimatedButton>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
}

export default ApprovedStep;