import React, { useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { Form, Input, Button } from "antd";
import useInput from "../hooks/useInput";
import { useSelector, useDispatch } from "react-redux";
import { addComment } from "../modules/post";

const CommentForm = ({ post }) => {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.user.me?.id);
  const { data } = useSelector((state) => state.post.comment);
  const [commentText, onChangeCommentText, setCommentText] = useInput("");

  useEffect(() => {
    if (data) {
      setCommentText("");
    }
  }, [data]);

  const onSubmitComment = useCallback(() => {
    dispatch(addComment({ postId: post.id, content: commentText, useid: id }));
  }, [commentText, id]);

  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item style={{ position: "relative", margin: 0 }}>
        <Input.TextArea
          value={commentText}
          onChange={onChangeCommentText}
          rows={4}
        />
        <Button
          htmlType="submit"
          style={{ position: "absolute", right: 0, bottom: -40, zIndex: 5 }}
          type="primary"
        >
          삐약
        </Button>
      </Form.Item>
    </Form>
  );
};

CommentForm.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CommentForm;
