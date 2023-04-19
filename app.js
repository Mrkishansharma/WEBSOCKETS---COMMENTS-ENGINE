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

        const htmls = data.map((ele)=>{

            return `<div class="blogBox">

                        <h3>Title:- ${ele.title}</h3>

                        <p>Description:- ${ele.desc}</p>

                        <input type="text" id="${ele.id}" placeholder="comments...">

                        <button onclick="addComment('${ele.id}')">Add Comment</button>


                        <div class="commentBox">Comments : - ${

                            ele.comments.map((e)=>{

                                return `<div>

                                        <p>${e.comment}</p>

                                        <input type="text" id="${e.id}" placeholder="Reply here...">

                                        <button onclick="addReply('${e.id}', '${ele.id}')">Add Reply</button>

                                        <div class="replyBox">Reply : - ${

                                            e.replies.map((r)=>{

                                                return `<div class="replyBox">

                                                        <p>${r.reply}</p>   
                                                        
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