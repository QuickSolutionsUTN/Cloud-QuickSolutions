import React, { useEffect, useState } from 'react';
import { Controller } from 'react-hook-form';
import { ToggleButtonGroup, ToggleButton, Modal, Form, Button, Toast, ToastContainer } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPerson, faTruck } from '@fortawesome/free-solid-svg-icons';
import apiService from '../../../services/axiosConfig.jsx';
import AddressCard from '../../users/UserAddressCard.jsx';
import { useContext } from 'react';
import AuthContext from '../../../contexts/AuthContext.jsx';

export default function StepLogistics({ formData, control, setValue }) {

  const { user } = useContext(AuthContext);
  const [userData, setUserData] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const [selected, setSelected] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('Obteniendo datos del usuario...', user.id);
        const response = await apiService.getUserProfile(user.id);
        console.log('Datos recibidos:', response.data);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [ user, ]);

  const handleCardClick = () => {
    // Mark that logistics (domicilio) will be used for the request
    if (setValue) {
      setValue('logisticsData.conLogistica', true);

      // Populate basic address fields if available
      if (domicilio) {
        setValue('logisticsData.street', domicilio?.calle || '');
        setValue('logisticsData.number', domicilio?.numero || domicilio?.numero_calle || '');
        setValue('logisticsData.floor', domicilio?.piso || '');
        setValue('logisticsData.apartment', domicilio?.departamento || '');
        setValue('logisticsData.cityId', domicilio?.localidad_id || domicilio?.idLocalidad || '');
        setValue('logisticsData.stateId', domicilio?.provincia_id || '');
        setValue('logisticsData.zipCode', domicilio?.codigo_postal || '');
      }

      setSelected(true);
      setShowToast(true);
    }
  }

  const domicilio = userData.domicilio ?? null;

  useEffect(() => {
    // If the toggle is switched off, clear selection
    if (!formData?.logisticsData?.conLogistica) {
      setSelected(false);
    }
  }, [formData?.logisticsData?.conLogistica]);

  return (
    <div>
      <div className="row mb-3">
        <h6>Seleccione el tipo de envío</h6>
        <Controller
          name="logisticsData.conLogistica"
          control={control}
          defaultValue={formData?.logisticsData.conLogistica || false}
          render={({ field }) => (
            <ToggleButtonGroup
              {...field}
              type="radio"
              value={field.value ? "logistica" : "particular"}
              onChange={(value) => { field.onChange(value === "logistica" ? true : false); }}
            >
              <ToggleButton id="particular" value="particular" variant="outline-primary">
                <FontAwesomeIcon icon={faPerson} className="me-2" />
                Envío Particular
              </ToggleButton>
              <ToggleButton id="logistica" value="logistica" variant="outline-primary">
                <FontAwesomeIcon icon={faTruck} className="me-2" />
                Servicio a domicilio
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        />
      </div>

      {formData?.logisticsData?.conLogistica && (
        <>
          <AddressCard
            street={domicilio?.calle || 'No especificado'}
            province={domicilio?.provincia || 'No especificado'}
            locality={domicilio?.localidad_nombre || 'No especificado'}
            zipCode={domicilio?.codigo_postal || 'No especificado'}
            floor={domicilio?.piso || 'No especificado'}
            department={domicilio?.departamento || 'No especificado'}
            onClick={handleCardClick}
            selected={selected}
          />

        </>
      )}
    </div>
  );
}