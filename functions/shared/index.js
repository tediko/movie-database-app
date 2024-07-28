import { Blob } from "buffer";
const parser = require('lambda-multipart-parser');

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

export { parseAvatar }