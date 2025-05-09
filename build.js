const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');

// Ensure the public directory exists
fs.ensureDirSync('public');
fs.ensureDirSync('public/styles');

// Copy static assets
fs.copySync('src/styles', 'public/styles');

// Read the base template
const template = fs.readFileSync('src/templates/base.html', 'utf-8');

// Function to convert markdown to HTML
function convertMarkdownToHtml(markdown, title) {
    const content = marked(markdown);
    return template
        .replace('{{title}}', title)
        .replace('{{content}}', content);
}

// Process all markdown files in the pages directory
async function buildPages() {
    const pagesDir = 'src/pages';
    const files = await fs.readdir(pagesDir);
    
    for (const file of files) {
        if (file.endsWith('.md')) {
            const content = await fs.readFile(path.join(pagesDir, file), 'utf-8');
            const title = file.replace('.md', '');
            const html = convertMarkdownToHtml(content, title);
            
            // Create the output HTML file
            const outputPath = path.join('public', `${title}.html`);
            await fs.writeFile(outputPath, html);
            console.log(`Built: ${outputPath}`);
        }
    }
}

// Build the site
buildPages().catch(console.error); 