//存放主要交互逻辑js代码
//JavaScript 模块化
var seckill = {
	// 封装秒杀相关ajax的地址
    URL:{  
        now:function(){  
            return '/seckill/seckill/time/now';  
        },  
        exposer:function(seckillId){  
            return '/seckill/seckill/'+seckillId+'/exposer';  
        },  
        execution:function(seckillId,md5){  
            return '/seckill/seckill/'+seckillId+'/'+md5+'/execution';  
        }  
    },
	// 处理秒杀
	handleSeckillkill : function(seckillId,node) {
		// 获取秒杀地址，控制显示逻辑，执行秒杀
		node.hide().html('<button class="btn btn-primary btn-lg" id="killBtn">开始秒杀！</button>');  //按钮
		$.post(seckill.URL.exposer(seckillId),{},function(result){
			//在回调函数中，执行交互流程
			if(result && result['success']){
				var exposer = result['data'];
				if(exposer['exposed']){
					//开启秒杀
					//获取秒杀地址
					var md5 = exposer['md5'];					
					//绑定一次点击事件，防止连续点击
					var killUrl = seckill.URL.execution(seckillId,md5);
					console.log("秒杀地址："+killUrl);
					$('#killBtn').one('click',function(){  
                        //1:禁用按钮
                    	$(this).addClass('disabled');
                        //2:发生秒杀请求
                        $.post(killUrl,{},function(result){ 
                        	console.log("成功进入秒杀逻辑");
                            if(result && result['success']){  
                                var killResult = result['data'];  
                                var state = killResult['state'];  
                                var stateInfo = killResult['stateInfo'];
                                //显示秒杀结果
                                node.html('<span class="label label-success">'+stateInfo+'</span>');  
                            }  
                        });  
                    });  
                    node.show();  
				}else{
					//未开启秒杀
					var now = exposer['now'];
					var start = exposer['start'];
					var end = exposer['end'];
					//重新计算计时逻辑
					seckill.countDown(seckillId,now,start,end);
				}	
			}else{
					cosole.log("result:"+result);
				}
		});
	},
	// 验证手机号
	validatePhone : function(phone) {
		if (phone && phone.length == 11 && !isNaN(phone)) {
			return true;
		} else {
			return false;
		}
	},
	//倒计时处理
	countDown : function(seckillId, nowTime, startTime, endTime) {
		var seckillBox = $('#seckill-box');
		// 时间判断
		if (nowTime > endTime) {
			// 秒杀结束
			seckillBox.html('秒杀结束！');
			console.log("秒杀结束")
		} else if (nowTime < startTime) {
			// 秒杀未开始，计时
			var killTime = new Date(startTime + 1000);
			seckillBox.countdown(killTime, function(event) {
				// 时间格式
				var format = event.strftime('秒杀倒计时: %D天 %H时 %M分 %S秒');
				seckillBox.html(format);
			}).on('finish.countdown', function() {// 倒计时时间到				
				seckill.handleSeckillkill(seckillId,seckillBox);
			});

		} else {
			// 秒杀开始
			console.log("开始秒杀哦")
			seckill.handleSeckillkill(seckillId,seckillBox);
		}
	},

	// 详情页秒杀逻辑
	detail : {
		// 详情页初始化
		init : function(params) {
			// 用户手机验证和登录，计时交互
			// 规划交互流程
			// 在cookie中查找手机号
			var killPhone = $.cookie('killPhone');
			
			// 验证手机号
			if (!seckill.validatePhone(killPhone)) {
				var killPhoneModal = $('#killPhoneModal');

				killPhoneModal.modal({
					show : true,
					backdrop : 'static',// 禁止位置关闭
					keyboard : false,	//禁止ESC退出
				});
				//修改遮罩层z-index防止遮挡Modal（不知什么原因导致该问题，按道理Modal的z-index大，应该在上）
				$(".modal-backdrop").css("z-index","0");
				//填写PhoneNum并存储到cookie中
				$('#killPhoneBtn')
						.click(
								function() {
									var inputPhone = $('#killPhoneKey').val();
									if (seckill.validatePhone(inputPhone)) {
										// 电话写入cookie
										$.cookie('killPhone', inputPhone, {
											expires : 7,
											path : '/seckill/seckill'
										})
										window.location.reload();
									} else {
										// 正常下会有一个前端字典
										$('#killPhoneMessage')
												.hide()
												.html(
														'<label class="label label-danger">手机号码错误</label>')
												.show(300);
									}
								});
			}
			// 已经登录
			// 计时交互
			var startTime = params['startTime'];
			var endTime = params['endTime'];
			var secKillId = params['seckillId'];
			//console.log('获取时间的url字符串:' + seckill.URL.now());
			//使用JavaScript的模块化函数调用时，不要忘记()，否则会直接返回seckill.URL.now后面的字符串
			$.get(seckill.URL.now(), {}, function(result) {
				if (result && result['success']) {
					var nowTime = result['data'];
					// 时间判断,计时交互					
					seckill.countDown(secKillId, nowTime, startTime, endTime);
				} else {
					console.log('result:' + result);
				}
			});
		}
	}
}