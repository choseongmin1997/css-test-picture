import { initializeImageUploader } from './imageUploader.js';
import { initializeImageEditor } from './imageEditor.js';

// DOM이 완전히 로드된 후 스크립트를 실행하여 요소가 누락되는 문제를 방지합니다.
document.addEventListener('DOMContentLoaded', () => {
    // 이미지 업로더 모듈을 초기화합니다.
    initializeImageUploader();
    // 추후 다른 모듈 초기화 코드를 여기에 추가할 수 있습니다.
    // 이미지 에디터 모듈을 초기화합니다.
    initializeImageEditor();
});
