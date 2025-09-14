/**
 * 이미지 데이터 URL을 파일로 다운로드합니다.
 * @param {string} dataUrl - 다운로드할 이미지의 Data URL.
 * @param {string} filename - 저장할 파일의 이름.
 */
export function downloadImage(dataUrl, filename) {
    if (!dataUrl || !dataUrl.startsWith('data:image')) {
        console.error("No valid image data URL provided for download.");
        alert("다운로드할 이미지가 없습니다.");
        return;
    }

    // 1. 임시 <a> 태그 생성
    const link = document.createElement('a');

    // 2. <a> 태그에 다운로드할 데이터와 파일명 설정
    link.href = dataUrl;
    link.download = filename;

    // 3. <a> 태그를 DOM에 추가하고 프로그래밍 방식으로 클릭하여 다운로드 트리거
    document.body.appendChild(link);
    link.click();

    // 4. 사용이 끝난 <a> 태그를 DOM에서 제거
    document.body.removeChild(link);
}
