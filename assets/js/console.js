// Scripted "agent trace" console. Answers live in the HTML (#answers) so the
// page works without JS and stays crawlable; this file only replays them.
(() => {
    const transcript = document.getElementById('transcript');
    const answers = new Map([...document.querySelectorAll('#answers article')].map(article => [article.dataset.q, article]));
    const questionButtons = document.querySelectorAll('.questions button');
    const form = document.getElementById('ask-form');
    const input = document.getElementById('ask-input');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, reducedMotion ? 0 : milliseconds));
    let currentRun = 0;
    // Play the first question unless the visitor picks one first.
    const autoplay = setTimeout(() => play('agents'), reducedMotion ? 0 : 500);

    document.getElementById('year').textContent = new Date().getFullYear();
    form.hidden = false;

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

    async function streamInto(container, source) {
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
        const textNodes = [];
        while (walker.nextNode()) textNodes.push(walker.currentNode);
        const fullTexts = textNodes.map(node => node.textContent);
        if (reducedMotion) return;
        textNodes.forEach(node => { node.textContent = ''; });
        const charsPerFrame = 9;
        for (let nodeIndex = 0; nodeIndex < textNodes.length; nodeIndex++) {
            const full = fullTexts[nodeIndex];
            for (let length = 0; length < full.length; length += charsPerFrame) {
                if (source !== currentRun) return;
                textNodes[nodeIndex].textContent = full.slice(0, length + charsPerFrame);
                await new Promise(requestAnimationFrame);
            }
            textNodes[nodeIndex].textContent = full;
        }
    }

    async function play(topic, askedText) {
        const article = answers.get(topic);
        if (!article) return;
        const run = ++currentRun;

        questionButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.q === topic && !askedText)));
        transcript.replaceChildren();
        transcript.setAttribute('aria-busy', 'true');

        const heading = askedText || article.querySelector('h2').textContent;
        transcript.append(element('p', 'asked', heading));

        const trace = element('ol', 'trace');
        transcript.append(trace);
        for (const [toolName, argument, result] of JSON.parse(article.dataset.trace)) {
            const row = element('li', 'pending');
            const shownArgument = topic === 'none' ? askedText : argument;
            const call = element('code', '', `${toolName}(${shownArgument ? `"${shownArgument}"` : ''})`);
            const outcome = element('span', 'outcome', 'running');
            row.append(call, outcome);
            trace.append(row);
            await sleep(520);
            if (run !== currentRun) return;
            row.className = 'done';
            outcome.textContent = result;
        }
        await sleep(200);
        if (run !== currentRun) return;

        const answer = element('div', 'answer');
        [...article.children].filter(child => child.tagName !== 'H2').forEach(child => answer.append(child.cloneNode(true)));
        transcript.append(answer);
        await streamInto(answer, run);
        if (run === currentRun) transcript.setAttribute('aria-busy', 'false');
    }

    document.addEventListener('click', event => {
        const trigger = event.target.closest('button[data-q]');
        if (!trigger) return;
        clearTimeout(autoplay);
        play(trigger.dataset.q);
        revealTranscript();
    });

    // On narrow screens the answer sits below the question list; bring it into view.
    function revealTranscript() {
        if (transcript.getBoundingClientRect().top > window.innerHeight * 0.6) {
            transcript.scrollIntoView({ block: 'start', behavior: reducedMotion ? 'auto' : 'smooth' });
        }
    }

    form.addEventListener('submit', event => {
        event.preventDefault();
        const question = input.value.trim();
        if (!question) return;
        clearTimeout(autoplay);
        play(route(question), question);
        input.value = '';
        revealTranscript();
    });

})();
