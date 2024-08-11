import React, { memo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getCall } from '../../utils/commonfunctions/apicallactions';
import { DEFAULT_IMAGE } from '../../utils/globalConstants';

import './PatientInfoCenter.scss';

const PatientInfoCenter = ({}) => {
  const infoObjInitialState = {
    patientDetails: '',
    doctorDetails: '',
    clinicDetails: '',
    patientProfilePhoto: DEFAULT_IMAGE,
  };
  const [info, setInfo] = useState(infoObjInitialState);
  const [resp, setRes] = useState({});

  const { patientID } = useParams();

  //api function for getting the patient Details
  const getPatientNUserDetails = async () => {
    const data = await getCall('GET_PATIENT_N_USER_INFO', [patientID]);
    const patientNUsers = data?.result === 'success' ? data.data : {};
    setRes(patientNUsers);
    const { clinic, doctor, patient, patientProfilePhoto } = patientNUsers;
    setInfo(prev => ({
      ...prev,
      patientDetails: patient?.userName ?? '',
      doctorDetails: doctor?.userName ?? '',
      clinicDetails: clinic?.userName ?? '',
      patientProfilePhoto: patientProfilePhoto ?? DEFAULT_IMAGE,
    }));
  };

  useEffect(() => {
    getPatientNUserDetails();
  }, [patientID]);

  return (
    <div className="displayFlex">
      <aside className="right-section-layout">
        <div className="right-section-container">
          <div className="right-profile-photo">
            <div className="img-container">
              <img src={info.patientProfilePhoto} alt={'Patient Photo'}></img>
            </div>
            {/* <div className='side-logo'></div> */}
            <div className="side-web-name"></div>
          </div>
          <div className="details-container">
            {Object.entries({
              patient: 'Patient',
              doctor: 'Doctor',
              clinic: 'Clinic',
            }).map(([key, label]) => {
              return (
                <div className="info-div" key={key + label}>
                  <span className="info-heading">{label + ':'}</span>
                  <span className="info-detail">{info[key + 'Details']}</span>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
};

export default memo(PatientInfoCenter);
