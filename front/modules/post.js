import { reducerUtils, handleAsyncActions } from "../lib/asyncUtils";
import { takeLatest, put, delay } from "redux-saga/effects";
import shortId from "shortid";

const initialState = {
  mainPosts: [
    {
      id: 1,
      User: {
        id: 1,
        nickname: "제로초",
      },
      content: "첫 번째 게시글 #해시태그 #익스프레스",
      Images: [
        {
          src:
            "https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?update=20180726",
        },
        {
          src: "https://gimg.gilbut.co.kr/book/BN001958/rn_view_BN001958.jpg",
        },
        {
          src: "https://gimg.gilbut.co.kr/book/BN001998/rn_view_BN001998.jpg",
        },
      ],
      Comments: [
        {
          User: {
            nickname: "nero",
          },
          content: "우와 개정판이 나왔군요~",
        },
        {
          User: {
            nickname: "hero",
          },
          content: "얼른 사고싶어요~",
        },
      ],
    },
  ],
  imagePaths: [],
  post: reducerUtils.initial(),
  comment: reducerUtils.initial(),
};

const dummyPost = (data) => ({
  id: shortId.generate(),
  User: {
    id: 1,
    nickname: "제로초",
  },
  content: data,
  Images: [],
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

const ADD_COMMENT = "ADD_COMMENT";
const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
const ADD_COMMENT_ERROR = "ADD_COMMENT_ERROR";

export const addPost = (data) => ({ type: ADD_POST, payload: data });

export const addComment = (data) => ({
  type: ADD_COMMENT,
  payload: data,
});

function* addPostSaga(action) {
  try {
    // const result = yield call(addPostAPI, action.data); // loginAPI가 리턴할때까지 기다렸다가 result에 넣어줌
    yield delay(1000);
    yield put({
      type: ADD_POST_SUCCESS,
      // payload: result.data,
      payload: action.payload,
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: ADD_POST_ERROR,
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
  yield takeLatest(ADD_COMMENT, addCommentSaga);
}

// (이전상태 ,액션) => 다음상태
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST:
      return handleAsyncActions(ADD_POST, "post")(state, action);
    case ADD_POST_SUCCESS:
      return {
        // ...state,
        ...state,
        post: reducerUtils.success(action.payload),
        mainPosts: [dummyPost(action.payload), ...state.mainPosts],
      };
    case ADD_POST_ERROR:
      return handleAsyncActions(ADD_POST, "post")(state, action);
    case ADD_COMMENT:
      return handleAsyncActions(ADD_POST, "post")(state, action);
    case ADD_COMMENT_SUCCESS:
      const postIndex = state.mainPosts.findIndex(
        (v) => v.id === action.payload.postId
      );
      const post = state.mainPosts[postIndex];
      const Comments = [dummyComment(action.payload.content), ...post.Comments];
      const mainPosts = [...state.mainPosts];
      mainPosts[postIndex] = { ...post, Comments };

      return {
        ...state,
        mainPosts,
        comment: reducerUtils.success(action.payload),
      };
    case ADD_COMMENT_ERROR:
      return handleAsyncActions(ADD_COMMENT, "comment")(state, action);
    default:
      return state;
  }
};

export default reducer;
