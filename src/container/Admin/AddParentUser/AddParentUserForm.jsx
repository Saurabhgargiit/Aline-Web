import { useContext, useEffect, useState } from 'react';
import { AddParentUserContext } from './Context/AddParentUserContext';
import { FormErrors } from '../../../utils/globalConstants';

const AddParentUserForm = ({}) => {
    const { passwordErr, nameErr, emailErr } = FormErrors;
    const { addType, setFormValid, setUserObj, setDetailUserObj, dataToModal, isEdit } =
        useContext(AddParentUserContext);

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const [nameValid, setNameValid] = useState(false);
    const [emailVaild, setEmailVaild] = useState(false);
    const [passValid, setPassValid] = useState(false);

    const objSetter = (field, value) => {
        setUserObj((prevState) => {
            return {
                ...prevState,
                [field]: value,
            };
        });
    };

    const detailObjSetter = (field, value) => {
        setDetailUserObj((prevState) => {
            return {
                ...prevState,
                [field]: value,
            };
        });
    };

    const inputHandler = (e, inputType, firstLoad = false) => {
        let value;
        if (firstLoad && isEdit) {
            //for edit flow, data is passed in 'e' variable
            value = e;
        } else {
            value = e.target.value;
        }
        switch (inputType) {
            case 'name':
                setName(() => value);
                setNameValid(value.trim().length > 0);
                objSetter(inputType, value);
                break;
            case 'userAddress':
                setAddress(() => value);
                detailObjSetter(inputType, value);
                break;
            case 'userCity':
                setCity(() => value);
                detailObjSetter(inputType, value);
                break;
            case 'mobileNo':
                setMobileNo(() => value);
                detailObjSetter(inputType, value);
                break;
            case 'email':
                setEmail(() => value);
                setEmailVaild(value.includes('@'));
                objSetter(inputType, value);
                break;
            case 'password':
                setPass(() => value);
                setPassValid(value.length > 5 && value.length < 13);
                objSetter(inputType, value);
                break;
            default:
                // This is the default case, which gets executed if `inputType` does not match any of the above.
                console.log('Unhandled input type:', inputType);
                break;
        }
    };

    useEffect(() => {
        if (emailVaild && nameValid && passValid) {
            setFormValid(true);
        } else {
            setFormValid(false);
        }
    }, [emailVaild, nameValid, passValid]);

    //UseEffect to input field if its a edit flow
    useEffect(() => {
        if (isEdit) {
            if (dataToModal.name) {
                inputHandler(dataToModal.name, 'name', true);
            }
            if (dataToModal.userAddress) {
                inputHandler(dataToModal.userAddress, 'userAddress', true);
            }
            if (dataToModal.userCity) {
                inputHandler(dataToModal.userCity, 'userCity', true);
            }
            if (dataToModal.mobileNo) {
                inputHandler(dataToModal.mobileNo, 'mobileNo', true);
            }
            if (dataToModal.email) {
                inputHandler(dataToModal.email, 'email', true);
            }
            //makePassValid flag true by default
            setPassValid(true);
        }
    }, [isEdit]);

    return (
        <div>
            <div className='label-input-container'>
                <label htmlFor='parent-name'>{addType} Name*</label>
                <input
                    id='parent-name'
                    type='text'
                    onChange={(e) => inputHandler(e, 'name')}
                    value={name}
                    required
                ></input>
            </div>
            <div className={`error-Msg height1rem ${nameValid ? 'noVisible' : ''}`}>{nameErr}</div>
            <div className='label-input-container mb-3'>
                <label htmlFor='parent-address'>Address</label>
                <input
                    id='parent-address'
                    type='text'
                    onChange={(e) => inputHandler(e, 'userAddress')}
                    value={address}
                ></input>
            </div>
            <div className='label-input-container mb-3'>
                <label htmlFor='parent-city'>City</label>
                <input
                    id='parent-city'
                    type='text'
                    onChange={(e) => inputHandler(e, 'userCity')}
                    value={city}
                ></input>
            </div>
            <div className='label-input-container mb-3'>
                <label htmlFor='parent-mobile'>Phone No.</label>
                <input
                    id='parent-mobile'
                    type='tel'
                    onChange={(e) => inputHandler(e, 'mobileNo')}
                    value={mobileNo}
                ></input>
            </div>
            <div className='label-input-container mb-3'>
                <label htmlFor='parent-role'>Role*</label>
                <input id='parent-role' type='dropdown' disabled value={addType}></input>
            </div>
            {addType === 'Doctor' && (
                <div className='label-input-container mb-3'>
                    <label htmlFor='clinic-name'>Clinic Name*</label>
                    <input
                        id='clinic-name'
                        type='dropdown'
                        disabled
                        value={dataToModal?.name}
                    ></input>
                </div>
            )}
            <div className='label-input-container'>
                <label htmlFor='parent-email'>Email*</label>
                <input
                    id='parent-email'
                    type='email'
                    onChange={(e) => inputHandler(e, 'email')}
                    value={email}
                    required
                ></input>
            </div>
            <div className={`error-Msg height1rem ${emailVaild ? 'noVisible' : ''}`}>
                {emailErr}
            </div>
            {!isEdit && (
                <div className='label-input-container'>
                    <label htmlFor='parent-pass'>Password*</label>
                    <input
                        id='parent-pass'
                        type='text'
                        onChange={(e) => inputHandler(e, 'password')}
                        value={pass}
                        required
                    ></input>
                </div>
            )}
            {!isEdit && (
                <div className={`error-Msg height1rem ${passValid ? 'noVisible' : ''} mb-2`}>
                    {passwordErr}
                </div>
            )}
        </div>
    );
};

export default AddParentUserForm;
