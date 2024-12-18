/*
{
    "_id": "675c852615fee0925c8d2e52",
    "text": "First Post",
    "username": "GurjotS",
    "createdAt": "2024-12-13T19:04:06.252Z",
    "likes": [
      {
        "_id": "675c8a3715fee0925c8d2e9e",
        "postId": "675c852615fee0925c8d2e52",
        "username": "buttercupx",
        "createdAt": "2024-12-13T19:25:43.034Z"
      }
    ]
  },
*/

async function handleLike(postElement) {
  console.dir(postElement.dataset.post_id, "hello")

  const payload = JSON.stringify({ "postId": postElement.dataset.post_id });

  const response = await fetch(
    BASE_URL + "/api/likes/", {
    method: "POST",
    headers: headersWithAuth(),
    body: payload
  });
  const object = await response.json();
  if (object.statusCode == 400) {
    alert("You already liked this post")
  } else if (object._id) {
    alert("Message Liked!")
    window.location.reload();
  } else {
    alert("Error");
    window.location.reload();
  }
}

 async function handleUnLike(postElement) {
  const username = localStorage.getItem("username");

  const response = await fetch(
    BASE_URL + "/api/posts/"+postElement.dataset.post_id , {
    method: "GET",
    headers: headersWithAuth()
  });
  const object = await response.json();
  if(object.likes) {
    object.likes.forEach(async (like) => {
      if(like.username == username) {
        console.log("found auth user")

        const response = await fetch(
          BASE_URL + "/api/likes/"+like._id , {
          method: "DELETE",
          headers: headersWithAuth()
        });
        const object = await response.json();
        if(object.statusCode == 202) {
          alert("You unliked the post");
          window.location.reload();
        }
      }
    })
  } 

}

async function handleDelete(postElement) {
  const response = await fetch(
    BASE_URL + "/api/posts/"+postElement.dataset.post_id , {
    method: "DELETE",
    headers: headersWithAuth(),
  });
  const object = await response.json();
  if (object.statusCode == 400) {
    alert("Bad request");
  } else if (object.statusCode == 202) {
    alert("Post Deleted!")
    window.location.reload();
  } else {
    alert("Error");
    window.location.reload();
  }
}


function getMessage(m) {
  return `
        <div data-post_id="${m._id}" class="message">
            FROM:  ${m.username}<br>\n    
            WHEN:  ${m.createdAt}<br>\n    
            TEXT:  ${m.text}<br>\n
            LIKES: ${m.likes.length}
            <button class="btn-like">Like</button>
            <button class="btn-unlike">Unlike</button>
            <div>
              <button class="btn-delete">Delete message</button>
            </div>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", async () => {

  const messages = await getMessageList();
  const userToken = localStorage.getItem("token");

  if (userToken) {
    output.innerHTML = messages.map(getMessage).join("<hr>\n")
  } else {
    console.log("triggered")
    alert("Please login first");
    window.location.href = "index.html";
  }


  const likeButtons = document.querySelectorAll(".btn-like");
  likeButtons.forEach(likeButton => {
    likeButton.addEventListener("click", function (event) {
      handleLike(likeButton.parentElement);
    })
  })

  const unlikeButtons = document.querySelectorAll(".btn-unlike");
  unlikeButtons.forEach(unlike => {
    unlike.addEventListener("click", function (event) {
      handleUnLike(unlike.parentElement);
    })
  })

  const deleteButtons = document.querySelectorAll(".btn-delete");
  deleteButtons.forEach(deleteBtn => {
    deleteBtn.addEventListener("click", function (event) {
      handleDelete(deleteBtn.parentElement.parentElement);
    })
  })

});//end load
