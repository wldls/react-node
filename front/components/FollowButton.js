import React, { useCallback } from "react";
import { Button } from "antd";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { followAction, unFollowAction } from "../modules/user";

const FollowButton = ({ post }) => {
  const dispatch = useDispatch();
  const { me, following, unFollowing } = useSelector((state) => state.user);
  const followLoading = following && following.loading;
  const unFollowLoading = unFollowing && unFollowing.loading;
  const isFollwing = me && me.Followings.find((v) => v.id === post.User.id);
  const onFollow = useCallback(() => {
    if (isFollwing) {
      dispatch(unFollowAction(post.User.id));
    } else {
      dispatch(followAction(post.User.id));
    }
  }, [isFollwing]);

  return (
    <Button loading={followLoading || unFollowLoading} onClick={onFollow}>
      {isFollwing ? "unfollow" : "follow"}
    </Button>
  );
};

FollowButton.propTypes = {
  post: PropTypes.object.isRequired,
};

export default FollowButton;
