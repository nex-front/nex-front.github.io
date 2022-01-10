window.console = window[ 'console' ] ? window[ 'console' ] : { log: function() {} };
window.log = window[ 'log' ] ? window[ 'log' ] : function() {
	console.info( arguments[ 0 ] );
};

var APP = APP || {};

APP.register = function(ns_name){
    var parts = ns_name.split('.'),
    parent = APP;
    for(var i = 0; i < parts.length; i += 1){
        if(typeof parent[parts[i]] === "undefined"){
               parent[parts[i]] = {};
        }else {
            throw new Error( ( parts[ i - 1 ] || "MYAPP" ) + " 부모객체에 이미 " + parts[ i ] + " 객체가 존재합니다." );
        }

        parent = parent[parts[i]];
    }
    return parent;
};


APP.isAlphaTween = true;

var browser = navigator.userAgent;
if(browser.toLowerCase().indexOf("msie 8")>0 || browser.toLowerCase().indexOf("msie 7")>0 ){
    APP.isAlphaTween = false;
}

(function(ns, $,undefined){

    // 스크린체크
    ns.register('chkScreen');
    ns.chkScreen = function(){
        var _init = function() {
            chkScreen();
        };
        
        var chkScreen = function(){        
            var winW = $(window).width();
            if(winW > 1600){
                $("body").removeClass("smallscreen").addClass("widescreen");
            }else{
                $("body").removeClass("widescreen").addClass("smallscreen");
            }
        };

        $(window).resize(chkScreen);

        return {
            init: _init
        }
    }();

    // GnbListData
    ns.register( 'GnbListData' );
    ns.GnbListData = ( function() {
        var _isLocal = true;
        var _isLoading = false;
        var _localUrl = './resources/data/getMenu_teaser.json';
        var _serverUrl = '';
        var _url = _isLocal ? _localUrl : _serverUrl;

        var load = function( cb ) {            
            if( _isLoading ) return;                        
            var param = ns.GnbList.getParam(); 
            console.log(param)           
            console.log( 'ajax GnbListData ---------------------------------' );        
            _isLoading = true;
            $.ajax( {
                url: _url,
                type: _isLocal ? 'GET' : 'POST',
                data: param,
                dataType: 'json'
            } ).done( function( data ) {
                _isLoading = false;
                var tbl = data;
                //console.log( tbl );               
                cb( tbl );
            } ).fail( function() {
                console.log( "GnbListData fail" );
                _isLoading = false;
            } );
        };

        return {
            isLoading: function() { return _isLoading; },
            load: load
        }
    } )();

    // GnbList Action
    ns.register( 'GnbList' );
    ns.GnbList = ( function() {
        var _isInitialized;
        var _vue;        
        var Data = ns.GnbListData;
        var pathName = location.pathname;
        
        //if(location.search) {}       

        var init = function() {
            if( _isInitialized ) return;
            _isInitialized = true;
            _initVue(); 
            _load();          
        };
        
        var _load = function() {
            Data.load(function( data ) {                   
                _vue.visibility = true;                                       
                _vue.obj = data.gnbList; 
                _vue.prjName = data.prjName;
                _vue.phoneNum = data.phoneNum;
                _vue.s3URL = data.s3URL;
                _vue.testURL = data.testURL;
                _vue.realURL = data.realURL;
                _initpageNumber();
                _pageLocation();
            } );
            
        };    
        
        var getParam = function() {                    
             return {
                 pathName : pathName
             }
        };

        var _initpageNumber = function() {      
            _vue.obj.forEach(function(item, i){                
                var children = item.subDepth;
                if(item.url == pathName) {
                    _vue.localNum1 = i;                        
                }      
                if(children != undefined) {
                    children.forEach(function(item2, j){
                        if(item2.url == pathName) {
                            _vue.localNum1 = i; 
                            _vue.localNum2 = j;                                                   
                        } else {
                            remoteUrl = item2.remoteUrl;
                            if (remoteUrl != undefined) {                                
                                chkIndex = remoteUrl.find(function(element) {
                                   if(element == pathName) {
                                        _vue.localNum1 = i; 
                                        _vue.localNum2 = j;        
                                   }
                                });
                            }
                        }
                    });
                } 
            });
            console.log(`localname1 : ${_vue.localNum1}`);
            console.log(`localname2 : ${_vue.localNum2}`);               
        };

        var _pageLocation = function(){    
                        
            _vue.firstDeptItem = _vue.obj.map(function(item) {
                return item;
            });                     
            if(_vue.localNum1 != undefined) { _vue.firstDeptTitle = _vue.firstDeptItem[_vue.localNum1].krName; }
            if(_vue.localNum2 != undefined) {
                _vue.secondDetpItem = _vue.obj[_vue.localNum1].subDepth;            
                _vue.secondDeptTitle = _vue.secondDetpItem[_vue.localNum2].krName;
            } else {
                _vue.secondDetpItem = [];
                _vue.secondDeptTitle = _vue.firstDeptTitle; 
            }
            //console.log(_vue.secondDetpItem)
        };

        var _initVue = function() {            
            _vue = new Vue( {
                el: '#vue_container',
                data: {               
                    prjName:"",
                    phoneNum:"",  
                    s3URL:"",
                    testURL:"",
                    realURL:"",
                    obj: [{}], 
                    localNum1:undefined,
                    localNum2:undefined,
                    firstDeptItem:[], 
                    secondDetpItem:[],
                    firstDeptTitle:"",
                    secondDeptTitle:""
                },
                methods: {
                    menuClick: function(url, open, blank) {                               
                         if(open) {
                            blank == true ? window.open(url) : location.href = url;                              
                         } else {     
                            alert("준비중입니다.");
                         }
                    },
                    isCurrunt: function(item){
                        var url = item.url;  
                        if (pathName == url) {
                            return true;
                        }                  
                    },
                    isRemote: function(item){
                        var remote = item.remoteUrl;                           
                        if (!remote) return ''                      
                        var chkIndex = remote.findIndex(function(element) {
                            return element == pathName;
                        });
                        if(chkIndex != -1) {
                            return true;
                        }
                    }
                },
                computed: {  
                    amazonImg: function() {
                        var winUrl = window.location.hostname;   
                        var imgTarget;                          

                        if(winUrl === this.realURL) {
                            imgTarget = _vue.s3URL;                      
                        } else {                           
                            imgTarget = "/";
                        }
                        return {
                            remoteImg: imgTarget  
                        };
                    }               
                },
                updated: function() {
                    if( this.visibility ) {                              
                        _UiGnb();
                        _UiLocation();
                    }                   
                }                
            } );
        };

        var _UiGnb = function () { 
            var $gnbMask, $depth0, depth1Arr, depth1TotalNum, depth2Arr, depth2ConArr, reSetTimer, tl;
            $gnbMask = $("#navbg");   
            $depth0 = $(".gnb").find(".gnb_depth_1");            
            depth1Arr = $depth0.find('> li > a');
            depth1TotalNum = depth1Arr.length;
            depth2ConArr = $depth0.find('.gnb_depth_2');
            depth2Arr = depth2ConArr.find('>li>a'); 
            depth1Arr.each(function(index, item){
                $(item).attr('name', 'depth1_'+index);
            });

            depth1Arr.on('mouseenter focusin mouseleave focusout', depth1Handler);
            for(i = 0, max = depth2ConArr.length; i<max; i++){
                depth2Arr[i] =  $(depth2ConArr[i]).find('a');
                depth2Arr[i].on('mouseenter focusin mouseleave focusout', depth2Handler);
            }

            depth2ConArr.css({"display":"none"});
            depth2ConArr.on('mouseenter mouseleave', depth2Handler);

            gnbViewSetting(); 

            $("#header").on("mouseleave", function(){
                tl.eventCallback("onReverseComplete", reverseComplete);
                tl.reverse();    
                $("header").removeClass("hover");           
            });

            function depth1Handler(e){
                var num = e.currentTarget.getAttribute('name').substr(7,1);
                switch ( e.type ) {
                    case 'mouseenter':
                    case 'focusin':
                        stopTimer();
                        $gnbMask.fadeIn();                                                   
                        $("header").addClass("hover");                          
                        depth2ConArr.css({"display":"block"});
                        tl.play();
                        depth1Over(num);                        
                        break;
                    case 'focusout':
                    case 'mouseleave':                        
                        startTimer();
                        break;
                }
            };

            function depth1Over(num){
                for(var i = 0; i < depth1TotalNum; i++){
                    if(num == i){
                        $(depth1Arr[num]).addClass('on');
                    }else{
                        $(depth1Arr[i]).removeClass('on');
                    }
                }               
            };

            function depth2Handler(e){
                var name = e.currentTarget.getAttribute('name');
                if(name != null){
                    var num = name.substr(7,1);
                }
                switch ( e.type ) {
                    case 'mouseenter':
                    case 'focusin':
                        $(e.currentTarget).parent().addClass("on");                        
                        stopTimer();
                        depth1Over(num);                        
                        break;
                    case 'focusout':
                    case 'mouseleave':
                        $(e.currentTarget).parent().removeClass("on");                        
                        startTimer();                        
                        break;
                }
            };

            function startTimer(){
                clearTimeout( reSetTimer );
                reSetTimer = setTimeout (reSetMenu, 500 );
            };

            function stopTimer(){
                clearTimeout( reSetTimer );
            };

            function reSetMenu(){
                depth1Over(null);                
            };                       
            
            $("#gnb_close").click(function(){
                tl.eventCallback("onReverseComplete", reverseComplete);
                tl.reverse();
            });

            function gnbViewSetting(){               
                tl = new TimelineMax({paused:true});
                tl.to($("header"), 0.3, {css:{height:320}, ease:Cubic.easeOut})
                  .to($(".header_con"), 0.3, {css:{height:320}, ease:Cubic.easeOut}, "-=.3");                                              
            }            
            function reverseComplete(){
                 $gnbMask.fadeOut();                         
            };
        };

        var _UiLocation = function () {       
            $(document).on('click', '.path-item .btn-open', function() {
                var pathItem = $(this).closest('.path-item');
                $(pathItem).addClass('active').children('dd').show();
                $(pathItem).siblings().removeClass('active').children('dd').hide();
                }).on('click', '.path-item .btn-close', function() {
                var pathItem = $(this).closest('.path-item');
                $(pathItem).removeClass('active').children('dd').hide();
                $('.btn-open', pathItem).focus();
                }).on('mouseup', function(e) {
                var pathList = $('.path-item.active');
                if(pathList.length){
                    var objPos = $(pathList).offset();
                    objPos.right = (objPos.left + $(pathList).width());
                    objPos.bottom = (objPos.top + $(pathList).height());
                    if( e.pageX < objPos.left || e.pageX > objPos.right || e.pageY < objPos.top || e.pageY > objPos.bottom ) {
                    $(pathList).removeClass('active').children('dd').hide();
                    $('.btn-open', pathList).focus();
                    }
                }
            });

        };

        return {
            init: init,
            getParam: getParam            
        }
    } )();

    // subpage Action
    ns.register('subTopMotion');
    ns.subTopMotion = function(){
        var $bg, $title, $en, $ele;
        var _init = function() {     
            $ele = $(".top_visual");
            $bg = $ele.find(".sub_top_bg");
            $title = $(".sub_top_tit").find("p");  

            var mySplitText = new SplitText($title, { type: "chars"});            
            var shuffleCharArray = shuffleArray(mySplitText.chars);  

            TweenLite.set(shuffleCharArray, {autoAlpha:0}); 

            tl = new TimelineLite({paused:true});                          
            tl.staggerTo(shuffleCharArray, .7, {autoAlpha: 1, ease:Cubic.easeOut}, 0.2)                                               
            tl.from($bg, 3, {autoAlpha:0, scale:1.4, skewX:0.001, ease:Power2.easeOut}, "-=5")                        
            tl.play();
            tl.timeScale(2.5);

            function shuffleArray(array) {
                for (var i = array.length - 1; i > 0; i--) {
                    var j = Math.floor(Math.random() * (i + 1));
                    var temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
                return array;
            }            
        };    
        return {
            init: _init
        }
    }();

    // Tab UI
    ns.register('ui.tabMenu');
    ns.ui.tabMenu = function(ele, targetEle){
        var element, targetElement, tNum=0, tabContainer, tabBtn, tabBtnCon, contentsArr, totalTabNum;
        element = ele;
        targetElement = targetEle;
        tabBtn = element.find(">li:not(.deactive)");
        tabBtnCon = element.find(">li");
        totalTabNum = tabBtn.length;
        contentsArr= targetElement.find(">li");
        tabBtn.each(function(index, item){
            //$(item).attr('name', 'tab_'+index);
            $(item).attr('data-index', index);

        });
        var menu = getRequests()["menu"];

        tabBtn.on('mouseenter focusin mouseleave focusout click', tabHandler);

        function tabHandler(e){
            //var num = e.currentTarget.getAttribute('name').substr(4,1);
             var num = e.currentTarget.getAttribute('data-index');
            
            if(tNum == num)return;

            switch ( e.type ) {
                case 'mouseenter':
                case 'focusin':
                   // tabOver(num);
                    break;
                case 'focusout':
                case 'mouseleave':
                  //  tabOver(tNum);
                    break;
               case 'click':
                    tabSelect(num);
                    break;
            }
        };

        function tabOver(num){
            for(var i = 0; i<totalTabNum; i++){
                if(i== num){
                    $(tabBtn[num]).addClass("on");
                    $(tabBtnCon[num]).addClass("on");
                }else{
                    $(tabBtn[i]).removeClass("on");
                    $(tabBtnCon[i]).removeClass("on");
                }
            }

        };

        function tabSelect(num){
            tabOver(num)
            tNum = num;
            $(contentsArr[num]).siblings().removeClass('current');
            $(contentsArr[num]).addClass('current');
            // if(element.hasClass("tab_vr")){
            //     var url = $(tabBtn[num]).find("a").data("url");
            //     $(contentsArr[num]).find(".iframe").attr("src", url);            
            // }
        }
        tabOver(tNum);
        tabSelect(tNum);    
        $(tabBtn[menu]).trigger("click");    
        
    };

    // 패밀리사이트 UI
    ns.register('selectUpBox');           
    ns.selectUpBox = function(ele){    
          
        var element, btn, isOpen=false, listCon, listHeight, closeTimer, listWrap;
        var i, max;        
        element=ele;
        listWrap = $(element).find('div');
        listCon = listWrap.find('ul');
        btn = $(element).find('>a');
        $(element).find('>a').on('mouseenter focusin mouseleave focusout', listHandler);
        $(element).find('>a').on('click', openList);
        listHeight = $(listCon).outerHeight(true)
        listWrap.css('height', 0)
        listCon.find('li>a').on('mouseenter focusin mouseleave focusout', listHandler);     
        listCon.css('display', 'none');
        listCon.css('top', listHeight);
        function listHandler(e) {
            switch ( e.type ) {
                //case 'mouseenter':
                case 'focusin':                             
                    stopTimer();                                               
                    break;                    
                case 'focusout':
                //case 'mouseleave':
                    startTimer();
                    break;
            }
        }   
        function startTimer(){
            clearTimeout( closeTimer );         
            closeTimer = setTimeout (close, 700 );
        };        
        function stopTimer(){
            clearTimeout( closeTimer );
        };      
        function close(){    
            isOpen=true;           
            openList()
        };
         
        function openList(){
            listHeight = $(listCon).outerHeight(true);
            if(isOpen){
                isOpen = false;
                listWrap.css('height', 0);
                listCon.css('display', 'none');
                $(btn).removeClass('on');
                TweenLite.to(listCon, 0, {css:{top:listHeight}});   
            }else{
                isOpen = true;
                listWrap.css('height', listHeight);
                listCon.css('display', 'block');
                $(btn).addClass('on');
                TweenLite.to(listCon, 0.3, {css:{top:0}});   
            }
        }
    };    

    // 아코디언faq UI
    ns.register('faqAcMenu');           
    ns.faqAcMenu = function(ele){
        
        var element, btn, isOpen=false, listArr;
        var i, max;
        
        element=ele;
        listArr = $(element).find('>li>dl');
        
        btn = $(listArr).find('dt a');
        btn.on('click', openList);
        
        function listHandler(e) {
            switch ( e.type ) {
                case 'mouseenter':
                case 'focusin':                             
                                                               
                    break;                    
                case 'focusout':
                case 'mouseleave':
                   
                    break;
            }
        }   
        
       function openList(e){         
            var parent = $(e.currentTarget).parent().parent()
            var viewCon = parent.find('>dd')
            if(parent.hasClass('on')){
                parent.removeClass('on');
                viewCon.css('display', 'none')
            }else{
                //listArr.removeClass('on');
                $(listArr).removeClass('on')
                $(listArr).find('>dd').css('display', 'none');
                parent.addClass('on');              
                viewCon.css('display', 'block');
                gsap.from(viewCon, 0.3, {css:{opacity:0}});  
            }   
       
        }
    };    


}(APP || {}, jQuery));


/* 레이어팝업 */
var LayerPopups = {
    find: function (id) {
        if (typeof (id) === 'string')
            return $((id.match(/^#/)) ? id : '#' + id);
        else
            return $(id).parents('.layerPopup');
    },
    open: function (id, closeOthers) {
        var $id = this.find(id);
        if ($id.length == 0)
            return;
        //$("html, body").stop().animate({scrollTop:(thisPos.top)-600}, 400);

        //if (id == "danziPop") {
        //    GoTop();
        //}

        this.showScreen();
        if (closeOthers) {
            $('.layerPopup').each(function () {
                if (this.id == $id[0].id)
                    $(this).show();
                else
                    $(this).hide();
            });
        }
        else {
            $id.show();
        }
    },
    close: function (id) {
        this.find(id).hide();
        this.hideScreen();
    },
    closeAll: function () {
        $('.layerPopup').hide();
        this.hideScreen();
    },
    opened: function () {
        var opened = false;
        $('.layerPopup').each(function () {
            if ($(this).css('display') != 'none')
                opened = true;
        });
        return opened;
    },
    showScreen: function () {
        $('#layerScreen').show();
    },
    hideScreen: function () {
        if (!this.opened())
            $('#layerScreen').hide();
    },
    closeId: function (id) {
        var $id = this.find(id);
        $id.hide();
        this.hideScreen();
        return;
    },
    openAlert: function (id, closeOthers, target, txt) {
        var $id = this.find(id);
        if ($id.length == 0)
            return;

        //GoTop(); //맨위로
        this.showScreen();
        if (closeOthers) {
            $('.layerPopup').each(function () {
                if (this.id == $id[0].id){
                    $(this).attr("data-target", target);
                    $(this).find(".layer_txt").html(txt);
                    $(this).show();
                }else{
                    $(this).hide();
                }
            });
        }
        else {
            $id.show();
        }
    },
    closeAlert: function (id) {
        var $id = this.find(id);
        $id.hide();
        this.hideScreen();
        if($id.attr("data-target") != "") {
            $($id.attr("data-target")).focus();
        }
        return;
    }
};

