export class TxtProvider {

    static getTxtFile = async (content) => {
        const blob = new Blob([content], { type: 'text/plain' });
        return {
            fileBlob: blob,
            fileURL: URL.createObjectURL(blob)
        }
    }
}