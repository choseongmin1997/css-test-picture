import { getCurrentFile } from './imageUploader.js';

/**
 * 이미지 편집 관련 기능을 초기화합니다.
 */
export function initializeImageEditor() {
    const imagePreview = document.getElementById('image-preview');
    const widthInput = document.getElementById('image-width');
    const heightInput = document.getElementById('image-height');

    if (!imagePreview || !widthInput || !heightInput) {
        console.error("Editor UI elements not found in the DOM.");
        return;
    }

    // 이미지 미리보기(<img />)가 로드될 때마다 실행됩니다.
    imagePreview.addEventListener('load', () => {
        // 이미지가 실제로 로드되었는지(src가 유효한지) 확인합니다.
        // getCurrentFile()을 통해 파일이 선택된 상태인지 확인하는 것이 가장 확실합니다.
        if (!getCurrentFile()) {
            return;
        }

        // naturalWidth/Height는 이미지의 원본 크기를 가져옵니다.
        const width = imagePreview.naturalWidth;
        const height = imagePreview.naturalHeight;

        // 편집 도구의 입력 필드에 이미지 크기를 표시합니다.
        widthInput.value = width;
        heightInput.value = height;
    });
}
