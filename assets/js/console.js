// Scripted chat console. Answers live in the HTML (#answers) so the page works
// without JS and stays crawlable; this file only replays them as a chat thread.
(() => {
    const thread = document.getElementById('transcript');
    const answers = new Map([...document.querySelectorAll('#answers article')].map(article => [article.dataset.q, article]));
    const questionButtons = document.querySelectorAll('.questions button');
    const form = document.getElementById('ask-form');
    const input = document.getElementById('ask-input');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, reducedMotion ? 0 : milliseconds));
    const maxTurns = 8;
    let currentRun = 0;
    let finishPrevious = () => {};
    // Play the first question unless the visitor picks one first.
    const autoplay = setTimeout(() => play('agents'), reducedMotion ? 0 : 500);

    document.getElementById('year').textContent = new Date().getFullYear();
    form.hidden = false;
    document.getElementById('all-answers').open = false;

    // Keyword routing for typed questions: a key matches the start of a word
    // ("agent" matches "agents"), and the topic with the most matching keys wins.
    function route(question) {
        const words = question.toLowerCase().split(/[^a-z0-9.-]+/).filter(Boolean);
        let best = { topic: 'none', score: 0 };
        for (const [topic, article] of answers) {
            const score = (article.dataset.keys || '').split(' ').filter(key => key && words.some(word => word.startsWith(key))).length;
            if (score > best.score) best = { topic, score };
        }
        return best.topic;
    }

    function element(tag, className, text) {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }

    // Types the answer out. Returns a function that completes it at once, used
    // when the visitor asks something else before it has finished.
    function streamInto(container, run) {
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
        const textNodes = [];
        while (walker.nextNode()) textNodes.push(walker.currentNode);
        const fullTexts = textNodes.map(node => node.textContent);
        const complete = () => textNodes.forEach((node, index) => { node.textContent = fullTexts[index]; });
        if (reducedMotion) return { done: Promise.resolve(), complete };
        textNodes.forEach(node => { node.textContent = ''; });
        const charsPerFrame = 9;
        const done = (async () => {
            for (let nodeIndex = 0; nodeIndex < textNodes.length; nodeIndex++) {
                const full = fullTexts[nodeIndex];
                for (let length = 0; length < full.length; length += charsPerFrame) {
                    if (run !== currentRun) return;
                    textNodes[nodeIndex].textContent = full.slice(0, length + charsPerFrame);
                    await new Promise(requestAnimationFrame);
                }
                textNodes[nodeIndex].textContent = full;
            }
        })();
        return { done, complete };
    }

    async function play(topic, askedText) {
        const article = answers.get(topic);
        if (!article) return;
        finishPrevious();
        const run = ++currentRun;

        questionButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.q === topic && !askedText)));
        thread.setAttribute('aria-busy', 'true');

        const turn = element('div', 'turn');
        turn.append(element('p', 'user-msg', askedText || article.querySelector('h3').textContent));
        const reply = element('div', 'reply');
        const from = element('p', 'reply-from');
        from.append(element('span', 'mark'), document.createTextNode("Vishnu's notes"));
        const tools = element('details', 'tools');
        tools.open = true;
        const toolsSummary = element('summary', '', 'Working');
        const trace = element('ol', 'trace');
        tools.append(toolsSummary, trace);
        reply.append(from, tools);
        turn.append(reply);
        thread.append(turn);
        while (thread.querySelectorAll('.turn').length > maxTurns) thread.querySelector('.turn').remove();
        thread.scrollTo({ top: turn.offsetTop - 12, behavior: reducedMotion ? 'auto' : 'smooth' });

        const steps = JSON.parse(article.dataset.trace);
        const usedLabel = `Used ${steps.length} ${steps.length === 1 ? 'tool' : 'tools'}`;
        const renderAnswer = () => {
            const answer = element('div', 'answer');
            [...article.children].filter(child => child.tagName !== 'H3').forEach(child => answer.append(child.cloneNode(true)));
            reply.append(answer);
            return answer;
        };

        // If the visitor moves on mid-trace, settle this turn instead of leaving it half done.
        let pendingRows = [];
        finishPrevious = () => {
            pendingRows.forEach(({ row, outcome, result }) => { row.className = 'done'; outcome.textContent = result; });
            toolsSummary.textContent = usedLabel;
            tools.open = false;
            renderAnswer();
        };

        for (const [toolName, argument, result] of steps) {
            const shownArgument = topic === 'none' ? askedText : argument;
            const callText = `${toolName}(${shownArgument ? `"${shownArgument}"` : ''})`;
            const row = element('li', 'pending');
            const outcome = element('span', 'outcome', 'running');
            row.append(element('code', '', callText), outcome);
            trace.append(row);
            toolsSummary.textContent = `Running ${toolName}`;
            pendingRows = [{ row, outcome, result }];
            await sleep(520);
            if (run !== currentRun) return;
            row.className = 'done';
            outcome.textContent = result;
        }
        pendingRows = [];
        toolsSummary.textContent = usedLabel;
        await sleep(180);
        if (run !== currentRun) return;
        tools.open = false;

        const stream = streamInto(renderAnswer(), run);
        finishPrevious = stream.complete;
        await stream.done;
        if (run === currentRun) thread.setAttribute('aria-busy', 'false');
    }

    // Bring the chat into view: on narrow screens it sits below the question list,
    // and follow-up links in the written-out answers sit below the console.
    function revealChat() {
        const top = thread.getBoundingClientRect().top;
        if (top < 0 || top > window.innerHeight * 0.6) {
            thread.scrollIntoView({ block: 'start', behavior: reducedMotion ? 'auto' : 'smooth' });
        }
    }

    document.addEventListener('click', event => {
        const trigger = event.target.closest('button[data-q]');
        if (!trigger) return;
        clearTimeout(autoplay);
        play(trigger.dataset.q);
        revealChat();
    });

    form.addEventListener('submit', event => {
        event.preventDefault();
        const question = input.value.trim();
        if (!question) return;
        clearTimeout(autoplay);
        play(route(question), question);
        input.value = '';
        revealChat();
    });
})();
