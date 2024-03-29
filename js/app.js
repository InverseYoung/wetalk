$(function () {
    function getGuidGenerator() {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
    var userid = '';
    if (window.sessionStorage) {
        var veri = window.sessionStorage.getItem('userid');
        if (veri) {
            userid = veri;
        } else {
            userid = getGuidGenerator();
            window.sessionStorage.setItem('userid', userid);
        }
    } else {
        userid = getGuidGenerator();
    }
    var wsUrl = "ws://211.149.133.37:8888/im/" + userid;
    function init(){
        ws = new WebSocket(wsUrl);
        ws.onopen = function () {
        };
        ws.onmessage = function (evt) {
            onMessage(evt);
        };
        ws.onclose = function () {
        };
        ws.onerror = function () {
        };
    }
    function onMessage(evt) {
        var d = JSON.parse(evt.data);
        console.log('d', d.errorCode);
        if (d.errorCode == '11'){
            showTips('正在匹配中...');
            addStaus('正在匹配中...(可点击按钮取消)', 0);
            $('#route').removeClass('startTalk').addClass('stopMatch').removeClass('aui-btn-info').addClass('aui-btn-warning');
            $('#route').html('匹配中..');
        } else if(d.errorCode == '22'){
            showTips('匹配成功，开始聊天吧');
            addStaus('匹配成功，开始聊天吧', 1);
            $('#route').removeClass('aui-btn-warning').addClass('aui-btn-danger');
            $('#route').addClass('endTalk').html('结束聊天');
            $('.talk-send-box').fadeIn(500);
            $('.talk-list').fadeIn(500);
            logoScorll(0);
        } else if(d.errorCode == '99'){
            showTips('对方已断开，请您重新匹配');
            addStaus('对方已断开，请您重新匹配', 2);
            resetTalk();
            ws.close();
        } else {
            if (d.returnObject[0] === '[*+-sending-+*]'){
                $('#sending').fadeIn();
            } else if (d.returnObject[0] === '[*+-unsending-+*]'){
                $('#sending').hide();
            } else {
                $('#sending').hide();
                newMessage(d.returnObject[0]);
            }

        }
    };
    function showTips(text){
        $('.aui-tips-title').html(text);
        $('.talk-process-tips').fadeIn(500);
        setTimeout(function (){
            $('.talk-process-tips').fadeOut(500);
        }, 1500);
    }
    function addStaus(text, type){
        var t = type || 0;
        var h = '<div class="status-'+t+'">'+text+'</div>';
        $('.talk-status').append(h);
    }
    function newMessage(data){
        var html = '<div class="aui-chat-item aui-chat-left">';
        html += '<div class="aui-chat-inner">';
        html += '<div class="aui-chat-name">对方 </div>';
        html += '<div class="aui-chat-content">';
        html += '<div class="aui-chat-arrow"></div>';
        html += data;
        html += '</div>';
        html += '<div class="aui-chat-status aui-chat-status-refresh">';
        html += '<i class="aui-iconfont aui-icon-correct aui-text-success"></i>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        $('.aui-chat').append(html);
        scrollLast();
    }
    function logoScorll(t){
        if (t === 0){
            $('.logo').animate({marginTop: 0}, 'slow');
        } else {
            $('.logo').animate({marginTop: '4rem'}, 'slow');
        }
    }
    function scrollLast(){
        $('html, body').animate({
            scrollTop: $('html, body').height()
        }, 'slow');
    }
    function resetTalk(){
        $("#route").removeClass('aui-btn-danger').addClass('aui-btn-info');
        $("#route").removeClass('endTalk').removeClass('stopMatch').addClass('startTalk').html('开始聊天');
        $('.talk-send-box').fadeOut(500);
        $('.aui-chat').empty();
        $('.talk-status').empty();
        $('.talk-list').fadeOut(500);
        logoScorll(1);
    }
    $('body').on('click', '.startTalk', function () {
        init();
    });
    $('body').on('click', '.stopMatch', function () {
        showTips('正在取消匹配...');
        $('#route').removeClass('stopMatch').addClass('startTalk').removeClass('aui-btn-warning').addClass('aui-btn-info');
        $('#route').html('开始聊天');
        $('.talk-status').empty();
        ws.close();
    });
    $('body').on('click', '.endTalk', function () {
        $('.aui-tips-title').html('正在断开...');
        resetTalk();
        ws.close();
    });
    $('.talk-unlink-btn').on('click', function () {
        $('.aui-tips-title').html('正在断开...');
        resetTalk();
        ws.close();
    });
    $('.talk-send-btn').on('click', function () {
        if ($('#talk-content').val().replace(/[ ]/ig, '').length) {
            var data = $('#talk-content').val();
            ws.send(data);
            var html = '<div class="aui-chat-item aui-chat-right">';
            html += '<div class="aui-chat-inner">';
            html += '<div class="aui-chat-name">我 </div>';
            html += '<div class="aui-chat-content">';
            html += '<div class="aui-chat-arrow"></div>';
            html += data;
            html += '</div>';
            html += '<div class="aui-chat-status aui-chat-status-refresh">';
            html += '<i class="aui-iconfont aui-icon-correct aui-text-success"></i>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            $('.aui-chat').append(html);
            $('#talk-content').val('');
            scrollLast();
        }
    });
    $('body').on('keyup', '#talk-content', function (e) {
        if (e.keyCode == 13){
            $('.talk-send-btn').trigger('click');
        } else {
            ws.send('[*+-sending-+*]');
        }
    });
    $('body').on('blur', '#talk-content', function (e) {
        ws.send('[*+-unsending-+*]');
    });
});