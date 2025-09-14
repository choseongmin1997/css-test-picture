/**
 * (개념 증명) 이미지에 육각형 모자이크 효과를 적용합니다.
 * 실제 픽셀 샘플링 로직은 복잡하여 개념적인 단계만 설명합니다.
 * @param {HTMLCanvasElement} sourceCanvas - 원본 이미지가 그려진 캔버스
 * @param {number} hexRadius - 육각형의 반지름 (중심에서 꼭짓점까지의 거리)
 * @returns {string|null} 변경된 이미지의 Data URL 또는 오류 시 null
 */
export function applyHexagonalMosaic(sourceCanvas, hexRadius) {
    const sourceCtx = sourceCanvas.getContext('2d');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const sourceWidth = sourceCanvas.width;
    const sourceHeight = sourceCanvas.height;
    canvas.width = sourceWidth;
    canvas.height = sourceHeight;

    // 육각형 타일링을 위한 기하학적 계산
    const hexWidth = Math.sqrt(3) * hexRadius;
    const hexHeight = 2 * hexRadius;

    // 1. 육각형 그리드를 순회합니다 (엇갈린 형태).
    for (let row = 0; ; row++) {
        const y = row * (hexHeight * 0.75);
        if (y > sourceHeight + hexRadius) break;

        for (let col = 0; ; col++) {
            // 2. 짝수/홀수 행에 따라 x 위치를 조정하여 엇갈리게 만듭니다.
            const x = col * hexWidth + (row % 2 === 1 ? hexWidth / 2 : 0);
            if (x > sourceWidth + hexRadius) break;

            // 3. (가장 어려운 부분) 현재 육각형 내부의 모든 픽셀을 식별합니다.
            //    - 이 과정은 보통 각 픽셀이 육각형의 6개 경계선 내부에 있는지 확인하는 방식으로 이루어집니다.
            //    - 여기서는 개념적으로 중심점의 색상을 샘플링하는 것으로 단순화합니다.
            //    - 실제 구현에서는 이 영역의 평균 또는 중앙값 색상을 계산해야 합니다.
            const sampleX = Math.floor(x);
            const sampleY = Math.floor(y);
            
            if (sampleX < 0 || sampleX >= sourceWidth || sampleY < 0 || sampleY >= sourceHeight) continue;

            const pixelData = sourceCtx.getImageData(sampleX, sampleY, 1, 1).data;
            ctx.fillStyle = `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;

            // 4. 계산된 색상으로 육각형을 그립니다.
            ctx.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = (Math.PI / 180) * (60 * i - 30);
                const vertexX = x + hexRadius * Math.cos(angle);
                const vertexY = y + hexRadius * Math.sin(angle);
                if (i === 0) {
                    ctx.moveTo(vertexX, vertexY);
                } else {
                    ctx.lineTo(vertexX, vertexY);
                }
            }
            ctx.closePath();
            ctx.fill();
        }
    }

    return canvas.toDataURL();
}
