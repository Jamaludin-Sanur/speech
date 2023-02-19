import MicrophoneStream from "microphone-stream";
import { Buffer } from "buffer";
import { ASRConfig } from "../../configs"

class MicStream {

  microphoneStream = null;

  setStream = (mediaStream) => {
    this.microphoneStream = new MicrophoneStream();
    this.microphoneStream.setStream(mediaStream);
    return this.microphoneStream;
  }

  stopStreaming = () => {
    this.microphoneStream.stop();
    this.microphoneStream.destroy();
  }

  getAudioStream = async function* () {
    for await (const chunk of this.microphoneStream) {
      if (chunk.length <= ASRConfig.ASR_SAMPLE_RATE) {
        yield {
          AudioEvent: {
            AudioChunk: this.encodePCMChunk(chunk),
          },
        };
      }
    }
  };

  encodePCMChunk = (chunk) => {
    const input = MicrophoneStream.toRaw(chunk);
    let offset = 0;
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < input.length; i++, offset += 2) {
      let s = Math.max(-1, Math.min(1, input[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return Buffer.from(buffer);
  };

}

export default MicStream;