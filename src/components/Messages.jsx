import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { db } from "../utils/firebase";
import { useSelector } from "react-redux";
import PreLoadImage from "./PreLoadImage";
import Loading from "../pages/Loading";

const Messages = () => {
  const { chat, currentUserDetails } = useSelector(
    (state) => state.userDetails
  );
  const scrollRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id =
      currentUserDetails.uid > chat.uid
        ? `${currentUserDetails.uid + " " + chat.uid}`
        : `${chat.uid + " " + currentUserDetails.uid}`;
    const msgRef = collection(db, "Messages", id, "Chat");
    const q = query(msgRef, orderBy("createdAt", "asc"));

    const unSub = onSnapshot(q, (querySnapShot) => {
      let messages = [];
      querySnapShot.forEach((doc) => {
        messages.push(doc.data());
      });
      setMessages(messages);
      setLoading(false);
    });

    return () => {
      unSub();
      setMessages([]);
    };
  }, [chat.uid, currentUserDetails.uid]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current?.scrollHeight;
    }
  };

  useEffect(() => {
    if (messages) {
      scrollToBottom();
    }
  }, [messages]);

  return messages.length > 0 ? (
    <div className="messages" ref={scrollRef}>
      {loading && <Loading type={"text"} />}
      {messages.length > 0 &&
        messages.map((message) => (
          <div
            className={`message-wrapper ${
              message.from === currentUserDetails.uid ? "mine" : ""
            }`}
          >
            <div
              className={`${
                messages.from === currentUserDetails.uid ? "myself" : "other"
              }`}
              key={message.id}
            >
              {message.media && <PreLoadImage src={message.media} />}
              <div>
                <p>{message.text}</p>
                <time>
                  {message.createdAt
                    ?.toDate(new Date().getTime())
                    .toString()
                    .slice(16, 21)}
                </time>
              </div>
            </div>
          </div>
        ))}
    </div>
  ) : (
    <div className="messages"></div>
  );
};

export default Messages;
