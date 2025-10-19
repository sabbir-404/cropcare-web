import Container from "../components/Layout/Container";
import Nav from "../components/Layout/Nav";
export default function Dashboard(){
  return (
    <>
      <Nav />
      <Container>
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-sm text-gray-600">Welcome! Use “New Scan” to analyze a leaf image.</p>
      </Container>
    </>
  );
}
