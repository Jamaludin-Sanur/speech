import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export function FormAwsAuth({ data, setData, onClickSave }) {
    return (
        <Form>
            <Form.Group className="mb-3" >
                <Form.Label>AWS Access Key</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter AWS Access Key"
                    value={data.accessKey}
                    onChange={(e) => setData(prev => ({ ...prev, accessKey: e.target.value }))}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>AWS Secret Key</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter AWS Secret Key"
                    value={data.secretKey}
                    onChange={(e) => setData(prev => ({ ...prev, secretKey: e.target.value }))}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Bucket Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter Bucket Name"
                    value={data.bucketName}
                    onChange={(e) => setData(prev => ({ ...prev, bucketName: e.target.value }))}
                />
            </Form.Group>

            <Button variant="primary" onClick={onClickSave}>
                Submit
            </Button>
        </Form>
    );
};