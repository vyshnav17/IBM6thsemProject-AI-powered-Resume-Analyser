import mongoose from 'mongoose';

const resumeDraftSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        default: 'Untitled Resume'
    },
    content: {
        type: Object, // Stores the JSON representation of the resume
        required: true
    },
    pdfFile: {
        type: Buffer, // Stores the generated PDF binary
        select: false
    },
    lastModified: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
        }
    }
});

export const ResumeDraft = mongoose.model('ResumeDraft', resumeDraftSchema);
