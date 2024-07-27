import { Blob } from "buffer";
const parser = require('lambda-multipart-parser');

/**
 * Converts a Base64-encoded string into a Blob object.
 * @param {string} base64 - The Base64-encoded string
 * @returns {Blob} A Blob object representing the decoded data with the appropriate MIME type.
 */
const base64ToBlob = (base64) => {
    // Split the Base64 string into the metadata and the data
    const [header, data] = base64.split(',');
    // Extract the MIME type from the header
    const mimeType = header.match(/:(.*?);/)[1];
    // Decode the Base64 data
    const byteString = atob(data);
    // Create a byte array
    const ab = new Uint8Array(byteString.length);
    // Populate the byte array with byte values
    for (let i = 0; i < byteString.length; i++) {
        ab[i] = byteString.charCodeAt(i);
    }
    // Create a Blob from the byte array with the extracted MIME type
    return new Blob([ab], { type: mimeType });
}

/**
 * Converts the downloaded Blob data to a Base64 data URL.
 * @param {Blob} data - The Blob object containing the downloaded file data.
 * @returns {Promise<string>} A promise that resolves to the Base64 data URL.
 */
async function blobToBase64DataUrl(data) {
    // Convert the Blob to an ArrayBuffer
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert Buffer to Base64
    const base64data = buffer.toString('base64');

    // Access the MIME type (default to 'image/jpeg' if not available)
    const mimeType = data?.type || 'image/jpeg';

    // Create the data URL
    const dataUrl = `data:${mimeType};base64,${base64data}`;

    return dataUrl;
}

/**
 * This function uses a form parser to process the event and retrieves
 * the avatar file name and a Blob representation of the avatar content.
 * @param {Object} event - The event object containing the incoming request data.
 * @returns {Promise<{ avatarFileName: string, avatarBlob: Blob }>} 
 *          A promise that resolves to an object containing:
 *          - avatarFileName {string} - The name of the uploaded avatar file.
 *          - avatarBlob {Blob} - A Blob representation of the uploaded avatar content.
 */
const parseAvatar = async (event) => {
    const formDataObject = await parser.parse(event);
    const avatarBuffer = Buffer.from(formDataObject.files[0].content);
    const avatarFileName = formDataObject.avatarFileName;
    const avatarBlob = new Blob([avatarBuffer], { type: formDataObject.files[0].contentType });

    return { avatarFileName, avatarBlob };
};

export { base64ToBlob, blobToBase64DataUrl, parseAvatar }