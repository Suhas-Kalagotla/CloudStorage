import React,{useState} from 'react'; 
import "./login.css";

const Login = () =>{
    const handleSubmit = async(e)=>{
        console.log("submit made");
    }
    const toggleVisibility = ()=>{
        setVisible(!passVisible); 
    }
    const [email,setEmail] = useState(''); 
    const [pass,setPass] = useState('');
    const [passVisible,setVisible] = useState(false); 
    const [errors,setErrors] =useState( );     
  return (
        <div className="loginContainer">
        <form onSubmit = {handleSubmit}>
          <h1>Login</h1>
          <label htmlFor="email">Email</label>
          <input value ={email} onChange={(e)=>setEmail(e.target.value)} type="email" 
          placeholder="youremail@gmail.com"id="email"name="email"/>
    
          <label htmlFor="password">Password</label>
          <div className="loginDiv">
          <input value = {pass} onChange={(e)=>setPass(e.target.value)} 
          type={passVisible ? "text": "password"} 
          placeholder="****"id="password"name="password"/>
          <button onClick={toggleVisibility} type="button" className="passToggle">
            {passVisible ? "Hide Password" : "Show Password"}
          </button>
          </div>
          
          <p className="error">{errors && errors}</p>
          <button className="loginButton" type="submit">Log In</button>
        </form>
          <p>Don't have an acccount? <a onClick={()=>onFormSwitch('register')}>Register here</a></p>
        </div>
      )
}
export default Login ; 
