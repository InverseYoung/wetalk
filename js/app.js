$(function () {
    function getGuidGenerator() {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    }
    var userid = '';
    if (window.localStorage) {
        var veri = window.localStorage.getItem('userid');
        if (veri) {
            userid = veri;
        } else {
            userid = getGuidGenerator();
            window.localStorage.setItem('userid', userid);
        }
    } else {
        userid = getGuidGenerator();
    }
    var ws = new WebSocket("ws://211.149.133.37:8888/im/" + userid);
    $('body').on('click', '.startTalk', function () {
        $('.aui-tips-title').html('正在建立通信...');
        $('.talk-process-tips').fadeIn();
        var self = $(this);
        setTimeout(function () {
            $('.aui-tips-title').html('通信连接成功');
            $('.talk-process-tips').fadeOut(800);
            self.removeClass('aui-btn-info').addClass('aui-btn-danger');
            self.removeClass('startTalk').addClass('endTalk').html('结束聊天');
            $('.talk-send-box').fadeIn(500);
            $('.talk-list').fadeIn(500);
        }, 1000);
    });
    $('body').on('click', '.endTalk', function () {
        $('.aui-tips-title').html('正在断开...');
        $('.talk-process-tips').fadeIn();
        var self = $(this);
        setTimeout(function () {
            $('.aui-tips-title').html('已经断开连接');
            $('.talk-process-tips').fadeOut(800);
            self.removeClass('aui-btn-danger').addClass('aui-btn-info');
            self.removeClass('endTalk').addClass('startTalk').html('开始聊天');
            $('.talk-send-box').fadeOut(500);
            $('.talk-list').fadeOut(500);
        }, 1000);
        ws.close();
    });
    ws.onmessage = function (evt) {
        var html = '<div class="aui-chat-item aui-chat-left">';
        html += '<div class="aui-chat-inner">';
        html += '<div class="aui-chat-name">对方 </div>';
        html += '<div class="aui-chat-content">';
        html += '<div class="aui-chat-arrow"></div>';
        html += evt.data;
        html += '</div>';
        html += '<div class="aui-chat-status aui-chat-status-refresh">';
        html += '<i class="aui-iconfont aui-icon-correct aui-text-success"></i>';
        html += '</div>';
        html += '</div>';
        html += '</div>';
        $('.aui-chat').append(html);
    };

    $('.talk-send-btn').on('click', function () {
        if ($('#talk-content').val().replace(/[ ]/ig, '').length) {
            var data = $('#talk-content').val();
            ws.send(data);
            var html = '<div class="aui-chat-item aui-chat-right">';
            html += '<div class="aui-chat-inner">';
            html += '<div class="aui-chat-name">你 </div>';
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
            $('html, body').animate({
                scrollTop: $('html, body').height()
            }, 'slow');
        }
    });
});