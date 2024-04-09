import { useContext, useEffect, useState } from 'react';
import { AddParentUserContext } from '../../Admin/AddParentUser/Context/AddParentUserContext';
import { FormErrors } from '../../../utils/globalConstants';
import { getCall } from '../../../utils/commonfunctions/apicallactions';
import Dropdown from '../../../components/Dropdown/Dropdown';

const AddExistingDoctorForm = ({}) => {
    const { emptyField } = FormErrors;
    const { addType, setFormValid, setUserObj, setDetailUserObj, dataToModal } =
        useContext(AddParentUserContext);

    const [doctor, setDoctor] = useState('');
    const [doctorList, setDoctorList] = useState([]);

    const [doctorValid, setDoctorValid] = useState(false);

    // const objSetter = (field, value) => {
    //     setUserObj((prevState) => {
    //         return {
    //             ...prevState,
    //             [field]: value,
    //         };
    //     });
    // };

    const selectHandler = (value) => {
        const doctorObj = doctorList.find((el) => el.value === value);
        setDoctor(() => value);
        if (value !== '') {
            setDoctorValid(() => true);
            setUserObj((prevState) => doctorObj);
        } else {
            setDoctorValid(() => false);
            setUserObj((prevState) => {});
        }
    };

    const getAllDoctors = async () => {
        const query = {
            role: 'ROLE_DOCTOR',
            pageNumber: 0,
            pageSize: 2000,
            sortBy: 'name',
            sortDir: 'des',
        };
        const data = await getCall('GET_ALL_USERS', [], query);
        const { content: doctors } = data?.data;
        const doctorWithLabals = doctors.map((el, i) => {
            return { key: el.id, id: el.id, value: el.name, label: el.name };
        });
        doctorWithLabals.unshift({
            key: 'select',
            id: 'select',
            value: '',
            label: '--Please choose an option--',
        });
        console.log(doctorWithLabals);
        setDoctorList(() => doctorWithLabals);
    };

    useEffect(() => {
        getAllDoctors();
    }, []);

    useEffect(() => {
        if (doctorValid) {
            setFormValid(() => true);
        } else {
            setFormValid(() => false);
        }
    }, [doctorValid]);

    return (
        <div>
            <div className='label-input-container mb-2'>
                <label htmlFor='parent-name'>Clinic Name*</label>
                <input id='parent-name' type='text' value={dataToModal.name} disabled></input>
            </div>

            <div className='label-input-container'>
                <label htmlFor='parent-pass'>Doctor*</label>
                <Dropdown
                    options={doctorList}
                    onChangeCallBk={selectHandler}
                    selectedValue={doctor}
                />
            </div>

            <div className={`error-Msg height1rem ${doctorValid ? 'noVisible' : ''} mb-2`}>
                {emptyField}
            </div>
        </div>
    );
};

export default AddExistingDoctorForm;
