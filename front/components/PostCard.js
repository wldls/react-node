import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Card, Popover, Button, Avatar, List, Comment } from "antd";
import {
  RetweetOutlined,
  HeartTwoTone,
  HeartOutlined,
  MessageOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import PostImages from "../components/PostImages";
import CommentForm from "../components/CommentForm";
import PostCardContent from "../components/PostCardContent";
import { removePostAciton, likePost, unlikePost } from "../modules/post";
import FollowButton from "./FollowButton";

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user); // state.user.me?.id 이런 방식으로 사용 가능
  const id = me?.id; // 옵셔널 체이닝(optional chaining) 연산자 : me && me.id 와 동일하다.
  const { removePost } = useSelector((state) => state.post);
  // const [liked, setLiked] = useState(false);
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const liked = post.Likers.find((v) => v.id === id);

  const onLike = useCallback((id) => {
    if (me) {
      dispatch(likePost(id));
    } else {
      alert("로그인이 필요합니다.");
    }
  }, []);
  const onUnlike = useCallback((id) => {
    if (me) {
      dispatch(unlikePost(id));
    } else {
      alert("로그인이 필요합니다.");
    }
  }, []);
  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);
  const onRemovePost = useCallback(() => {
    dispatch(removePostAciton(post.id));
  }, []);

  return (
    <div style={{ marginBottom: 20 }}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" />,
          liked ? (
            <HeartTwoTone
              twoToneColor="#eb2f96"
              key="heart"
              onClick={() => {
                onUnlike(post.id);
              }}
            />
          ) : (
            <HeartOutlined
              key="heart"
              onClick={() => {
                onLike(post.id);
              }}
            />
          ),
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Popover
            key="more"
            content={
              <Button.Group>
                {id && post.User.id === id ? (
                  <>
                    <Button>수정</Button>
                    <Button
                      type="danger"
                      loading={removePost.loading}
                      onClick={onRemovePost}
                    >
                      삭제
                    </Button>
                  </>
                ) : (
                  <Button>신고</Button>
                )}
              </Button.Group>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
        extra={me && <FollowButton post={post} />}
      >
        <Card.Meta
          avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
          title={post.User.nickname}
          description={<PostCardContent postData={post.content} />}
        />
      </Card>
      {commentFormOpened && (
        <div>
          <CommentForm post={post} />
          <List
            header={`${post.Comments.length} 개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <li>
                <Comment
                  // author={item.User.nickname}
                  // avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
                  content={item.content}
                />
              </li>
            )}
          />
        </div>
      )}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    // id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.string,
    Comments: PropTypes.arrayOf(PropTypes.object),
    Images: PropTypes.arrayOf(PropTypes.object),
    Likers: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default PostCard;
