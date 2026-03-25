import mongoose from 'mongoose';

const resumeAnalysisSchema = new mongoose.Schema({
    userId: {
        type: String, // Maps to the user ID provided by JWT
        required: true,
        index: true
    },
    fileName: {
        type: String,
        default: 'resume.pdf'
    },
    fileSize: {
        type: Number,
        default: 0
    },
    extractedText: {
        type: String,
        default: ''
    },
    overallScore: {
        type: Number,
        required: true
    },
    scores: {
        formatting: Number,
        content: Number,
        keywords: Number,
        experience: Number
    },
    strengths: [{
        title: String,
        description: String
    }],
    recommendations: [{
        title: String,
        description: String,
        example: String
    }],
    sectionAnalysis: {
        contact: Number,
        summary: Number,
        experience: Number,
        education: Number,
        skills: Number
    },
    atsCompatibility: [{
        title: String,
        status: String,
        description: String
    }],
    originalFile: {
        type: Buffer
    },
    originalFileType: {
        type: String
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
            delete ret.originalFile;
            delete ret.originalFileType;
        }
    }
});

export const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
