import { FormAwsAuth } from "../../components/awsAuth";
import { useState, useContext, useEffect } from 'react';
import { AWSContext } from '../../context';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';

export const SetAwsAuth = () => {
    const { auth, setAuth } = useContext(AWSContext);
    const [data, setData] = useState({
        accessKey: auth.accessKey,
        secretKey: auth.secretKey,
        bucketName: auth.bucketName,
    });
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        setData(auth);
    }, []);

    const onClickSave = () => {
        if (!data.accessKey) alert('Access Key is required');
        if (!data.secretKey) alert('Secret Key is required');
        if (!data.bucketName) alert('Bucket Name is required');
        setAuth(data);
        setSuccess(true);
    }

    return (<>
        <FormAwsAuth
            data={data}
            setData={setData}
            onClickSave={onClickSave}
        />
        <ToastContainer className="p-3" position="bottom-end">
            <Toast
                className="d-inline-block m-1"
                bg="light"
                onClose={() => setSuccess(false)}
                show={success} delay={10000} autohide
            >
                <Toast.Header>
                    <strong className="me-auto text-primary">Success</strong>
                </Toast.Header>
                <Toast.Body className="d-flex justify-content-between">
                    <span>Update Success</span>
                </Toast.Body>
            </Toast>
        </ToastContainer>
    </>

    )
}