
import './FillerPage.scss';

const FillerPage =({message}) =>{
    return (
    <div>
        <div className="PatientDetailsContainer">
            <div className="patient-details-tabs-container">
            <div className="patientAddEditTopContainer  mb-4">
            <div className="patientAddEditContainer no-plan">
                <h1>{message}</h1>
                </div>
                </div>
            </div>
        </div>
    </div>)

}

export default FillerPage;