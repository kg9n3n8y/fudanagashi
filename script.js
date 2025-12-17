document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener("dblclick", function(e) { e.preventDefault(); }, { passive: false });

    const PLACEHOLDER_IMAGE = './torifuda/tori_0.png';
    const STORAGE_KEYS = {
        history: 'fudanagashi:history',
        letters: 'fudanagashi:letters'
    };
    const HISTORY_LIMIT = 3;

    const LETTER_GROUPS = [
        { id: 'one', title: '1枚札', letters: ['む', 'す', 'め', 'ふ', 'さ', 'ほ', 'せ'], mode: 'bundle', description: 'むすめふさほせ' },
        { id: 'two', title: '2枚札', letters: ['う', 'つ', 'し', 'も', 'ゆ'], mode: 'single' },
        { id: 'three', title: '3枚札', letters: ['い', 'ち', 'ひ', 'き'], mode: 'single' },
        { id: 'four', title: '4枚札', letters: ['は', 'や', 'よ', 'か'], mode: 'single' },
        { id: 'five', title: '5枚札', letters: ['み'], mode: 'single' },
        { id: 'six', title: '6枚札', letters: ['た', 'こ'], mode: 'single' },
        { id: 'seven', title: '7枚札', letters: ['お', 'わ'], mode: 'single' },
        { id: 'eight', title: '8枚札', letters: ['な'], mode: 'single' },
        { id: 'sixteen', title: '16枚札', letters: ['あ'], mode: 'single' }
    ];

    // HTML要素の取得
    const imageElement = document.getElementById('random-image');
    const reloadButton = document.getElementById('reload-button');
    const kimariji = document.getElementById('kimariji');
    const kimarijiButton = document.getElementById('kimariji-button');
    const topScreen = document.getElementById('top-screen');
    const gameScreen = document.getElementById('game-screen');
    const startButton = document.getElementById('start-button');
    const openSettingsButton = document.getElementById('open-settings-button');
    const selectionSummary = document.getElementById('selection-summary');
    const timeHistoryElement = document.getElementById('time-history');
    const settingsModal = document.getElementById('settings-modal');
    const modalOverlay = document.getElementById('modal-overlay');
    const closeSettingsButton = document.getElementById('close-settings');
    const settingsList = document.getElementById('settings-list');
    const enableAllButton = document.getElementById('enable-all-button');
    const disableAllButton = document.getElementById('disable-all-button');

    let fudaOrder = [];
    let startTime;
    let currentFuda = 0;
    let activeFudaPool = [];
    let letterState = loadLetterSettings();
    normalizeBundleStates();
    saveLetterSettings();

    let timeHistory = loadHistory();

    buildSettingsUI();
    syncSettingsUI();
    updateSelectionSummary();
    renderTimeHistory();

    function formatTime(ms) {
        if (!Number.isFinite(ms)) {
            return '--';
        }
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        if (minutes > 0) {
            return `${minutes}分${String(seconds).padStart(2, '0')}秒`;
        }
        return `${seconds}秒`;
    }

    function loadHistory() {
        try {
            const raw = JSON.parse(localStorage.getItem(STORAGE_KEYS.history));
            if (Array.isArray(raw)) {
                return raw.filter(entry => Number.isFinite(entry.timeMs) && Number.isFinite(entry.cards)).slice(0, HISTORY_LIMIT);
            }
        } catch (e) {
            console.warn('タイム履歴の読み込みに失敗しました。');
        }
        return [];
    }

    function saveHistory() {
        localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(timeHistory));
    }

    function addHistoryEntry(timeMs, cardCount) {
        const entry = {
            timeMs,
            cards: cardCount,
            recordedAt: Date.now()
        };
        timeHistory = [entry, ...timeHistory].slice(0, HISTORY_LIMIT);
        saveHistory();
    }

    function renderTimeHistory() {
        timeHistoryElement.innerHTML = '';
        if (timeHistory.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.className = 'time-history-empty';
            emptyItem.textContent = 'まだ記録がありません';
            timeHistoryElement.appendChild(emptyItem);
            return;
        }

        timeHistory.forEach((entry, index) => {
            const item = document.createElement('li');
            item.className = 'time-entry';

            const label = document.createElement('span');
            label.className = 'time-entry-label';
            label.textContent = `${index + 1}回前`;

            const value = document.createElement('span');
            value.className = 'time-entry-value';
            value.textContent = `${formatTime(entry.timeMs)}（${entry.cards}枚）`;

            item.appendChild(label);
            item.appendChild(value);
            timeHistoryElement.appendChild(item);
        });
    }

    function loadLetterSettings() {
        const defaults = {};
        getAllLetters().forEach(letter => {
            defaults[letter] = true;
        });
        try {
            const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.letters));
            if (stored && typeof stored === 'object') {
                Object.keys(stored).forEach(letter => {
                    if (letter in defaults && typeof stored[letter] === 'boolean') {
                        defaults[letter] = stored[letter];
                    }
                });
            }
        } catch (e) {
            console.warn('設定の読み込みに失敗しました。デフォルト値を使用します。');
        }
        return defaults;
    }

    function saveLetterSettings() {
        localStorage.setItem(STORAGE_KEYS.letters, JSON.stringify(letterState));
    }

    function getAllLetters() {
        const set = new Set();
        LETTER_GROUPS.forEach(group => {
            group.letters.forEach(letter => set.add(letter));
        });
        return Array.from(set);
    }

    function normalizeBundleStates() {
        LETTER_GROUPS.filter(group => group.mode === 'bundle').forEach(group => {
            const enabled = group.letters.every(letter => letterState[letter]);
            group.letters.forEach(letter => {
                letterState[letter] = enabled;
            });
        });
    }

    function createToggleButton(label, extraClasses = []) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'toggle-button';
        extraClasses.forEach(cls => button.classList.add(cls));
        button.textContent = label;
        button.setAttribute('aria-pressed', 'false');
        return button;
    }

    function setToggleButtonState(button, isActive) {
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-pressed', String(isActive));
    }

    function buildSettingsUI() {
        LETTER_GROUPS.forEach(group => {
            const section = document.createElement('section');
            section.className = 'settings-group';
            const heading = document.createElement('h3');
            heading.textContent = group.title;
            section.appendChild(heading);

            if (group.mode === 'bundle') {
                const button = createToggleButton(`${group.description}`, ['bundle-button']);
                button.dataset.bundle = 'true';
                button.dataset.letters = group.letters.join(',');
                section.appendChild(button);
            } else {
                const grid = document.createElement('div');
                grid.className = 'settings-grid';
                group.letters.forEach(letter => {
                    const button = createToggleButton(letter, ['letter-button']);
                    button.dataset.letter = letter;
                    grid.appendChild(button);
                });
                section.appendChild(grid);
            }

            settingsList.appendChild(section);
        });
    }

    function syncSettingsUI() {
        const buttons = settingsList.querySelectorAll('.toggle-button');
        buttons.forEach(button => {
            let isActive = false;
            if (button.dataset.bundle === 'true') {
                const letters = button.dataset.letters.split(',');
                isActive = letters.every(letter => letterState[letter]);
            } else if (button.dataset.letter) {
                isActive = letterState[button.dataset.letter];
            }
            setToggleButtonState(button, isActive);
        });
    }

    function updateSelectionSummary() {
        const available = getSelectedFudaList().length;
        if (available === 0) {
            selectionSummary.textContent = '使用できる札がありません。設定を見直してください。';
            startButton.disabled = true;
        } else {
            selectionSummary.textContent = `現在の使用枚数：${available}枚`;
            startButton.disabled = false;
        }
    }

    function isLetterEnabled(letter) {
        return letterState[letter] !== false;
    }

    function getSelectedFudaList() {
        return fudalist.filter(fuda => isLetterEnabled(fuda.kimariji[0]));
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function prepareGame() {
        activeFudaPool = getSelectedFudaList();
        if (activeFudaPool.length === 0) {
            alert('使用する札が選択されていません。');
            return false;
        }
        fudaOrder = shuffleArray([...activeFudaPool]);
        currentFuda = 0;
        startTime = null;
        imageElement.src = PLACEHOLDER_IMAGE;
        kimariji.textContent = '';
        kimariji.style.display = 'none';
        return true;
    }

    function showGameScreen() {
        topScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
    }

    function returnToTop() {
        topScreen.classList.remove('hidden');
        gameScreen.classList.add('hidden');
        imageElement.src = PLACEHOLDER_IMAGE;
        kimariji.textContent = '';
        kimariji.style.display = 'none';
        currentFuda = 0;
        startTime = null;
        fudaOrder = [];
        activeFudaPool = [];
    }

    function displayFuda(orderIndex) {
        const fuda = fudaOrder[orderIndex];
        const isFlipped = Math.random() < 0.5;
        imageElement.src = isFlipped ? fuda.reverse : fuda.normal;
        kimariji.textContent = fuda.kimariji;
    }

    function stopTimer() {
        const elapsedTime = Date.now() - startTime;
        const seconds = Math.floor(elapsedTime / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        alert(`終わりです。${minutes}分${remainingSeconds}秒でした！`);

        const cardsUsed = fudaOrder.length;
        addHistoryEntry(elapsedTime, cardsUsed);
        renderTimeHistory();

        returnToTop();
        updateSelectionSummary();
    }

    function openSettings() {
        settingsModal.classList.remove('hidden');
        modalOverlay.classList.remove('hidden');
    }

    function closeSettings() {
        settingsModal.classList.add('hidden');
        modalOverlay.classList.add('hidden');
    }

    // 決まり字の表示
    kimarijiButton.addEventListener('click', function() {
        if (window.getComputedStyle(kimariji).display === 'none') {
            kimariji.style.display = 'flex';
        }
    });

    imageElement.addEventListener('click', () => {
        if (gameScreen.classList.contains('hidden') || fudaOrder.length === 0) {
            return;
        }
        if (currentFuda === 0) {
            startTime = Date.now();
            displayFuda(currentFuda);
            currentFuda++;
        } else if (currentFuda === fudaOrder.length) {
            stopTimer();
        } else {
            displayFuda(currentFuda);
            currentFuda++;
        }

        if (window.getComputedStyle(kimariji).display === 'flex') {
            kimariji.style.display = 'none';
        }
    });

    function confirmReturnToTop() {
        const confirmReset = window.confirm("トップ画面に戻ります。よろしいですか？");
        if (!confirmReset) {
            return;
        }
        returnToTop();
        updateSelectionSummary();
    }

    reloadButton.addEventListener('click', confirmReturnToTop);

    startButton.addEventListener('click', () => {
        if (!prepareGame()) {
            return;
        }
        showGameScreen();
    });

    openSettingsButton.addEventListener('click', () => {
        syncSettingsUI();
        openSettings();
    });

    closeSettingsButton.addEventListener('click', closeSettings);
    modalOverlay.addEventListener('click', closeSettings);

    enableAllButton.addEventListener('click', () => {
        Object.keys(letterState).forEach(letter => {
            letterState[letter] = true;
        });
        saveLetterSettings();
        syncSettingsUI();
        updateSelectionSummary();
    });

    disableAllButton.addEventListener('click', () => {
        Object.keys(letterState).forEach(letter => {
            letterState[letter] = false;
        });
        saveLetterSettings();
        syncSettingsUI();
        updateSelectionSummary();
    });

    settingsList.addEventListener('click', (event) => {
        const target = event.target.closest('.toggle-button');
        if (!target) {
            return;
        }
        if (target.dataset.bundle === 'true') {
            const letters = target.dataset.letters.split(',');
            const nextState = !letters.every(letter => letterState[letter]);
            letters.forEach(letter => {
                letterState[letter] = nextState;
            });
        } else if (target.dataset.letter) {
            const letter = target.dataset.letter;
            letterState[letter] = !letterState[letter];
        }
        saveLetterSettings();
        syncSettingsUI();
        updateSelectionSummary();
    });

    function preloadFudaImages() {
        const imagePaths = new Set([PLACEHOLDER_IMAGE]);
        fudalist.forEach(({ normal, reverse }) => {
            imagePaths.add(normal);
            imagePaths.add(reverse);
        });

        const sources = Array.from(imagePaths);
        let index = 0;
        const CHUNK_SIZE = 8;

        const loadChunk = (deadline) => {
            let processed = 0;
            while (index < sources.length && processed < CHUNK_SIZE) {
                if (deadline && deadline.timeRemaining() <= 0) {
                    break;
                }
                const img = new Image();
                img.src = sources[index];
                index++;
                processed++;
            }

            if (index < sources.length) {
                if (window.requestIdleCallback) {
                    requestIdleCallback(loadChunk);
                } else {
                    setTimeout(loadChunk, 16);
                }
            }
        };

        if (sources.length === 0) {
            return;
        }

        if (window.requestIdleCallback) {
            requestIdleCallback(loadChunk);
        } else {
            setTimeout(loadChunk, 0);
        }
    }

    window.addEventListener('load', preloadFudaImages);
});
