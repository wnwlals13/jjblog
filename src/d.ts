/**
 *  블로그 게시글 타입
 */
export type Content = {
  id: string; //게시글 고유번호
  createDate: string; // 게시글 등록날짜
  updateDate: string; // 게시글 수정날짜
  writer: string; // 게시글 작성자
  title: string; // 게시글 제목
  contents: string; // 게시글 내용
  imgUrl: string[]; // 이미지 url
  imgFile?: File[];
};
