"use strict";

/*******************************************************
 *    Asynchronotrigger - 100p
 *
 *    This is your last assignment. Finish this to proof that
 *    you are a grown up now, who doesn't need to be held by
 *    the hand.
 *
 *    Create a users-class. Fetch the users, create Instances.
 *    - https://jsonplaceholder.typicode.com/users
 *
 *    Create a posts-class. Fetch the posts. create Instances.
 *    Assign them to the users (see userId in the posts).
 *    - https://jsonplaceholder.typicode.com/posts
 *
 *    Print the shit. Beautifully:
 *    List the 10 users. On click, expand them with their posts.
 *    Each Post should also have a Button to "load comments".
 *    Yes, you are correct. This is the perfect usecase for
 *    event-delegation! You can get the comments to a post from either
 *    - https://jsonplaceholder.typicode.com/posts/1/comments
 *    or
 *    - https://jsonplaceholder.typicode.com/comments?postId=1
 *    where "1" stands for the posts ID of course.
 *
 *    I believe in...
 *    Carina - 2026-06-09
 *  *******************************************************/

import User from "./class.user.js";
import Post from "./class.post.js";

const USERS_URL = "https://jsonplaceholder.typicode.com/users";
const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";
const COMMENTS_URL = "https://jsonplaceholder.typicode.com/comments";

let users = [];

const app = document.querySelector("#app");
app.addEventListener("click", handleClick);

loadData();

async function loadData() {
    const userData = await fetchUsers();
    const postData = await fetchPosts();

    users = createUsers(userData);
    const posts = createPosts(postData);

    assignPostsToUsers(posts, postData);

    printUsers();
}

async function fetchUsers() {
    const response = await fetch(USERS_URL);
    const data = await response.json();
    return data;
}

async function fetchPosts() {
    const response = await fetch(POSTS_URL);
    const data = await response.json();
    return data;
}

async function fetchComments(postId) {
    const response = await fetch(COMMENTS_URL + "?postId=" + postId);
    const data = await response.json();
    return data;
}

function createUsers(userData) {
    let newUsers = [];

    for (const user of userData) {
        let newUser = new User(user.id, user.name, user.username, user.email, user.website);
        newUsers.push(newUser);
    }

    return newUsers;
}

function createPosts(postData) {
    let posts = [];

    for (const post of postData) {
        let newPost = new Post(post.id, post.title, post.body);
        posts.push(newPost);
    }

    return posts;
}

function assignPostsToUsers(posts, postData) {
    for (let i = 0; i < posts.length; i++) {
        let userId = postData[i].userId;

        for (const user of users) {
            if (user.id === userId) {
                user.addPost(posts[i]);
            }
        }
    }
}

function printUsers() {
    let html = "";

    for (const user of users) {
        html += "<section class='user' data-user-id='" + user.id + "'>";
        html += "<h2>" + user.name + "</h2>";
        html += "<p>Username: " + user.username + "</p>";
        html += "<p>Email: <a href='mailto:" + user.email + "'>" + user.email + "</a></p>";
        html += "<p>Website: <a href='https://" + user.website + "' target='_blank'>" + user.website + "</a></p>";
        html += "<button class='show-posts'>Show posts</button>";
        html += "<div class='posts'></div>";
        html += "</section>";
    }

    app.innerHTML = html;
}

async function handleClick(event) {
    if (event.target.classList.contains("load-comments")) {
        const postArticle = event.target.closest(".post");
        const postId = Number(postArticle.dataset.postId);
        const commentsDiv = postArticle.querySelector(".comments");

        const comments = await fetchComments(postId);
        printComments(comments, commentsDiv);

        return;
    }

    if (event.target.classList.contains("show-posts")) {
        const userSection = event.target.closest(".user");
        const userId = Number(userSection.dataset.userId);
        const user = findUserById(userId);
        const postsDiv = userSection.querySelector(".posts");

        if (postsDiv.innerHTML === "") {
            printPosts(user, postsDiv);
            event.target.textContent = "Hide posts";
        } else {
            postsDiv.innerHTML = "";
            event.target.textContent = "Show posts";
        }
    }
}

function findUserById(id) {
    for (const user of users) {
        if (user.id === id) {
            return user;
        }
    }
}

function printPosts(user, postsDiv) {
    let html = "";

    for (const post of user.posts) {
        html += "<article class='post' data-post-id='" + post.id + "'>";
        html += "<h3>" + post.title + "</h3>";
        html += "<p>" + post.body + "</p>";
        html += "<button class='load-comments'>Load comments</button>";
        html += "<div class='comments'></div>";
        html += "</article>";
    }

    postsDiv.innerHTML = html;
}

function printComments(comments, commentsDiv) {
    let html = "";

    for (const comment of comments) {
        html += "<section class='comment'>";
        html += "<h4>" + comment.name + "</h4>";
        html += "<p>" + comment.body + "</p>";
        html += "<p><a href='mailto:" + comment.email + "'>" + comment.email + "</a></p>";
        html += "</section>";
    }

    commentsDiv.innerHTML = html;
}