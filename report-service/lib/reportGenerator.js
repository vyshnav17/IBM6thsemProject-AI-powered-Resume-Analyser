import PDFDocument from "pdfkit";

/**
 * Generates a professional PDF from the optimized resume text.
 */
export async function generateResumePDF(text) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50, autoFirstPage: true });
        const chunks = [];

        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", (err) => reject(err));

        // Fonts
        const titleFont = "Helvetica-Bold";
        const bodyFont = "Helvetica";
        const lightFont = "Helvetica-Oblique";

        const lines = text.split("\n");
        let isFirstLine = true;

        lines.forEach((originalLine) => {
            let line = originalLine.trim();

            if (!line) {
                doc.moveDown(0.5);
                return;
            }

            // Remove AI intros like "Here's an optimized version..."
            if (isFirstLine && line.toLowerCase().includes("here's an optimized") || line.toLowerCase().includes("here is the optimized")) {
                return; // Skip this conversational AI intro
            }

            // Is this a purely bold header? e.g. **Contact Information**
            const isBoldHeader = /^(\*\*|__)(.*?)\1:?$/.test(line);
            
            // Clean markdown bold tags from anywhere in the string
            line = line.replace(/\*\*|__/g, "");

            // Name / Title at the very top
            if (isFirstLine) {
                isFirstLine = false;
                doc.font(titleFont).fontSize(24).fillColor("#111827").text(line, { align: 'center' });
                doc.moveDown(0.5);
                return;
            }

            // Section Headers (either all caps, or bold headers like **Experience**)
            if (isBoldHeader || /^[A-Z\s]{5,}$/.test(line)) {
                doc.moveDown();
                doc.font(titleFont).fontSize(14).fillColor("#1e40af").text(line.toUpperCase());
                doc.moveDown(0.3);
                // Subtle divider
                doc.moveTo(50, doc.y).lineTo(545, doc.y).lineWidth(1).strokeColor("#e5e7eb").stroke();
                doc.moveDown(0.5);
            }
            // Bullet points
            else if (line.startsWith("•") || line.startsWith("-") || line.startsWith("*")) {
                const cleanLine = line.replace(/^[\s\*\-\•]+/, "");
                doc.font(bodyFont).fontSize(11).fillColor("#374151")
                   .text(`•  ${cleanLine}`, { indent: 15, paragraphGap: 2 });
            }
            // Roles / Dates (Typical subheader patterns like "Software Engineer | 2020 - Present")
            else if (line.includes("|") || line.match(/\d{4}\s*-\s*(Present|\d{4})/i)) {
                doc.font(titleFont).fontSize(12).fillColor("#1f2937").text(line, { paragraphGap: 2 });
            }
            // Normal Text
            else {
                doc.font(bodyFont).fontSize(11).fillColor("#4b5563").text(line, { paragraphGap: 2 });
            }
        });

        doc.end();
    });
}

/**
 * Generates a comprehensive PDF report of the resume analysis.
 */
export async function generateReportPDF(analysis) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        const chunks = [];

        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", (err) => reject(err));

        // Header
        doc.font("Helvetica-Bold").fontSize(20).fillColor("#1e40af").text("RESUME ANALYSIS REPORT", { align: "center" });
        doc.moveDown();

        doc.font("Helvetica").fontSize(10).fillColor("#6b7280")
            .text(`File: ${analysis.fileName}`)
            .text(`Analysis Date: ${new Date().toLocaleDateString()}`);
        doc.moveDown();

        // Overall Score
        doc.font("Helvetica-Bold").fontSize(16).fillColor("#111827").text(`Overall Score: ${analysis.overallScore}/100`);
        doc.moveDown(0.5);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor("#e5e7eb").stroke();
        doc.moveDown();

        // Scores Breakdown
        doc.font("Helvetica-Bold").fontSize(14).fillColor("#1e40af").text("DETAILED SCORES");
        doc.moveDown(0.5);
        const scoreItems = [
            { label: "Formatting", value: analysis.scores.formatting },
            { label: "Content", value: analysis.scores.content },
            { label: "Keywords", value: analysis.scores.keywords },
            { label: "Experience", value: analysis.scores.experience },
        ];
        scoreItems.forEach(item => {
            doc.font("Helvetica").fontSize(11).fillColor("#374151").text(`${item.label}: ${item.value}%`);
        });
        doc.moveDown();

        // Strengths
        doc.font("Helvetica-Bold").fontSize(14).fillColor("#1e40af").text("STRENGTHS");
        doc.moveDown(0.5);
        analysis.strengths.forEach((s) => {
            doc.font("Helvetica-Bold").fontSize(11).fillColor("#111827").text(`• ${s.title}`);
            doc.font("Helvetica").fontSize(10).fillColor("#4b5563").text(s.description, { indent: 15 });
            doc.moveDown(0.5);
        });
        doc.moveDown();

        // Recommendations
        doc.font("Helvetica-Bold").fontSize(14).fillColor("#1e40af").text("RECOMMENDATIONS");
        doc.moveDown(0.5);
        analysis.recommendations.forEach((r) => {
            doc.font("Helvetica-Bold").fontSize(11).fillColor("#111827").text(`• ${r.title}`);
            doc.font("Helvetica").fontSize(10).fillColor("#4b5563").text(r.description, { indent: 15 });
            if (r.example) {
                doc.font("Helvetica-Oblique").fontSize(9).fillColor("#6b7280").text(`Example: ${r.example}`, { indent: 15 });
            }
            doc.moveDown(0.5);
        });

        doc.end();
    });
}
/**
 * Generates a professional PDF from structured builder resume data.
 */
export async function generateBuilderResumePDF(data) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50, autoFirstPage: true });
        const chunks = [];

        doc.on("data", (chunk) => chunks.push(chunk));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", (err) => reject(err));

        const { personalInfo, summary, experience, skills } = data;

        // Header - Name
        doc.font("Helvetica-Bold").fontSize(24).fillColor("#111827").text(personalInfo.fullName || "Name", { align: 'center' });
        doc.moveDown(0.2);

        // Contact Info
        const contactLine = [personalInfo.email, personalInfo.phone, personalInfo.location]
            .filter(Boolean)
            .join("  |  ");
        doc.font("Helvetica").fontSize(10).fillColor("#4b5563").text(contactLine, { align: 'center' });
        doc.moveDown(1);

        // Summary
        if (summary) {
            doc.font("Helvetica-Bold").fontSize(14).fillColor("#1e40af").text("PROFESSIONAL SUMMARY");
            doc.moveDown(0.3);
            doc.moveTo(50, doc.y).lineTo(545, doc.y).lineWidth(1).strokeColor("#e5e7eb").stroke();
            doc.moveDown(0.5);
            doc.font("Helvetica").fontSize(11).fillColor("#374151").text(summary, { paragraphGap: 10 });
        }

        // Experience
        if (experience && experience.length > 0) {
            doc.moveDown();
            doc.font("Helvetica-Bold").fontSize(14).fillColor("#1e40af").text("WORK EXPERIENCE");
            doc.moveDown(0.3);
            doc.moveTo(50, doc.y).lineTo(545, doc.y).lineWidth(1).strokeColor("#e5e7eb").stroke();
            doc.moveDown(0.5);

            experience.forEach(exp => {
                doc.font("Helvetica-Bold").fontSize(12).fillColor("#111827").text(`${exp.position} at ${exp.company}`);
                doc.font("Helvetica-Oblique").fontSize(10).fillColor("#6b7280").text(exp.duration);
                doc.moveDown(0.3);
                doc.font("Helvetica").fontSize(11).fillColor("#374151").text(exp.description, { paragraphGap: 5 });
                doc.moveDown(0.8);
            });
        }

        // Skills
        if (skills && skills.length > 0) {
            doc.moveDown();
            doc.font("Helvetica-Bold").fontSize(14).fillColor("#1e40af").text("SKILLS");
            doc.moveDown(0.3);
            doc.moveTo(50, doc.y).lineTo(545, doc.y).lineWidth(1).strokeColor("#e5e7eb").stroke();
            doc.moveDown(0.5);
            doc.font("Helvetica").fontSize(11).fillColor("#374151").text(skills.join(", "), { paragraphGap: 10 });
        }

        doc.end();
    });
}
