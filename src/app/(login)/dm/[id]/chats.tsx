"use client";

import moment from "moment";
import React from "react";
import { useSetRecoilState } from "recoil";

import { isFooterAtom, isHeaderAtom } from "@/utils/states";

import Message from "./message";

const Chats = () => {
  const [messages, setMessages] = React.useState<{
    isMyMessage: boolean;
    message: string;
    time: string;
    isSending?: boolean;
  }[]>([]);
  const setFooter = useSetRecoilState(isFooterAtom);
  const setHeader = useSetRecoilState(isHeaderAtom);
  const [input, setInput] = React.useState<string>("");
  const [readNo, setReadNo] = React.useState<number>(30);
  const ref = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setFooter(false);
    setHeader(false);
    inputRef.current?.focus();
    for(let i = 0; i < 7; i++) {
      setMessages(p => [
        ...p,
        {
          isMyMessage: false,
          message: "여기도 불우이웃 있는데요",
          time: moment().subtract(1, "day").format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          isMyMessage: false,
          message: "여기도 불우이웃 있는데요",
          time: moment().subtract(1, "day").format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          isMyMessage: false,
          message: "여기도 불우이웃 있는데요",
          time: moment().subtract(1, "day").format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          isMyMessage: true,
          message: "디미고인이여서 인정해드립니다…",
          time: moment().subtract(1, "day").format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          isMyMessage: true,
          message: "디미고인이여서 인정해드립니다…",
          time: moment().subtract(1, "day").format("YYYY-MM-DD HH:mm:ss"),
        },
        {
          isMyMessage: true,
          message: "디미고인이여서 인정해드립니다…",
          time: moment().subtract(1, "day").format("YYYY-MM-DD HH:mm:ss"),
        },
      ]);
    }
    return () => {
      setFooter(true);
      setHeader(true);
    };
  }, []);

  React.useEffect(() => {
    if(ref.current) {
      ref.current.scrollTo({
        top: ref.current.scrollHeight,
      });
    }
  }, [messages]);

  const send = async () => {
    if(!input) return;
    const newI = [...messages].length;
    setMessages(p => [
      ...p,
      {
        isMyMessage: true,
        isSending: true,
        message: input,
        time: moment().format("YYYY-MM-DD HH:mm:ss"),
      }
    ]);
    setInput("");
    await new Promise(() => setTimeout(() => {
      setMessages(p => [
        ...p.slice(0, newI),
        {
          isMyMessage: true,
          message: input,
          time: moment().format("YYYY-MM-DD HH:mm:ss"),
        },
        ...p.slice(newI + 1),
      ]);
    }, 1000));
  };

  return (
    <>
      <section 
        className="flex flex-col gap-1 h-[100vh] justify-start w-full px-4 pt-32 pb-20 overflow-auto"
        ref={ref}
      >
        {
          messages.map((message, index) => (
            <Message
              key={index}
              isMyMessage={message.isMyMessage}
              isSending={message.isSending}
              message={message.message}
              isRead={index <= readNo}
              isStart={!messages[index - 1] || message.isMyMessage !== messages[index - 1]?.isMyMessage}
              isEnd={!messages[index + 1] || message.isMyMessage !== messages[index + 1]?.isMyMessage}
              time={message.time}
              isNewDay={!messages[index - 1] || moment(message.time).format("YYYY-MM-DD") !== moment(messages[index - 1]?.time).format("YYYY-MM-DD")}
            />
          ))
        }
      </section>
      <div className="px-4 w-full h-10 my-4 -mt-16">
        <div className="border border-text/10 w-full h-full flex flex-row items-center justify-start bg-text/5 dark:bg-text/10 backdrop-blur-xl rounded-full px-4 gap-2">
          <input 
            type="text" 
            ref={inputRef}
            className="w-full h-full bg-transparent focus:outline-none"
            placeholder="메시지를 입력하세요."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyUp={(e) => {
              if(e.key === "Enter") {
                send();
              }
            }}
          />
          {
            input.length > 0 ? (
              <p 
                className="text-primary cursor-pointer select-none font-medium"
                onClick={send}
              >보내기</p>
            ) : null
          }
        </div>
      </div>
    </>
  );
};

export default Chats;