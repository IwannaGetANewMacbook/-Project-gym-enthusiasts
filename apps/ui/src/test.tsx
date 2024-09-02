import { TestModel } from './models/test.model';

export function Test(props: TestModel) {
  return (
    <>
      <div>이름: {props.username}</div>
      <div>나이: {props.age}</div>
      <div>사는곳: {props.city}</div>
    </>
  );
}
