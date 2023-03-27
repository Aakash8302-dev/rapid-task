import React,{useState, useEffect} from 'react'
import { Grid, TextField, Box, styled, MenuItem, FormHelperText, Button, Typography, Container, InputAdornment, InputLabel, FormControl, OutlinedInput, IconButton } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { useForm, Form } from './useForm'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Item = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    '& .MuiTextField-root': { margin: '0.4rem', width: '35ch' }

}))

const initialValues = {
    username: '',
    password: '',
}

const style = {
    root: {
        textAlign: 'center',
    },
    formWrap: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }
}

const LoginForm = ({history}) => {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(true);
    const [login, setLogin] = useState(false)

    //Checks if user Logged In and updates state
    useEffect(()=>{
        if(localStorage.getItem('user') && localStorage.getItem('user').length>0){
           setLogin(JSON.parse(localStorage.getItem('user')))
        }
    },[login])


    // Validates the username and password valuess
    const validate = () => {
        let temp = {}
        temp.username = (/^[a-z0-9]+$/i.test(values.username)) ? "" : "Enter valid username"
        temp.password = values.password ? "" : "Enter valid password"

        setErrors({
            ...temp
        })

        return Object.values(temp).every(x => x === "")
    }

    const { values, setValues, errors, setErrors, handleInputChange } = useForm(initialValues)

    // Method handles Login 
    const handleSubmit = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if(validate(values)){
            const {data} = await axios.post("/api/user/login", values, config);
            if(data.status === "success"){
                localStorage.setItem('user', JSON.stringify(data.payload));
            }
            window.location.reload();
        }

    }

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


  return (
    <Form onSubmit={handleSubmit}>
            <Typography variant='h5' style={{margin: '1rem'}}>Login</Typography>
            <Container sx={{ ...style.root }} >
                <Grid item sx={{ ...style.formWrap }}>
                    <Item>
                        <TextField
                            variant="outlined"
                            label='Username'
                            name="username"
                            value={values.username}
                            onChange={handleInputChange}
                            {...(errors ? { error: (errors.username ? true : false), helperText: errors.username } : false)}
                        />
                        <FormControl variant='outlined'>
                            <TextField
                                id='outlined-adornment-password'
                                type={showPassword ? 'password' : 'text'}
                                value={values.password}
                                variant="outlined"
                                name="password"
                                onChange={handleInputChange}
                                {...(errors ? { error: (errors.password ? true : false), helperText: errors.password } : false)}
                                endAdornment={
                                    <InputAdornment position='end'>
                                        <IconButton
                                            aria-label='toggle password visibility'
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            edge='end'
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                                label='Password'
                            />
                        </FormControl>
                        <Button type="submit" variant="contained">Submit</Button>
                    </Item>
                </Grid>
            </Container>
        </Form>
  )
}

export default LoginForm