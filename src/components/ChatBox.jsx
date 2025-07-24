import { useEffect, useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  deleteDoc
} from 'firebase/firestore';

const ChatBox = ({ songId, currentUserName }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const userId = localStorage.getItem('spotify_display_name') || 'Anonymous';
  const userName = currentUserName || userId; 
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    if (!songId) return;

    const q = query(
      collection(db, 'comments', songId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const grouped = msgs.reduce((acc, msg) => {
        if (!msg.parentMessageId) {
          acc.push({ ...msg, replies: [] });
        } else {
          const parent = acc.find(m => m.id === msg.parentMessageId);
          if (parent) {
            parent.replies.push(msg);
          }
        }
        return acc;
      }, []);

      setMessages(grouped);
    });

    return () => unsubscribe();
  }, [songId]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    await addDoc(collection(db, 'comments', songId, 'messages'), {
      text: message,
      user: userName,     // ✅ Use fallback here
      userId: userId,
      timestamp: serverTimestamp(),
      parentMessageId: replyingTo ? replyingTo.id : null,
      likes: []
    });    

    setMessage('');
    setReplyingTo(null);
  };

  const toggleLike = async (msgId) => {
    const msgRef = doc(db, 'comments', songId, 'messages', msgId);
    const msgSnap = await getDoc(msgRef);

    if (msgSnap.exists()) {
      const msgData = msgSnap.data();
      const currentLikes = msgData.likes || [];

      if (currentLikes.includes(userId)) {
        await updateDoc(msgRef, {
          likes: arrayRemove(userId),
        });
      } else {
        await updateDoc(msgRef, {
          likes: arrayUnion(userId),
        });
      }
    }
  };

  // 🔥 Delete Comment
  const deleteComment = async (msgId) => {
    const msgRef = doc(db, 'comments', songId, 'messages', msgId);
    await deleteDoc(msgRef);
  };

  // 🚩 Report Comment
  const reportComment = async (msgId) => {
    await addDoc(collection(db, 'reports'), {
      commentId: msgId,
      songId: songId,
      reportedBy: userId,
      timestamp: serverTimestamp()
    });
    alert('Comment reported!');
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded mt-4 max-h-60 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-2">💬 Chat for this Song</h3>

      {messages.map((msg) => (
        <div key={msg.id} className="mb-3">
          <div className="bg-gray-700 p-2 rounded">
            <span className="font-semibold">{msg.user}</span>
            <div>{msg.text}</div>

            <div className="flex items-center gap-3 mt-2 text-xs">
              {/* Like Button */}
              <button
                className={`${
                  msg.likes?.includes(userId) ? 'text-blue-400' : 'text-gray-400'
                }`}
                onClick={() => toggleLike(msg.id)}
              >
                👍 {msg.likes?.length || 0}
              </button>

              {/* Moderation Buttons */}
              {msg.userId === userId && (
                <button
                  className="text-red-400"
                  onClick={() => deleteComment(msg.id)}
                >
                  🗑️ Delete
                </button>
              )}
              <button
                className="text-yellow-400"
                onClick={() => reportComment(msg.id)}
              >
                🚩 Report
              </button>
            </div>

            <button
              className="text-xs text-green-400 mt-1"
              onClick={() => {
                setReplyingTo(msg);
                setMessage(`@${msg.user} `);
              }}
            >
              Reply
            </button>
          </div>

          {/* Replies */}
          {msg.replies.map((reply) => (
            <div key={reply.id} className="ml-6 mt-1 bg-gray-600 p-2 rounded">
              <span className="font-semibold">{reply.user}</span>
              <div>{reply.text}</div>

              <div className="flex items-center gap-3 mt-2 text-xs">
                <button
                  className={`${
                    reply.likes?.includes(userId) ? 'text-blue-400' : 'text-gray-400'
                  }`}
                  onClick={() => toggleLike(reply.id)}
                >
                  👍 {reply.likes?.length || 0}
                </button>

                {reply.userId === userId && (
                  <button
                    className="text-red-400"
                    onClick={() => deleteComment(reply.id)}
                  >
                    🗑️ Delete
                  </button>
                )}
                <button
                  className="text-yellow-400"
                  onClick={() => reportComment(reply.id)}
                >
                  🚩 Report
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Input */}
      <div className="flex gap-2 mt-2">
        <input
          className="flex-grow p-2 rounded bg-gray-900 text-white text-sm"
          placeholder={
            replyingTo ? `Replying to ${replyingTo.user}` : 'Write a comment...'
          }
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-green-600 px-3 rounded hover:bg-green-700 text-sm"
        >
          Send
        </button>
      </div>

      {/* Cancel reply */}
      {replyingTo && (
        <div className="text-xs mt-1 text-gray-300">
          Replying to <strong>{replyingTo.user}</strong>{' '}
          <button onClick={() => setReplyingTo(null)} className="text-red-400 ml-2">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
