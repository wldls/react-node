import React, { useCallback, useState, useRef, useEffect } from "react";
import { Form, Input, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  addPost,
  uploadImagesAction,
  removeImagesAction,
} from "../modules/post";
import useInput from "../hooks/useInput";

const PostForm = () => {
  const dispatch = useDispatch();
  const [text, onChangeText, setText] = useInput("");
  const { imagePaths, post } = useSelector((state) => state.post);
  const imageInput = useRef();

  useEffect(() => {
    // 포스트 등록에 성공하면 입력창을 비워준다.
    if (post.data) {
      setText("");
    }
  }, [post.data]);

  const onSubmit = useCallback(() => {
    if (!text || !text.trim()) {
      return alert("게시글을 작성하세요");
    }
    const formData = new FormData();
    imagePaths.forEach((p) => {
      formData.append("image", p);
    });

    formData.append("content", text);

    dispatch(addPost(formData));
  }, [text]);

  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    // FormData를 이용해야 multipart형식으로 보낼 수 있음. 반드시 multipart형식으로 보내야 multer가 처리
    const imageFormData = new FormData();
    // e.target.files가 유사배열객체이므로 call 사용
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append("image", f);
    });
    dispatch(uploadImagesAction(imageFormData));
  });

  const onRemoveImage = useCallback((index) => () => {
    dispatch(removeImagesAction(index));
  });

  return (
    <Form
      style={{ margin: "10px 0 20px" }}
      encType="multipart/form-data"
      onFinish={onSubmit}
    >
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholde="어떤 신기한 일이 있엇나요?"
      />
      <div>
        <input
          type="file"
          name="image"
          multiple
          hidden
          ref={imageInput}
          onChange={onChangeImages}
        />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: "right" }} htmlType="submit">
          짹짹
        </Button>
      </div>
      <div>
        {imagePaths.map((v, i) => (
          <div key={v} style={{ display: "inline-block" }}>
            <img
              src={`http://localhost:3065/${v}`}
              style={{ width: "200px" }}
              alt={v}
            />
            <div>
              <Button onClick={onRemoveImage(i)}>제거</Button>
            </div>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
