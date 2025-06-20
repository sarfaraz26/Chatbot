$(function () {

    //CONSTANTS
    const enterKeyWord = 13; //key code


    //CALLER
    addBotMessage("Hello! How can I assist you today?");            // Initialize Bot chat nessage first
    btnSend_click();                                                // Send button clicked


    //EVENTS
    function btnSend_click() {
        $('#btnSend').click(function () {
            const question = $('#userInput').val().trim();

            addUserMessage();
            addLoader();
            addChatScroll();
            getResponseFromBot(question)
        })
    }

    $('#userInput').on('input', validateSendButton);
    validateSendButton();

    $('#userInput').on('keydown', function (e) {
        if (e.key === 'Enter') {
            $('#btnSend').click();
        }
    });


    //METHODS
    function getResponseFromBot(question) {
        $.ajax({
            url: '/AskBot',
            type: 'POST',
            data: JSON.stringify(question),
            async: true,
            contentType: 'application/json',
            success: function (response) {
                removeLoader();
                addBotMessage(response.answer);
                addChatScroll();
            },
            error: function () {
                console.log('Error occurred while fetching response from bot.');        //TODO : Add error pop up
            }
        });
    }

    function addBotMessage(text) {
        const htmlContent = `<div class="d-flex justify-content-start align-items-start mt-3">
                <img src="/images/bot.png" width="40" height="40" class="rounded-circle me-1" />
                <div class="me-2">
                    <div class="bg-primary text-white p-2 rounded">
                        <strong>Bot</strong>
                        <br><span>${text}</span><br>
                        <small class="text-white-50">${getFormattedTime()}</small>
                    </div>
                </div>
            </div>`

        $('.card-body').append($(htmlContent));
    }

    function addUserMessage() {
        const text = $('#userInput').val().trim();

        const htmlContent =  `<div class="d-flex justify-content-end align-items-start mt-3">
                <img src="/images/user.png" width="40" height="40" class="rounded-circle me-1" />
                <div class="me-2">
                    <div class="bg-light border p-2 rounded">
                        <strong>User</strong>
                        <br><span>${text}</span><br>
                        <small class="text-muted">${getFormattedTime()}</small>
                    </div>
                </div>
            </div>`

        $('.card-body').append($(htmlContent));
        $('#userInput').val('');
    }

    function addChatScroll() {
        $('.card-body').scrollTop($('.card-body').scrollTop() + 500);
    }

    function addLoader() {
        const htmlContent = `<div class="px-5">
                <img class="imgLoader" src="/images/loader.gif" height="50"/>
            </div>`;

        $('.card-body').append($(htmlContent));
    }

    function removeLoader() {
        $('.imgLoader').hide();
    }

    function getFormattedTime() {

        const date = new Date();
        const h = "0" + date.getHours();
        const m = "0" + date.getMinutes();

        return `${h.slice(-2)}:${m.slice(-2)}`;
    }

    function validateSendButton() {
        const isEmpty = $('#userInput').val().trim() === '';
        $('#btnSend').prop('disabled', isEmpty);
    }
})