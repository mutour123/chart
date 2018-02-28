var isAll = true;//是否是群聊

$(function () {
    var socket = io();

    //写入一个cookie,表示客户端打开了一个窗口
    var openNum = Cookies.get('openNum'); // 如果cookie不存在 则返回 => undefined
    if (!openNum){
        Cookies.set('openNum', 1 );
    }else {
        Cookies.set('openNum', ++openNum );
    }

    //通知服务器有新的用户登录
    var welcome = $('#welcome');
    if (!welcome)return
    var user = welcome.text()
    socket.emit('login', user)

    //新的用户登录，
    socket.on('welcomeMes', function (data) {
        data = JSON.parse(data)
        //创建欢迎节点
        if (data.user){
            var welcomeNode = $('<div class="welcome-user">'),
                welcomeSpan = $('<span>');
            welcomeSpan.text("欢迎"+data.user+"加入");
            welcomeNode.append(welcomeSpan);
            $('.chart').append(welcomeNode);
        }
        //onlineNum
        $('#onlineNum').text(data.onlineNum);

        //添加到在线列表data.onlineList
        $('#onlineList')[0].innerHTML = ""

        data.onlineList.forEach(function (item) {
            var li = $('<li>'),
                span = $('<span class="onlineListname">')
            span.text(item)
            li.append(span)
            $('#onlineList').append(li)
        })


        //单聊
        var userList = $('#onlineList li')
        userList.on('click', function () {
            isAll = false//设置为单聊
            //显示聊天面板并且去除聊天记录
            $('.one').css('display', 'block')
            $('.chart').css('display', 'none')
            //设置单聊header名字
            $('.usernameonetext').text($(this).find('.onlineListname').text())
            //取消提示
            var newTip = $(this).find('.new-tip')
            if (newTip[0]){{
                newTip.remove()
            }}
        })
    })
    
    //返回群聊
    $('.toBack').click(function () {
        isAll = true//设置为单聊
        $('.one').css('display', 'none')
        $('.chart').css('display', 'block')
        var newTip = $(this).find('.new-tip')
        if (newTip) {
            newTip.remove()
        }
    })

    //点击发送消息
    $('#sub').click(function () {
        //获得输入框的内容
        var msgVal = $('#msg').val()
        var me = $('#welcome').text()
        var toUser = $('.usernameonetext').text()
        var sendMsg
        //发送消息前判断是不是群聊
        if (isAll) {
            sendMsg = {msgVal: msgVal, sendUser: me};
            sendMsg = JSON.stringify(sendMsg);
        }else {
            sendMsg = {msgVal: msgVal, sendUser: me, toUser: toUser};
            sendMsg = JSON.stringify(sendMsg);
            //创建节点
            var chartText = $('<div class="chart-text self">'),
                div = $('<div>'),
                a = $('<a class="nick-name" href="#">自己</a>'),
                img = $('<img class="self-div head-img" src="http://thirdwx.qlogo.cn/mmopen/QRTaLgM6bICTcsLP2zoKrecQTY4OGzunvzr5DV3qo9A4aytwqZqsneYr6e4JcULuLMicKlN6ZBQR9iaMjZtISedFIHibD5ddHkB/132" alt="头像">'),
                p = $('<p class="chart-text-con pself">');
            p.text(msgVal);
            div.append(a);
            div.append(img);
            chartText.append(div);
            chartText.append(p);
            $('.chartone').append(chartText);
            toTheView('.chartone > div:last');
        }
        socket.emit('message',sendMsg );
        $('#msg').val("");
    })

    //接收到新消息
    socket.on('someMsg', function (msg) {
        msg = JSON.parse(msg);
        //创建节点
        var me = $('#welcome').text();
        //如果是不是处于群聊模式
        if (!isAll) {
            var newTip = $('<span class="new-tip">new</span>');
            $('.toBack').append(newTip)
        }


        if (msg.sendUser == me) {//自己发送的信息
            var chartText = $('<div class="chart-text self">'),
                div = $('<div>'),
                a = $('<a class="nick-name" href="#">自己</a>'),
                img = $('<img class="self-div head-img" src="http://thirdwx.qlogo.cn/mmopen/QRTaLgM6bICTcsLP2zoKrecQTY4OGzunvzr5DV3qo9A4aytwqZqsneYr6e4JcULuLMicKlN6ZBQR9iaMjZtISedFIHibD5ddHkB/132" alt="头像">'),
                p = $('<p class="chart-text-con pself">');
            p.text(msg.msgVal);
            div.append(a);
            div.append(img);
            chartText.append(div);
            chartText.append(p);
            $('.chart').append(chartText);
            toTheView('.chart > div:last');
        } else {//别人发的群消息
            var chartText = $('<div class="chart-text">'),
                div = $('<div>'),
                a = $('<a class="nick-name" href="#">'),
                img = $('<img class="self-div head-img" src="http://thirdwx.qlogo.cn/mmopen/QRTaLgM6bICTcsLP2zoKrecQTY4OGzunvzr5DV3qo9A4aytwqZqsneYr6e4JcULuLMicKlN6ZBQR9iaMjZtISedFIHibD5ddHkB/132" alt="头像">'),
                p = $('<p class="chart-text-con">');
            p.text(msg.msgVal);
            a.text(msg.sendUser)
            div.append(img);
            div.append(a);
            chartText.append(div);
            chartText.append(p);
            $('.chart').append(chartText);
            toTheView('.chart > div:last');
        }
    })

    socket.on('toMe', function (msg) {
        msg = JSON.parse(msg)
        var chartText = $('<div class="chart-text">'),
            div = $('<div>'),
            a = $('<a class="nick-name" href="#">'),
            img = $('<img class="self-div head-img" src="http://thirdwx.qlogo.cn/mmopen/QRTaLgM6bICTcsLP2zoKrecQTY4OGzunvzr5DV3qo9A4aytwqZqsneYr6e4JcULuLMicKlN6ZBQR9iaMjZtISedFIHibD5ddHkB/132" alt="头像">'),
            p = $('<p class="chart-text-con">')
        p.text(msg.msgVal)
        a.text(msg.from)
        div.append(img)
        div.append(a)
        chartText.append(div)
        chartText.append(p)
        $('.chartone').append(chartText)
        toTheView('.chartone > div:last')

        //做出提醒


        for (var i = 0; i < $('#onlineList > li').length; i++){
           if ($( $('#onlineList > li')[i]).text() === msg.from) {
               var newTip = $('<span class="new-tip">new</span>');
               $( $('#onlineList > li')[i]).append(newTip)
           }
        }

    })

    //关闭浏览器事件
    window.onbeforeunload = onbeforeunload_handler
    window.onunload = onunload_handler
})

/**
 * 显示最后一个元素
 * @param select
 */
function toTheView(select) {
    $(select)[0].scrollIntoView();
}

/**
 * 清除所有cookie
 */
function clearAllCookie() {
    var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
    if(keys) {
        for(var i = keys.length; i--;)
            document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
    }
    console.log('清除成功')

}

/**
 * 关闭浏览器之间
 * @returns {string}
 */
function onbeforeunload_handler(){
    //判断是不是最后一个同网址下最后一个窗口
    var openNum = Cookies.get('openNum'); // 如果cookie不存在 则返回 => undefined
    if (openNum === 1){//最后一个窗口
        console.log('keyile ')
        clearAllCookie()
    }
    Cookies.set('openNum', --openNum );

}

/**
 * 关闭浏览器
 */
function onunload_handler(){
    var a =3;
    var warning="谢谢光临"+(a+2);
    alert(warning);
}