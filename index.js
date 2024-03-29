

const express = require('express');

const app = express()

const http = require('http');

const server = http.createServer(app);

const {Server} = require('socket.io');

const { v4: uuidv4 } = require('uuid');



app.get('/',(req,res)=>{
    res.send("HOME PAGE")
})

// Blog DB
const BlogDB = []


server.listen(3000, ()=>{
    console.log(`Listening on port 3000`);
})

const io = new Server(server);


io.on("connection", (socket) =>{

    io.emit('allBlogs', BlogDB);
    



    socket.on("createblog", (blog)=>{

        blog.id = uuidv4();

        blog.comments = []

        BlogDB.push(blog);
        
        console.log(BlogDB);

        io.emit('allBlogs', BlogDB);
    })




    socket.on('addComment', (commentObj)=>{

        commentObj.id = uuidv4();
        commentObj.replies = []

        BlogDB.forEach((ele) => {
            if(ele.id === commentObj.blogID){
                ele.comments.push(commentObj)
            }
        })

        console.log(BlogDB);

        io.emit('allBlogs', BlogDB);

    })



    socket.on('addReply', (replyObj)=>{

        replyObj.id = uuidv4();
        console.log(replyObj);

        BlogDB.forEach((ele)=>{
            if(ele.id === replyObj.blogID){
                ele.comments.forEach((e)=>{
                    if(e.id === replyObj.commentID){
                        e.replies.push(replyObj)
                    }
                })
            }
        })

        console.log(BlogDB);

        io.emit('allBlogs', BlogDB);

    })




    socket.on("deleteReply", (obj)=>{

        BlogDB.forEach((b)=>{

            if(b.id === obj.bid ){

                b.comments.forEach(c=>{

                    if(c.id === obj.cid){

                        c.replies.forEach((r, i)=>{

                            if(r.id === obj.rid){

                                c.replies.splice(i,1);

                            }

                        })

                    }

                })

            } 

        })

        io.emit('allBlogs', BlogDB);

    })


    

    socket.on("deleteComment", (obj)=>{

        BlogDB.forEach((b)=>{

            if(b.id === obj.bid ){

                b.comments.forEach((c,i)=>{

                    if(c.id === obj.cid){

                        b.comments.splice(i,1);

                    }

                })

            } 

        })

        io.emit('allBlogs', BlogDB);

    })




    socket.on("deleteBlog", (obj)=>{

        BlogDB.forEach((b,i)=>{

            if(b.id === obj.bid ){

                BlogDB.splice(i,1)

            } 

        })

        io.emit('allBlogs', BlogDB);

    })

})