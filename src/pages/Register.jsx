import { Button, Stack, TextField, Typography, useMediaQuery } from '@mui/material'
import React, { useState } from 'react'
import { useSigninMutation , useLoginMutation} from '../redux/service';

const Register = () => {
  //  logic
  const [signinUser]  = useSigninMutation();
    const [loginUser]  = useLoginMutation();
  const _700= useMediaQuery("(min-width:700px)");

  const [login, setLogin] = useState(false);
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const toggleLogin = () =>{
    setLogin((pre)=> !pre);
  };
  const handleLogin = async () =>{
    const data ={
      
      email,//first is identifier it name anything
      password,


    }
  await loginUser(data);
  };
  const handleRegister = async () =>{
    const data ={
      userName, //first is identifier it name anything
      email,
      password,


    }
    await signinUser(data);
  };

  return (
    <Stack width={'100%'} height={'100vh'} flexDirection={'row'}
    justifyContent={'center'}
    alignItems={'center'} sx={ _700 ? {
        // backgroundImage:'url("/register-bg.webp")',
        backgroundRepeat:'no-repeat',
        backgroundSize:"100% 600px",
        backgroundColor:'#dbebf8ff',
    }: null
  }
    >
    <Stack flexDirection={'column'} width={_700 ? "40%" : "90%"} gap={2} mt={_700 ? 20 :0}>
        <Typography variant='h5' fontSize={_700? "1.5rem": "1rem"} fontWeight={'bold'} alignSelf={'center'}>{login ? "Login with email" : " register with email"}</Typography>

        {
          login ? null :
        <TextField 
        variant='outlined' placeholder='Enter your username...'
        onChange={(e)=>setUserName(e.target.value)} //get the value of e by e.target.value
        />
        }

        
        <TextField variant='outlined' placeholder='Enter your Email' onChange={(e)=>setEmail(e.target.value)}/>
        
        <TextField variant='outlined' placeholder='Enter your password' onChange={(e)=>setPassword(e.target.value)}/>

        <Button size='large' sx={{
           width:'100%',
           height:52,
           bgcolor:'green',
           color:'white',
           fontSize:'1rem',
           ":hover":{
            backgroundColor:'blue',
            cursor:'pointer',
           }
          }}
          onClick={login ? handleLogin : handleRegister}

        >{ login?"Login" : "sign Up"}</Button>

        <Typography variant='subtitle2' fontSize={_700 ? "1.3rem" : "qrem"} alignSelf={'center'}>{login ? "Don't have an account? " : "already have an account? "}<span className='login-link' onClick={toggleLogin}>{ login ? "sign Up" : "Login"}</span></Typography>

    </Stack>

    </Stack>
  )
}

export default Register
