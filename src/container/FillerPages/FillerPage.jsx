import Button from '../../components/Button/Button';

import './FillerPage.scss';

const FillerPage =({message, btnDetails}) =>{

    return (
        <div>
            <div className="PatientDetailsContainer">
                <div className="patient-details-tabs-container">
                    <div className="patientAddEditTopContainer  mb-4">
                        <div className="patientAddEditContainer no-plan">
                            <h1>{message}</h1>
                            {btnDetails && Object.keys(btnDetails).length >0 && <Button {...btnDetails}/>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FillerPage;