import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useDispatch } from 'react-redux';

import { getLoginData, loginAction } from '../../../store/actions/loginaction';
import Loader from '../../common/Loader/Loader';
import { ApiRelativePaths } from '../../../utils/globalURLs';
import './LoginForm.scss';

const LoginForm = ({ errorObj, setErrorObj }) => {
    const [email, setEmail] = useState('');
    const [emailVaild, setEmailVaild] = useState(false);
    const [emailErr, setEmailErr] = useState('');
    const [pass, setPass] = useState('');
    const [passValid, setPassValid] = useState(false);
    const [passErr, setPassErr] = useState('');

    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const emailHandler = (event) => {
        const { value } = event.target;
        setEmail(() => value);
        if (value.includes('@')) {
            setEmailVaild(true);
            if (!!emailErr) {
                setEmailErr('');
            }
        } else if (!value.includes('@') && emailVaild) setEmailVaild(false);
    };

    const passHandler = (event) => {
        const { value } = event.target;
        setPass(() => value);
        if (value.length > 5 && value.length < 12) {
            setPassValid(true);
            if (!!passErr) {
                setPassErr('');
            }
        } else if (!(value.length > 5 && value.length < 13) && passValid) setPassValid(false);
    };

    const fetchData = () => {
        let data = {
            email: email,
            password: pass,
        };

        dispatch(getLoginData('LOGIN_PATH', data));
    };

    const submitHandler = (e) => {
        e.preventDefault();
        setErrorObj((prevState) => {
            return {
                ...prevState,
                errorMsg: '',
                errorFlag: false,
            };
        });
        if (emailVaild && passValid) {
            setLoading(true);
            fetchData();
        } else {
            if (!emailVaild) {
                setEmailErr('Please enter valid user ID.');
            } else if (!passValid) {
                setPassErr('Password should be between 6 to 12 letters.');
            }
        }
    };
    console.log(loading, errorObj);

    useEffect(() => {
        if (errorObj.errorFlag && loading) {
            setLoading(false);
        }
    }, [errorObj.errorFlag]);

    return (
        <div className='login-container'>
            {!loading ? (
                <Form noValidate>
                    <Form.Group className='mb-3 mt-4' controlId='formBasicEmail'>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Enter email'
                            onChange={(e) => emailHandler(e)}
                            value={email}
                            autoComplete='off'
                        />
                    </Form.Group>

                    <Form.Group className='mb-3' controlId='formBasicPassword'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Password'
                            value={pass}
                            onChange={(e) => passHandler(e)}
                            autoComplete='off'
                        />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='formBasicCheckbox'></Form.Group>
                    <Button variant='primary' type='submit' onClick={(e) => submitHandler(e)}>
                        Submit
                    </Button>
                    {!!emailErr && <div className='error-Msg'>{emailErr}</div>}
                    {!!passErr && <div className='error-Msg'>{passErr}</div>}
                    {errorObj.errorFlag && <div className='error-Msg'>{errorObj.errorMsg}</div>}
                </Form>
            ) : (
                <Loader />
            )}
        </div>
    );
};
export default LoginForm;
