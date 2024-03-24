import { useContext, useEffect, useState } from 'react';
import { AddParentUserContext } from './Context/AddParentUserContext';
import { FormErrors } from '../../../utils/globalConstants';

const AddParentUserForm = ({ addType, isEdit }) => {
    const { passwordErr, nameErr, emailErr } = FormErrors;

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');

    const [nameValid, setNameValid] = useState(false);
    const [emailVaild, setEmailVaild] = useState(false);
    const [passValid, setPassValid] = useState(false);

    const ctx = useContext(AddParentUserContext);
    // console.log({ name, address, city, phone, email, pass });

    useEffect(() => {
        if (emailVaild && nameValid && passValid) {
            ctx.setFormValid(true);
        } else {
            ctx.setFormValid(false);
        }
    }, [emailVaild, nameValid, passValid]);

    const objSetter = (field, value) => {
        ctx.setUserObj((prevState) => {
            return {
                ...prevState,
                [field]: value,
            };
        });
    };

    const inputHandler = (e, inputType) => {
        const { value } = e.target;
        switch (inputType) {
            case 'name':
                setName(() => value);
                if (value.trim().length > 0) {
                    setNameValid(true);
                } else {
                    setNameValid(false);
                }
                break;
            case 'address':
                setAddress(() => value);
                break;
            case 'city':
                setCity(() => value);
                break;
            case 'phone':
                setPhone(() => value);
                break;
            case 'email':
                setEmail(() => value);
                if (value.includes('@')) {
                    setEmailVaild(true);
                } else {
                    setEmailVaild(false);
                }
                break;
            case 'password':
                setPass(() => value);
                if (value.length > 5 && value.length < 13) {
                    setPassValid(true);
                } else {
                    setPassValid(false);
                }
                break;
            default:
                break;
        }
        objSetter(inputType, value);
    };

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
                    onChange={(e) => inputHandler(e, 'address')}
                    value={address}
                ></input>
            </div>
            <div className='label-input-container mb-3'>
                <label htmlFor='parent-city'>City</label>
                <input
                    id='parent-city'
                    type='text'
                    onChange={(e) => inputHandler(e, 'city')}
                    value={city}
                ></input>
            </div>
            <div className='label-input-container mb-3'>
                <label htmlFor='parent-mobile'>Phone No.</label>
                <input
                    id='parent-mobile'
                    type='tel'
                    onChange={(e) => inputHandler(e, 'phone')}
                    value={phone}
                ></input>
            </div>
            <div className='label-input-container mb-3'>
                <label htmlFor='parent-role'>Role*</label>
                <input id='parent-role' type='dropdown' disabled value={addType}></input>
            </div>
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
            <div className={`error-Msg height1rem ${passValid ? 'noVisible' : ''} mb-2`}>
                {passwordErr}
            </div>
        </div>
    );
};

export default AddParentUserForm;
