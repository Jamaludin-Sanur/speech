import { Sidebar } from '../containers/sidebar';
import { Outlet } from "react-router-dom";
import Container from 'react-bootstrap/Container';

export function HomePage() {
    return (
        <div className='d-flex w-100 h-100 '>
            <Sidebar />
            <Container className='border py-3 px-4'>
                <Outlet />
            </Container>

        </div>
    )
}