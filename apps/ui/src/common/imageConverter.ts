// browser-image-compression 라이브러리 import
// 이 라이브러리는 브라우저에서 이미지 파일을 압축하거나 변환할 수 있게 해줌
import imageCompression from 'browser-image-compression';

/**
 * 다양한 확장자의 이미지를 .jpeg 형식으로 변환하는 함수
 * @param files 변환 대상 이미지 File 객체 배열
 * @returns 변환된 File 객체 배열 (모두 image/jpeg 형식으로 변경됨)
 */
export const convertImagesToJpeg = async (files: File[]): Promise<File[]> => {
  console.log('convertImagesToJpeg 함수 호출됨');
  console.log('변환전 파일들: ', files);
  // 변환에 사용할 옵션 설정
  const options = {
    fileType: 'image/jpeg', // 모든 이미지를 JPEG으로 변환
    maxSizeMB: 11, // 최대 파일 용량 제한 (1MB)
    maxwidthOrHeight: 1920, // 최대 너비 또는 높이 (1920px)
    initialQuality: 0.7, // 초기 압축률 설정
    useWebWorker: true, // 성능 향상을 위한 Web Worker 사용
  };

  // 주어진 파일 배열을 순회하면서 변환 실행
  // Promise.all을 사용하여 모든 변환 작업이 완료될 때까지 대기
  // promise.all은 여러개의 비동기 작업을 동시에 병렬로 처리할 수 있게 해줌
  const converted = await Promise.all(
    files.map(async (file) => {
      // 이미 JPEG 형식이면 변환 없이 그대로 반환
      if (file.type === 'image/jpeg') return file;

      try {
        // imageCompression 함수로 이미지 압축 + 포맷 변환
        const compressed = await imageCompression(file, options);

        // 압축된 Blob 데이터를 다시 File 객체로 감싸줌
        return new File(
          [compressed], // Blob 데이터
          file.name.replace(/\.\w+$/, '.jpg'), // 확장자명 강제로 .jpg 로 바꿈
          { type: 'image/jpeg' } // MIME 타입 설정
        );
      } catch (err) {
        // 변환 중 에러 발생 시 콘솔에 출력 후 원본 파일 그대로 사용
        console.error(`이미지 변환 실패: ${file.name}`, err);
        return file;
      }
    })
  );

  // 변환된 파일 배열 반환
  return converted;
};
