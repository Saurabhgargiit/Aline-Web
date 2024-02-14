import { useState } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './LoginForm.scss';

const LoginForm = () => {

  const [email, setEmail] = useState('');
  const [emailVaild, setEmailVaild] = useState(false);
  const [pass, setPass] = useState('');
  const [passValid, setPassValid] = useState(false);

  const emailHandler = (event) => {
    const { value } = event.target;
    console.log(event.target);
    setEmail((prevState) => value);
    if (value.includes('@') && !emailVaild) setEmailVaild(true)
    else if (!value.includes('@') && emailVaild) setEmailVaild(false);
  };


  const passHandler = (event) => {
    const { value } = event.target;
    setPass((prevState) => value);
    if (value.length > 8) setPassValid(true);
  };

  const fecthData = () => {
    // let data = {
    //       'email_id': state.username,
    //       'password': state.password,
    //       'keep_login': state.keepLogin,
    //       'dual_auth_token': null,
    //       'captcha': state.captcha
    //   };
    //
    //   dispatch(
    //       loginActions.getLoginData(
    //           data,
    //           "LOGIN",
    //       )
    //   );
  }

  const submitHandler = (e) => {
    e.preventDefault();
    if (emailVaild && passValid) {
      fecthData();
    }
  }

  console.log(email, pass);

  return (
    <div className="login-container">
      <Form noValidate>
        <Form.Group className="mb-3 mt-4" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={(e) => emailHandler(e)}
            value={email}
            // noValidate
            autoComplete="off"
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={pass}
            onChange={(e) => passHandler(e)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          onClick={(e) => submitHandler(e)}
        >
          Submit
        </Button>
      </Form>
    </div>
  )
}
export default LoginForm;
