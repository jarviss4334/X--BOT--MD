const {Sparky, isPublic} = require("../lib");
const {getString, getJson} = require('./pluginsCore');
const PDFDocument = require("pdfkit");
const {  
    PDFDocument: PDFEditor, 
    rgb, 
    StandardFonts 
} = require("pdf-lib"); 
const PDFLib = PDFEditor;
const lang = getString('converters');
let fs = require('fs');
let pdfStore = {};
let mergePdfStore = {};
let pdfEditStore = {};

Sparky({
    name: "addimg",
    fromMe: isPublic,
    category: "converters",
    desc: "Add image to PDF list",
}, async ({ m }) => {

    if (!m.quoted || !m.quoted.message.imageMessage) {
        return m.reply("❌ Reply to an image");
    }

    await m.react("☠️");

    const buffer = await m.quoted.download();

    if (!pdfStore[m.jid]) pdfStore[m.jid] = [];

    pdfStore[m.jid].push({
        type: "image",
        content: buffer
    });

    await m.react("🍻");
    m.reply(`➤ Image added (${pdfStore[m.jid].length})`);
});

Sparky({
    name: "addtext",
    fromMe: isPublic,
    category: "converters",
    desc: "Add text to PDF",
}, async ({ m }) => {

    const text = m.quoted?.text || m.text.split(" ").slice(1).join(" ");

    if (!text) return m.reply("❌ Provide or reply to text");

    if (!pdfStore[m.jid]) pdfStore[m.jid] = [];

    pdfStore[m.jid].push({
        type: "text",
        content: text
    });

    m.reply(`➤ Text added (${pdfStore[m.jid].length})`);
});

Sparky({
    name: "pdf",
    fromMe: isPublic,
    category: "converters",
    desc: "Convert stored images into PDF",
}, async ({ m, client }) => {

    try {
        if (!pdfStore[m.jid] || pdfStore[m.jid].length === 0) {
            return m.reply("⚠️ No images stored");
        }

        await m.react("☠️");

        const filePath = `./temp_${Date.now()}.pdf`;
        const doc = new PDFDocument();

        doc.pipe(fs.createWriteStream(filePath));

pdfStore[m.jid].forEach((item, index) => {

    if (index !== 0) doc.addPage();

    if (item.type === "image") {
        doc.image(item.content, {
            fit: [500, 700],
            align: "center",
            valign: "center"
        });
    }

    if (item.type === "text") {
        doc
          .fontSize(16)
          .text(item.content, {
              align: "left"
          });
        }
        });
        

        doc.end();

        setTimeout(async () => {
            await client.sendMessage(m.jid, {
                document: fs.readFileSync(filePath),
                mimetype: "application/pdf",
                fileName: "xbotmd.pdf"
            }, { quoted: m });

            fs.unlinkSync(filePath);
            pdfStore[m.jid] = []; 

            await m.react("🍻");
        }, 2000);

    } catch (err) {
        console.log(err);
        await m.react("❌");
        m.reply("Error creating PDF 😅");
    }
});

Sparky({
    name: "clearimg",
    fromMe: isPublic,
    category: "converters",
    desc: "Clear stored images",
}, async ({ m }) => {
    pdfStore[m.jid] = [];
    m.reply("➤ Cleared stored images");
});

Sparky({
    name: "cleartext",
    fromMe: isPublic,
    category: "converters",
    desc: "Clear stored text + images",
}, async ({ m }) => {
    pdfStore[m.jid] = [];
    m.reply("➤ Cleared all PDF content");
});

Sparky({
    name: "add",
    fromMe: isPublic,
    category: "converters",
    desc: "Add PDF to merge list",
}, async ({ m }) => {

    if (!m.quoted || !m.quoted.message.documentMessage) {
        return m.reply("❌ Reply to a PDF file");
    }

    const mime = m.quoted.message.documentMessage.mimetype;
    if (!mime.includes("pdf")) {
        return m.reply("❌ Only PDF files allowed");
    }

    await m.react("☠️");

    const buffer = await m.quoted.download();

    if (!mergePdfStore[m.jid]) mergePdfStore[m.jid] = [];

    mergePdfStore[m.jid].push(buffer);

    await m.react("🍻");
    m.reply(`➤ PDF added (${mergePdfStore[m.jid].length})`);
});

Sparky({
    name: "merge",
    fromMe: isPublic,
    category: "converters",
    desc: "Merge added PDFs",
}, async ({ m, client }) => {

    const files = mergePdfStore[m.jid];

    if (!files || files.length < 2) {
        return m.reply("❌ Need at least 2 PDFs");
    }

    try {
        await m.react("☠️");

        const mergedPdf = await PDFLib.create();


        for (let file of files) {
            const pdf = await PDFLib.load(file);
            const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());

            pages.forEach((page) => mergedPdf.addPage(page));
        }

        const mergedBytes = await mergedPdf.save();

        await client.sendMessage(
            m.jid,
            {
                document: Buffer.from(mergedBytes),
                mimetype: "application/pdf",
                fileName: "xbotmdmerged.pdf"
            },
            { quoted: m }
        );

        mergePdfStore[m.jid] = [];

        await m.react("🍻");

    } catch (err) {
        console.log(err);
        await m.react("❌");
        m.reply("Error merging PDFs 😅");
    }
});

Sparky({
    name: "split",
    fromMe: isPublic,
    category: "converters",
    desc: "Split PDF pages (range)"
}, async ({ m, client, args }) => {
    if (!m.quoted || !m.quoted.message.documentMessage)
        return m.reply("❌ Reply to a PDF");
    const mime = m.quoted.message.documentMessage.mimetype;
    if (!mime.includes("pdf"))
        return m.reply("❌ Only PDF allowed");
    if (!args.includes(";"))
        return m.reply("Usage:\nsplit 1;5");
    try {
        await m.react("☠️");
        let [start, end] = args.split(";").map(n => parseInt(n));
        if (!start || !end || start < 1 || end < start)
            return m.reply("❌ Invalid range");
        const buffer = await m.quoted.download();
        const pdfDoc = await PDFEditor.load(buffer);
        const totalPages = pdfDoc.getPageCount();
        if (end > totalPages) end = totalPages;
        const newPdf = await PDFEditor.create();
        const pagesToCopy = [];
        for (let i = start - 1; i < end; i++) {
            pagesToCopy.push(i);
        }
        const copiedPages = await newPdf.copyPages(pdfDoc, pagesToCopy);
        copiedPages.forEach(p => newPdf.addPage(p));
        const pdfBytes = await newPdf.save();
        await client.sendMessage(m.jid, {
            document: Buffer.from(pdfBytes),
            mimetype: "application/pdf",
            fileName: `xbotmdsplitted.pdf`
        }, { quoted: m });
        await m.react("🍻");

    } catch (err) {
        console.log(err);
        await m.react("❌");
        m.reply("Error splitting PDF");
    }
});

Sparky({
    name: "clear",
    fromMe: isPublic,
    category: "converters",
    desc: "Clear stored PDFs",
}, async ({ m }) => {
    mergePdfStore[m.jid] = [];
    m.reply("➤ Cleared stored PDFs");
});

Sparky({
    name: "pdfstart",
    fromMe: isPublic,
    category: "converters",
    desc: "Start PDF editing session"
}, async ({ m }) => {
    if (!m.quoted || !m.quoted.message.documentMessage)
        return m.reply("❌ Reply to a PDF");
    const mime = m.quoted.message.documentMessage.mimetype;
    if (!mime.includes("pdf"))
        return m.reply("❌ Not a PDF");

    try {
        await m.react("☠️");
        const buffer = await m.quoted.download();
        const pdfDoc = await PDFEditor.load(buffer);
        pdfEditStore[m.jid] = {
        doc: pdfDoc,
        cursor: {},
        deleteQueue:[]
        };

        await m.react("🍻");
m.reply(`╭━━━〔 𝙋𝘿𝙁 𝙀𝘿𝙄𝙏𝙊𝙍 〕━━━⬣
┃
┃  ⚡ STATUS : ACTIVE
┃  📄 PAGES  : ${pdfDoc.getPageCount()}
┃
┣━━━〔  TEXT 〕━━━⬣
┃  write <page> "text"
┃  ➤ Auto adds at top 
┃
┣━━━〔  IMAGE 〕━━━⬣
┃  pdfimg <page> <x> <y> [w] [h]
┃
┃   ALIGNMENT SHORTCUTS:
┃   center        → x:150  y:350
┃   left-center   → x:20   y:350
┃   right-center  → x:300  y:350
┃   top-left      → x:20   y:700
┃   top-right     → x:300  y:700
┃   bottom-left   → x:20   y:50
┃   bottom-right  → x:300  y:50
┃   top-center    → x:150  y:700
┃   bottom-center → x:150  y:50
┃   full          → x:0    y:0   w:600 h:800
┃
┣━━━〔 EDIT 〕━━━⬣
┃   delpage <page>
┃
┣━━━〔 SAVE 〕━━━⬣
┃  returnpdf
┃  cancelpdf
┃
╰━━━━━━━━━━━━━━━━━━⬣`);
    } catch (err) {
        console.log(err);
        await m.react("❌");
        m.reply("Error loading PDF");
    }
});

Sparky({
    name: "write",
    fromMe: isPublic,
    category: "converters",
    desc: "Top-aligned clean text writer"
}, async ({ m, args }) => {

    if (!pdfEditStore[m.jid])
        return m.reply(" Start with pdfstart");
    const match = args.match(/^(\d+)\s+"([\s\S]+)"$/);
    if (!match)
        return m.reply('Usage:\nwrite 1 "your full text here"');
    const pageNum = parseInt(match[1]);
    const text = match[2]; 
    try {
        const store = pdfEditStore[m.jid];
        const pdfDoc = store.doc;
        let pageIndex = pageNum - 1;
        if (isNaN(pageIndex) || pageIndex < 0)
            return m.reply(" Invalid page");
        while (pdfDoc.getPageCount() <= pageIndex) {
            pdfDoc.addPage();
        }

        const pages = pdfDoc.getPages();
        const page = pages[pageIndex];
        if (!page) return m.reply("Page error");
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontSize = 16;
        const lineHeight = 22;
        const { width, height } = page.getSize();
        const marginX = 50;
        const marginY = height - 50;
        const maxWidth = width - 100;
        let y = marginY;
        const lines = text.split("\n");
        for (let rawLine of lines) {
            let words = rawLine.split(" ");
            let line = "";
            for (let word of words) {
                let testLine = line + word + " ";
                let textWidth = font.widthOfTextAtSize(testLine, fontSize);
                if (textWidth > maxWidth) {
                    page.drawText(line, {
                        x: marginX,
                        y: y,
                        size: fontSize,
                        font,
                        color: rgb(0, 0, 0),
                    });
                    line = word + " ";
                    y -= lineHeight;
                    if (y < 50) {
                        pdfDoc.addPage();
                        const newPages = pdfDoc.getPages();
                        const newPage = newPages[newPages.length - 1];
                        y = newPage.getSize().height - 50;
                        page = newPage;
                    }

                } else {
                    line = testLine;
                }
            }
            if (line) {
                page.drawText(line, {
                    x: marginX,
                    y: y,
                    size: fontSize,
                    font,
                    color: rgb(0, 0, 0),
                });

                y -= lineHeight;
            }
        }

        m.reply("➤ Text added ");

    } catch (err) {
        console.log(err);
        m.reply("Error writing text");
    }
});
Sparky({
    name: "pdfimg",
    fromMe: isPublic,
    category: "converters",
    desc: "Smart image insert (editor mode)"
}, async ({ m, args }) => {
    if (!pdfEditStore[m.jid])
        return m.reply("❌ Start with pdfstart");
    if (!m.quoted || !m.quoted.message.imageMessage)
        return m.reply("❌ Reply to image");
    let [pageNum, width, height] = args.split(" ");
    if (!pageNum)
        return m.reply(`Usage:
pdfimg <page>
pdfimg <page> <width> <height>`);

    try {
        const store = pdfEditStore[m.jid];
        const pdfDoc = store.doc;
        let pageIndex = parseInt(pageNum) - 1;
        while (pdfDoc.getPageCount() <= pageIndex) {
            pdfDoc.addPage();
        }

        let page = pdfDoc.getPages()[pageIndex];
        const imgBuffer = await m.quoted.download();
        let image;
        try {
            image = await pdfDoc.embedJpg(imgBuffer);
        } catch {
            image = await pdfDoc.embedPng(imgBuffer);
        }
        const imgDims = image.scale(1);
        const finalWidth = width ? parseInt(width) : imgDims.width;
        const finalHeight = height ? parseInt(height) : imgDims.height;
        const { height: pageHeight } = page.getSize();
        if (!store.imgCursor) store.imgCursor = {};
        if (!store.imgCursor[pageIndex]) {
            store.imgCursor[pageIndex] = pageHeight - 50;
        }
        let y = store.imgCursor[pageIndex];
        if (y - finalHeight < 50) {
            pdfDoc.addPage();
            pageIndex++;
            page = pdfDoc.getPages()[pageIndex];
            store.imgCursor[pageIndex] = page.getSize().height - 50;
            y = store.imgCursor[pageIndex];
        }

        page.drawImage(image, {
            x: 50,
            y: y - finalHeight,
            width: finalWidth,
            height: finalHeight
        });

        store.imgCursor[pageIndex] = y - finalHeight - 20;

        m.reply("➤ Image added");

    } catch (err) {
        console.log(err);
        m.reply("Error adding image");
    }
});

Sparky({
    name: "delpage",
    fromMe: isPublic,
    category: "converters",
    desc: "Queue page deletion"
}, async ({ m, args }) => {
    if (!pdfEditStore[m.jid])
        return m.reply(" Start with pdfstart");
    const pageNum = parseInt(args);
    if (!pageNum)
        return m.reply("Usage: delpage 2");
    const store = pdfEditStore[m.jid];
    const totalPages = store.doc.getPageCount();
    if (pageNum < 1 || pageNum > totalPages)
        return m.reply(" Page not found");
    if (!store.deleteQueue.includes(pageNum)) {
        store.deleteQueue.push(pageNum);
    }
    m.reply(`➤ Page ${pageNum} marked for deletion`);
});

Sparky({
    name: "delrange",
    fromMe: isPublic,
    category: "converters",
    desc: "Delete range of pages"
}, async ({ m, args }) => {
    if (!pdfEditStore[m.jid])
        return m.reply(" Start with pdfstart");
    const match = args.match(/^(\d+);(\d+)$/);
    if (!match)
        return m.reply("Usage: delrange 1;10");
    let start = parseInt(match[1]);
    let end = parseInt(match[2]);
    if (start > end) [start, end] = [end, start];
    const store = pdfEditStore[m.jid];
    const total = store.doc.getPageCount();
    if (start < 1 || end > total)
        return m.reply(" Invalid page range");
    if (!store.deleteQueue) store.deleteQueue = [];
    for (let i = start; i <= end; i++) {
        if (!store.deleteQueue.includes(i)) {
            store.deleteQueue.push(i);
        }
    }
    m.reply(`➤ Pages ${start} → ${end} marked for deletion`);
});

Sparky({
    name: "extract",
    fromMe: isPublic,
    category: "converters",
    desc: "Extract page range (use returnpdf to get file)"
}, async ({ m, args }) => {
    if (!pdfEditStore[m.jid])
        return m.reply("❌ Start with pdfstart");
    if (!args.includes(";"))
        return m.reply("Usage: extract 1;5");
    try {
        const [start, end] = args.split(";").map(n => parseInt(n));
        if (!start || !end || start > end)
            return m.reply("❌ Invalid range");
        const pdfDoc = pdfEditStore[m.jid].doc;
        if (end > pdfDoc.getPageCount())
            return m.reply("❌ Range exceeds pages");
        pdfEditStore[m.jid].extractRange = {
            start,
            end
        };
        m.reply(`➤ Extract range set`);
    } catch (err) {
        console.log(err);
        m.reply("Error setting extract range");
    }
});

Sparky({
    name: "returnpdf",
    fromMe: isPublic,
    category: "converters",
    desc: "Save edited PDF"
}, async ({ m, client, args }) => {
    if (!pdfEditStore[m.jid])
        return m.reply(" No active session");
    try {
        await m.react("☠️");
        let pdfDoc = pdfEditStore[m.jid].doc;
        const store = pdfEditStore[m.jid];
        if (store.extractRange) {
        const { start, end } = store.extractRange;
        const newDoc = await PDFEditor.create();
        const indexes = [];
        for (let i = start - 1; i <= end - 1; i++) {
        indexes.push(i);
        }
        const pages = await newDoc.copyPages(pdfDoc, indexes);
        pages.forEach(p => newDoc.addPage(p));
        pdfDoc = newDoc;
        }
        if (store.deleteQueue && store.deleteQueue.length > 0) {
            const newDoc = await PDFEditor.create();
            const deleteIndexes = store.deleteQueue
                .map(p => p - 1)
                .sort((a, b) => b - a);
            const keepIndexes = pdfDoc.getPageIndices()
                .filter(i => !deleteIndexes.includes(i));
            const pages = await newDoc.copyPages(pdfDoc, keepIndexes);
            pages.forEach(p => newDoc.addPage(p));
            pdfDoc = newDoc;
        }
        const finalBytes = await pdfDoc.save();
        let fileName = "xbotmdedited.pdf";
        if (args) {
            const match = args.match(/"(.+?)"/);
            if (match) {
                fileName = match[1];
                if (!fileName.toLowerCase().endsWith(".pdf")) {
                    fileName += ".pdf";
                }
            }
        }
        await client.sendMessage(m.jid, {
            document: Buffer.from(finalBytes),
            mimetype: "application/pdf",
            fileName: fileName
        }, { quoted: m });
        delete pdfEditStore[m.jid];
        await m.react("🍻");
    } catch (err) {
        console.log(err);
        await m.react("❌");
        m.reply("Error saving PDF");
    }
});

Sparky({
    name: "cancel",
    fromMe: isPublic,
    category: "converters",
    desc: "Cancel PDF editing"
}, async ({ m }) => {
    delete pdfEditStore[m.jid];
    m.reply("PDF Neutrilized ➤");
});
