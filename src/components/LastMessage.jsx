import React from "react";

const LastMessage = ({ lastMessage, user, currentUserDetails }) => {
  return (
    <p
      className={
        lastMessage &&
        lastMessage.from === user.uid &&
        lastMessage.unread === true
          ? "unread"
          : "read"
      }
    >
      <strong>
        {lastMessage && lastMessage.from === currentUserDetails.uid
          ? "Me:"
          : ""}
      </strong>
      {lastMessage && lastMessage.text}
    </p>
  );
};

export default LastMessage;
