import { generateReportPDF, generateResumePDF, generateBuilderResumePDF } from '../lib/reportGenerator.js';

const ANALYZER_SERVICE_URL = process.env.ANALYZER_SERVICE_URL || 'http://localhost:5002';

export const downloadAnalysisReport = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await fetch(`${ANALYZER_SERVICE_URL}/internal/analysis/${id}`);

        if (!response.ok) {
            if (response.status === 404) return res.status(404).json({ error: "Analysis not found" });
            throw new Error('Failed to fetch analysis from Analyzer Service');
        }
        const analysis = await response.json();
        const pdfBuffer = await generateReportPDF(analysis);

        const fileName = analysis.fileName || "resume.pdf";
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=resume-analysis-${fileName.replace(".pdf", "")}.pdf`
        );
        res.send(pdfBuffer);
    } catch (error) {
        console.error("Download report error:", error);
        res.status(500).json({ error: error.message || "Failed to download analysis report" });
    }
};

export const downloadOptimizedResume = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await fetch(`${ANALYZER_SERVICE_URL}/internal/generate-optimized-resume/${id}`, {
            method: 'POST'
        });

        if (!response.ok) {
            if (response.status === 404) return res.status(404).json({ error: "Analysis not found" });
            throw new Error('Failed to fetch optimized resume from Analyzer Service');
        }
        const data = await response.json();
        const pdfBuffer = await generateResumePDF(data.optimizedResume);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=optimized-resume.pdf`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error("Download optimized resume error:", error);
        res.status(500).json({ error: error.message || "Failed to download optimized resume" });
    }
};

export const downloadBuilderResume = async (req, res) => {
    try {
        const { content, title } = req.body;

        if (!content) {
            return res.status(400).json({ error: "Resume content is required" });
        }

        const pdfBuffer = await generateBuilderResumePDF(content);
        const fileName = (title || "resume").replace(/\s+/g, "_") + ".pdf";
        
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
        res.send(pdfBuffer);
    } catch (error) {
        console.error("Download builder resume error:", error);
        res.status(500).json({ error: error.message || "Failed to generate PDF" });
    }
};
