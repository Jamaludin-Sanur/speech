import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import Spinner from 'react-bootstrap/Spinner';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import CONSTANT from '../../constants';
import { useRef, useEffect } from 'react';
import { saveAs } from 'file-saver'

const ButtonSubmit = ({ status, fileZipURL, onClick }) => {
    if (status === CONSTANT.SPEECH_FINISH) {
        if (fileZipURL) {
            return (
                <Button type="submit" onClick={onClick}>Save To Cloud</Button>
            )
        } else {
            return (
                <Spinner animation="border" variant="primary" />
            );
        }
    } else {
        return null;
    }
}

const ButtonExportOriginal = ({ status, originalFileTxtURL, originalFileWordBlob }) => {
    if (status === CONSTANT.SPEECH_FINISH) {
        if (originalFileTxtURL && originalFileWordBlob) {
            return (
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Export Original
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href={originalFileTxtURL} download='original.txt'>As txt</Dropdown.Item>
                        <Dropdown.Item onClick={() => { saveAs(originalFileWordBlob, 'original.docx') }}>As word</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            )
        } else {
            return (
                <Spinner animation="border" variant="primary" />
            )
        }
    } else {
        return null;
    }
}

const ButtonExportEditable = ({ status, editableFileTxtURL, editableFileWordBlob }) => {
    if (status === CONSTANT.SPEECH_FINISH) {
        if (editableFileTxtURL && editableFileWordBlob) {
            return (
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Export Editable
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href={editableFileTxtURL} download='editable.txt'>As txt</Dropdown.Item>
                        <Dropdown.Item onClick={() => { saveAs(editableFileWordBlob, 'editable.docx') }}>As word</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            )
        } else {
            return (
                <Spinner animation="border" variant="primary" />
            )
        }
    } else {
        return null;
    }
}

export function FormSpeech({
    title,
    onChangeTitle,
    status,
    onClickBtnRecording,
    onClickBtnSubmit,
    onChangeTranscribe,
    transcribeOriginal,
    transcribeFinal,
    transcribeFileURL,
    originalFileTxtURL,
    originalFileWordBlob,
    editableFileTxtURL,
    editableFileWordBlob,
    fileZipURL,
}) {

    const domTxtArea = useRef(null);

    useEffect(() => {
        domTxtArea.current.scrollTop = domTxtArea.current.scrollHeight;
    }, [transcribeOriginal])

    const renderRecordingInput = () => {
        if (status == CONSTANT.SPEECH_INITIAL) {
            return (<Button size="sm" onClick={onClickBtnRecording}>Start Recording</Button>)
        }
        else if (status == CONSTANT.SPEECH_IN_PROGRESS) {
            return (<Button size="sm" onClick={onClickBtnRecording}>Stop Recording</Button>)
        }
        else if (status == CONSTANT.SPEECH_FINISH) {
            if (transcribeFileURL) {
                return (
                    <div className='d-flex align-items-center '>
                        <audio src={transcribeFileURL} controls></audio>
                    </div>
                )
            } else {
                return "Loading"
            }

        }
    }

    const renderBtnDownloadAudio = () => {
        if (status === CONSTANT.SPEECH_FINISH) {
            if (transcribeFileURL) {
                return (
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Export Audio
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item href={transcribeFileURL} download='audio.wav'>As wav</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                )
            } else {
                return "Loading";
            }
        } else {
            return null;
        }
    }

    return (
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" placeholder="Enter title" value={title} onChange={onChangeTitle} required />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Speech</Form.Label>
                <Form.Group className="mb-3">
                    {renderRecordingInput()}
                </Form.Group>
                <div className='d-flex w-100'>
                    <div className='d-flex flex-column w-100'>
                        <span>Original Transcribe</span>
                        <textarea ref={domTxtArea} className='d-flex w-100 me-2' style={{ background: '#ccc' }} placeholder="Press Start Recoding and speak into your mic" rows="10" readOnly value={transcribeOriginal} />
                    </div>
                    <div className='d-flex flex-column w-100'>
                        <span className='ms-2'>Editable Transcribe</span>
                        <textarea className='d-flex w-100 ms-2' onChange={onChangeTranscribe} placeholder="Press Start Recoding and speak into your mic" rows="10" value={transcribeFinal} />
                    </div>

                </div>
            </Form.Group>

            <div className="d-flex justify-content-between">
                <Stack direction="horizontal" gap={3}>
                    {renderBtnDownloadAudio()}
                    <ButtonExportOriginal
                        status={status}
                        originalFileTxtURL={originalFileTxtURL}
                        originalFileWordBlob={originalFileWordBlob}
                    />
                    <ButtonExportEditable
                        status={status}
                        editableFileTxtURL={editableFileTxtURL}
                        editableFileWordBlob={editableFileWordBlob}
                    />

                </Stack>
                <ButtonSubmit
                    status={status}
                    fileZipURL={fileZipURL}
                    onClick={onClickBtnSubmit}
                />
            </div>


        </Form >
    );
};