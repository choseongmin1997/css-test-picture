let currentFile = null; // 모듈 스코프에 현재 파일을 저장할 변수

/**
 * 현재 선택된 이미지 파일을 반환합니다.
 * @returns {File|null} 현재 파일 객체 또는 선택된 파일이 없으면 null
 */
export function getCurrentFile() {
    return currentFile;
}

/**
 * 이미지 업로드 및 미리보기 기능을 초기화합니다.
 */
export function initializeImageUploader() {
    const imageUploadInput = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const imageContainer = document.getElementById('image-container');
    const uploadLabel = document.querySelector('label[for="image-upload"]');
    const removeButton = document.getElementById('remove-image-button');
    const editorToolbar = document.getElementById('editor-toolbar');
    const container = document.querySelector('.container');

    // 필수 HTML 요소가 존재하는지 확인합니다.
    if (!imageUploadInput || !imagePreview || !imageContainer || !uploadLabel || !removeButton || !editorToolbar || !container) {
        console.error("Required UI elements not found in the DOM. Check your HTML structure.");
        return;
    }

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        currentFile = file; // 파일 선택 시 변수에 저장

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                imagePreview.src = e.target.result;
                imagePreview.hidden = false;
                imageContainer.classList.add('has-image');
                uploadLabel.hidden = true;
                removeButton.hidden = false;
                editorToolbar.hidden = false;
                container.classList.add('editor-active');
            };

            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        // 이미지 및 관련 상태 초기화
        imagePreview.src = ''; // '#' 대신 빈 문자열 사용
        imagePreview.hidden = true;
        imageContainer.classList.remove('has-image');

        // 버튼 상태 되돌리기
        uploadLabel.hidden = false;
        removeButton.hidden = true;
        editorToolbar.hidden = true;
        container.classList.remove('editor-active');

        // input 값을 초기화하여 같은 파일을 다시 선택할 수 있도록 함
        imageUploadInput.value = '';
        currentFile = null; // 저장된 파일 참조 제거
    };

    // 이벤트 리스너 등록
    imageUploadInput.addEventListener('change', handleFileSelect);
    removeButton.addEventListener('click', handleRemoveImage);
}
