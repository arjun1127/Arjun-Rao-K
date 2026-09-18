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
    if (!content.includes('id="btn-text"')) {
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
        if (!content.includes('querySelector(\'button span\')')) {
            content = content.replace(
                /document\.getElementById\(['"]btn-text['"]\)/g,
                "(document.getElementById('btn-text') || document.querySelector('button span'))"
            );
            modified = true;
        }
    }

    // 3. Special color patch for aetheris-labs.html.js (About Me Plasma Button -> Purple Shades)
    if (file === 'aetheris-labs.html.js') {
        // Replace blue shader colors with purple shader colors
        if (content.includes("vec3 c1 = vec3(0.002, 0.004, 0.015);") || !content.includes("vec3 c1 = vec3(0.015, 0.003, 0.035);")) {
            content = content.replace(/vec3 c1 = vec3\([^)]+\);/g, "vec3 c1 = vec3(0.015, 0.003, 0.035);");
            content = content.replace(/vec3 c2 = vec3\([^)]+\);/g, "vec3 c2 = vec3(0.22, 0.05, 0.42);");
            content = content.replace(/vec3 c3 = vec3\([^)]+\);/g, "vec3 c3 = vec3(0.68, 0.22, 1.0);");
            
            // Add c4 if not present or update it
            if (!content.includes("vec3 c4")) {
                content = content.replace(
                    "vec3 c3 = vec3(0.68, 0.22, 1.0);",
                    "vec3 c3 = vec3(0.68, 0.22, 1.0);\n            '  vec3 c4 = vec3(0.92, 0.76, 1.0);'"
                );
                content = content.replace(
                    "'  vec3 col = mix(c1, c2, smoothstep(0.1, 0.6, m));',",
                    "'  vec3 col = mix(c1, c2, smoothstep(0.2, 0.52, m));',\n            '  col = mix(col, c3, smoothstep(0.52, 0.8, m));',\n            '  col = mix(col, c4, smoothstep(0.82, 1.02, m));',"
                );
            }
            
            content = content.replace(
                /col \+= vec3\([^)]+\) \* vein \* \([^)]+\);/g,
                "col += vec3(0.72, 0.25, 1.0) * vein * (0.12 + heat * 0.25);"
            );
            
            // Update box shadows & fallback gradient to purple
            content = content.replace(/rgba\(4, 98, 126, 0.2\)/g, "rgba(120, 30, 200, 0.2)");
            content = content.replace(/rgba\(0, 210, 255, 0\.35\)/g, "rgba(160, 50, 240, 0.35)");
            content = content.replace(/hoverStyles = "[^"]*"/g, 'hoverStyles = "0 30px 60px rgba(160, 50, 240, 0.35), 0 4px 12px rgba(2, 6, 20, 0.4)"');
            content = content.replace(/defaultStyles = "[^"]*"/g, 'defaultStyles = "0 24px 48px rgba(120, 30, 200, 0.2), 0 3px 10px rgba(2, 6, 20, 0.35)"');
            content = content.replace(
                /radial-gradient\([^)]+\)/g,
                "radial-gradient(130% 170% at 50% 118%, #c084fc 0%, #9333ea 24%, #4c1d95 56%, #050a19 88%)"
            );
            modified = true;
        }
    }

    // 4. Mute cdn.tailwindcss.com warning & extension message channel errors inside iframe templates
    if (content.includes('cdn.tailwindcss.com') && !content.includes('cdn.tailwindcss.com suppressor')) {
        const suppressScript = `<script>
    /* cdn.tailwindcss.com suppressor */
    (function() {
        var _w = console.warn;
        console.warn = function() {
            if (arguments[0] && typeof arguments[0] === 'string' && (arguments[0].indexOf('cdn.tailwindcss.com') !== -1 || arguments[0].indexOf('Tailwind CSS') !== -1)) return;
            _w.apply(console, arguments);
        };
        window.addEventListener('unhandledrejection', function(e) {
            var m = (e.reason && e.reason.message) || e.reason || '';
            if (typeof m === 'string' && (m.indexOf('asynchronous response') !== -1 || m.indexOf('message channel closed') !== -1)) {
                e.preventDefault();
            }
        });
    })();
    <\/script>\n    <script src="https://cdn.tailwindcss.com">`;

        content = content.replace('<script src="https://cdn.tailwindcss.com">', suppressScript);
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        patchedCount++;
        console.log(`[patch-threeui] Patched ${file}`);
    }
});

console.log(`[patch-threeui] Complete! Patched ${patchedCount} files.`);
