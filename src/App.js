import { RouterProvider } from "react-router-dom";
import { browserRouter } from './router/BrowserRouter';
import Container from 'react-bootstrap/Container';
import { AWSContextProvider } from './context';

function App() {


  return (
    <AWSContextProvider>
      <Container fluid className='w-100 h-100 m-0 p-0'>
        <RouterProvider router={browserRouter()} />
      </Container>
    </AWSContextProvider>
  );
}

export default App;
