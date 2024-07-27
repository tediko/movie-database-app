import { Blob } from "buffer";
const parser = require('lambda-multipart-parser');

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

export { blobToBase64DataUrl, parseAvatar }