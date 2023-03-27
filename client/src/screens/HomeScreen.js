import React,{useEffect, useState} from 'react'
import axios from 'axios'
import Loader from '../components/Loader'
import Thread from '../components/Thread'
import { Button, Container, Grid, Typography, InputBase, Box } from '@mui/material'
import { styled, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'
import CreateModal from '../components/CreateModal'
import SearchIcon from '@mui/icons-material/Search';

const style = {
    root:{
        padding: "1rem 0"
    }
}

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));

  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }));

const HomeScreen = () => {
    
    const navigate = useNavigate();
 
    const [issues, setIssue] = useState({})
    const [issuesCopy, setIssueCopy] =useState({})
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    useEffect(()=>{
        getIssues();
    },[])

// Function which returns all Issues in Database
const getIssues = async () => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
        },
    };
    const {data} = await axios.get('http://localhost:5000/api/user/issue');
    
    setIssue(data);
    setIssueCopy(data);
}

//Redirects to login page if user data is not available
const handlePostIssue = () => {
    if(!localStorage.getItem('user')){
        navigate('/auth')
    }else{
        handleOpen();
    }
}

// Function to Rank Issue Threads based on Upvotes and Comments
//Priority value is calculated by: Priority_value = Number_of_likes/3 + Number_of_comments
//Issue Threads are Sorted in descending order based on Priority value
const rankThreads = (arr) => {
    arr.map(ele => {
        ele.priority = ele.likes/3 + ele.comments.length
    })
    arr.sort((a,b) => b.priority - a.priority);
    return 1;
}


// Function which handles Search
const handleSearch = (e) => {

    let newArr = []

    if(e.target.value.length === 0){
       setIssue(issuesCopy)
    }else{
        for(let i=0; i<issues.length; i++){
            if(issues[i].issue.toLowerCase().includes(e.target.value.toLowerCase()) || issues[i].title.toLowerCase().includes(e.target.value.toLowerCase())){
                newArr.push(issues[i])
            }
        }
        setIssue(newArr)
    }
    
}

  return (
        <Container sx={{...style.root}}>
            <Box style={{display: "flex", justifyContent: "space-between"}}>
                <Button variant='contained' onClick={handlePostIssue}>Post Issue</Button>
                <Search>
                    <SearchIconWrapper>
                    <SearchIcon />
                    </SearchIconWrapper>
                    <StyledInputBase
                    placeholder="Search…"
                    inputProps={{ 'aria-label': 'search' }}
                    onChange={handleSearch}
                    />
                </Search>
            </Box>
                <Grid container spacing={3}>
                    <Grid item lg={8} md={8} xs={8}>
                        <Typography variant='h5' sx={{margin: "1rem 0"}}>Popular Threads</Typography>
                        {
                            issues && issues.length > 0 ? rankThreads(issues) && issues.map((ele) => (
                                <Thread key={ele._id} id={ele._id} title={ele.title} likes={ele.likes} comments={ele.comments} user={ele.user} issue={ele.issue} />
                            )) : <Loader />
                        }
                    </Grid>
                    <Grid item lg={4}  md={4} xs={4}>
                        <Typography variant='h6' sx={{margin: "1rem 0"}}>Latest</Typography>
                        {
                            issuesCopy && issuesCopy.length ? issuesCopy.reverse().map((ele) => (
                                <Thread key={ele._id} id={ele._id} title={ele.title} likes={ele.likes} comments={ele.comments} user={ele.user} issue={ele.issue} />
                            )) : <Loader />
                        }
                    </Grid>
            </Grid>
            <CreateModal open={open} handleOpen={handleOpen} handleClose={handleClose} />
        </Container>
  )
}

export default HomeScreen