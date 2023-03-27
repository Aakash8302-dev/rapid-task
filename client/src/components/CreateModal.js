import React,{useState, useEffect} from 'react'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import Modal from '@mui/material/Modal';
import axios from 'axios'
import { TextField } from '@mui/material';

const style = {
  modal:{
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    background: "#ffff",
    p: 4,
  },
  root:{
    borderRadius: "10%"
  }
  
};

const CreateModal = ({open,handleOpen, handleClose}) => {

    const [issue, setIssue] = useState("");
    const [title, setTitle] = useState("");
    const [login, setLogin] = useState(null)


    //check if user is logged In and updates state
    useEffect(()=>{
        if(localStorage.getItem("user") && localStorage.getItem("user")){
            setLogin(JSON.parse(localStorage.getItem('user')))
            console.log(login)
        }
    },[])


    // Create a new Issue/Post
    const handleSubmit = async() => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const {data} = await axios.post('/api/user/issue',{issue, title}, {
            headers: {
                Authorization: `Bearer ${login && login.token}`,
            },
        }, config);
        
        if(data){
            window.location.reload();
        }

    }

    const handleInputChange = (e) => {
        setIssue(e.target.value);
    }

    return (
      <div >
        <Modal
          open={open}
          onClose={handleClose}
          style={{...style.root}}
        >
          <Box sx={{...style.modal}}>
                <Typography variant='h5' style={{marginBottom: '1rem'}}>Post an Issue</Typography>
                <div>
                    <TextField  
                        variant="outlined"
                        label='Title'
                        name="Title"
                        sx={{margin: "15px 0"}}
                        onChange={(e) => setTitle(e.target.value)}
                    >
                    </TextField>
                </div>
                <TextareaAutosize placeholder='Enter Issue' style={{width: 400, height:200}} onChange={handleInputChange} />
                <div>
                    <Button style={{marginTop: "0.5rem"}} variant='contained' onClick={handleSubmit}>Submit</Button>
                </div>
          </Box>
        </Modal>
      </div>
    );
}

export default CreateModal