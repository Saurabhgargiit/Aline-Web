import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { FormErrors, roles } from '../../../utils/globalConstants';
import Dropdown from '../../../components/Dropdown/Dropdown';
import { useSelector } from 'react-redux';
import { CommonUtils } from '../../../utils/commonfunctions/commonfunctions';
import {
  getCall,
  postCall,
  putCall,
} from '../../../utils/commonfunctions/apicallactions';
import { toast, Bounce } from 'react-toastify';

const AddPatientForm = forwardRef(
  ({ isEdit, initialData, closeModal, setUserAdded }, ref) => {
    const { nameErr, pastDateError, emptyField, ageError } = FormErrors;

    const [formData, setFormData] = useState({
      name: '',
      doctorID: '',
      clinicID: '',
      gender: '',
      age: '',
      nationality: '',
      dateOfScan: CommonUtils.formatDate(new Date()),
    });

    const [formValidity, setFormValidity] = useState({
      nameValid: false,
      doctorIDValid: false,
      clinicIDValid: false,
      genderValid: false,
      ageValid: false,
      dateOfScanValid: true, // Assume valid initially until a date is chosen
    });

    const [doctorList, setDoctorList] = useState([]);
    const [clinicList, setClinicList] = useState([]);

    const fetchedUserInfo = useSelector(
      (state) => state.userInfoReducer?.userInfo?.data
    );
    const {
      id: userID,
      role: [role],
      name,
      email,
    } = fetchedUserInfo;

    const validateField = (name, value) => {
      switch (name) {
        case 'name':
        case 'doctorID':
        case 'clinicID':
        case 'gender':
          return value.trim() !== '';
        case 'age':
          // Ensure the age is a valid number between 1 and 120
          const ageNum = parseInt(value, 10);
          return !isNaN(ageNum) && ageNum > 0 && ageNum <= 120;
        case 'dateOfScan':
          if (isEdit) return !!value;
          // Ensure the date is not in the past while creating new patient
          const today = new Date();
          const selectedDate = new Date(value);
          return selectedDate >= today;
        default:
          return true;
      }
    };

    const handleInputChange = (field, value) => {
      const isValid = validateField(field, value);
      if (field === 'age' && !isValid) return;
      setFormData((prev) => ({ ...prev, [field]: value }));
      setFormValidity((prev) => ({ ...prev, [`${field}Valid`]: isValid }));
    };

    useEffect(() => {
      if (isEdit && initialData) {
        Object.entries(initialData).forEach(([key, value]) => {
          if (key === 'dateOfScan') {
            value = CommonUtils.formatDate(value);
          }
          handleInputChange(key, value);
        });
      }
    }, [isEdit, initialData]);

    useEffect(() => {
      const fetchDoctorsAndClinics = async () => {
        if (CommonUtils.isAdmin(role) || CommonUtils.isLab(role)) {
          await getAllDoctors();
          await getAllClinics();
        } else {
          if (CommonUtils.isClinic(role)) {
            setFormValidity((prev) => ({ ...prev, clinicIDValid: true }));
            setFormData((prev) => ({ ...prev, clinicID: userID }));
            const clinicData = [
              {
                key: 'cli' + userID,
                id: 'clin' + userID,
                value: userID,
                label: `${name} (${email})`,
              },
            ];
            setClinicList(clinicData);
            await getAllDoctors();
          } else {
            setFormValidity((prev) => ({ ...prev, doctorIDValid: true }));
            setFormData((prev) => ({ ...prev, doctorID: userID }));
            const doctorData = [
              {
                key: 'doc' + userID,
                id: 'doc' + userID,
                value: userID,
                label: `${name} (${email})`,
              },
            ];
            setDoctorList(doctorData);
            await getAllClinics();
          }
        }
      };
      fetchDoctorsAndClinics();
    }, [role]);

    let genderList = [
      {
        key: 'select',
        id: 'select',
        value: '',
        label: '--Please choose an option--',
      },
      { key: 'male', id: 'male', value: 'male', label: 'Male' },
      { key: 'female', id: 'female', value: 'female', label: 'Female' },
      { key: 'others', id: 'others', value: 'others', label: 'Others' },
    ];

    const getAllDoctors = async () => {
      const query = {
        role: roles.ROLE_DOCTOR,
        pageNumber: 0,
        pageSize: 2000,
        sortBy: 'name',
        sortDir: 'des',
      };
      const data = await getCall('GET_ALL_USERS', [], query);
      const doctors = data?.result === 'success' ? data.data.content : [];
      const doctorWithLabels = [
        {
          key: 'select',
          id: 'select',
          value: '',
          label: '--Please choose an option--',
        },
        ...doctors.map((el) => ({
          key: el.id,
          id: el.id,
          value: el.id,
          label: `${el.name} (${el.email})`,
        })),
      ];
      setDoctorList(() => doctorWithLabels);
      if (isEdit) {
        const value = doctorWithLabels.filter(
          (el) => el.id === initialData.doctorID
        );
        if (value.length !== 0) {
          handleInputChange(
            handleInputChange('doctorID', initialData.doctorID)
          );
        }
      }
    };

    const getAllClinics = async () => {
      const query = {
        role: roles.ROLE_CLINIC,
        pageNumber: 0,
        pageSize: 2000,
        sortBy: 'name',
        sortDir: 'des',
      };
      const data = await getCall('GET_ALL_USERS', [], query);
      const clinics = data?.result === 'success' ? data.data.content : [];
      const clinicWithLabels = [
        {
          key: 'select',
          id: 'select',
          value: '',
          label: '--Please choose an option--',
        },
        ...clinics.map((el) => ({
          key: el.id,
          id: el.id,
          value: el.id,
          label: `${el.name} (${el.email})`,
        })),
      ];
      setClinicList(clinicWithLabels);
      if (isEdit) {
        const value = clinicWithLabels.filter(
          (el) => el.id === initialData.clinicID
        );
        if (value.length !== 0) {
          handleInputChange(
            handleInputChange('clinicID', initialData.clinicID)
          );
        }
      }
    };

    const addPatientFn = () => {
      let payload = { ...formData };

      let params = {};

      if (!isEdit) {
        postCall(payload, 'CREATE_PATIENT', [], params).then((data) => {
          if (data.result === 'success') {
            toast.success(`Patient added successully`, {
              position: 'top-right',
              hideProgressBar: false,
              autoClose: 2000,
              closeOnClick: true,
              // pauseOnHover: true,
              theme: 'light',
              transition: Bounce,
            });
            setUserAdded(() => true);
            closeModal();
          } else if (data.result === 'error') {
            toast.error(data.error ?? 'data.error', {
              position: 'top-right',
              hideProgressBar: false,
              autoClose: 2000,
              closeOnClick: true,
              // pauseOnHover: true,
              theme: 'light',
              transition: Bounce,
            });
          }
          // setLoading(false);
        });
      } else {
        putCall(payload, 'UPDATE_PATIENT', [], params).then((data) => {
          if (data.result === 'success') {
            toast.success(`Patient modified successully`, {
              position: 'top-right',
              hideProgressBar: false,
              autoClose: 2000,
              closeOnClick: true,
              // pauseOnHover: true,
              theme: 'light',
              transition: Bounce,
            });
            setUserAdded(() => true);
            closeModal();
          } else if (data.result === 'error') {
            toast.error(data.error ?? 'data.error', {
              position: 'top-right',
              hideProgressBar: false,
              autoClose: 2000,
              closeOnClick: true,
              // pauseOnHover: true,
              theme: 'light',
              transition: Bounce,
            });
          }
          // setLoading(false);
        });
      }
    };

    const handleSubmit = (event) => {
      if (event) {
        event.preventDefault();
      }
      const allValid = Object.values(formValidity).every(Boolean);
      if (allValid) {
        addPatientFn();
      } else {
        console.error('Validation errors:', formValidity);
      }
    };

    useImperativeHandle(ref, () => {
      return { submitForm: () => handleSubmit() };
    });

    return (
      <form onSubmit={handleSubmit} ref={ref} id="add-patient-form">
        <div className="label-input-container">
          <label htmlFor="patient-name">Patient Name*</label>
          <input
            id="patient-name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
          ></input>
        </div>
        <div
          className={`error-Msg height1rem ${
            formValidity.nameValid && formData.name ? 'noVisible' : ''
          }`}
        >
          {nameErr}
        </div>

        {/* Doctor Dropdown  */}
        <div className="label-input-container">
          <label htmlFor="doctor-name">Doctor Name*</label>
          <Dropdown
            id="doctor-name"
            options={doctorList}
            selectedValue={formData.doctorID}
            onChangeCallBk={(value) => handleInputChange('doctorID', value)}
            disabled={CommonUtils.isDoctor(role)}
          />
        </div>
        <div
          className={`error-Msg height1rem ${
            formValidity.doctorIDValid && formData.doctorID ? 'noVisible' : ''
          } mb-1`}
        >
          {emptyField}
        </div>

        {/* Clinic Dropdown */}
        <div className="label-input-container">
          <label htmlFor="clinic-name">Clinic Name*</label>
          <Dropdown
            id="clinic-name"
            options={clinicList}
            selectedValue={formData.clinicID}
            onChangeCallBk={(value) => handleInputChange('clinicID', value)}
            disabled={CommonUtils.isClinic(role)}
          />
        </div>
        <div
          className={`error-Msg height1rem ${
            formValidity.clinicIDValid && formData.clinicID ? 'noVisible' : ''
          }`}
        >
          {emptyField}
        </div>

        {/* Date of Scan */}
        <div className="label-input-container">
          <label htmlFor="date-scan">Date of Scan*</label>
          <input
            id="date-scan"
            type="date"
            value={formData.dateOfScan}
            // min={formData.dateOfScan}
            onChange={(e) => handleInputChange('dateOfScan', e.target.value)}
          ></input>
        </div>
        <div
          className={`error-Msg height1rem ${
            formValidity.dateOfScanValid && formData.dateOfScan
              ? 'noVisible'
              : ''
          }`}
        >
          {pastDateError}
        </div>

        {/* Gender */}
        <div className="label-input-container">
          <label htmlFor="gender">Gender*</label>
          <Dropdown
            id="gender"
            options={genderList}
            selectedValue={formData.gender}
            onChangeCallBk={(value) => handleInputChange('gender', value)}
          />
        </div>
        <div
          className={`error-Msg height1rem ${
            formValidity.genderValid && formData.gender ? 'noVisible' : ''
          }`}
        >
          {emptyField}
        </div>

        {/* Age */}
        <div className="label-input-container">
          <label htmlFor="age">Age*</label>
          <input
            id="age"
            type="number"
            value={formData.age}
            min="1" // Set minimum value to 1
            max="120" // Set maximum value to 120
            onChange={(e) => handleInputChange('age', e.target.value)}
            // onWheel={handleWheel}
            onWheel={(e) => e.target.blur()}
          ></input>
        </div>
        <div
          className={`error-Msg height1rem ${
            formValidity.ageValid && formData.age ? 'noVisible' : ''
          }`}
        >
          {ageError}
        </div>

        {/* Nationality */}
        <div className="label-input-container mb-4">
          <label htmlFor="nationality">Nationality</label>
          <input
            id="nationality"
            type="text"
            value={formData.nationality}
            onChange={(e) => handleInputChange('nationality', e.target.value)}
          ></input>
        </div>
      </form>
    );
  }
);

export default AddPatientForm;
