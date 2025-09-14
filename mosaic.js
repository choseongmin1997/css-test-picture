/**
 * 배열의 중앙값을 계산하는 헬퍼 함수.
 * @param {number[]} arr - 정렬된 숫자 배열
 * @returns {number} 중앙값
 */
function getMedian(arr) {
    const midIndex = Math.floor(arr.length / 2);
    if (arr.length % 2 === 0) {
        // 배열의 길이가 짝수일 경우, 중앙의 두 값의 평균을 반환
        return Math.round((arr[midIndex - 1] + arr[midIndex]) / 2);
    } else {
        // 배열의 길이가 홀수일 경우, 중앙값을 반환
        return arr[midIndex];
    }
}

/**
 * 이미지에 중앙값(median)을 사용한 모자이크 효과를 적용한 새로운 이미지 데이터 URL을 반환합니다.
 * @param {HTMLCanvasElement} sourceCanvas - 원본 이미지가 그려진 캔버스
 * @param {number} blockSize - 모자이크 사각형의 한 변의 길이 (픽셀)
 * @returns {string|null} 변경된 이미지의 Data URL 또는 오류 시 null
 */
export function applyMosaicWithMedian(sourceCanvas, blockSize) {
    const sourceCtx = sourceCanvas.getContext('2d');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const sourceWidth = sourceCanvas.width;
    const sourceHeight = sourceCanvas.height;
    canvas.width = sourceWidth;
    canvas.height = sourceHeight;
 
    let y = 0;
    while (y < sourceHeight) {
        // 1. 현재 행의 높이를 무작위로 결정합니다. (기본 블록 크기의 90% ~ 100%)
        const minRowSize = Math.ceil(blockSize * 0.9);
        const randomRowHeight = Math.floor(Math.random() * (blockSize - minRowSize + 1)) + minRowSize;
        // 이미지 경계를 넘지 않도록 행 높이를 조정합니다.
        const rowHeight = Math.min(randomRowHeight, sourceHeight - y);
 
        let x = 0;
        while (x < sourceWidth) {
            // 2. 현재 블록의 너비를 무작위로 결정합니다.
            const minColSize = Math.ceil(blockSize * 0.9);
            const randomColWidth = Math.floor(Math.random() * (blockSize - minColSize + 1)) + minColSize;
            // 이미지 경계를 넘지 않도록 블록 너비를 조정합니다.
            const blockWidth = Math.min(randomColWidth, sourceWidth - x);
 
            // 이 블록의 높이는 현재 행의 높이와 같습니다.
            const blockHeight = rowHeight;
 
            try {
                // 3. 계산된 블록의 픽셀 데이터를 가져와 중앙값 색상을 계산합니다.
                const regionImageData = sourceCtx.getImageData(x, y, blockWidth, rowHeight);
                const data = regionImageData.data;
 
                const reds = [], greens = [], blues = [];
                for (let i = 0; i < data.length; i += 4) {
                    reds.push(data[i]);
                    greens.push(data[i + 1]);
                    blues.push(data[i + 2]);
                }
 
                const medianR = getMedian(reds.sort((a, b) => a - b));
                const medianG = getMedian(greens.sort((a, b) => a - b));
                const medianB = getMedian(blues.sort((a, b) => a - b));
 
                // 4. 계산된 색상으로 사각형을 그립니다.
                ctx.fillStyle = `rgb(${medianR}, ${medianG}, ${medianB})`;
                ctx.fillRect(x, y, blockWidth, blockHeight);
 
            } catch (e) {
                console.error("Failed to process image data.", e);
                return null;
            }
            // 5. 다음 블록의 시작 위치로 이동합니다.
            x += blockWidth;
        }
        // 6. 다음 행의 시작 위치로 이동합니다.
        y += rowHeight;
    }
    return canvas.toDataURL();
}