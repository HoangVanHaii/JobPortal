import cloudinary from "../config/cloudinary";

export const uploadToCloudinary = async (folder: string, file: Express.Multer.File): Promise<{ url: string; publicId: string }> => {
    const base64 = file.buffer.toString("base64");
    const dataURI = `data:${file.mimetype};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataURI, {
        folder: `JobPortal/${folder}`,
        resource_type: "auto",
    });

    return {
        url: result.secure_url,
        publicId: result.public_id
    };
};