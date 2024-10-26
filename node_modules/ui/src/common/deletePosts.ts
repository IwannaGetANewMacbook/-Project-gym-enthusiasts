import api from './api';

export const deletePost = (postId: number, accessToken: string) => {
  return new Promise<void>((resolve, reject) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      api
        .delete(`/posts/${postId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((r) => {
          console.log(r.data);
          alert('해당 게시물이 삭제되었습니다.');
          resolve();
        })
        .catch((e) => {
          console.log(e);
          alert('해당 게시불 삭제에 실패했습니다.');
          reject(e);
        });
    } else {
      reject(new Error('사용자가 삭제를 취소했습니다.'));
    }
  });
};
