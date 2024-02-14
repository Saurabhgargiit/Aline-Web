import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ScanningInputsForm from './ScanningInputsForm';
import LabInputs from './LabInputs';
import './FormViewTabs.scss';
import TreatmentInputs from './TreatmentInputs';

function FormViewTabs() {
  return (
    <Tabs
      defaultActiveKey='home'
      id='justify-tab-example'
      className='patient-details-tabs-container'
      justify
    >
      <Tab eventKey='home' title='Scanning Inputs'>
        <ScanningInputsForm />
      </Tab>
      <Tab eventKey='profile' title='Lab Inputs'>
        <LabInputs />
      </Tab>
      <Tab eventKey='longer-tab' title='Treatment Inputs'>
        <TreatmentInputs />
      </Tab>
    </Tabs>
  );
}

export default FormViewTabs;
