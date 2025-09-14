import { getCurrentFile } from './imageUploader.js';
import { applyMosaicWithMedian } from './mosaic.js';
import { applyHexagonalMosaic } from './hex-mosaic.js';
import { downloadImage } from './imageDownloader.js';

// 모듈 스코프에 원본 이미지를 관리할 숨겨진 캔버스를 생성합니다.
const sourceCanvas = document.createElement('canvas');
const sourceCtx = sourceCanvas.getContext('2d', { willReadFrequently: true });

/**
 * 이미지 편집 관련 기능을 초기화합니다.
 */
export function initializeImageEditor() {
    const imagePreview = document.getElementById('image-preview');
    const widthInput = document.getElementById('image-width');
    const heightInput = document.getElementById('image-height');
    const blockSizeInput = document.getElementById('block-size');
    const loadingSpinner = document.getElementById('loading-spinner');
    const mosaicButton = document.getElementById('mosaic-button');
    const hexMosaicButton = document.getElementById('hex-mosaic-button');
    const downloadButton = document.getElementById('download-button');

    if (!imagePreview || !widthInput || !heightInput || !blockSizeInput || !mosaicButton || !loadingSpinner || !hexMosaicButton || !downloadButton) {
        console.error("Editor UI elements not found in the DOM. Check your HTML structure.");
        return;
    }

    // 이미지 미리보기(<img />)가 로드될 때마다 실행됩니다.
    imagePreview.addEventListener('load', () => {
        if (!getCurrentFile()) {
            // 이미지가 제거된 경우, 원본 캔버스도 초기화합니다.
            sourceCtx.clearRect(0, 0, sourceCanvas.width, sourceCanvas.height);
            return;
        }

        const width = imagePreview.naturalWidth;
        const height = imagePreview.naturalHeight;

        widthInput.value = width;
        heightInput.value = height;

        // **핵심: 원본 관리용 캔버스에 현재 이미지를 그려넣습니다.**
        sourceCanvas.width = width;
        sourceCanvas.height = height;
        sourceCtx.drawImage(imagePreview, 0, 0, width, height);
    });

    // '모자이크' 버튼 클릭 이벤트
    mosaicButton.addEventListener('click', () => {
        // 입력 필드에서 블록 크기 값을 가져옵니다.
        const blockSize = parseInt(blockSizeInput.value, 10);

        // 입력 값 유효성 검사
        if (isNaN(blockSize) || blockSize <= 0) {
            alert('블록 크기는 1 이상의 숫자여야 합니다.');
            return;
        }

        // 1. 로딩 스피너를 표시합니다.
        loadingSpinner.hidden = false;

        // 2. UI가 스피너를 렌더링할 시간을 주기 위해 setTimeout으로 무거운 작업을 지연시킵니다.
        setTimeout(() => {
            try {
                const newImageDataUrl = applyMosaicWithMedian(sourceCanvas, blockSize);
                if (newImageDataUrl) {
                    imagePreview.src = newImageDataUrl; // 화면의 이미지 소스를 교체
                    alert(`이미지에 ${blockSize}px 크기의 모자이크 효과(중앙값)를 적용했습니다.`);
                }
            } catch (error) {
                console.error("An error occurred during mosaic processing:", error);
                alert("모자이크 처리 중 오류가 발생했습니다.");
            } finally {
                // 3. 작업이 끝나면 성공/실패 여부와 관계없이 스피너를 숨깁니다.
                loadingSpinner.hidden = true;
            }
        }, 10); // 브라우저 렌더링을 위한 최소한의 지연
    });

    // '육각형 모자이크' 버튼 클릭 이벤트
    hexMosaicButton.addEventListener('click', () => {
        const hexRadius = parseInt(blockSizeInput.value, 10);
        if (isNaN(hexRadius) || hexRadius <= 0) {
            alert('블록 크기는 1 이상의 숫자여야 합니다.');
            return;
        }

        loadingSpinner.hidden = false;
        setTimeout(() => {
            try {
                const newImageDataUrl = applyHexagonalMosaic(sourceCanvas, hexRadius);
                if (newImageDataUrl) {
                    imagePreview.src = newImageDataUrl;
                    alert(`이미지에 반지름 ${hexRadius}px 크기의 육각형 모자이크 효과(개념)를 적용했습니다.`);
                }
            } catch (error) {
                console.error("An error occurred during hexagonal mosaic processing:", error);
                alert("육각형 모자이크 처리 중 오류가 발생했습니다.");
            } finally {
                loadingSpinner.hidden = true;
            }
        }, 10);
    });

    // '이미지 다운로드' 버튼 클릭 이벤트
    downloadButton.addEventListener('click', () => {
        const imageSrc = imagePreview.src;
        const originalFile = getCurrentFile();

        if (!originalFile || !imageSrc.startsWith('data:image')) {
            alert("다운로드할 편집된 이미지가 없습니다.");
            return;
        }

        // 새 파일 이름 생성 (예: 'original_edited.png')
        // 캔버스에서 생성된 Data URL은 보통 png 포맷이므로 확장자를 png로 고정하는 것이 안전합니다.
        const originalName = originalFile.name;
        const nameParts = originalName.split('.');
        nameParts.pop(); // 기존 확장자 제거
        const newFilename = `${nameParts.join('.')}_edited.png`;

        downloadImage(imageSrc, newFilename);
    });
}
