import React from 'react';
import { useState } from 'react';
import axios from 'axios';
function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  console.log(formData);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const data = await axios.post(
        'http://localhost:3000/api/v1/auth/login',
        formData
      );
      console.log(data.data.token);
      localStorage.setItem('token', data.data.token);
      localStorage.setItem("user" , JSON.stringify(data.data.user))
      setFormData({ ...formData, email: ' ', password: '' });
    } catch (error) {
      console.log(error);
    }
    //NOTE jab main form submit karunga tab kya krna hain
    //NOTE yaha par register ki api call krni hian
  };

  const handleChange = (e) => {
    console.log(e.target.value);
    console.log(e.target.name);
    setFormData({ ...formData, [e.target.name]: e.target.value }); //remember
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          onChange={handleChange}
          type="email"
          placeholder="Enter Your Email"
          name="email"
          value={formData.email}
        />
        <input
          onChange={handleChange}
          type="password"
          placeholder="Enter your Password"
          name="password"
          value={formData.password}
        />
        {/* <input type="password" placeholder="Enter your Password"/> */}

        <button>Click To Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
