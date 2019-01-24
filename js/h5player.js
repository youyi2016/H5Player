(function () {
	
	var state = "Pause";//默认播放器状态	
	    
	function H5Player() {
		 this.option = {
		 	isShowDanMu: true
		 };
		 this.player = this.$("#player");
		 this.player.volume = 0.1;
		 this.playbtn = this.$(".h5player-play-icon");
		 this.allTimeBar = this.$(".h5player-alltime");
		 this.currentTimeBar = this.$(".h5player-curtime");
		 this.playedBar = this.$(".h5player-played");
		 this.loadBar = this.$(".h5player-bar");
		 this.volumeWrap = this.$(".h5player-volume");
		 this.volumeBtn = this.$(".h5player-volume-icon");
		 this.volumeBar = this.$(".h5player-volume-bar");
		 this.currentVolume = this.$(".h5player-volume-loaded");
		 this.h5controller = this.$(".h5player-controller");
		 this.fullScreen = this.$(".h5player-full");
		 this.commentBtn = this.$(".h5player-comment-icon");
		 this.loadingTip = this.$(".h5player-loading-text");
		 this.errorBar = this.$(".h5player-error-text");
		 
		 this.allTime = this.player.duration;
		 this.currentTime = this.player.currentTime; 
		 this.buffered = this.player.buffered;
		 this.volume = this.player.volume;
//		 this.danmuData = null;
          // {time: 00:02, content: huangxuan, position: top, color: #ff0}
		 this.danmuData = [{id: 1, time: '00:02', content: 'huangxuan', position: 'top', color: '#ff0'},
		                   {id: 2, time: '00:02', content: '我爱黄轩啊啊啊啊啊阿', position: 'top', color: '#ff0'}, 
		                   {id: 3, time: '00:02', content: '支持黄轩支持非凡任务', position: 'top', color: '#ff0'}, 
		                   {id: 4, time: '00:02', content: '表白轩轩啦啦啦啦啦', position: 'top', color: '#ff0'},
		                   {id: 5, time: '00:04', content: '表白轩轩啦啦啦啦啦', position: 'top', color: '#ff0'},
		                   {id: 6, time: '00:04', content: '表白轩轩啦啦啦啦啦', position: 'top', color: '#ff0'},
		                   {id: 7, time: '00:05', content: '23333333333', position: 'top', color: '#ff0'}
		                   ];
		 
		 console.log("this.buffered:"+ this.buffered.length); 
		 console.log("currentTime："+ this.currentTime);
			
		 this.initEvents();
		 this.setVolumeBarStyle();
	}
	
	H5Player.prototype = {
		
		constructor: H5Player,
		
		initEvents: function () {
		    console.log("init....");
	        this.loadSource();
	        this.changePlayProgress();
            this.playButton();
            this.showPlayerTime( this.allTime );
            this.showPlayedTime();   
            this.volumeButton();
            this.changeVolume();
            this.clickCommentBtn();
            this.showFullScreen();
            //setTimeout( this.showPlayedTime, 500 );       
		},
		
		$: function ( str ) {
			
			var type = str[0];
			var className = str.slice(1);
			var doc = document;
			
			switch( type ) {
				case ".": 
				      doc = doc.getElementsByClassName( className )[0];
				      break;
				case "#":
				      doc = doc.getElementById( className );
				      break;
				default:   
				      break;
			}
			
			return doc;
		},
		
		loadSource: function () {
			console.log("loading...");
			console.log("duration" in this.player );
			console.log(this.player.duration);
			
			var that = this;
			
			this.player.addEventListener("durationchange", function () {
				 that.showPlayerTime ( that.player.duration );
				 console.log("duration:" + that.player.duration);
			});
			
			this.player.addEventListener("error", function () {
				state = "Pause";
				that.changePlayBtnStyle();
				that.showErrorTip();
				
				console.log("load souce is error");
			});
		},
		
		showErrorTip: function () {
			this.errorBar.style.display = "inline-block";
			this.errorBar.classList.add("h5player-error-show");
		},
		
		/*
	   * 改变播放进度
	   */
	  changePlayProgress: function () {
	  	
	  	var that = 	this;
	  	var loadBar = this.loadBar;
	  	var width = loadBar.clientWidth;
	  	var currentTime = 0;
	  	
	  	this.loadBar.addEventListener('mousedown', function( event ) {
	  		
	  		var e = event || window.event;
	  		var playedwidth = e.pageX - that.getElementOffsetLeft( loadBar ) - 0.5;
	  		console.log("offsetleft:"+ that.getElementOffsetLeft( loadBar ));
	  		playedwidth > width ? playedwidth = width : playedwidth;
	  		var percent = playedwidth / width;
	  		currentTime = that.allTime * percent;
	  		//that.player.currentTime = currentTime;
	  		console.log(currentTime);
	  		that.updateCurrentTime( currentTime );	//更新当前时间
	  		that.changeLoadBarStyle( currentTime ); //改变进度条样式
	  		that.showPlayedTime();                  //展现当前播放时间
	  	});	
	  },
	    
	  /*
	   * 改变进度条样式
	   */
	  changeLoadBarStyle: function ( currentTime ) {
	    
	  	 var playedWidth = currentTime / this.allTime * 100 + "%";
	  	 
	  	 if ( playedWidth === "100%" ) {  
	  	 	 state = "Pause";
	  	     this.changePlayBtnStyle(); //改变播放按钮样式
	  	 }
	  	 
	  	 this.playedBar.style.width = playedWidth; 
	  	 console.log("playedWidth:"+ playedWidth);	  
	  },
	
	  updateCurrentTime: function( currentTime ) {
	  	console.log("update...");
	  	// chrome无法根据this.player.currentTime来修改当前播放时间
	  	var that = this;
//	  	this.player.addEventListener('timeupdate', function() {
//	  		console.log("updateTime...");
	  		that.player.currentTime = currentTime;
//	  	});
	  	
//	  	console.log("currentTime:"+th.player.currentTime);
	  },
		
		/*
		 *播放按钮 
		 */
		playButton:  function () {		
	
            var player = this.player;
            var that = this;
            
			this.playbtn.addEventListener('click', function( event ) {
			
				if (player.paused) {
				   console.log("play:"+  that.player.currentTime);
					player.play();
					state = "Play";
					that.changePlayBtnStyle();
					that.showPlayedTime();
					that.showDanMu();
					console.log("start");
				}
				else {
					player.pause();
					state = "Pause";
					that.changePlayBtnStyle();
//					that.showPlayedTime();
					console.log("stop");		
				}
			}, false);
	  },
	  
	    /*
	   * 显示总播放时间
	   */
	  showPlayerTime: function ( time ) {
	  	
	  	this.allTime = time;
	  	console.log("this.allTime:" +this.allTime);
	  	this.allTimeBar.innerHTML = time ? this.convertSecoundToTime( time ) : "00:00";
	  },
	  
	  /*
	   * 显示已经播放时间
	   */
	  showPlayedTime: function () {
	  	
	  	   var that = this;
	  	
//   	    console.log("存在id吗..."+" "+this.intervalId);
	  	    var intervalId = setInterval(function () {

  	 	    var currentTime = that.player.currentTime;
  	 	    
  	 	    if( that.player.ended || state === "Pause" ) {//播放完毕
     	       clearInterval( intervalId );//清除间歇调用  	
     	       that.changePlayBtnStyle(); //改变播放按钮样式
  	 	    }
  	 	    
//	 	    if ( state === "Pause" ) {
//		    	console.log("应该停止了..."+" "+intervalId);
//		     	clearInterval( intervalId );
//		     	//this.intervalId = null;
//		    	console.log("应该清除了..."+" "+intervalId);     	
//          }
  	 	    
  	 	    if ( state === "Play" ) {
	  	 	     console.log("showPlayedTime..."+ " "+ currentTime );
//	  	 	     if ( currentTime === 0 ) {
//	 	    	    that.showIsLoading();
//	 	         } 
  	 	         
  	 	         if ( currentTime !== 0 && that.$(".h5player-isloading-show")) {
  	 	         	that.removeIsLoading();
  	 	         }
  	 	         
	  	 	    that.currentTimeBar.innerHTML = currentTime ? that.convertSecoundToTime( currentTime ) : "00:00";
	  	        that.changeLoadBarStyle( currentTime );//实时更新进度条的样式  	
	  	        that.showDanMu();
  	       }	     	 	   
	  	 }, 1000);
	  },
	  
	  /*
	   * 弹幕
	   */
	  showDanMu: function () {
	  	
	  	if ( this.option.isShowDanMu ) {
	  		
	  		var data = this.danmuData;
	  	    
	  		for( var i = 0, len = data.length; i<len; i++ ) {
	  			this.getItem( data[i] );
	  		}
	  	}
	  },
	  
	  getItem: function ( data ) {
	  	
	  },
	  
	  /*
	   * 改变播放按钮样式
	   */
	  changePlayBtnStyle: function() {
	  	
	  	if(state === "Play") {
	  		this.playbtn.classList.remove("h5player-icon-play");
	  	    this.playbtn.classList.add("h5player-icon-pause");
	  	   
	  	}
	  	else {
	  		this.playbtn.classList.remove("h5player-icon-pause");
	  	    this.playbtn.classList.add("h5player-icon-play");  		
	  	}
	  },
	  
	  /*
	   * 音量控制
	   */
	  volumeButton: function () {
	  	
	    var that = this;
	  	var intervalId = null;	 
	  	
	  	that.volumeBtn.addEventListener('mousedown', function( event ) {
	  	       console.log( "show");
	  	       that.player.muted ? that.player.muted = false : that.player.muted = true;
	  	       that.changeVolumeBtnStyle();
	    });
	   
	    that.volumeWrap.addEventListener('mouseover', function( event ) {
	  		   that.showVolumeBar();
	    });
	    
  	    that.volumeWrap.addEventListener('mouseout', function( event ) {
  		     that.hideVolumeBar();
  	    });		  	
	    },
	  
	  changeVolumeBtnStyle: function () {
	  	
	  	if ( this.player.muted ) {
	  		this.volumeBtn.classList.remove("h5player-icon-volume-low");
	  		this.volumeBtn.classList.add("h5player-icon-volume-mute");
	  	}
	  	else {
	  		this.volumeBtn.classList.remove("h5player-icon-volume-mute");
	  		this.volumeBtn.classList.add("h5player-icon-volume-low");
	  	}
	  },
	  
	  /*
	   * 显示音量调节按钮
	   */
	  showVolumeBar: function () {
	  	this.volumeBar.style.display = "inline-block";
	  },
	  
	  /*
	   * 隐藏音量调节按钮
	   */
	  hideVolumeBar: function () {
	  	this.volumeBar.style.display = "none";
	  },
	  
	  /*
	   * 改变音量
	   */
	  changeVolume: function () {
	  	
	  	var that = this;
        var volumeBar = this.volumeBar;
        
	  	volumeBar.addEventListener('mousedown', function ( event ) {
	  		console.log("click");
	  		var e = event || window.event;
	  		var width = e.pageX - that.getElementOffsetLeft( that.h5controller )- 86;
	  		console.log("width:"+width + " e.pageX:"+  that.getElementOffsetLeft( that.h5controller ));
	  		
	  	    width > 40 ? that.player.volume = 1 : that.player.volume = width / 40;  
	  	    width < 10 ? that.player.volume = 0 : that.player.volume = width / 40;  
	  		console.log("that.volume:"+that.player.volume);
	  		that.setVolumeBarStyle();
	  	});
	  },
	  
	  /*
	   * 设置音量条的样式
	   */
	  setVolumeBarStyle: function () {
	  	
	     var width =  this.player.volume * 100 + "%";
	     this.currentVolume.style.width = width;
	  },
	  
	  /*
	   * 正在加载
	   */
	  showIsLoading: function () {
	  	console.log("loading...");
	  	
	  	this.loadingTip.style.display = "inline-block";
	  	this.loadingTip.classList.add("h5player-isloading-show");
	  },
	  
	  removeIsLoading: function () {
	  	this.loadingTip.style.display = "none";
	  	this.loadingTip.classList.remove("h5player-isloading-show");
	  },
	  
	  /*
	   * 将秒数转换为时间
	   */
	  convertSecoundToTime: function ( secoundTime ) {
	  	
	  	var minute = Math.floor( secoundTime / 60 );
        var  secound = Math.ceil( secoundTime % 60 );
	  	
	  	return this.addZero( minute ) + ":" + this.addZero( secound );
	  },
	  
	  /*
	   * 为时间补零
	   */
	  addZero: function ( time ) {
	
	  	 return time < 10 ? "0" + time : time;
	  },
	  	 
	 /*
	  * 评论
	  */
	 clickCommentBtn: function() {
	 	
	 	var that = this;
	 	var elems = that.$(".h5player-input-wrap").classList;
	 	var isSelected = false;
	 	
	 	this.commentBtn.addEventListener('click', function ( event ) {
	 		
	 		 if (elems && isSelected) {
	 		   elems.remove("h5player-input-comment-open"); 
	 		   isSelected = false;
	 		 }
	 		 else {
	 		 	elems.add("h5player-input-comment-open"); 
	 		 	isSelected = true;
	 		 }
	 	});
	 },
	 
	  /*
	   * 获取元素距离页面的左偏移量
	   */
	  getElementOffsetLeft: function ( element ) {
	  	
	        var offsetLeft =  element.offsetLeft;
	        var current =  element.offsetParent;	        

	        while ( current !== null ) {
	        	
	        	offsetLeft += current.offsetLeft;
	        	current = current.offsetParent;
	        }
	        
	        return offsetLeft;
	  },
	  
	/*
	 * 全屏
	 */
	showFullScreen: function () {
		
		var elem = this.player;
		var that = this;
		
		this.fullScreen.addEventListener('click', function () {
//			that.player.style.width = '80%'; 
			that.toggleFullScreen( elem );			 
		});
		}, 
		
	toggleFullScreen: function ( elem ) {
		
		//处于全屏状态 元素中的全屏元素属性不为空
		if (!elem.fullscreenElement &&    // alternative standard method
             !elem.mozFullScreenElement &&  
             !elem.webkitFullscreenElement) {  // current working methods
		   
		   if (elem.requestFullscreen) {
		      elem.requestFullscreen();
		    } 
		    else if (elem.mozRequestFullScreen) {
		      elem.mozRequestFullScreen();
		    } 
		    else if (elem.webkitRequestFullscreen) {
		      elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		    }
		  } 
		  else {
		  	
		    if (elem.cancelFullScreen) {
		      elem.cancelFullScreen();
		    }
		    else if (elem.mozCancelFullScreen) {
		      elem.mozCancelFullScreen();
		    } 
		    else if (elem.webkitCancelFullScreen) {
		      elem.webkitCancelFullScreen();
		    }
		  }
		}
	};
		
	new H5Player();

})()
