import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import LabInputs from './LabInputs';
import TreatmentInputs from './TreatmentInputs';
import ComplaintNHistoryForm from './ComplaintNHistoryForm';

import './FormViewTabs.scss';
import './PatientDetailsAddEditLayout.scss';

function FormViewTabs() {
    return (
        <Tabs
            defaultActiveKey='home'
            id='justify-tab-example'
            className='patient-details-tabs-container'
            justify
        >
            <Tab eventKey='home' title='Complaint & History'>
                <ComplaintNHistoryForm />
            </Tab>
            <Tab eventKey='profile' title='Treatment Goal'>
                <LabInputs />
            </Tab>
            <Tab eventKey='longer-tab' title='Photos & Scans'>
                <TreatmentInputs />
            </Tab>
        </Tabs>
    );
}

export default FormViewTabs;
