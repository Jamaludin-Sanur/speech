
export class CommonUtility {
    static excludeExtension = (fileName) => {
        return fileName ? fileName.replace(/\.[^/.]+$/, "") : '';
    }
}