---
layout: page
title: Source
icon: lnr lnr-code
order: 2
---

## Javascript
> 기본 필수등록 라이브러리  
- Jquery
- Vue
- GSAP (Tweenmax)

``` html 
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.5.1/gsap.min.js"></script>
```


<br> 


> 스크롤 모션관련 라이브러리
- locomotive-scroll
- ScrollTrigger

``` html 
<script type="text/javascript" src="https://unpkg.com/locomotive-scroll@3.2.6/dist/locomotive-scroll.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.5.1/ScrollTrigger.min.js"></script> 
```

<br>


> 스와이프 모션관련 라이브러리
- Slick
- Swiper

``` html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css">

<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.2.2/js/swiper.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/Swiper/4.2.2/css/swiper.min.css">	

```

<br>

> App.js (구축 Common Default type)
>> <i class="icon icon-link"></i> app.js](/guide/resources/js/app.js){:target="_blank"}

<script src="https://gist.github.com/nex-front/74919d94aec1486dc1b6528a0b3edd75.js"></script>

### - app.js 함수 호출 예시 `(html 페이지 최하단 부위에서 호출합니다)`

``` html

<script type="text/javascript">

    (function (ns) {
        $(function(){
            ns.GnbList.init();
        });
    })(APP || {});

</script>

```


<br>

---

<br>

## HTML

> Head 영역

``` html

<!DOCTYPE html>
<html lang="ko">
<head>
<title></title>
<meta http-equiv="content-type" content="text/html;charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=Edge"/>
<meta name="description" content=""/>
<meta name="keywords" content="">
<meta name="author" content="">
<meta property="og:type" content="">
<meta property="og:title" content="">
<meta property="og:description" content="">
<meta property="og:image" content="">
<meta property="og:url" content="">

<link rel="shortcut icon" href="/resources/img/favicon.ico" type="image/x-icon">
<link rel="stylesheet" href="/resources/css/style.css">	
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.css">

<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.14/vue.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.5.1/gsap.min.js"></script>
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.js"></script>

```


## CSS
> reset.css
>> <i class="icon icon-link"></i> reset.css

<script src="https://gist.github.com/nex-front/5044f61bc9c77ea087699fafe615481c.js"></script>  

<br>   

>common.css
>> <i class="icon icon-link"></i> common.css

<script src="https://gist.github.com/nex-front/c3dd44f31c90bf31cbc448cde8e8fa4a.js"></script>

<br>

>form.css
>> <i class="icon icon-link"></i> form.css

<script src="https://gist.github.com/nex-front/cd4014258be3bab0c0d0fe10376b9c7c.js"></script>

<br>

>ui.css
>> <i class="icon icon-link"></i> ui.css

<script src="https://gist.github.com/nex-front/22371fb79eb6faa8c108c6bba88b8021.js"></script>

### Download 
---
> ZIP (ver.1.0) 2022.01.10 : [<i class="icon icon-link"></i> guide.zip](/guide.zip){:target="_blank"}
