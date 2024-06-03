$( document ).ready(function() {

    // ====================================LIVE COMMENTS

    let commentIds = JSON.parse(localStorage.getItem('commentIds') || '[]');


    let randomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const addClass = (item, className) => (item.classList.add(className));
    const removeClass = (item, className) => (item.classList.remove(className));

    $('.answer-wrap').each(function () {
        const answerId = this.getAttribute('data-id');
        if (commentIds.includes(answerId)) {
            addClass(this, 'already-typed');
        }
    });

    $('.answer-wrap:not(.typing, .just-typed, .already-typed)').one('inview', (event, isInView) => {
        const item = event.target;
        const answerId = item.getAttribute('data-id');
        if (isInView && !commentIds.includes(answerId)) {
            commentIds.push(answerId);
            localStorage.setItem('commentIds', JSON.stringify(commentIds));
            const firstTicker = randomInt(1200, 4700);
            const secondTicker = randomInt(3600, 9500);
            setTimeout(() => {
                addClass(item, 'typing');
            }, firstTicker);
            setTimeout(() => {
                addClass(item, 'just-typed');
                removeClass(item, 'typing');
            }, firstTicker + secondTicker);
        }
    })


    // ====================================COMMENTS TYPE ABILITY

    let commentsData = JSON.parse(localStorage.getItem('commentsData') || '[]');

    const displayComment = (name, text) => {
        const commentsWrapper = document.querySelector('.comments-wrap');
        const createCommentElement = document.querySelector('.comment-add-block');

        const commentLayout = document.querySelector('.comment-layout').cloneNode(true);
        commentLayout.classList.add("answer-wrap", "just-typed", "comment-layout");
        commentLayout.querySelector(".layout-user-pic").setAttribute("src", "img/profile.jpg");
        const commentLikes = commentLayout.querySelector(".layout-comment-likes");
        const commentTime = commentLayout.querySelector(".layout-comment-time");
        commentLikes ? commentLikes.innerText = '' : '';
        commentTime ? commentTime.innerText = 'just now' : '';
        commentLayout.querySelector(".user-name").innerText = name;
        commentLayout.querySelector(".typed-text").innerText = text;

        commentsWrapper.insertBefore(commentLayout, createCommentElement.nextSibling);

    };

    for (const comment of commentsData) {
        displayComment(comment.name, comment.text);
    }

    $('#add-comment-btn').click(() => {
        const comment = {
            name: document.querySelector('[name="user-name"]').value,
            text: document.querySelector('[name="user-comment"]').value
        };

        if (comment.name.length > 2 && comment.text.length > 2) {
            displayComment(comment.name, comment.text);
            commentsData.push(comment);
            localStorage.setItem('commentsData', JSON.stringify(commentsData));
            document.querySelector('[name="user-name"]').value = "";
            document.querySelector('[name="user-comment"]').value = "";
        }

    })
})