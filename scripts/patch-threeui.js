const fs = require('fs');
const path = require('path');

console.log('[patch-threeui] Checking threeui package files...');

const sourcesDir = path.join(__dirname, '..', 'node_modules', '@designcodeio', 'threeui', 'lib-dist', 'shaders', 'neuform-isolated', 'sources');

if (!fs.existsSync(sourcesDir)) {
    console.log('[patch-threeui] threeui sources directory not found, skipping patch.');
    process.exit(0);
}

const filesToPatch = fs.readdirSync(sourcesDir).filter(file => file.endsWith('.html.js'));

let patchedCount = 0;

filesToPatch.forEach(file => {
    const filePath = path.join(sourcesDir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Ensure <button id="btn"> has span with id="btn-text"
    // Replace <span ...> default text </span> inside button with id="btn-text" if not present
    if (!content.includes('id="btn-text"')) {
        // Regex to match span inside button or relative span
        content = content.replace(
            /(<button[^>]*>[\s\S]*?<span\s+class="[^"]*")/i,
            '$1 id="btn-text"'
        );
        modified = true;
    }

    // 2. Inject message listener if missing or enhance existing message listener
    if (!content.includes('window.addEventListener(\'message\'')) {
        const messageScript = `
    <!-- ThreeUI Runtime Message Handler -->
    <script>
    (function() {
        window.addEventListener('message', function (e) {
            var d = (e.data && e.data.threeuiRuntime) || e.data;
            if (!d) return;
            var text = d.btnText || d.label || d.text;
            if (text) {
                var span = document.getElementById('btn-text') || document.querySelector('button span') || document.querySelector('.btn span');
                if (span) span.textContent = text;
            }
        });
    })();
    <\/script>
`;
        content = content.replace('</body>', `${messageScript}\n</body>`);
        modified = true;
    } else {
        // Ensure the existing message handler updates text even if id="btn-text" wasn't matched
        if (!content.includes('querySelector(\'button span\')')) {
            content = content.replace(
                /document\.getElementById\(['"]btn-text['"]\)/g,
                "(document.getElementById('btn-text') || document.querySelector('button span'))"
            );
            modified = true;
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        patchedCount++;
        console.log(`[patch-threeui] Patched ${file}`);
    }
});

console.log(`[patch-threeui] Complete! Patched ${patchedCount} files.`);
