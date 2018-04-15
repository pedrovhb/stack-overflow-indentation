inputArea = document.querySelector('[id^=wmd-input]');  // Select element whose id starts with wmd-input
insertedStr = "    ";

inputArea.onkeydown = function (e) {

    // Tab
    if (e.keyCode === 9) {

        e.preventDefault();

        if (e.target.selectionStart === e.target.selectionEnd && !e.shiftKey) {

            // No selection and no shift, just add spaces
            let cursorIndex = e.target.selectionEnd;
            e.target.value = e.target.value.slice(0, cursorIndex) + insertedStr + e.target.value.slice(cursorIndex);
            e.target.selectionStart = e.target.selectionEnd = cursorIndex + insertedStr.length;

        } else {

            // There's text selected or shift + tab has been pressed

            let selStart = e.target.selectionStart;
            let selEnd = e.target.selectionEnd;

            // Should also ident first line selected, even though selection doesn't comprehend that newline
            let prevNewlineIndex = e.target.value.slice(0, e.target.selectionStart).lastIndexOf('\n');
            let originalStrLength = e.target.value.length;

            if (e.shiftKey) { // Remove indentation

                let removedIndentation = false;
                let re = new RegExp('\n' + insertedStr + '|^' + insertedStr, 'g');
                let removeindentation = function (match, offset, string) {
                    if (e.target.selectionEnd > offset && offset >= prevNewlineIndex) {
                        removedIndentation = true;
                        return match.slice(0, -insertedStr.length);
                    } else {
                        return match;
                    }
                };
                e.target.value = e.target.value.replace(re, removeindentation);
                if (!removedIndentation) {
                    return;
                }

            } else { // Add indentation

                let re = new RegExp('\n|^', 'g');
                let addindentation = function (match, offset, string) {
                    return (e.target.selectionEnd > offset && offset >= prevNewlineIndex)
                        ? match + insertedStr
                        : match;
                };
                e.target.value = e.target.value.replace(re, addindentation);
            }

            // Move selection to match the same as the previous selection with new indentation characters
            e.target.selectionStart = (e.shiftKey) ? selStart - insertedStr.length : selStart + insertedStr.length;
            e.target.selectionEnd = selEnd + e.target.value.length - originalStrLength;
        }
    }

    // Return
    if (e.keyCode === 13 && e.target.selectionStart === e.target.selectionEnd) {
        let prevNewlineIndex = e.target.value.lastIndexOf('\n');
        prevNewlineIndex = (prevNewlineIndex === -1) ? 0 : prevNewlineIndex;
        let indentCount = 0;
        let line = e.target.value.slice(prevNewlineIndex, e.target.selectionStart);
        line = (line[0] === '\n') ? line.slice(1) : line;
        while (true) {

            if (line.slice(0, insertedStr.length) === insertedStr) {
                indentCount++;
                line = line.slice(insertedStr.length);
            } else {
                break;
            }
        }

        if (indentCount === 0)
            return;

        e.preventDefault();
        e.target.value = e.target.value.slice(0, e.target.selectionStart)
            + '\n' + insertedStr.repeat(indentCount)
            + e.target.value.slice(e.target.selectionStart);

    }

    // Backspace
    if (e.keyCode === 8) {

        let selStart = e.target.selectionStart;
        let selEnd = e.target.selectionEnd;

        // If there's something selected, let default behaviour take over
        if (selStart !== selEnd)
            return;

        let cursorIndex = selStart;

        if (e.target.value.slice(cursorIndex - insertedStr.length, cursorIndex) === insertedStr) {

            e.preventDefault();
            e.target.value = e.target.value.slice(0, cursorIndex - insertedStr.length)
                + e.target.value.slice(cursorIndex);
            e.target.selectionStart = e.target.selectionEnd = cursorIndex - insertedStr.length;
        }
    }

};

