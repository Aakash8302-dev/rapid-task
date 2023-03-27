import React,{useState} from 'react'
import { Link } from 'react-router-dom'
import LoginForm from "../components/LoginForm.js"
import RegisterForm from "../components/RegisterForm"


const style = {
    root: {
        textAlign: "center"
    },
    link:{
        textDecoration: 'none'
    }
} 

// Renders Login Form or Register based on input
const renderSwitch = (param) => {
    switch(param){
        case "a1":
            return <LoginForm />
        case "a2":
            return <RegisterForm />
        default:
            return <div>Not Found</div>
    }
}

const AuthScreen = () => {

  const [screen, setScreen] = useState("a2")

  const handleSwitch = () => {
    if(screen=== "a1"){
        setScreen("a2")
    }else if(screen === "a2"){
        setScreen("a1")
    }
  }

  return (
    <div style={{...style.root}}>
        {
            renderSwitch(screen)
        }
        <div style={{margin: "0.6rem"}}>
            {
                screen === "a2" ? <div>Already registerd ?<Link sx={{...style.link}} onClick={handleSwitch}>login</Link></div> : <div>New user? <Link sx={{...style.link}} onClick={handleSwitch}>register</Link></div>
            }
        </div>
    </div>
  )
}

export default AuthScreen