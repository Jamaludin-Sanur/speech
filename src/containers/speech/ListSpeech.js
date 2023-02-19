import Stack from 'react-bootstrap/Stack';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { useState, useEffect, useContext } from 'react';
import { NavLink } from "react-router-dom";
import { PATH } from '../../router/PATH';
import { AWSContext } from "../../context";
import {
    S3Provider
} from '../../providers'
import {
    CardSpeech
} from "../../components";

export function ListSpeech() {
    const { auth } = useContext(AWSContext);
    const [s3Provider] = useState(new S3Provider(auth));
    const [state, setState] = useState({
        speechArray: [],
        loadingList: true
    })

    const loadSpeech = async () => {
        const result = await s3Provider.listObject();
        const data = result?.Contents || [];
        setState(prev => ({
            ...prev,
            speechArray: data.map(content => content.Key),
            loadingList: false,
        }))
    }

    useEffect(() => {
        loadSpeech();
    }, []);

    const onClickDelete = async (speech) => {
        if (!window.confirm('Are you sure?')) return;

        setState(prev => ({
            ...prev,
            loadingList: true
        }));

        s3Provider.deleteObject({
            key: speech
        }).then(() => {
            loadSpeech();
        }).catch(err => {
            alert(err);
        })
    }

    // Handle missing AWS auth
    if (!auth.accessKey || !auth.secretKey || !auth.bucketName) {
        return 'AWS credential is required'
    }
    // Other
    else {
        return (
            <section className="d-flex flex-column h-100">
                <Stack direction="horizontal" gap={3}>
                    <NavLink to={PATH.SPEECH_CREATE}> Create </NavLink>
                </Stack>

                {state.loadingList
                    ? (
                        (<div className='d-flex align-items-center justify-content-center h-100'>
                            <Spinner animation="border" variant="primary" />
                        </div>)
                    )
                    : (
                        <div className='d-flex flex-column mt-4'>
                            {state.speechArray.map(speech => (
                                <CardSpeech
                                    key={speech}
                                    speech={speech}
                                    onClickDelete={onClickDelete}
                                />
                            ))}
                        </div>
                    )
                }

            </section>
        )
    }

}