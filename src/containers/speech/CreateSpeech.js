import { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Spinner from 'react-bootstrap/Spinner';
import { FormSpeech } from '../../components/speech';
import CONSTANT from '../../constants';
import { PATH } from '../../router/PATH';
import { AWSContext } from "../../context";
import {
    ASRProvider,
    TxtProvider,
    WordProvider,
    ZipProvider,
    S3Provider
} from '../../providers'

export function CreateSpeech() {
    const { auth } = useContext(AWSContext);
    const [asrProvider] = useState(new ASRProvider(auth));
    const [s3Provider] = useState(new S3Provider(auth));
    const navigate = useNavigate();
    const [state, setState] = useState({
        title: '',

        status: CONSTANT.SPEECH_INITIAL,
        fileBlob: '',
        fileURL: '',

        audioFileWavBlob: null,
        audioFileWavURL: null,

        originalText: '',
        originalFileTxtBlob: null,
        originalFileTxtURL: null,
        originalFilePdfBlob: null,
        originalFilePdfURL: null,
        originalFileWordBlob: null,

        editableText: '',
        editableFileTxtBlob: null,
        editableFileTxtURL: null,
        editableFilePdfBlob: null,
        editableFilePdfURL: null,
        editableFileWordBlob: null,

        fileZipBlob: null,
        fileZipURL: null,

        loading: false,
        submitSuccess: false,
        submitError: '',
    });

    useEffect(() => {
        if (state.audioFileWavBlob) {
            buildFileBundle();
        }

    }, [state.audioFileWavBlob]);

    const buildFileOriginal = async () => {
        const fileWord = await WordProvider.getWordFile(state.originalText);
        const fileTxt = await TxtProvider.getTxtFile(state.originalText);
        setState(prev => ({
            ...prev,
            originalFileTxtBlob: fileTxt.fileBlob,
            originalFileTxtURL: fileTxt.fileURL,
            originalFileWordBlob: fileWord.fileBlob,
        }));
    }

    const buildFileEditable = async () => {
        const fileWord = await WordProvider.getWordFile(state.editableText);
        const fileTxt = await TxtProvider.getTxtFile(state.editableText);
        setState(prev => ({
            ...prev,
            editableFileTxtBlob: fileTxt.fileBlob,
            editableFileTxtURL: fileTxt.fileURL,
            editableFileWordBlob: fileWord.fileBlob,
        }));
    }

    const buildFileBundle = async () => {
        const originalFileTxt = await TxtProvider.getTxtFile(state.originalText);
        const editableFileTxt = await TxtProvider.getTxtFile(state.editableText);
        const zipFile = await ZipProvider.getZipFile([
            {
                key: 'original.txt',
                value: originalFileTxt.fileBlob
            },
            {
                key: 'editable.txt',
                value: editableFileTxt.fileBlob
            },
            {
                key: 'audio.wav',
                value: state.audioFileWavBlob
            },
        ])
        setState(prev => ({
            ...prev,
            fileZipBlob: zipFile.fileBlob,
            fileZipURL: zipFile.fileURL
        }));

    }

    const onReceiveTranscribe = (text, fullText) => {
        if (text || fullText) {
            setState(prev => ({
                ...prev,
                originalText: fullText,
                editableText: prev.editableText + text
            }));
        }
    }

    const onReceiveFileRecording = ({ fileBlob, fileURL }) => {
        setState(prev => ({
            ...prev,
            audioFileWavBlob: fileBlob,
            audioFileWavURL: fileURL
        }));

    }

    const onClickBtnRecording = () => {
        if (state.status == CONSTANT.SPEECH_INITIAL) {
            setState(prev => ({
                ...prev,
                status: CONSTANT.SPEECH_IN_PROGRESS,
            }));
            asrProvider.onReceiveTranscribe(onReceiveTranscribe);
            asrProvider.onReceiveFileRecording(onReceiveFileRecording);
            asrProvider.startASR();
        } else if (state.status == CONSTANT.SPEECH_IN_PROGRESS) {
            setState(prev => ({
                ...prev,
                status: CONSTANT.SPEECH_FINISH,
            }));
            asrProvider.stopASR();
            buildFileOriginal();
            buildFileEditable();
        }
    }

    const onClickBtnSubmit = (evt) => {
        evt.preventDefault();
        if (!state.title.trim()) {
            alert('title is required');
            return;
        };

        setState(prev => ({
            ...prev,
            loading: true
        }))

        s3Provider.uploadObject({
            filePath: state.title + ".zip",
            file: state.fileZipBlob
        }).then(() => {
            setState(prev => ({
                ...prev,
                loading: false,
                submitSuccess: true
            }));
        }).catch(err => {
            setState(prev => ({
                ...prev,
                loading: false,
                submitError: err.message
            }));
        })
    }

    const onChangeTranscribe = (e) => {
        setState(prev => ({
            ...prev,
            editableText: e.target.value,
        }));

        if (state.status === CONSTANT.SPEECH_FINISH) {
            buildFileBundle();
            buildFileEditable();
        }
    }

    const onChangeTitle = (evt) => {
        setState(prev => ({
            ...prev,
            title: evt.target.value
        }));
    }

    // Handle Loading
    if (state.loading) {
        return (
            <div className='d-flex align-items-center justify-content-center h-100'>
                <Spinner animation="border" variant="primary" />
            </div>
        )
    }
    // Render
    else {
        return (
            <>
                <FormSpeech
                    title={state.title}
                    onChangeTitle={onChangeTitle}
                    status={state.status}
                    onClickBtnRecording={onClickBtnRecording}
                    onClickBtnSubmit={onClickBtnSubmit}
                    onChangeTranscribe={onChangeTranscribe}
                    transcribeOriginal={state.originalText}
                    transcribeFinal={state.editableText}
                    transcribeFileURL={state.audioFileWavURL}
                    originalFileTxtURL={state.originalFileTxtURL}
                    originalFileWordBlob={state.originalFileWordBlob}
                    editableFileTxtURL={state.editableFileTxtURL}
                    editableFileWordBlob={state.editableFileWordBlob}
                    fileZipURL={state.fileZipURL}
                />

                <ToastContainer className="p-3" position="bottom-end">
                    <Toast
                        className="d-inline-block m-1"
                        bg="danger"
                        onClose={() => setState(prev => ({ ...prev, submitError: '' }))}
                        show={!!state.submitError} delay={10000} autohide
                    >
                        <Toast.Header>
                            <strong className="me-auto">Error</strong>
                        </Toast.Header>
                        <Toast.Body >
                            {state.submitError}
                        </Toast.Body>
                    </Toast>
                </ToastContainer>

                <ToastContainer className="p-3" position="bottom-end">
                    <Toast
                        className="d-inline-block m-1"
                        bg="light"
                        onClose={() => setState(prev => ({ ...prev, submitSuccess: false }))}
                        show={!!state.submitSuccess} delay={10000} autohide
                    >
                        <Toast.Header>
                            <strong className="me-auto text-primary">Success</strong>
                        </Toast.Header>
                        <Toast.Body className="d-flex justify-content-between">
                            <span>Upload Success</span>
                            <div>
                                <NavLink className="me-3 " onClick={() => { navigate(0) }}>  New </NavLink>
                                <NavLink className="text-primary" to={PATH.SPEECH_LIST}>  List </NavLink>
                            </div>
                        </Toast.Body>
                    </Toast>
                </ToastContainer>
            </>
        )
    }



}