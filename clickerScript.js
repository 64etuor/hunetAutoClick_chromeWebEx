function injectScript(func) {
    const script = document.createElement('script');
    script.textContent = `(${func})();`;
    (document.head || document.documentElement).appendChild(script);
    script.remove();
}

// 2024-11-22: injectScript 페이지 컨텍스트에서 alert와 confirm 재정의 - Content Script과 개발자 도구 콘솔(실제 Javascript 환경) 환경 상이함
injectScript(() => {
    
    window.alert = function (msg) {
        console.log("Alert 메시지: " + msg);
        return true; 
    };

    window.confirm = function (msg) {
        console.log("Confirm 메시지: " + msg);
        return true; 
    };
});

function clickNextButton() {
    try {
        var foundNextChapterButton = false;
        
        var nextChapterButton = document.querySelector('a.btn.btn-lg.btn-primary');
        if (nextChapterButton && nextChapterButton.textContent.includes('다음 차시 바로가기')) {
            nextChapterButton.click();
            console.log('다음 차시 바로가기 버튼을 클릭했습니다.');
            foundNextChapterButton = true;
        } else {
            
            var framesArray = Array.from(frames);
            for (var i = 0; i < framesArray.length; i++) {
                try {
                    var frame = framesArray[i];
                    var frameDoc = frame.document;

                    var frameNextButton = frameDoc.querySelector('a.btn.btn-lg.btn-primary');
                    if (frameNextButton && frameNextButton.textContent.includes('다음 차시 바로가기')) {
                        frameNextButton.click();
                        console.log(`프레임에서 다음 차시 버튼 클릭: ${frame.name || i}`);
                        foundNextChapterButton = true;
                        break;
                    }
                } catch (e) {
                    console.error(`프레임 접근 오류 (${i}):`, e);
                }
            }
        }

        // 메인 프레임에서 next 버튼 검색
        if (!foundNextChapterButton) {
            var mainFrame = frames['main'];
            if (mainFrame) {
                try {
                    var nextButton = mainFrame.document.querySelector('#btn-next');
                    if (nextButton) {
                        nextButton.click();
                        console.log('Main 프레임에서 Next 버튼 클릭 완료');

                        // 재귀 호출 방지
                        setTimeout(function () {
                            console.log('다시 실행하지 않음. 작업 완료.');
                        }, 2000); 
                    } else {
                        console.log('Main 프레임에서 Next 버튼을 찾지 못했습니다.');
                    }
                } catch (e) {
                    console.error('Main 프레임 접근 오류:', e);
                }
            } else {
                console.log('main 프레임을 찾지 못했습니다.');
            }
        }

    } catch (e) {
        console.error('오류 발생:', e);
    }
}


var attempts = 0;
var maxAttempts = 100; 
var intervalId = setInterval(function () {
    attempts++;
    clickNextButton();

    if (attempts >= maxAttempts) {
        clearInterval(intervalId);
        console.log('최대 시도 횟수에 도달했습니다.');
    }
}, 30000);
