import { useState } from 'react';

const AddParentUser = ({ addType, isEdit }) => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    console.log({ name, address, city, phone, email, pass });

    const inputHandler = (e, inputType) => {
        const { value } = e.target;
        switch (inputType) {
            case 'name':
                setName(() => value);
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
                break;
            case 'password':
                setPass(() => value);
                break;
            default:
                break;
        }
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
            <div className='label-input-container'>
                <label htmlFor='parent-address'>Address</label>
                <input
                    id='parent-address'
                    type='text'
                    onChange={(e) => inputHandler(e, 'address')}
                    value={address}
                ></input>
            </div>
            <div className='label-input-container'>
                <label htmlFor='parent-city'>City</label>
                <input
                    id='parent-city'
                    type='text'
                    onChange={(e) => inputHandler(e, 'city')}
                    value={city}
                ></input>
            </div>
            <div className='label-input-container'>
                <label htmlFor='parent-mobile'>Phone No.</label>
                <input
                    id='parent-mobile'
                    type='tel'
                    onChange={(e) => inputHandler(e, 'phone')}
                    value={phone}
                ></input>
            </div>
            <div className='label-input-container'>
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
            <div className='label-input-container'>
                <label htmlFor='parent-pass'>Password*</label>
                <input
                    id='parent-pass'
                    type='password'
                    onChange={(e) => inputHandler(e, 'password')}
                    value={pass}
                    required
                ></input>
            </div>
        </div>
    );
};

export default AddParentUser;
