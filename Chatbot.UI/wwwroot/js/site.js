$(function () {

    function chatMessage(actor, img, isLeft, msg) {
        const htmlMsg = `
            <div class="msg ${side}-msg">
                <div class="msg-img" style="background-image: url(${img})"></div>
                    <div class="msg-bubble">
                        <div class="msg-info">
                            <div class="msg-info-name">${actor}</div>
                            <div class="msg-info-time">${formatDate(new Date())}</div>
                        </div>
                        <div class="msg-text">${msg}</div>
                    </div>
            </div>`
    }
})