import { reducerUtils, handleAsyncActions } from "../lib/asyncUtils";
import { takeLatest, put, call, throttle } from "redux-saga/effects";
import { addPostMine, removePostMine } from "./user";
import utilProduce from "../util/produce";
import * as postAPI from "../api/post";

const initialState = {
  mainPosts: [],
  imagePaths: [],
  hasMorePosts: true,
  reqPosts: reducerUtils.initial(),
  reqPost: reducerUtils.initial(),
  hashtagPost: reducerUtils.initial(),
  post: reducerUtils.initial(),
  removePost: reducerUtils.initial(),
  comment: reducerUtils.initial(),
  likePost: reducerUtils.initial(),
  unlikePost: reducerUtils.initial(),
  uploadImages: reducerUtils.initial(),
  removeImages: reducerUtils.initial(),
  retweet: reducerUtils.initial(),
};

const LOAD_POST = "LOAD_POST";
const LOAD_POST_SUCCESS = "LOAD_POST_SUCCESS";
const LOAD_POST_ERROR = "LOAD_POST_ERROR";

const LOAD_POSTS = "LOAD_POSTS";
const LOAD_POSTS_SUCCESS = "LOAD_POSTS_SUCCESS";
const LOAD_POSTS_ERROR = "LOAD_POSTS_ERROR";

const LOAD_USER_POSTS = "LOAD_USER_POSTS";
const LOAD_USER_POSTS_SUCCESS = "LOAD_USER_POSTS_SUCCESS";
const LOAD_USER_POSTS_ERROR = "LOAD_USER_POSTS_ERROR";

const LOAD_HASHTAG_POSTS = "LOAD_HASHTAG_POSTS";
const LOAD_HASHTAG_POSTS_SUCCESS = "LOAD_HASHTAG_POSTS_SUCCESS";
const LOAD_HASHTAG_POSTS_ERROR = "LOAD_HASHTAG_POSTS_ERROR";

const ADD_POST = "ADD_POST";
const ADD_POST_SUCCESS = "ADD_POST_SUCCESS";
const ADD_POST_ERROR = "ADD_POST_ERROR";

const REMOVE_POST = "REMOVE_POST";
const REMOVE_POST_SUCCESS = "REMOVE_POST_SUCCESS";
const REMOVE_POST_ERROR = "REMOVE_POST_ERROR";

const ADD_COMMENT = "ADD_COMMENT";
const ADD_COMMENT_SUCCESS = "ADD_COMMENT_SUCCESS";
const ADD_COMMENT_ERROR = "ADD_COMMENT_ERROR";

const LIKE_POST = "LIKE_POST";
const LIKE_POST_SUCCESS = "LIKE_POST_SUCCESS";
const LIKE_POST_ERROR = "LIKE_POST_ERROR";

const UNLIKE_POST = "UNLIKE_POST";
const UNLIKE_POST_SUCCESS = "UNLIKE_POST_SUCCESS";
const UNLIKE_POST_ERROR = "UNLIKE_POST_ERROR";

const UPLOAD_IMAGES = "UPLOAD_IMAGES";
const UPLOAD_IMAGES_SUCCESS = "UPLOAD_IMAGES_SUCCESS";
const UPLOAD_IMAGES_ERROR = "UPLOAD_IMAGES_ERROR";

const REMOVE_IMAGES = "REMOVE_IMAGES";

const RETWEET = "RETWEET";
const RETWEET_SUCCESS = "RETWEET_SUCCESS";
const RETWEET_ERROR = "RETWEET_ERROR";

export const loadPosts = (payload) => ({ type: LOAD_POSTS, payload });
export const loadUserPosts = (payload) => ({ type: LOAD_USER_POSTS, payload });
export const loadHashtagPosts = (payload) => ({
  type: LOAD_HASHTAG_POSTS,
  payload,
});

export const loadPost = (payload) => ({ type: LOAD_POST, payload });

export const addPost = (payload) => ({ type: ADD_POST, payload });
export const removePostAciton = (payload) => ({ type: REMOVE_POST, payload });

export const addComment = (payload) => ({
  type: ADD_COMMENT,
  payload,
});

export const likePost = (payload) => ({ type: LIKE_POST, payload });
export const unlikePost = (payload) => ({ type: UNLIKE_POST, payload });
export const uploadImagesAction = (payload) => ({
  type: UPLOAD_IMAGES,
  payload,
});
export const removeImagesAction = (payload) => ({
  type: REMOVE_IMAGES,
  payload,
});
export const retweetAction = (payload) => ({
  type: RETWEET,
  payload,
});

function* loadPostsSaga(action) {
  try {
    const result = yield call(postAPI.loadPosts, action.payload); // loginAPI??? ?????????????????? ??????????????? result??? ?????????
    yield put({
      type: LOAD_POSTS_SUCCESS,
      payload: result.data,
    });
  } catch (error) {
    yield put({
      type: LOAD_POSTS_ERROR,
      error: error.response.data,
    });
  }
}

function* loadUserPostsSaga(action) {
  try {
    const result = yield call(postAPI.loadUserPosts, action.payload); // loginAPI??? ?????????????????? ??????????????? result??? ?????????
    yield put({
      type: LOAD_USER_POSTS_SUCCESS,
      payload: result.data,
    });
  } catch (error) {
    yield put({
      type: LOAD_USER_POSTS_ERROR,
      error: error.response.data,
    });
  }
}

function* loadHashtagPostsSaga(action) {
  try {
    const result = yield call(postAPI.loadHashtagPosts, action.payload); // loginAPI??? ?????????????????? ??????????????? result??? ?????????
    yield put({
      type: LOAD_HASHTAG_POSTS_SUCCESS,
      payload: result.data,
    });
  } catch (error) {
    console.log(error);
    yield put({
      type: LOAD_HASHTAG_POSTS_ERROR,
      error: error,
      // error: error.response.data,
    });
  }
}

function* loadPostSaga(action) {
  try {
    const result = yield call(postAPI.loadPost, action.payload); // loginAPI??? ?????????????????? ??????????????? result??? ?????????
    yield put({
      type: LOAD_POST_SUCCESS,
      payload: result.data,
    });
  } catch (error) {
    yield put({
      type: LOAD_POST_ERROR,
      error: error.response.data,
    });
  }
}

function* addPostSaga(action) {
  try {
    const result = yield call(postAPI.addPost, action.payload);
    yield put({
      type: ADD_POST_SUCCESS,
      payload: result.data,
    });
    yield put(addPostMine(result.data.id));
  } catch (error) {
    yield put({
      type: ADD_POST_ERROR,
      payload: error,
    });
  }
}

function* removePostSaga(action) {
  try {
    const result = yield call(postAPI.removePost, action.payload);
    yield put({
      type: REMOVE_POST_SUCCESS,
      payload: result.data,
    });
    yield put(removePostMine(action.payload));
  } catch (error) {
    yield put({
      type: REMOVE_POST_ERROR,
      payload: error.response.data,
    });
  }
}

function* addCommentSaga(action) {
  try {
    const result = yield call(postAPI.addComment, action.payload); // loginAPI??? ?????????????????? ??????????????? result??? ?????????
    yield put({
      type: ADD_COMMENT_SUCCESS,
      payload: result.data,
    });
  } catch (error) {
    yield put({
      type: ADD_COMMENT_ERROR,
      payload: error,
    });
  }
}

function* likePostSaga(action) {
  try {
    const result = yield call(postAPI.likePost, action.payload);
    yield put({
      type: LIKE_POST_SUCCESS,
      payload: result.data, // postId, userId
    });
  } catch (error) {
    yield put({
      type: LIKE_POST_ERROR,
      error: error.response.data,
    });
  }
}

function* unlikePostSaga(action) {
  try {
    const result = yield call(postAPI.unlikePost, action.payload);
    yield put({
      type: UNLIKE_POST_SUCCESS,
      payload: result.data,
    });
  } catch (error) {
    yield put({
      type: UNLIKE_POST_ERROR,
      error: error.response.data,
    });
  }
}

function* uploadImagesSaga(action) {
  try {
    const result = yield call(postAPI.uploadImages, action.payload);
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      payload: result.data,
    });
  } catch (error) {
    yield put({
      type: UPLOAD_IMAGES_ERROR,
      error: error.response.data,
    });
  }
}

function* rewteetSaga(action) {
  try {
    const result = yield call(postAPI.retweet, action.payload);
    yield put({
      type: RETWEET_SUCCESS,
      payload: result.data,
    });
  } catch (error) {
    yield put({
      type: RETWEET_ERROR,
      error: error.response.data,
    });
  }
}

export function* postSaga() {
  yield takeLatest(LOAD_POSTS, loadPostsSaga);
  yield takeLatest(LOAD_USER_POSTS, loadUserPostsSaga);
  yield takeLatest(LOAD_HASHTAG_POSTS, loadHashtagPostsSaga);
  yield takeLatest(LOAD_POST, loadPostSaga);
  yield takeLatest(ADD_POST, addPostSaga);
  yield takeLatest(REMOVE_POST, removePostSaga);
  yield takeLatest(ADD_COMMENT, addCommentSaga);
  yield takeLatest(LIKE_POST, likePostSaga);
  yield takeLatest(UNLIKE_POST, unlikePostSaga);
  yield takeLatest(UPLOAD_IMAGES, uploadImagesSaga);
  yield takeLatest(RETWEET, rewteetSaga);
}

// (???????????? ,??????) => ????????????
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_POSTS:
    case LOAD_POSTS_ERROR:
      return handleAsyncActions(LOAD_POSTS, "reqPosts")(state, action);
    case LOAD_POSTS_SUCCESS:
      return {
        ...state,
        reqPosts: reducerUtils.success(action.payload),
        mainPosts: state.mainPosts.concat(action.payload),
        hasMorePosts: action.payload.length === 10,
      };
    case LOAD_USER_POSTS:
    case LOAD_USER_POSTS_ERROR:
      return handleAsyncActions(LOAD_USER_POSTS, "reqPost")(state, action);
    case LOAD_USER_POSTS_SUCCESS:
      return {
        ...state,
        reqPost: reducerUtils.success(action.payload),
        mainPosts: state.mainPosts.concat(action.payload),
        hasMorePosts: action.payload.length === 10,
      };
    case LOAD_HASHTAG_POSTS_SUCCESS:
      return {
        ...state,
        hashtagPost: reducerUtils.success(action.payload),
        mainPosts: state.mainPosts.concat(action.payload),
        hasMorePosts: action.payload.length === 10,
      };
    case LOAD_HASHTAG_POSTS:
    case LOAD_HASHTAG_POSTS_ERROR:
      return handleAsyncActions(LOAD_HASHTAG_POSTS, "hashtagPost")(
        state,
        action
      );
    case LOAD_POST:
    case LOAD_POST_SUCCESS:
    case LOAD_POST_ERROR:
      return handleAsyncActions(LOAD_POST, "reqPost")(state, action);
    case ADD_POST:
      return handleAsyncActions(ADD_POST, "post")(state, action);
    case ADD_POST_SUCCESS:
      return utilProduce(state, (draft) => {
        draft.post = reducerUtils.success(action.payload);
        draft.mainPosts.unshift(action.payload);
        draft.imagePaths = [];
      });
    case ADD_POST_ERROR:
      return handleAsyncActions(ADD_POST, "post")(state, action);
    case ADD_COMMENT:
      return handleAsyncActions(ADD_POST, "post")(state, action);
    case ADD_COMMENT_SUCCESS:
      // ???????????? ???????????? ????????? ?????? ?????? ????????? ?????? ????????? ??????????????? ??????
      return utilProduce(state, (draft) => {
        const post = draft.mainPosts.find(
          (v) => v.id === action.payload.PostId
        );
        draft.comment = reducerUtils.success(action.payload);
        post.Comments.unshift(action.payload);
      });
    case ADD_COMMENT_ERROR:
      return handleAsyncActions(ADD_COMMENT, "comment")(state, action);
    case REMOVE_POST:
      return handleAsyncActions(REMOVE_POST, "removePost")(state, action);
    case REMOVE_POST_SUCCESS:
      const newPosts = state.mainPosts.filter(
        (v) => v.id !== action.payload.PostId
      );
      return {
        ...state,
        mainPosts: newPosts,
        removePost: reducerUtils.success(action.payload),
      };
    case REMOVE_POST_ERROR:
      return handleAsyncActions(REMOVE_POST, "removePost")(state, action);
    case LIKE_POST_SUCCESS:
      return utilProduce(state, (draft) => {
        const post = draft.mainPosts.find(
          (v) => v.id === action.payload.PostId
        );
        post.Likers.push({ id: action.payload.UserId });
        draft.likePost = reducerUtils.success(action.payload);
      });
    case LIKE_POST:
    case LIKE_POST_ERROR:
      return handleAsyncActions(LIKE_POST, "likePost")(state, action);
    case UNLIKE_POST_SUCCESS:
      return utilProduce(state, (draft) => {
        const post = draft.mainPosts.find(
          (v) => v.id === action.payload.PostId
        );
        post.Likers = post.Likers.filter((v) => v.id !== action.payload.UserId);
        draft.unlikePost = reducerUtils.success(action.payload);
      });
    case UNLIKE_POST:
    case UNLIKE_POST_ERROR:
      return handleAsyncActions(UNLIKE_POST, "unlikePost")(state, action);
    case UPLOAD_IMAGES_SUCCESS:
      return {
        ...state,
        imagePaths: action.payload,
      };
    case UPLOAD_IMAGES:
    case UPLOAD_IMAGES_ERROR:
      return handleAsyncActions(UPLOAD_IMAGES, "uploadImages")(state, action);
    case REMOVE_IMAGES:
      const newPaths = state.imagePaths.filter((v, i) => i !== action.payload);
      return {
        ...state,
        imagePaths: newPaths,
      };
    case RETWEET_SUCCESS:
      const addRetweet = state.mainPosts.concat(action.payload);
      return {
        ...state,
        mainPosts: addRetweet,
      };
    case RETWEET:
    case RETWEET_ERROR:
      return handleAsyncActions(RETWEET, "retweet")(state, action);
    default:
      return state;
  }
};

export default reducer;
