/*
 var Waiter = function(){
 	var dfd = [],//注册了的等待对象
 		donArr = [],//成功回调方法容器
 		failArr=[],//失败回调方法容器
 		slice = Array.prototype.slice,//缓存array方法slice
 		that = this;//保存当前等待者对象
 	//监控对象类	
 	var Primise = function(){
 		this.resolved = false;//监控对象是否成功
 		this.rejected = false;//监控对象是否失败
 	}
 	Primise.prototype = {
 		resolve:function(){
 			this.resolved = true;//设置状态为成功
 			if(!dfd.length){
 				return;//如果没有监控对象则终止执行
 			}
 			for(var i=dfd.length-1; i>=0; i--){
 				if(dfd[i] && !dfd[i].resolved || dfd[i].rejected){
 					return;//如果有任意一个监控对象没有成功或失败则返回
 				}
 				dfd.splice(i,1);//清除监控对象
 			}
 			_exec(donArr);//执行成功回调方法
 		},
 		reject : function() {
 			this.rejected = true;//设置状态为失败
 			if (!dfd.length) return;
 			dfd.splice(0);//清除所有监控对象
 			_exec(failArr);
 		}
 	}
 	//创建监控对象
 	that.Deferred = function(){
 		return new Primise();
 	}
 	//回调执行方法
 	function _exec(arr){
 		var i=0,len = arr.length;
 		for(;i<len;i++){
 			try{
 				arr[i] && arr[i]();//执行回调函数
 			}catch(e){}
 		}
 	}
 	that.when = function(){
 		dfd=slice.call(arguments);
 		var i=dfd.length;
 		for(--i;i>=0;i--){//向前遍历监控对象，最后一个监控对象的索引值为length-1
 			//如果不存在监控对象，或者以解决，或者不是监控对象
 			if(!dfd[i] || dfd[i].resolved || dfd[i].rejected || !dfd[i] instanceof Primise){
 				dfd.splice(i,1);//内存清理，清除当前监控对象
 			}
 		}
 		return that;//返回等待者
 	}
 	that.done = function(){
 		doneArr = donArr.concat(slice.call(arguments));//添加回调方法
 		return that;
 	}
 	that.fail = function(){
 		failArr = failArr.concat(slice.call(arguments));
 		return that;
 	}
 }
 
 //使用方法
 var waiter = new Waiter();
 var first = function(){
 	var dtd = waiter.Deferred();//创建一个监听对象
 	setTimeout(function(){
 		console.log('first finish');
 		//dtd.resolve();//发布成功
 		dtd.reject();
 	},5000);
 	return dtd;
 }();
  var second = function(){
 	var dtd = waiter.Deferred();//创建一个监听对象
 	setTimeout(function(){
 		console.log('second finish');
 		dtd.resolve();
 	},10000);
 	return dtd;
 }();
 waiter.when(first,second)//监听两个事件
 		.done(function(){
 			console.log("success");
 		},function(){
 			console.log("success again")
 		})
 		.fail(function(){
 			console.log('fail');
 		})

*/

class Primise {
    public resolved = false;
    public rejected = false;
    public dfd: Primise[] = []; //注册了的等待对象
    public donArr = []; //成功回调方法容器
    public failArr = []; //失败回调方法容器
    public resolve() {
        this.resolved = true; //设置状态为成功
        if (!this.dfd.length) {
            return; //如果没有监控对象则终止执行
        }
        for (var i = this.dfd.length - 1; i >= 0; i--) {
            if ((this.dfd[i] && !this.dfd[i].resolved) || this.dfd[i].rejected) {
                return; //如果有任意一个监控对象没有成功或失败则返回
            }
            this.dfd.splice(i, 1); //清除监控对象
        }
        this._exec(this.donArr); //执行成功回调方法
    }

    public reject() {
        this.rejected = true; //设置状态为失败
        if (!this.dfd.length) return;
        this.dfd.splice(0); //清除所有监控对象
        this._exec(this.failArr);
    }

    public _exec(arr: any) {
        var i = 0,
            len = arr.length;
        for (; i < len; i++) {
            try {
                arr[i] && arr[i](); //执行回调函数
            } catch (e) {}
        }
    }

    public Deferred() {
        return new Primise();
    }
}

export class Waiter {
    public slice = Array.prototype.slice; //缓存array方法slice
    that = this; //保存当前等待者对象
    //监控对象类
    public Primise = function () {
        let resolved = false; //监控对象是否成功
        let rejected = false; //监控对象是否失败
    };
}
