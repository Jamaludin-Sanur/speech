class RecordStream {

    mediaRecorder = null;
    recordedChunk = [];
    wavFileBlob = null;
    wavFileURL = null;

    setStream = async (stream) => {
        this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    }

    startStreaming = (callback) => {
        const self = this;
        this.mediaRecorder.addEventListener('dataavailable', function (e) {
            if (e.data.size > 0) self.recordedChunk.push(e.data);
        });

        this.mediaRecorder.addEventListener('stop', function () {
            const blob = new Blob(self.recordedChunk);
            self.wavFileBlob = blob;
            self.wavFileURL = URL.createObjectURL(blob);
            if (typeof callback === 'function') {
                callback({
                    fileBlob: self.wavFileBlob,
                    fileURL: self.wavFileURL
                })
            };
        });

        this.mediaRecorder.start();
    }

    stopStreaming = () => {
        this.mediaRecorder.stop();
    }

    buildRecordFile = () => {
        const blob = new Blob(this.recordedChunk);
        return {
            fileBlob: blob,
            fileURL: URL.createObjectURL(blob)
        }
    }
}

export default RecordStream;