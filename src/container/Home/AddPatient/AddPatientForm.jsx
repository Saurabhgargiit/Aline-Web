import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { FormErrors, roles } from '../../../utils/globalConstants';
import Dropdown from '../../../components/Dropdown/Dropdown';
import { useSelector } from 'react-redux';
import { CommonUtils } from '../../../utils/commonfunctions/commonfunctions';
import { getCall } from '../../../utils/commonfunctions/apicallactions';

const AddPatientForm = forwardRef(({ isEdit, initialData }, ref) => {
    const { nameErr, pastDateError, emptyField, ageError } = FormErrors;

    const [formData, setFormData] = useState({
        name: '',
        doctor: '',
        clinic: '',
        gender: '',
        age: '',
        nationality: '',
        dateOfScan: CommonUtils.formatDate(new Date()),
    });

    const [formValidity, setFormValidity] = useState({
        nameValid: false,
        doctorValid: false,
        clinicValid: false,
        genderValid: false,
        ageValid: false,
        dateOfScanValid: true, // Assume valid initially until a date is chosen
    });

    const [doctorList, setDoctorList] = useState([]);
    const [clinicList, setClinicList] = useState([]);

    const fetchedUserInfo = useSelector((state) => state.userInfoReducer?.userInfo?.data);
    const {
        id: userID,
        role: [role],
    } = fetchedUserInfo;

    const validateField = (name, value) => {
        switch (name) {
            case 'name':
            case 'doctor':
            case 'clinic':
            case 'gender':
                return value.trim() !== '';
            case 'age':
                // Ensure the age is a valid number between 1 and 120
                const ageNum = parseInt(value, 10);
                return !isNaN(ageNum) && ageNum > 0 && ageNum <= 120;
            case 'dateOfScan':
                // Ensure the date is not in the past
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
                handleInputChange(key, value);
            });
        }
    }, [isEdit, initialData]);

    useEffect(() => {
        const fetchDoctorsAndClinics = async () => {
            if (CommonUtils.isAdmin(role) || CommonUtils.isLab(role)) {
                await getAllDoctors();
                await getAllClinics();
            }
        };
        fetchDoctorsAndClinics();
    }, [role]);

    let genderList = [
        { key: 'select', id: 'select', value: '', label: '--Please choose an option--' },
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
            { key: 'select', id: 'select', value: '', label: '--Please choose an option--' },
            ...doctors.map((el) => ({
                key: el.id,
                id: el.id,
                value: el.id,
                label: `${el.name} (${el.email})`,
            })),
        ];
        setDoctorList(() => doctorWithLabels);
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
            { key: 'select', id: 'select', value: '', label: '--Please choose an option--' },
            ...clinics.map((el) => ({
                key: el.id,
                id: el.id,
                value: el.id,
                label: `${el.name} (${el.email})`,
            })),
        ];
        setClinicList(clinicWithLabels);
    };

    const handleSubmit = (event) => {
        if (event) {
            event.preventDefault();
        }
        const allValid = Object.values(formValidity).every(Boolean);
        if (allValid) {
            console.log('Form Data:', formData);
            // Submit logic here
        } else {
            console.error('Validation errors:', formValidity);
        }
    };

    useImperativeHandle(ref, () => {
        return { submitForm: () => handleSubmit() };
    });

    return (
        <form onSubmit={handleSubmit} ref={ref}>
            <div className='label-input-container'>
                <label htmlFor='patient-name'>Patient Name*</label>
                <input
                    id='patient-name'
                    type='text'
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
            <div className='label-input-container'>
                <label htmlFor='doctor-name'>Doctor Name*</label>
                <Dropdown
                    id='doctor-name'
                    options={doctorList}
                    selectedValue={formData.doctor}
                    onChangeCallBk={(value) => handleInputChange('doctor', value)}
                />
            </div>
            <div
                className={`error-Msg height1rem ${
                    formValidity.doctorValid && formData.doctor ? 'noVisible' : ''
                } mb-1`}
            >
                {emptyField}
            </div>

            {/* Clinic Dropdown */}
            <div className='label-input-container'>
                <label htmlFor='clinic-name'>Clinic Name*</label>
                <Dropdown
                    id='clinic-name'
                    options={clinicList}
                    selectedValue={formData.clinic}
                    onChangeCallBk={(value) => handleInputChange('clinic', value)}
                />
            </div>
            <div
                className={`error-Msg height1rem ${
                    formValidity.clinicValid && formData.clinic ? 'noVisible' : ''
                }`}
            >
                {emptyField}
            </div>

            {/* Date of Scan */}
            <div className='label-input-container'>
                <label htmlFor='date-scan'>Date of Scan*</label>
                <input
                    id='date-scan'
                    type='date'
                    value={formData.dateOfScan}
                    min={formData.dateOfScan}
                    onChange={(e) => handleInputChange('dateOfScan', e.target.value)}
                ></input>
            </div>
            <div
                className={`error-Msg height1rem ${
                    formValidity.dateOfScanValid && formData.dateOfScan ? 'noVisible' : ''
                }`}
            >
                {pastDateError}
            </div>

            {/* Gender */}
            <div className='label-input-container'>
                <label htmlFor='gender'>Gender*</label>
                <Dropdown
                    id='gender'
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
            <div className='label-input-container'>
                <label htmlFor='age'>Age*</label>
                <input
                    id='age'
                    type='number'
                    value={formData.age}
                    min='1' // Set minimum value to 1
                    max='120' // Set maximum value to 120
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
            <div className='label-input-container mb-4'>
                <label htmlFor='nationality'>Nationality</label>
                <input
                    id='nationality'
                    type='text'
                    value={formData.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                ></input>
            </div>
        </form>
    );
});

export default AddPatientForm;
