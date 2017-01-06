
console.log($('.ddd').html());
$.ajax({
    url:'http://127.0.0.1:3000/mock-test',
    type:'get',
    success:function (data) {
        console.log(1111111);
        console.log(data);
    },
    error:function () {
        console.log('网络失败');
    }
});
$.get("http://127.0.0.1:3000/mock-test",function(data,status){
    console.log(222222);
    console.log(data);
    console.log(status);
});
$.post("http://127.0.0.1:3000/test",function(data,status){
    console.log(33333);
    console.log(data);
});
$.get("http://127.0.0.1:3000/mock-test",function(data,status){
    console.log(55555);
    console.log(data);
});
$.post("http://127.0.0.1:3000/test",function(data,status){
    console.log(44444);
    console.log(data);
});