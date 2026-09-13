// منصات الفيديو المدعومة
const SUPPORTED_PLATFORMS = {
    youtube: {
        name: 'YouTube',
        pattern: /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
        icon: '▶️'
    },
    tiktok: {
        name: 'TikTok',
        pattern: /(?:tiktok\.com\/@[^/]+\/video\/(\d+)|vm\.tiktok\.com\/([a-zA-Z0-9]+))/,
        icon: '♪'
    },
    instagram: {
        name: 'Instagram',
        pattern: /(?:instagram\.com\/(?:p|reel)\/([a-zA-Z0-9_-]+))/,
        icon: '📷'
    },
    facebook: {
        name: 'Facebook',
        pattern: /(?:facebook\.com\/.*\/videos?\/\d+)/,
        icon: '📘'
    },
    twitter: {
        name: 'Twitter/X',
        pattern: /(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/,
        icon: '𝕏'
    }
};

// العناصر من الـ DOM
const videoUrlInput = document.getElementById('videoUrl');
const downloadBtn = document.getElementById('downloadBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const resultSection = document.getElementById('resultSection');
const qualityOptions = document.getElementById('qualityOptions');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');
const cancelBtn = document.getElementById('cancelBtn');

// دالة للتحقق من صحة الرابط
function validateUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// دالة لتحديد المنصة
function detectPlatform(url) {
    for (const [platform, config] of Object.entries(SUPPORTED_PLATFORMS)) {
        if (config.pattern.test(url)) {
            return { platform, config };
        }
    }
    return null;
}

// دالة لعرض الخطأ
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    successMessage.style.display = 'none';
    loadingSpinner.style.display = 'none';
    resultSection.style.display = 'none';
}

// دالة لعرض الرسالة الناجحة
function showSuccess(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    errorMessage.style.display = 'none';
}

// دالة لتنسيق حجم الملف
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// دالة لإنشاء خيارات الجودة (محاكاة)
function generateQualityOptions(platform) {
    const qualities = [
        { quality: '1080p', size: 250, fps: '60' },
        { quality: '720p', size: 150, fps: '60' },
        { quality: '480p', size: 75, fps: '30' },
        { quality: '360p', size: 45, fps: '30' },
        { quality: 'Audio Only (MP3)', size: 5, fps: 'N/A' }
    ];

    qualityOptions.innerHTML = '';
    
    qualities.forEach((option, index) => {
        const div = document.createElement('div');
        div.className = 'quality-option';
        div.innerHTML = `
            <div class="quality-info">
                <div class="quality-label">${option.quality}</div>
                <div class="quality-size">الحجم: ${formatFileSize(option.size * 1024 * 1024)} | FPS: ${option.fps}</div>
            </div>
            <button class="btn-primary" onclick="handleDownload('${option.quality}', ${option.size})" style="width: auto;">تحميل</button>
        `;
        qualityOptions.appendChild(div);
    });
}

// دالة معالجة التحميل
function handleDownload(quality, size) {
    showSuccess(`جاري تحميل الفيديو بجودة ${quality} (${formatFileSize(size * 1024 * 1024)})...`);
    resultSection.style.display = 'none';
    
    // محاكاة التحميل
    setTimeout(() => {
        showSuccess(`✅ تم تحميل الفيديو بنجاح! جودة: ${quality}`);
    }, 2000);
}

// معالج حدث زر التحميل
downloadBtn.addEventListener('click', async () => {
    const url = videoUrlInput.value.trim();
    
    // إخفاء الرسائل السابقة
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    resultSection.style.display = 'none';
    
    // التحقق من الرابط
    if (!url) {
        showError('⚠️ الرجاء إدخال رابط الفيديو');
        return;
    }
    
    if (!validateUrl(url)) {
        showError('⚠️ الرجاء إدخال رابط صحيح');
        return;
    }
    
    // تحديد المنصة
    const detection = detectPlatform(url);
    if (!detection) {
        showError('❌ المنصة غير مدعومة حالياً\nالمنصات المدعومة: YouTube, TikTok, Instagram, Facebook, Twitter/X');
        return;
    }
    
    // عرض محمل التحميل
    loadingSpinner.style.display = 'block';
    downloadBtn.disabled = true;
    
    // محاكاة جلب بيانات الفيديو
    setTimeout(() => {
        loadingSpinner.style.display = 'none';
        downloadBtn.disabled = false;
        
        // عرض خيارات الجودة
        generateQualityOptions(detection.platform);
        resultSection.style.display = 'block';
        showSuccess(`✅ تم العثور على الفيديو من ${detection.config.name} ${detection.config.icon}`);
    }, 1500);
});

// معالج زر الإلغاء
cancelBtn.addEventListener('click', () => {
    resultSection.style.display = 'none';
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    videoUrlInput.value = '';
    videoUrlInput.focus();
});

// السماح بالتحميل عند الضغط على Enter
videoUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        downloadBtn.click();
    }
});

// التركيز على حقل الإدخال عند تحميل الصفحة
window.addEventListener('load', () => {
    videoUrlInput.focus();
});