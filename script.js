document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener("dblclick", function(e) { e.preventDefault(); }, { passive: false });

    let remainingImages = [...fudalist];
    let startTime;
    let isGameStarted = false;

    const timerElement = document.getElementById('timer');
    const imageElement = document.getElementById('random-image');
    const reloadButton = document.getElementById('reload-button');
    const kimariji = document.getElementById('kimariji');
    const kimarijiButton = document.getElementById('kimariji-button');

    // 決まり字の表示
    kimarijiButton.addEventListener('click', function() {
        if (window.getComputedStyle(kimariji).display === 'none') {
            kimariji.style.display = 'flex';
        }
    });

    // タイマーの停止・リセット
    function stopTimer() {
        const elapsedTime = Date.now() - startTime;
        const seconds = Math.floor(elapsedTime / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        alert(`終わりです。${minutes}分${remainingSeconds}秒でした！`);

        imageElement.src = './torifuda/tori_0.png';
        kimariji.textContent = '';
        isGameStarted = false;
        remainingImages = [...fudalist];
    }

    // ページのリロード
    function reloadPage(){
        let flag = window.confirm("最初の状態に戻りますが、いいですか？");
        if(flag) {
            imageElement.src = './torifuda/tori_0.png';
            document.getElementById('kimariji').textContent = '';
            isGameStarted = false;
            remainingImages = [...fudalist]
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
        imageElement.src = isFlipped ? randomImage.reverse : randomImage.normal;
        document.getElementById('kimariji').textContent = randomImage.kimariji;
    }

    // 画像クリック時のイベント
    imageElement.addEventListener('click', () => {
        if (!isGameStarted) {
            isGameStarted = true;
            startTime = Date.now();
            displayRandomImage();
        } else {
            displayRandomImage();
        }

        const kimariji = document.getElementById('kimariji');
        if (window.getComputedStyle(kimariji).display === 'flex') {
            kimariji.style.display = 'none';
        }
    });

    // 最初からボタンクリックでリロードイベント
    reloadButton.addEventListener('click', reloadPage);
});