import { reducerUtils, handleAsyncActions } from "../lib/asyncUtils";
import { takeLatest, put, delay } from "redux-saga/effects";
import shortId from "shortid";
import { addPostMine, removePostMine } from "./user";
import produce from "immer";
import faker from "faker";

// {
// 	id: 1,
// 	User: {
// 		id: 1,
// 		nickname: "제로초",
// 	},
// 	content: "첫 번째 게시글 #해시태그 #익스프레스",
// 	Images: [
// 		{
// 			id: shortId.generate(),
// 			src:
// 				"https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?update=20180726",
// 		},
// 		{
// 			id: shortId.generate(),
// 			src: "https://gimg.gilbut.co.kr/book/BN001958/rn_view_BN001958.jpg",
// 		},
// 		{
// 			id: shortId.generate(),
// 			src: "https://gimg.gilbut.co.kr/book/BN001998/rn_view_BN001998.jpg",
// 		},
// 	],
// 	Comments: [
// 		{
// 			id: shortId.generate(),
// 			User: {
// 				id: shortId.generate(),
// 				nickname: "nero",
// 			},
// 			content: "우와 개정판이 나왔군요~",
// 		},
// 		{
// 			id: shortId.generate(),
// 			User: {
// 				id: shortId.generate(),
// 				nickname: "hero",
// 			},
// 			content: "얼른 사고싶어요~",
// 		},
// 	],
// },

const initialState = {
  mainPosts: [],
  imagePaths: [],
  post: reducerUtils.initial(),
  removePost: reducerUtils.initial(),
  comment: reducerUtils.initial(),
};

export const generateDummyPost = (number) =>
  Array(number)
    .fill()
    .map((v, i) => ({
      id: shortId.generate(),
      User: {
        id: shortId.generate(),
        nickname: faker.name.findName(),
      },
      content: faker.lorem.paragraph(),
      Images: [
        {
          src: faker.image.imageUrl(),
        },
      ],
      Comments: [
        {
          User: {
            id: shortId.generate(),
            nickname: faker.name.findName(),
          },
          content: faker.lorem.sentence(),
        },
      ],
    }));

const newState = initialState.mainPosts.concat(generateDummyPost(10));

initialState.mainPosts = newState;

const dummyPost = (data) => ({
  id: data.id,
  User: {
    id: 1,
    nickname: "제로초",
  },
  content: data.content,
  Images: [],
  Comments: [],
});

const dummyComment = (data) => ({
  id: shortId.generate(),
  User: { nickname: "test" },
  content: data,
});

// 게시글 작성 액션
const ADD_POST = "ADD_POST";
const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
const ADD_POST_ERROR = "ADD_POST_ERROR";

const REMOVE_POST = "REMOVE_POST";
const REMOVE_POST_SUCCESS = "REMOVE_POST_SUCCESS";
const REMOVE_POST_ERROR = "REMOVE_POST_ERROR";

const ADD_COMMENT = "ADD_COMMENT";
const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
const ADD_COMMENT_ERROR = "ADD_COMMENT_ERROR";

export const addPost = (data) => ({ type: ADD_POST, payload: data });
export const removePost = (data) => ({ type: REMOVE_POST, payload: data });

export const addComment = (data) => ({
  type: ADD_COMMENT,
  payload: data,
});

function* addPostSaga(action) {
  try {
    // const result = yield call(addPostAPI, action.data); // loginAPI가 리턴할때까지 기다렸다가 result에 넣어줌
    yield delay(1000);
    const id = shortId.generate();
    yield put({
      type: ADD_POST_SUCCESS,
      // payload: result.data,
      payload: { id, content: action.payload },
    });
    yield put(addPostMine(id));
  } catch (error) {
    console.log(error);
    yield put({
      type: ADD_POST_ERROR,
      payload: error,
    });
  }
}

function* removePostSaga(action) {
  try {
    yield delay(1000);
    yield put({
      type: REMOVE_POST_SUCCESS,
      payload: action.payload,
    });
    yield put(removePostMine(action.payload));
  } catch (e) {
    console.log(e);
    yield put({
      type: REMOVE_POST_ERROR,
      payload: error,
    });
  }
}

function* addCommentSaga(action) {
  try {
    // const result = yield call(addPostAPI, action.data); // loginAPI가 리턴할때까지 기다렸다가 result에 넣어줌
    yield delay(1000);
    yield put({
      type: ADD_COMMENT_SUCCESS,
      payload: action.payload,
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: ADD_COMMENT_ERROR,
      payload: error,
    });
  }
}

export function* postSaga() {
  yield takeLatest(ADD_POST, addPostSaga);
  yield takeLatest(REMOVE_POST, removePostSaga);
  yield takeLatest(ADD_COMMENT, addCommentSaga);
}

// (이전상태 ,액션) => 다음상태
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST:
      return handleAsyncActions(ADD_POST, "post")(state, action);
    case ADD_POST_SUCCESS:
      return produce(state, (draft) => {
        draft.post = reducerUtils.success(action.payload);
        draft.mainPosts.unshift(dummyPost(action.payload));
      });
    case ADD_POST_ERROR:
      return handleAsyncActions(ADD_POST, "post")(state, action);
    case ADD_COMMENT:
      return handleAsyncActions(ADD_POST, "post")(state, action);
    case ADD_COMMENT_SUCCESS:
      // 불변성은 지키면서 액션을 통해 이전 상태를 다음 상태로 만들어내는 함수
      return produce(state, (draft) => {
        const post = draft.mainPosts.find(
          (v) => v.id === action.payload.postId
        );
        draft.comment = reducerUtils.success(action.payload);
        post.Comments.unshift(dummyComment(action.payload.content));
      });
    case ADD_COMMENT_ERROR:
      return handleAsyncActions(ADD_COMMENT, "comment")(state, action);
    case REMOVE_POST:
      return handleAsyncActions(REMOVE_POST, "post")(state, action);
    case REMOVE_POST_SUCCESS:
      const newPosts = state.mainPosts.filter((v) => v.id !== action.payload);
      return {
        ...state,
        mainPosts: newPosts,
      };
    case REMOVE_POST_ERROR:
      return handleAsyncActions(REMOVE_POST, "removePost")(state, action);
    default:
      return state;
  }
};

export default reducer;
