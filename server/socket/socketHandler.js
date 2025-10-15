const usersMap = new Map();

module.exports = (io)=>{
    io.on("connection",(socket)=>{
        console.log("new user connected",socket.id)
        
        socket.on("register_user", (userId) => {
            usersMap.set(userId, socket.id);
            console.log("Registered user:", userId);
                    
        });

        socket.on("send_message", (data) => {
            console.log("sending message");
            const { senderId, receiverId, message } = data;
            console.log(data);
            const receiverSocketId = usersMap.get(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("receive_message", {
                senderId,
                message,
                time: new Date(),
                });
            }
        });


        socket.on("disconnect",()=>{
            for( const[userId,socket_id] of usersMap.entries()){
                if(socket_id===socket.id){
                    usersMap.delete(userId);
                    break;
                }
                
            }
            console.log("user disconnected");
        });
    })
}