

export const processDate = () => {
    const formattedDateTH = new Date().toLocaleDateString('th-TH', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const formattedDateEN = new Date().toLocaleDateString('en-EN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return {formattedDateTH, formattedDateEN};
}

//card progress bar helper
export const getPocketProgressColor = (current: number, initial: number) => {
    const safeInitial = initial || 1;
    const percentage = Math.max(0, Math.min(100, (current / safeInitial) * 100));

    let progressBg = "bg-emerald-500";
    let progrestext = "text-emerald-500!";
    if (percentage <= 25) {
        progressBg = "bg-rose-500";
        progrestext = "text-rose-500!";
    }
    else if (percentage <= 50) {
        progressBg = "bg-amber-500";
        progrestext = "text-amber-500!";
    } 
    else if (percentage <= 70) {
        progressBg = "bg-yellow-500";
        progrestext = "text-yellow-500!";
    }
    return { percentage, progressBg, progrestext };
};


// generate color tone
// ฟังก์ชันช่วยแปลง Hex Code เป็นค่า RGB
function hexToRgb(hex: string) {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
        cleanHex = cleanHex.split('').map(c => c + c).join('');
    }
    const num = parseInt(cleanHex, 16);
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
    };
}

// ฟังก์ชันแปลง RGB เป็น HSL เพื่อให้ง่ายต่อการปรับความสว่าง (Lightness)
function rgbToHsl(r: number, g: number, b: number) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0; 
    const l = (max + min) / 2; // เปลี่ยนจาก let เป็น const ตรงนี้

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// ฟังก์ชันหลัก: รับสีค่าเดียว (เช่น '#0ea5e9') แล้วแตกเฉดตามจำนวน item
export function generatePaletteFromSingleColor(baseColor: string, count: number): string[] {
    if (count <= 0) return [];
    if (count === 1) return [baseColor];

    const { r, g, b } = hexToRgb(baseColor);
    const { h, s } = rgbToHsl(r, g, b);

    const colors: string[] = [];
    // วนลูปสร้างเฉดสี โดยปรับช่วงความสว่าง (Lightness) จาก 35% ถึง 75%
    for (let i = 0; i < count; i++) {
        const lightness = 35 + (i * (40 / (count - 1)));
        colors.push(`hsl(${h}, ${s}%, ${Math.round(lightness)}%)`);
    }
    return colors;
}
