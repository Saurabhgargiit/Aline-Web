import Footer from "../common/Footer";
import Header from "../common/Header";
import Form from 'react-bootstrap/Form';
import "./PatientDetailsContainer.scss";
import ScanningInputsForm from "./ScanningInputsForm";
import FormViewTabs from "./FormViewTabs";

const PatientDetailsContainer = (props) => {
    return (
        <>
            <Header title={"Enter Details"} />
            <FormViewTabs />
            <Footer />
        </>
    );
}

export default PatientDetailsContainer;