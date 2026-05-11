import { useState } from "react";
import axios from "axios";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: any) => {
    e.preventDefault();

    axios.post("http://127.0.0.1:8000/api/v1/register", {
      name,
      email,
      password
    })
    .then(res => {
      alert(res.data.message);
      window.location.href = "/login";
    })
    .catch(err => {
      console.log(err.response);
      alert(err.response?.data?.message || "Error");
    });
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleRegister} style={styles.card}>
        <h2>Register</h2>

        <input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button style={styles.button}>Register</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#1e3a8a"
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    width: "300px"
  },
  input: {
    width: "100%",
    margin: "10px 0",
    padding: "10px"
  },
  button: {
    width: "100%",
    padding: "10px",
    background: "#10b981",
    color: "#fff",
    border: "none"
  }
};

export default Register;