import Layout from './components/layout'
import styled from 'styled-components'
import Link from 'next/link'

const GreenButton = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 0.8rem;
  text-align: center !important;
  background-color: #1db954;
  border: 0;
  border-radius: 50px;
  text-transform: uppercase;
  text-decoration: none;
  padding: 5px 2px;
  width: 210px;
  margin-left: 0px;
  letter-spacing: 1.2px;
  margin-top: 15px;
  font-weight: 600;
  box-shadow: 0 1px 5px 1px rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: #1db954;
  }

  @media only screen and (max-width:600px){
    width:100%;
    margin-bottom:5vh;
  }
`;

function Error() {
    return (
      <Layout>
          <p>Not enough data to make this request please return home</p>
          <Link href="/">
          <GreenButton href="/">Return Home</GreenButton>
          </Link>
      </Layout>
    )
  }
  
  export default Error