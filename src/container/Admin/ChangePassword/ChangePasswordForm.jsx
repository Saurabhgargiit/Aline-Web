import { useContext, useEffect, useState } from 'react';
import { AddParentUserContext } from '../../Admin/AddParentUser/Context/AddParentUserContext';
import { FormErrors } from '../../../utils/globalConstants';

const ChangePasswordForm = ({}) => {
    const { passwordErr, repasswordErr } = FormErrors;
    const { addType, setFormValid, setUserObj, setDetailUserObj, dataToModal, isEdit } =
        useContext(AddParentUserContext);

    const [pass, setPass] = useState('');
    const [repass, setRePass] = useState(''); //field for re-enter password

    const [passValid, setPassValid] = useState(false);
    const [rePassValid, setRePassValid] = useState(false);

    // const objSetter = (field, value) => {
    //     setUserObj((prevState) => {
    //         return {
    //             ...prevState,
    //             [field]: value,
    //         };
    //     });
    // };

    // const detailObjSetter = (field, value) => {
    //     setDetailUserObj((prevState) => {
    //         return {
    //             ...prevState,
    //             [field]: value,
    //         };
    //     });
    // };

    const inputHandler = (e, inputType, firstLoad = false) => {
        let value;
        if (firstLoad && isEdit) {
            //for edit flow, data is passed in 'e' variable
            value = e;
        } else {
            value = e.target.value;
        }
        switch (inputType) {
            case 'password':
                setPass(() => value);
                setPassValid(value.length > 5 && value.length < 13);
                // objSetter(inputType, value);
                break;
            case 'reEnterPassword':
                setRePass(() => value);
                setRePassValid(value === pass);
                // objSetter(inputType, value);
                break;
            default:
                // This is the default case, which gets executed if `inputType` does not match any of the above.
                console.log('Unhandled input type:', inputType);
                break;
        }
    };

    // useEffect(() => {
    //     if (emailVaild && nameValid && passValid) {
    //         setFormValid(true);
    //     } else {
    //         setFormValid(false);
    //     }
    // }, [emailVaild, nameValid, passValid]);

    return (
        <div>
            <div className='label-input-container'>
                <label htmlFor='parent-name'>{addType} Name*</label>
                <input
                    id='parent-name'
                    type='text'
                    onChange={(e) => inputHandler(e, 'name')}
                    // value={name}
                    required
                ></input>
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

            <div className='label-input-container'>
                <label htmlFor='parent-pass'>Re-enter Password*</label>
                <input
                    id='parent-re-pass'
                    type='text'
                    onChange={(e) => inputHandler(e, 'reEnterPassword')}
                    value={repass}
                    required
                ></input>
            </div>

            <div className={`error-Msg height1rem ${rePassValid ? 'noVisible' : ''} mb-2`}>
                {repasswordErr}
            </div>
        </div>
    );
};

export default ChangePasswordForm;
