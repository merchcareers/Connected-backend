import multer from 'multer';

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
    fileFilter(req, file, callback) {
        const allowedMimeTypes = [
            'image/png', 'image/jpeg', 'image/webp', // for avatar
            'application/pdf',                        // for resumes
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
            return callback(new Error('Unsupported file format.'));
        }
        callback(null, true);
    },
});
