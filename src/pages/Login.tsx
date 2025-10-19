import Nav from "../components/Layout/Nav";
import Container from "../components/Layout/Container";
import { setToken, isAuthed } from "../lib/auth";
import { useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";

export default function Login(){
/* The code snippet  provided is a React functional component for a login page. */
  if (isAuthed()) return <Navigate to="/dashboard" replace />;
  const nav = useNavigate();
  const [email,setEmail] = useState("");
  const [pw,setPw] = useState("");
  const [err,setErr] = useState("");

  async function onSubmit(e: React.FormEvent){
    e.preventDefault();
    setErr("");
    // TODO: replace with real API call
    if (email && pw) {
      setToken("dev-local-token");
      nav("/dashboard");
    } else {
      setErr("Please enter email and password");
    }
  }

  return (
    <>
      <Nav />
      <Container>
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <form onSubmit={onSubmit} className="max-w-sm space-y-3">
          <input className="w-full rounded-md border p-2" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
          <input className="w-full rounded-md border p-2" placeholder="Password" type="password" value={pw} onChange={e=>setPw(e.target.value)}/>
          {err && <div className="text-sm text-rose-600">{err}</div>}
          <button className="rounded-md bg-gray-900 text-white px-3 py-2">Login</button>
        </form>
      </Container>
    </>
  );
}
