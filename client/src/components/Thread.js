import React,{useState, useEffect} from 'react'
import { Box, Button, Typography, TextField, Paper, IconButton, Icon } from '@mui/material'
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const style = {
    root:{
        marginBottom: "2rem",
        width: "fitContent",
        padding: "1rem"
    },
    addComment:{
        fontSize: "1rem",
        textDecoration: 'none',
    },
    cmtSection:{
        margin: "1.5rem 1rem"
    },
    issueContent:{
        backgroundColor: "#e6e6e6",
        padding: "1.4rem",
        borderRadius: "5px"
    }
}

const Thread = ({id,issue,user,comments, likes, title}) => {

    const navigate = useNavigate();

    const [cmtBox, setCmtBox] = useState("inactive");
    const [cmt, setCmt] = useState("")
    const [btn, setBtn] = useState(false);
    const [users,setUsers] = useState([]);
    const [login, setLogin] = useState(null);

    useEffect(()=>{
        if(localStorage.getItem("user") && localStorage.getItem("user")){
            setLogin(JSON.parse(localStorage.getItem('user')))
        }
    },[])

    useEffect(()=>{
       getAllUsers();
       
    },[])

    const getAllUsers = async() => {
        const {data} = await axios.get('/api/user/')
        setUsers(data);
    }

    const handleAddComment = async () => {
        let comment = cmt
        const {data} = await axios.put(`/api/user/issue/${id}`,{comment}, {
            headers: {
                Authorization: `Bearer ${login && login.token}`,
            },
        });

        if(data){
            window.location.reload();
        }
    }

    const handleCommentInput = (e) => {
       e.target.value.length > 0 ? setBtn(true) : setBtn(false)
       setCmt(e.target.value);
    }

    const getUserName = (id) => {
        let name;
        users.map((u) => {
            if(u._id === id){
                name = u.username
            }
        })

        return name
    }

    const handleUpvote = async () => {

        if(login.token){
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };
            const {data} = await axios.get(`/api/user/issue/${id}/addlike/`,{
                headers: {
                    Authorization: `Bearer ${login && login.token}`,
                },
            }, config);

            window.location.reload();

        }else{
            navigate('/auth')
        }   
        
    }

  return (
    <Paper key={id} sx={{...style.root}} elevation={3}>
        <Typography variant='subtitle2'>Asked by : {getUserName(user)}</Typography>
        <Typography variant='h6' style={{margin:'0.5rem 0'}}>{title}</Typography>
        <Box style={{...style.issueContent}}>
            <Typography variant='p' style={{whiteSpace:'pre-wrap'}}>{issue}</Typography>
        </Box>
        <Box sx={{...style.cmtSection}}>
            {
                comments.map((c,index) => (
                    <div key={index} style={{margin: "5px 0"}}>{c.comment} - {getUserName(c.userId)}</div>
                ))
            }
        </Box>
        <Box sx={{margin: "0 1rem"}}>
            {
                cmtBox === "inactive" ? (
                <Link style={{...style.addComment}} onClick={()=>setCmtBox("active")}>Add a comment</Link>
                ) : (
                    <div>
                        <TextField variant="standard" onChange={handleCommentInput} />
                        {
                            btn ? (<Button size='small' onClick={handleAddComment} >post</Button> ): (
                                <Button size='small' onClick={() => setCmtBox("inactive")}>cancel</Button>
                            )
                        }
                    </div>
                    
                )
            }
        </Box>
        <Box sx={{marginTop: "1.5rem", display:'flex', justifyContent:'space-between'}}>
            <div>Upvotes :{likes}</div>
            <div>
                Found this thread helpful ? <IconButton size='small' onClick={handleUpvote}><ThumbUpIcon fontSize='small' /></IconButton>
            </div>
        </Box>
    </Paper>
  )
}

export default Thread