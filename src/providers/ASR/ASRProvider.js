import MicStream from "./MicStream";
import RecordStream from "./RecordStream";
import TranscribeClient from "./TranscribeClient";
import { Buffer } from "buffer";
import process from "process";
import CONSTANT from "../../constants";

// Workaround to handle error 
// 'Buffer is not defined' and
// 'process is not defined'
window.Buffer = window.Buffer || Buffer;
window.process = window.process || process;

export class ASRProvider {

    micStream = null;
    recordStream = null;
    transcribeClient = null;
    isStreaming = false;
    auth = {
        accessKey: null,
        secretKey: null,
        bucketName: null
    }
    _onReceiveTranscribe = null;
    _onReceiveFileRecording = null;

    constructor({ accessKey, secretKey }) {
        // init
        this.micStream = new MicStream();
        this.recordStream = new RecordStream();
        this.transcribeClient = new TranscribeClient({ accessKey, secretKey });
    }

    startASR = async () => {
        // Validation
        if (this.isStreaming) return;

        // Set flag 
        this.isStreaming = true;



        // Create media stream
        const mediaStream = await window.navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true,
        });

        // Set stream for AWS transcribe
        this.micStream.setStream(mediaStream);
        this.transcribeClient.setMicrophoneStream(this.micStream);

        // Set recording stream
        this.recordStream.setStream(mediaStream);

        // Start
        this.recordStream.startStreaming(this._onReceiveFileRecording);
        this.transcribeClient.startStreaming(this._onReceiveTranscribe);
    }

    stopASR = async () => {
        if (!this.isStreaming) return;

        this.micStream.stopStreaming();
        this.recordStream.stopStreaming();
    }

    buildRecordFile = () => {
        return this.recordStream.buildRecordFile();
    }

    onReceiveTranscribe = (callback) => {
        this._onReceiveTranscribe = callback;
    }

    onReceiveFileRecording = (callback) => {
        this._onReceiveFileRecording = callback;
    }
}