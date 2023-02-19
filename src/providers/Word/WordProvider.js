import { Document, Packer, Paragraph, TextRun } from "docx";
export class WordProvider {

    // static getWordFile = async (text) => {
    //     if (!text) return;

    //     const paragraphs = text.split("\n");
    //     const contents = [];
    //     for (const p of paragraphs) {
    //         contents.push(new Paragraph({
    //             children: [new TextRun(p)]
    //         }))
    //     }

    //     const doc = new Document({
    //         sections: [{ children: contents }]
    //     });

    //     let blob = await Packer.toBlob(doc);
    //     const result = blob.slice(0, blob.size, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")

    //     return {
    //         fileBlob: result,
    //         fileURL: URL.createObjectURL(result)
    //     }

    // }

    static getWordFile = async (text) => {
        if (!text) return;
        const doc = new Document();
        const paragraphs = text.split("\n");
        const contents = [];
        for (const p of paragraphs) {
            doc.createParagraph(p);
        }

        const packer = new Packer();

        const blob = await packer.toBlob(doc);
        const result = blob.slice(0, blob.size, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")

        return {
            fileBlob: result,
        }

    }

    // static getWordFile = async (text) => {

    //     var header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
    //         "xmlns:w='urn:schemas-microsoft-com:office:word' " +
    //         "xmlns='http://www.w3.org/TR/REC-html40'>" +
    //         "<head><meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
    //     var footer = "</body></html>";
    //     var sourceHTML = header + text + footer;

    //     var source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    //     return {
    //         fileURL: source,
    //         fileBlob: null,
    //     }

    // }


}