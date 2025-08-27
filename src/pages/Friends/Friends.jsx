import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth";
import {
  db,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  setUsername,
  usernameToUid
} from "../../firebase";
import { collection, onSnapshot, query, getDocs, where } from "firebase/firestore";

export default function Friends() {
  const { user } = useAuth();
  const [friendCode, setFriendCode] = useState("");
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newUsername, setNewUsername] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");

  useEffect(() => {
    if (!user) return;

    const fetchCurrentUsername = async () => {
      try {
        const docRef = query(collection(db, "usernames"), where("uid", "==", user.uid));
        const querySnap = await getDocs(docRef);
        if (!querySnap.empty) {
          setCurrentUsername(querySnap.docs[0].id); // The document ID is the username
        }
      } catch (err) {
        console.error("Failed to fetch username:", err);
      }
    };

    fetchCurrentUsername();
  }, [user]);

  // Listen for friendRequests and friends
  useEffect(() => {
    if (!user) return;

    setLoading(true);

    const unsub1 = onSnapshot(collection(db, "friendRequests"), (snap) => {
      const inReq = [];
      const outReq = [];
      snap.forEach((doc) => {
        const r = doc.data();
        if (r.toUid === user.uid && r.status === "pending") inReq.push(r);
        if (r.fromUid === user.uid && r.status === "pending") outReq.push(r);
      });
      setIncoming(inReq);
      setOutgoing(outReq);
    });

    const unsub2 = onSnapshot(collection(db, "friends"), (snap) => {
      const fs = [];
      snap.forEach((doc) => {
        const r = doc.data();
        if (r.uids.includes(user.uid)) fs.push(r);
      });
      setFriends(fs);
      setLoading(false);
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, [user]);

  const handleSetUsername = async () => {
    console.log("User in Friends.jsx:", currentUsername);
    if (!newUsername.trim()) return;
    try {
      await setUsername(user.uid, newUsername.trim());
      alert("✅ Username saved successfully!");
      setCurrentUsername(newUsername.trim());
      setNewUsername("");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  const handleSendFriendRequest = async () => {
    const toUid = await usernameToUid(friendCode.trim());
    if (!toUid) return alert("❌ User not found");
    await sendFriendRequest(user.uid, toUid);
    setFriendCode("");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Your Username</h2>
      <p className="bg-gray-100 p-2 rounded">{currentUsername || user.uid}</p>

      <div className="mt-4">
        <input
          type="text"
          value={friendCode}
          onChange={(e) => setFriendCode(e.target.value)}
          placeholder="Enter friend's username"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={handleSendFriendRequest}
          className="bg-green-500 text-white px-4 py-2 rounded mt-2"
        >
          Send Request
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Set Your Username</h3>
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
            placeholder="Choose a username"
            className="border p-2 rounded flex-grow"
          />
          <button
            onClick={handleSetUsername}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>

      {loading ? (
        <p className="mt-6 italic">⏳ Loading your friends...</p>
      ) : (
        <>
          <h3 className="text-lg mt-6 font-semibold">Incoming Requests</h3>
          {incoming.map((req) => (
            <div key={req.fromUid} className="flex gap-2 items-center">
              <span>{req.fromUid}</span>
              <button
                onClick={() => acceptFriendRequest(req.fromUid, user.uid)}
                className="bg-blue-500 text-white px-2 py-1 rounded"
              >
                Accept
              </button>
              <button
                onClick={() => rejectFriendRequest(req.fromUid, user.uid)}
                className="bg-red-500 text-white px-2 py-1 rounded"
              >
                Reject
              </button>
            </div>
          ))}

          <h3 className="text-lg mt-6 font-semibold">Outgoing Requests</h3>
          {outgoing.map((req) => (
            <div key={req.toUid} className="flex gap-2 items-center">
              <span>{req.toUid} (pending)</span>
              <button
                onClick={() => cancelFriendRequest(user.uid, req.toUid)}
                className="bg-gray-500 text-white px-2 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          ))}

          <h3 className="text-lg mt-6 font-semibold">Friends</h3>
          {friends.length === 0 ? (
            <p>No friends yet 😢</p>
          ) : (
            friends.map((f, i) => (
              <div key={i} className="bg-gray-100 p-2 rounded">
                {f.uids.filter(uid => uid !== user.uid).join(", ")}
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
}
