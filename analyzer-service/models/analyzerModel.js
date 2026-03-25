import mongoose from 'mongoose';

const resumeAnalysisSchema = new mongoose.Schema({
    userId: {
        type: String, // Maps to the user ID provided by JWT
        required: true,
        index: true
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
    }]
}, {
    timestamps: true
});

export const ResumeAnalysis = mongoose.model('ResumeAnalysis', resumeAnalysisSchema);
