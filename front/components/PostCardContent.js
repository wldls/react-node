import React from "react";
import Link from "next/link";
import PropTypes from "prop-types";

const PostCardContent = ({ postData }) => {
  const regex = /(#[^\s#]+)/g;
  return (
    <div>
      {postData.split(regex).map((v, i) => {
        if (regex.test(v)) {
          return (
            <Link key={i} href={`/hashtag/${v.slice(1)}`}>
              <a>{v}</a>
            </Link>
          );
        }
        return v;
      })}
    </div>
  );
};

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
};

export default PostCardContent;
