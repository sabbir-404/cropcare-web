import Container from "../components/Layout/Container";
import Nav from "../components/Layout/Nav";

export default function MapPage(){
  return (
    <>
      <Nav />
      <Container>
        <h1 className="text-2xl font-bold mb-4">Map</h1>
        <p className="text-sm text-gray-600">Coming soon: markers by severity and time.</p>
      </Container>
    </>
  );
}
