import { useState, useEffect, useContext } from 'react';
import { FormSpeech } from '../../components/speech';
import CONSTANT from '../../constants';
import Toast from 'react-bootstrap/Toast';
import Spinner from 'react-bootstrap/Spinner';
import { useNavigate } from "react-router-dom";
import ToastContainer from 'react-bootstrap/ToastContainer';
import { NavLink, useSearchParams } from "react-router-dom";
import { PATH } from '../../router/PATH'
import { CommonUtility } from '../../utilities';
import { AWSContext } from "../../context";
import {
    ASRProvider,
    TxtProvider,
    WordProvider,
    ZipProvider,
    S3Provider
} from '../../providers'

export function EditSpeech() {
    const { auth } = useContext(AWSContext);
    const [asrProvider] = useState(new ASRProvider(auth));
    const [s3Provider] = useState(new S3Provider(auth));
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [state, setState] = useState({
        title: '',

        status: CONSTANT.SPEECH_FINISH,
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

        loading: true,
        submitSuccess: false,
        submitError: '',
    });

    useEffect(() => {
        const loadZip = async () => {
            const id = searchParams.get('id');
            if (id) {
                const byteArray = await s3Provider.getObject({ key: id });
                let blob = new Blob([byteArray], { type: 'application/octet-stream' });
                let result = await ZipProvider.readZipFileToBlob(blob);
                const stateToUpdate = {
                    title: CommonUtility.excludeExtension(id),
                    loading: false,
                    fileZipBlob: blob,
                    fileZipURL: URL.createObjectURL(blob),
                    originalText: undefined,
                    editableText: undefined,
                    audioFileWavBlob: null,
                    audioFileWavURL: null,
                }
                await Promise.all(result.map(async file => {
                    if (file.name.includes('original.txt')) {
                        stateToUpdate.originalText = await file.async('string');
                    } else if (file.name.includes('editable.txt')) {
                        stateToUpdate.editableText = await file.async('string');
                    } else if (file.name.includes('audio.wav')) {
                        const audioBlob = await file.async('blob');
                        stateToUpdate.audioFileWavBlob = audioBlob;
                        stateToUpdate.audioFileWavURL = URL.createObjectURL(audioBlob)
                    }
                }))
                setState(prev => ({
                    ...prev,
                    ...stateToUpdate,
                }));
            }
        }
        loadZip();
    }, []);

    useEffect(() => {
        if (state.editableText) buildFileEditable()
    }, [state.editableText]);

    useEffect(() => {
        if (state.originalText) buildFileOriginal()
    }, [state.originalText]);

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

    // Handle missing speec id
    if (!searchParams.get('id')) {
        return "id is missing in url"
    }
    // Handle Loading
    else if (state.loading) {
        return (
            <div className='d-flex align-items-center justify-content-center h-100'>
                <Spinner animation="border" variant="primary" />
            </div>
        )
    }

    else {
        return (
            <>
                <FormSpeech
                    title={state.title}
                    onChangeTitle={onChangeTitle}
                    status={state.status}
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
                                <NavLink className="me-3 text-primary" onClick={() => { navigate(0) }}>  New </NavLink>
                                <NavLink className="text-primary" to={PATH.SPEECH_LIST}>  List </NavLink>
                            </div>
                        </Toast.Body>
                    </Toast>
                </ToastContainer>
            </>
        )
    }


}