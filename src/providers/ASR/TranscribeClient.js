import {
  TranscribeStreamingClient,
  StartStreamTranscriptionCommand,
} from "@aws-sdk/client-transcribe-streaming";
import { ASRConfig } from "../../configs"
import moment from 'moment';
class TranscribeClient {

  transcribeClient = null;
  micStream = null;
  text = "";

  constructor({ accessKey, secretKey }) {
    this.transcribeClient = new TranscribeStreamingClient({
      region: 'ap-southeast-2',
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey
      }
    });
  }

  setMicrophoneStream = async (micStream) => {
    this.micStream = micStream;
  }

  startStreaming = async (callback) => {
    const command = new StartStreamTranscriptionCommand({
      LanguageCode: 'en-US',
      MediaEncoding: "pcm",
      MediaSampleRateHertz: ASRConfig.ASR_SAMPLE_RATE,
      AudioStream: this.micStream.getAudioStream(),
    });
    const data = await this.transcribeClient.send(command);
    const startDate = moment();
    let index = 0;
    const existingTime = {};

    for await (const event of data.TranscriptResultStream) {
      for (const result of event.TranscriptEvent.Transcript.Results || []) {
        if (result.IsPartial === false) {
          if (result.Alternatives[0]) {
            const timeFormat = startDate.clone().add(parseInt(result.StartTime), 's').format('HH:mm:ss');
            let partialText = `[${timeFormat}] :\n`;
            partialText += result.Alternatives[0].Transcript || '';
            partialText += '\n\n';
            this.text += partialText;
            callback("" + partialText, this.text);
          }
        }
      }
    }
  }

}

export default TranscribeClient;