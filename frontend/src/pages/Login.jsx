import { useState } from "react";

function Login() {

  // använd usestate för username och lösen
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  
  const handleSubmit =(e) => {
    e.preventDefault();
    console.log("Submitting")
    console.log(username, password)
    
    // skicka med fetch
    const endPoint = "http://localhost:8888/api/user/login";

    const options = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    }

    fetch(endPoint, options)
      .then((res) => res.text())
      .then((data) => {
        console.log("Response from server: ", data)

        if(data.verified) {
          console.log("verifiera...")
          
        }
      });
  }

  return (
    <>
      <h1>Login Page</h1>
      <form action="" method="post" onSubmit={handleSubmit}>
        
        <div>
        <label htmlFor="username">Username</label>
        <input 
          type="text" 
          name="username" 
          id="username" 
          onChange={(e) => {setUsername(e.target.value)}} 
          required
        />
        </div>
        
        <div>
        <label htmlFor="password">Password</label>
        <input 
          type="password" 
          name="password" 
          id="password" 
          onChange={(e) => {setPassword(e.target.value)}} 
          required
        />
        </div>

        <input type="submit" value="Login" />
      </form>
    </>
  );
}
export default Login;