const handleSend = async () => {
    if (!message.trim()) return;
  
    const senderId = currentUserId;
    const receiverId = selectedUserId;
  
    if (!senderId || !receiverId) {
      console.error("❌ Missing sender or receiver ID");
      return;
    }
  
    const newMsg = {
      senderId,
      receiverId,
      message,
    };
  
    // Send to socket
    socket.emit("private_message", newMsg);
  
    // Save to database
    try {
      const res = await fetch(`${BACKEND_URL}/api/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMsg),
      });
  
      const data = await res.json();
      console.log("✅ Message saved to DB:", data);
    } catch (err) {
      console.error("❌ Error saving message:", err);
    }
  
    // Show in chat immediately
    setChat((prev) => [...prev, { ...newMsg, timestamp: new Date() }]);
    setMessage("");
  };
  