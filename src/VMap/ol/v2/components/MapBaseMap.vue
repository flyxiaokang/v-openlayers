<template>
    <div class="all">

        <div class="center">
            <!-- <div class="explainer"><span>Hover me</span></div> -->
            <!-- <div class="text">Frontend Development</div> -->
        </div>
        <div class="right">
            <!-- <div class="text">Backend Development</div> -->
        </div>
        <div class="righter">
            <!-- <div class="text">SEO</div> -->
        </div>
    </div>
</template>

<script>
export default {};
</script>


<style>
/* body {
  font-family: 'Raleway', sans-serif;
  background-image: radial-gradient(circle at center, #899Dc4, #495D84);
  background-size: cover;
  background-repeat: no-repeat;
  height: 100vh;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(ellipse at bottom, #1b2735, #090a0f);
  font-weight: 300;
} */

.all {
    position: absolute;
    top: 100px;
    left: 100px;
    z-index: 2999;
    display: flex;
    -webkit-perspective: 10px;
    perspective: 10px;
    -webkit-transform: perspective(300px) rotateX(20deg);
    transform: perspective(300px) rotateX(20deg);
    will-change: perspective;
    -webkit-perspective-origin: center center;
    perspective-origin: center center;
    transition: all 1.3s ease-out;
    justify-content: center;
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
}

.all:hover {
    -webkit-perspective: 1000px;
    perspective: 1000px;
    transition: all 1.3s ease-in;
    -webkit-transform: perspective(10000px) rotateX(0deg);
    transform: perspective(10000px) rotateX(0deg);
}
.all:hover .text {
    opacity: 1;
}
.all:hover > div {
    opacity: 1;
    transition-delay: 0s;
}
.all:hover .explainer {
    opacity: 0;
}

.left,
.center,
.right,
.lefter,
.righter {
    width: 60px;
    height: 60px;
    -webkit-transform-style: preserve-3d;
    transform-style: preserve-3d;
    border-radius: 10px;
    border: 1px solid #fff;
    box-shadow: 0 0 20px 5px rgba(100, 100, 255, 0.4);
    opacity: 0;
    transition: all 0.3s ease;
    transition-delay: 1s;
    position: relative;
    background-position: center center;
    background-size: contain;
    background-repeat: no-repeat;
    background-color: #58d;
    cursor: pointer;
    background-blend-mode: color-burn;
}
.left:hover,
.center:hover,
.right:hover,
.lefter:hover,
.righter:hover {
    box-shadow: 0 0 30px 10px rgba(100, 100, 255, 0.6);
    background-color: #ccf;
}

.text {
    -webkit-transform: translateY(30px);
    transform: translateY(30px);
    opacity: 0;
    transition: all 0.3s ease;
    bottom: 0;
    left: 5px;
    position: absolute;
    will-change: transform;
    color: #fff;
    text-shadow: 0 0 5px rgba(100, 100, 255, 0.6);
}

.lefter {
    -webkit-transform: translateX(-60px) translateZ(-50px) rotateY(-10deg);
    transform: translateX(-60px) translateZ(-50px) rotateY(-10deg);
    background-image: url(img/organization-512.png);
}

.left {
    -webkit-transform: translateX(-30px) translateZ(-25px) rotateY(-5deg);
    transform: translateX(-30px) translateZ(-25px) rotateY(-5deg);
    background-image: url(img/creative_draw-512.png);
}

.center {
    opacity: 1;
    background-image: url(img/app_window-512.png);
}

.right {
    -webkit-transform: translateX(30px) translateZ(-25px) rotateY(5deg);
    transform: translateX(30px) translateZ(-25px) rotateY(5deg);
    background-image: url(img/cloud_weather-512.png);
}

.righter {
    -webkit-transform: translateX(60px) translateZ(-50px) rotateY(10deg);
    transform: translateX(60px) translateZ(-50px) rotateY(10deg);
    background-image: url(img/search-512.png);
}

.explainer {
    font-weight: 300;
    font-size: 2rem;
    color: #fff;
    transition: all 0.6s ease;
    width: 100%;
    height: 100%;
    background-color: #303050;
    background-image: radial-gradient(circle at center top, #cce, #33a);
    border-radius: 10px;
    text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
}

.ref {
    background-color: #000;
    background-image: linear-gradient(to bottom, #d80, #c00);
    border-radius: 3px;
    padding: 7px 10px;
    position: absolute;
    font-size: 16px;
    bottom: 10px;
    right: 10px;
    color: #fff;
    text-decoration: none;
    text-shadow: 0 0 3px rgba(0, 0, 0, 0.4);
}
.ref::first-letter {
    font-size: 12px;
}
</style>