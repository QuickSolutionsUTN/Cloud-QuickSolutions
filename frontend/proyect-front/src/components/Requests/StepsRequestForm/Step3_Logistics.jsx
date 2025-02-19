import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPerson, faTruck } from '@fortawesome/free-solid-svg-icons';
import ApiDeliveryForm from './ApiDelivery.jsx';

export default function StepLogistics({ formData, control, errors }) {

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
                Servicio de Logística
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        />
      </div>

      {formData?.logisticsData?.conLogistica && (
        <ApiDeliveryForm
          formData={formData}
          control={control}
          errors={errors}
        />
      )}
    </div>
  );
}