import JSZip from "jszip";

export class ZipProvider {
    static getZipFile = async (keyValueArray) => {
        if (!Array.isArray(keyValueArray)) throw new Error('keyValueArray is required');

        var zip = new JSZip();
        keyValueArray.forEach(item => {
            zip.file(item.key, item.value);
        });
        const blob = await zip.generateAsync({ type: 'blob' });
        return {
            fileBlob: blob,
            fileURL: URL.createObjectURL(blob)
        }
    }

    static readZipFileToBlob = async (blob) => {
        if (!blob) throw new Error('blob is required');

        var zip = new JSZip();
        const result = await zip.loadAsync(blob);
        const zipObjectArray = Object.keys(result.files).map((key) => result.files[key]);
        return zipObjectArray;
        // return Promise.all(
        //     zipObjectArray.map(
        //         async zipObject => {
        //             const blob = await zipObject.async('blob');
        //             return {
        //                 fileName: zipObject.name,
        //                 fileBlob: blob,
        //                 fileURL: URL.createObjectURL(blob),
        //             }

        //         }
        //     )
        // )
    }
}