// script.js

// --- BENCHMARK LOGIC ---
const scanConfigs = {
    fast: {
        label: "Fast",
        rv:  { d:"15", k:"0",  gadgets:"3,653",   time:"~5.5s",  pruned:"3,205",   desc:"" },
        x86: { d:"15", k:"0",  gadgets:"3,822",   time:"~8.0s",  pruned:"10,574",  desc:"" },
        arm: { d:"15", k:"0",  gadgets:"3,886",   time:"~5.5s",  pruned:"10,606",  desc:"" }
    },
    balanced: {
        label: "Balanced",
        rv:  { d:"20", k:"5",  gadgets:"7,867",   time:"~7.0s",  pruned:"1,223",   desc:"" },
        x86: { d:"20", k:"5",  gadgets:"27,175",  time:"~9.0s",  pruned:"18,289",  desc:"" },
        arm: { d:"20", k:"5",  gadgets:"26,514",  time:"~6.0s",  pruned:"14,397",  desc:"" }
    },
    deep: {
        label: "Deep",
        rv:  { d:"25", k:"10", gadgets:"7,867",   time:"~7.0s",  pruned:"1,223",   desc:"" },
        x86: { d:"25", k:"10", gadgets:"27,432",  time:"~9.5s",  pruned:"18,557",  desc:"" },
        arm: { d:"25", k:"10", gadgets:"26,733",  time:"~6.0s",  pruned:"14,448",  desc:"" }
    }
};

const architectures = ['rv', 'x86', 'arm'];
const fieldsMap = { depth:'d', dark:'k', gadgets:'gadgets', time:'time', desc:'desc', pruned:'pruned' };

function initStrategies() {
    const container = document.getElementById('strategy-buttons');
    if(!container) return; // fail-safe
    
    Object.keys(scanConfigs).forEach(key => {
        const btn = document.createElement('button');
        btn.id = `btn-${key}`;
        btn.onclick = () => setStrategy(key);
        btn.className = "px-6 py-3 rounded-lg text-sm font-bold transition-all duration-300 text-gray-400 hover:text-white";
        btn.innerText = scanConfigs[key].label;
        container.appendChild(btn);
    });
    setStrategy('fast');
}

function setStrategy(type) {
    const activeClasses   = ['bg-primary','text-darker','shadow-[0_0_15px_rgba(155,219,8,0.4)]'];
    const inactiveClasses = ['text-gray-400','hover:text-white'];

    Object.keys(scanConfigs).forEach(key => {
        const btn = document.getElementById(`btn-${key}`);
        if (!btn) return;
        btn.classList[key === type ? 'add' : 'remove'](...activeClasses);
        btn.classList[key === type ? 'remove' : 'add'](...inactiveClasses);
    });

    architectures.forEach(arch => {
        Object.keys(fieldsMap).forEach(f => {
            const el = document.getElementById(`${arch}-${f}`);
            if (el) el.style.opacity = 0;
        });
    });

    setTimeout(() => {
        architectures.forEach(arch => {
            const data = scanConfigs[type][arch];
            if (!data) return;
            Object.keys(fieldsMap).forEach(f => {
                const el = document.getElementById(`${arch}-${f}`);
                if (el) { el.innerText = data[fieldsMap[f]]; el.style.opacity = 1; }
            });
        });
    }, 150);
}

// Inizializza al caricamento della pagina
document.addEventListener('DOMContentLoaded', initStrategies);

// --- COPY TO CLIPBOARD LOGIC ---
function copyInstall() {
    const textArea = document.createElement("textarea");
    textArea.value = "pip install lcsajdump";
    document.body.appendChild(textArea);
    textArea.select();
    try {
        document.execCommand('copy');
        const toast = document.getElementById('copyToast');
        toast.classList.replace('opacity-0','opacity-100');
        setTimeout(() => toast.classList.replace('opacity-100','opacity-0'), 2000);
    } catch(err) { 
        console.error('Failed to copy', err); 
    }
    document.body.removeChild(textArea);
}
