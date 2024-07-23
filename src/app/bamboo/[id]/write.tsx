"use client";

import React from "react";

const Write = () => { 
  const [comment, setComment] = React.useState("");
  return (
    <div className="absolute bottom-0 w-full px-6 z-[100] bg-background border-t rounded-t-3xl pt-3 pb-safe-offset-3 transition-all">
      <div className="w-full flex flex-row items-center justify-between gap-1">
        <input
          type="text"
          className="w-full bg-transparent outline-none py-3"
          placeholder="댓글을 입력해주세요."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="cursor-pointer flex flex-row items-center justify-end gap-1">
          <p className="font-medium select-none">전송</p>
          <div className="-m-2 p-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <mask id="mask0_324_165" maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
                <rect width="20" height="20" fill="#D9D9D9"/>
              </mask>
              <g mask="url(#mask0_324_165)">
                <path className="fill-text" d="M2.91675 14.8494V5.15074C2.91675 4.86294 3.03321 4.64382 3.26612 4.49339C3.49903 4.34294 3.74829 4.32496 4.01391 4.43943L15.5192 9.25968C15.8429 9.39846 16.0048 9.64576 16.0048 10.0016C16.0048 10.3574 15.8429 10.6037 15.5192 10.7404L4.01391 15.5607C3.74829 15.6752 3.49903 15.6572 3.26612 15.5067C3.03321 15.3563 2.91675 15.1372 2.91675 14.8494ZM4.25006 14.0417L13.8126 10.0001L4.25006 5.95839V8.88949L8.76925 10.0001L4.25006 11.1106V14.0417Z" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Write;