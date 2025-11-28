import React, { useEffect, useState, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import '../ModalJoin.css';
import apiService from '../../services/axiosConfig.jsx';
import { useBackendURL } from '../../contexts/BackendURLContext';
import AuthContext from '../../contexts/AuthContext.jsx';

export default function UserAddressModal({ show, onClose, onSubmit, initialData }) {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        defaultValues: {
            calle: '',
            numero: '',
            piso: '',
            departamento: '',
            codigo_postal: '',
            provincia: '',
            localidad: '',
            id_localidad: ''
        }
    });

    const [provincias, setProvincias] = useState([]);
    const [provinciaSeleccionada, setProvinciaSeleccionada] = useState('');
    const [localidadesFiltradas, setLocalidadesFiltradas] = useState([]);
    const backendURL = useBackendURL();
    const { userToken } = useContext(AuthContext);

    useEffect(() => {
        if (!show) return;
        let mounted = true;

        const fetchProvinciasAndMaybeLocalidades = async () => {
            try {
                const resp = await apiService.getStates();
                if (!mounted) return;
                setProvincias(resp.data);

                if (initialData && initialData.provincia) {
                    const foundProv = resp.data.find((p) => p.nombre === initialData.provincia);
                    if (foundProv) {
                        const provId = foundProv.id;
                        setProvinciaSeleccionada(provId.toString());
                        setValue('provincia', provId.toString());

                        try {
                            const locResp = await apiService.getLocalityByStateId(provId);
                            if (!mounted) return;
                            setLocalidadesFiltradas(locResp.data);
                            if (initialData.localidad) {
                                setValue('id_localidad', initialData.localidad.toString());
                            }
                        } catch (err) {
                            console.error('Error fetching localidades for provincia:', err);
                        }
                    }
                }

            } catch (err) {
                console.error('Error fetching provincias:', err);
            }
        };

        fetchProvinciasAndMaybeLocalidades();
        return () => { mounted = false; };
    }, [show, initialData, backendURL, userToken]);

    useEffect(() => {
        if (initialData) {
            reset({
                calle: initialData.calle || '',
                numero: initialData.numero || '',
                piso: initialData.piso || '',
                departamento: initialData.departamento || '',
                codigo_postal: initialData.codigo_postal || '',
                provincia: '',
                id_localidad: ''
            });
        } else {
            reset({ calle: '', numero: '', piso: '', departamento: '', codigo_postal: '', provincia: '', id_localidad: '' });
            setProvinciaSeleccionada('');
            setLocalidadesFiltradas([]);
        }
    }, [initialData, show, reset]);

    const onFormSubmit = (data) => {
        if (data.id_localidad) data.id_localidad = Number(data.id_localidad);
        onSubmit(data);
    };

    const handleProvinciaChange = async (e) => {
        const val = e.target.value;
        setProvinciaSeleccionada(val);
        setValue('provincia', val);
        if (!val) {
            setLocalidadesFiltradas([]);
            setValue('id_localidad', '');
            return;
        }
        try {
            const resp = await apiService.getLocalityByStateId(Number(val));
            setLocalidadesFiltradas(resp.data);
            setValue('id_localidad', '');
        } catch (err) {
            console.error('Error fetching localidades:', err);
            setLocalidadesFiltradas([]);
            setValue('id_localidad', '');
        }
    };

    const handleLocalidadChange = (e) => {
        setValue('id_localidad', e.target.value);
    };

    return (
        <Modal size="xl" show={show} onHide={onClose} dialogClassName="custom-modal" centered>
            <Modal.Header closeButton>
                <Modal.Title>{initialData ? 'Modificar domicilio' : 'Agregar domicilio'}</Modal.Title>
            </Modal.Header>

            <Form onSubmit={handleSubmit(onFormSubmit)}>
                <Modal.Body>
                    <div className="form-group-inline">
                        <Form.Group className="form-group" controlId="provincia">
                            <Form.Label>Provincia</Form.Label>
                            <Form.Select
                                {...register('provincia', { required: '*Campo obligatorio' })}
                                value={provinciaSeleccionada}
                                onChange={handleProvinciaChange}
                            >
                                <option value="">Seleccione una provincia</option>
                                {provincias.map((p) => (
                                    <option key={p.id} value={p.id}>{p.nombre}</option>
                                ))}
                            </Form.Select>
                            {errors.provincia && <p className="error-message">{errors.provincia.message}</p>}
                        </Form.Group>

                        <Form.Group className="form-group" controlId="localidad">
                            <Form.Label>Localidad</Form.Label>
                            <Form.Select
                                {...register('id_localidad', { required: '*Campo obligatorio' })}
                                onChange={handleLocalidadChange}
                                disabled={!provinciaSeleccionada}
                            >
                                <option value="">Seleccione una localidad</option>
                                {localidadesFiltradas.map((l) => (
                                    <option key={l.id} value={l.id}>{l.nombre}</option>
                                ))}
                            </Form.Select>
                            {errors.id_localidad && <p className="error-message">{errors.id_localidad.message}</p>}
                        </Form.Group>
                    </div>

                    <div className="form-group-inline">
                        <Form.Group className="form-group" controlId="calle">
                            <Form.Label>Calle</Form.Label>
                            <Form.Control type="text" {...register('calle', { required: '*Campo obligatorio' })} />
                            {errors.calle && <p className="error-message">{errors.calle.message}</p>}
                        </Form.Group>

                        <Form.Group className="form-group" controlId="numero">
                            <Form.Label>Número</Form.Label>
                            <Form.Control type="number" {...register('numero', { required: '*Campo obligatorio', valueAsNumber: true })} />
                            {errors.numero && <p className="error-message">{errors.numero.message}</p>}
                        </Form.Group>
                    </div>

                    <div className="form-group-inline">
                        <Form.Group className="form-group" controlId="piso">
                            <Form.Label>Piso</Form.Label>
                            <Form.Control type="text" {...register('piso')} />
                            {errors.piso && <p className="error-message">{errors.piso.message}</p>}
                        </Form.Group>

                        <Form.Group className="form-group" controlId="departamento">
                            <Form.Label>Departamento</Form.Label>
                            <Form.Control type="text" {...register('departamento')} />
                            {errors.departamento && <p className="error-message">{errors.departamento.message}</p>}
                        </Form.Group>
                    </div>

                    <div className="form-group-inline">
                        <Form.Group className="form-group" controlId="codigo_postal">
                            <Form.Label>Código postal</Form.Label>
                            <Form.Control type="text" {...register('codigo_postal', { required: '*Campo obligatorio' })} />
                            {errors.codigo_postal && <p className="error-message">{errors.codigo_postal.message}</p>}
                        </Form.Group>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>Cancelar</Button>
                    <Button variant="primary" type="submit">Guardar</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}
