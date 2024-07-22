import React from "react";

const Comment = ({
  isFirst,
}: {
  isFirst: boolean;
}) => {
  return (
    <>
      {
        isFirst ? null : (
          <div className="w-full border-b border-text/10 dark:border-text/20" />
        )
      }
      <div>
        <h1>Comment</h1>
      </div>
    </>
  );
};

export default Comment;