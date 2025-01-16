let remainingImages = [...fudalist];

let timerInterval;
let startTime;
let isGameStarted = false;

const timerElement = document.getElementById('timer');
const imageElement = document.getElementById('random-image');
const reloadButton = document.getElementById('reload-button');

// タイマーの開始
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const seconds = Math.floor(elapsedTime / 1000);
        const minutes = Math.floor(seconds / 60);
        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    }, 1000);
}

// タイマーの停止
function stopTimer() {
    clearInterval(timerInterval);
    const elapsedTime = Date.now() - startTime;
    const seconds = Math.floor(elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    alert(`終わりです。${minutes}分${remainingSeconds}秒でした！`);
    timerInterval = null;
}

// ページのリロード
function reloadPage(){
    let flag = window.confirm("最初の状態に戻りますが、いいですか？");
    if(flag) {
        location.reload();
    }
}

// ランダムなイメージを選択
function getRandomImage() {
    if (remainingImages.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * remainingImages.length);
    const [selectedImage] = remainingImages.splice(randomIndex, 1);
    return selectedImage;
}

// ランダムな画像を表示
function displayRandomImage() {
    const randomImage = getRandomImage();
    if (!randomImage) {
        stopTimer();
        return;
    }
    const isFlipped = Math.random() < 0.5;
    imageElement.src = randomImage.file;
    imageElement.style.transform = isFlipped ? 'rotate(180deg)' : 'rotate(0deg)';
}

// 画像クリック時のイベント
imageElement.addEventListener('click', () => {
    if (!isGameStarted) {
        isGameStarted = true;
        startTimer();
        displayRandomImage();
    } else if (timerInterval) {
        displayRandomImage();
    }
});

// リセットボタンクリックでリロードイベント
reloadButton.addEventListener('click', reloadPage);
