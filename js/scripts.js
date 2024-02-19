const url = "https://jsonplaceholder.typicode.com/posts";

const loadingElement = document.querySelector('#loading');
const postsContainer = document.querySelector('#posts-container');

//Get ID from URL 

const urlSearchParams = new URLSearchParams(window.location.search);
const postID = urlSearchParams.get('id');
const postPage = document.querySelector('#post');
const postContainer = document.querySelector('#post-container');
const commentsContainer = document.querySelector('#comments-container');

const commentFrom = document.querySelector('#commment-form');
const emailInput =  document.querySelector('#email');
const bodyInput = document.querySelector('#body');

//Get all posts 

async function getAllPosts() {
    const res = await fetch(url);

    const data = await res.json();


    console.log(data);
    loadingElement.classList.add("hidde");
    data.map((post) => {
        const div = document.createElement('div');
        const title = document.createElement('h2');
        const body = document.createElement('p');
        const link = document.createElement('a');


        title.innerText =  post.title; 
        body.innerText = post.body;
        link.innerText = "Ler";
        link.setAttribute("href", `/post.html?id=${post.id}`);


        div.appendChild(title);
        div.appendChild(body);
        div.appendChild(link);

        postsContainer.appendChild(div);
    })

}

//Get individual Post 

async function getPost(id)  {
    const [resPost, resComments] = await Promise.all ([
        fetch(`${url}/${id}`),
        fetch(`${url}/${id}/comments`)
    ])
    const dataPost = await resPost.json();
    const dataComments = await resComments.json();

    loadingElement.classList.add('hide');
    postPage.classList.remove('hide');

    const title = document.createElement('h1');
    const body = document.createElement('p');

    title.innerText = dataPost.title;
    body.innerText = dataPost.body;

    postContainer.appendChild(title);
    postContainer.appendChild(body);

    dataComments.map((comment) => {
        createComment(comment);
    })

}

function createComment(comment) {
    const div = document.createElement('div');
    const email = document.createElement('h3');
    const commentBody = document.createElement('p');

    email.innerText = comment.email;
    commentBody.innerText = comment.commentBody;

    div.appendChild(email);
    div.appendChild(commentBody);

    commentsContainer.appendChild(div);

}

//Post a comment 

async function postComment(comment) {
    const res = await fetch(`${url}/${postID}/comments`, {
        method:"POST",
        body: comment,
        headers: {
            "Content-type": "application/json",
        }
    })
    const data = await res.json();
    createComment(data);

}

if (!postID) {
    getAllPosts
}else {
    getPost(postID);

    //Add event to comment form 
    commentFrom.addEventListener("submit", (e) => {
        e.preventDefault();

        let comment = {
            email: emailInput.value,
            body: bodyInput.value,

        };
        comment = JSON.stringify(comment);
        postComment(comment);
    })
}