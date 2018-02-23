
$(function () {
    var socket = io();

    console.log(socket)

    var welcome = $('#welcome');
    if (!welcome)return
    var user = welcome.text()

    socket.emit('login', user)
    socket.on('welcomeMes', function (data) {
        console.log(data)
        //创建欢迎节点
        var welcomeNode = $('<div class="welcome-user">'),
            welcomeSpan = $('<span>');
        welcomeSpan.text("欢迎"+data+"加入");
        welcomeNode.append(welcomeSpan);
        $('.chart').append(welcomeNode)
    })

    $('#sub').click(function () {
        //获得输入框的内容
        var msgVal = $('#msg').val();
        var me = $('#welcome').text();

        var sendMsg = {msgVal: msgVal, sendUser: me};
        sendMsg = JSON.stringify(sendMsg);
        socket.emit('message',sendMsg );
         $('#msg').val("");

    })
    socket.on('someMsg', function (msg) {
        msg = JSON.parse(msg);
        //创建节点
        var me = $('#welcome').text();
        if (msg.sendUser == me){//自己发送的信息
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
        }else {
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
})


function toTheView(select) {
    $(select)[0].scrollIntoView();
}