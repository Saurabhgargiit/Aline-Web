import Footer from '../common/Footer';
import Header from '../common/Header';
import Form from 'react-bootstrap/Form';
import './PatientDetailsAddEditLayout.scss';
import ScanningInputsForm from './ScanningInputsForm';
import FormViewTabs from './FormViewTabs';

const PatientDetailsAddEditLayout = (props) => {
  return (
    <>
      <Header title={'Enter Details'} />
      <FormViewTabs />
      <Footer />
    </>
  );
};

export default PatientDetailsAddEditLayout;
