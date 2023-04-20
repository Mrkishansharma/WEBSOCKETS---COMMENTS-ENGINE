const socket = io("http://localhost:3000/", { transports: ["websocket"] });

    socket.on('allBlogs', (blogs) => {
        console.log(blogs);
        displayBlogs(blogs);
    })


    function createBlog() {

        const title = document.getElementById('title').value;
        const desc = document.getElementById('desc').value;

        if (!(title && desc)) {
            alert('Fill All the details')
            return
        }

        const blog = { title, desc }

        socket.emit("createblog", blog);

        alert('success')

    }

    const blogContainer = document.getElementById('blogContainer')

    function displayBlogs(data){

        const htmls = data.map((blog)=>{

            return `<div class="blogBox">

                        <h3>Title:- ${blog.title}</h3>

                        <p>Description:- ${blog.desc}</p>

                        <input type="text" id="${blog.id}" placeholder="comments...">

                        <button onclick="addComment('${blog.id}')">Add Comment</button>

                        <button onclick="deleteBlog('${blog.id}')">Delete Blog</button>

                        <div class="commentBox">Comments : - ${

                            blog.comments.map((c)=>{

                                return `<div>

                                        <p>${c.comment}</p>

                                        <input type="text" id="${c.id}" placeholder="Reply here...">

                                        <button onclick="addReply('${c.id}', '${blog.id}')">Add Reply</button>

                                        <button onclick="deleteComment('${c.id}', '${blog.id}')">Delete Comment</button> 

                                        <div class="replyBox">Reply : - ${

                                            c.replies.map((r)=>{

                                                return `<div class="replyBox">

                                                        <p>${r.reply}</p>
                                                        <button onclick="deleteReply('${r.id}', '${c.id}', '${blog.id}')">Delete Reply</button>   
                                                        
                                                    </div>`

                                            }).join('')

                                        }</div>
                                        
                                    </div>`

                            }).join('')

                        }</div>


                    </div>`;

        }).join('');

        blogContainer.innerHTML = htmls;
    }






    function addComment(id){

        const comment = document.getElementById(id).value;

        if (!comment) {
            alert('write comment');
            return
        }

        const commentObj = { comment, blogID:id }

        socket.emit("addComment", commentObj);

        alert('success');
    }




    function addReply(id, blogID){

        const reply = document.getElementById(id).value;

        if (!reply) {
            alert('write reply');
            return
        }

        const replyObj = { reply, commentID:id, blogID }

        socket.emit("addReply", replyObj);

        alert('success');
    }




    function deleteReply(rid, cid, bid){

        let obj = {rid, cid, bid}

        socket.emit("deleteReply", obj)

        alert('successfully deleted');
    }


    
    function deleteComment(cid, bid){

        let obj = { cid, bid }

        socket.emit("deleteComment", obj)

        alert('successfully deleted');
    }



    function deleteBlog(bid){

        let obj = { bid }

        socket.emit("deleteBlog", obj)

        alert('successfully deleted');
    }

