import React from 'react';
import RequestForm from '../components/RequestsForm/RequestForm';
import '../styles/RequestPageLayout.css';

export default function RepairRequest() {
    return (
        <div className='p-repairsRequest'>
            <div className='p-repairsRequest titulo'><h2>Solicita tu reparacion</h2> </div>
            <RequestForm />
        </div>
    );
}