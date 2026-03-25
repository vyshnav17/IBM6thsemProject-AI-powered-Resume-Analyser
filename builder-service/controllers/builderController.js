import { ResumeDraft } from '../models/builderModel.js';

const REPORT_SERVICE_URL = process.env.REPORT_SERVICE_URL || 'http://localhost:5003';

export const saveDraft = async (req, res) => {
    try {
        const { title, content, id } = req.body;
        
        let draft;
        if (id) {
            draft = await ResumeDraft.findOneAndUpdate(
                { _id: id, userId: req.user.id },
                { title, content, lastModified: Date.now() },
                { new: true }
            );
        } else {
            draft = await ResumeDraft.create({
                userId: req.user.id,
                title,
                content
            });
        }

        // Generate and store PDF buffer internally
        try {
            const pdfResponse = await fetch(`${REPORT_SERVICE_URL}/internal/generate-builder-pdf`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, title })
            });

            if (pdfResponse.ok) {
                const buffer = await pdfResponse.arrayBuffer();
                draft.pdfFile = Buffer.from(buffer);
                await draft.save();
            }
        } catch (pdfErr) {
            console.error("Internal PDF generation failed for save:", pdfErr.message);
            // Don't fail the whole save if PDF fails
        }

        res.status(id ? 200 : 201).json(draft);
    } catch (error) {
        console.error("Save draft error:", error);
        res.status(500).json({ error: error.message || "Failed to save draft" });
    }
};

export const getDrafts = async (req, res) => {
    try {
        const drafts = await ResumeDraft.find({ userId: req.user.id }).sort({ lastModified: -1 });
        res.json(drafts);
    } catch (error) {
        console.error("Get drafts error:", error);
        res.status(500).json({ error: error.message || "Failed to fetch drafts" });
    }
};

export const getDraftById = async (req, res) => {
    try {
        const draft = await ResumeDraft.findOne({ _id: req.params.id, userId: req.user.id });
        if (!draft) return res.status(404).json({ error: "Draft not found" });
        res.json(draft);
    } catch (error) {
        console.error("Get draft error:", error);
        res.status(500).json({ error: error.message || "Failed to fetch draft" });
    }
};

export const deleteDraft = async (req, res) => {
    try {
        const draft = await ResumeDraft.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!draft) return res.status(404).json({ error: "Draft not found" });
        res.json({ message: "Draft deleted successfully" });
    } catch (error) {
        console.error("Delete draft error:", error);
        res.status(500).json({ error: error.message || "Failed to delete draft" });
    }
};
