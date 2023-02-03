//@ts-check

(function () {
    window.addEventListener('message', event => {
        const message = event.data;
        const summaryPanel = document.getElementById('summary');
        switch (message.type) {
            case 'addSummary':
                {
                    // @ts-ignore
                    summaryPanel.innerHTML = convertHTMLToDisplayText(message.text);
                    break;
                }
        }
    });

    function convertHTMLToDisplayText(htmlString) {
        let encodedString = htmlString.replace(/&/g, '&amp;');
        encodedString = encodedString.replace(/</g, '&lt;');
        encodedString = encodedString.replace(/>/g, '&gt;');
        encodedString = encodedString.replace(/"/g, '&quot;');
        return encodedString;
    }

}());