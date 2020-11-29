import styled from "styled-components";
import { Container } from "reactstrap";

const Tagline = styled.p`
  text-align: center;
  font-size: 1.5rem;
  font-weight: 400;
  margin: 8px 0;
  .bold {
    font-weight: 700;
  }
`;

const GreenButton = styled.a`
  color: #fff;
  font-size: 1rem;
  text-align: center !important;
  background-color: #1db954;
  border: 0;
  border-radius: 50px;
  text-transform: uppercase;
  text-decoration: none;
  padding: 10px 30px;
  letter-spacing: 1.5px;
  margin: 1rem 0rem;
  font-weight: 600;
  box-shadow: 0 1px 5px 1px rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: #1db954;
  }
`;

const Login = () => {
  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div>
          <Tagline>
            <span className="bold">Spotify Analyzer</span> allows you to view
            your Spotify data in a neat way.
          </Tagline>
          <Tagline>
            You also have the ability to find new music according to your taste.
          </Tagline>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <GreenButton href="/login">Connect With Spotify</GreenButton>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default Login;
