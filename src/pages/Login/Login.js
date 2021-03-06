import React, { useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import auth from '../../firebase.init';
import { useSendPasswordResetEmail, useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SocialLogin from '../SocialLogin/SocialLogin';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const emailRef = useRef('');
    const passwordRef = useRef('');
    const navigate = useNavigate();
    const location = useLocation();
    let errorElement;

    // sign in with email and password
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useSignInWithEmailAndPassword(auth);

      // reset password
      const [sendPasswordResetEmail, sending, resetPasswordError] = useSendPasswordResetEmail(
        auth
      );

      const from = location.state?.from?.pathname || "/";

      // handle error
      if (error || resetPasswordError){
        errorElement = <p className='text-danger'>Error: {error?.message}</p>
      }

      if(user){
        navigate(from, { replace: true });
      }

      const resetPassword = async() =>{
          const email = emailRef.current.value;

          if(email){
            await sendPasswordResetEmail(email);
            toast('Sent email');
        }
        else{
            toast('Please enter your email address')
        }

      }

    const handleSubmit = event =>{
        event.preventDefault()
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        signInWithEmailAndPassword (email, password);
    }

    return (
        <div className='container mx-auto w-50'>
            <h2 className='text-center text-primary mt-4'>Please Login</h2>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control ref={emailRef} type="email" placeholder="Enter email"/>
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control ref={passwordRef} type="password" placeholder="Password"/>
                </Form.Group>
                <Button className='mx-auto w-50 d-block' onClick={handleSubmit} variant="primary" type="submit">
                    Login
                </Button>
            </Form>
            {errorElement}
            <p className='text-center mt-3'>New to Photo Photo Galleria? <Link to='/register' className='btn btn-link text-primary pu-auto text-decoration-none'>Please Register</Link></p>
            <p className='text-center'>Forget Password? <button onClick={resetPassword} className='btn btn-link text-primary pu-auto text-decoration-none' >Reset Password</button>
            </p>
            <SocialLogin></SocialLogin>
            <ToastContainer />
        </div>
    );
};

export default Login;