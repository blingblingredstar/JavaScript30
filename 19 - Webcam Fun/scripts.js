const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

// 获取摄像头使用权限，开启摄像头，将其渲染到video标签上
function getVideo() {
  navigator.mediaDevices.getUserMedia({ video: true, audio: false }) // 获取摄像头
    .then(localMediaStream => {
      video.srcObject = localMediaStream // 将摄像头渲染到video标签上
      video.play() // 开始播放
    })
    .catch(err => { // 捕获错误信息
      console.log(err)
    })
}

// 将video标签的播放内容定时渲染到canvas标签上
function paintToCanvas() {
  const [width, height] = [video.videoWidth, video.videoHeight] // 保存video的宽高
    ;[canvas.width, canvas.height] = [width, height] // 将canvas的宽高设为video的宽高
  setInterval(function renderToCanvas() { // 每16毫秒把video上的画面渲染到canvas上
    ctx.drawImage(video, 0, 0, width, height) // 把video渲染到canvas上并设置原点和宽高
    let pixels = ctx.getImageData(0, 0, width, height) // 获取canvas像素数据
    pixels = rgbSplit(pixels) // 添加抖音效果
    ctx.putImageData(pixels, 0, 0) // 根据像素数据重新渲染canvas
  }, 16)
}

// 保存当前canvas画面，渲染到页面上，并提供下载链接
function takePhoto() {
  // 播放拍照声音
  snap.currentTime = 0
  snap.play()
  // 获取canvas上的数据
  const data = canvas.toDataURL('image/jpeg') // 以base64格式保存canvas上的图像数据
  const link = document.createElement('a') // 创建新的a标签
  link.href = data // 将数据添加到a标签的href属性上
  link.setAttribute('download', 'handsome') // 给a标签添加download属性
  link.innerHTML = `<img src="${data}" alt="Handsome Man"/>` // 在a标签内添加img标签
  strip.insertBefore(link, strip.firstChild) // 将连接添加到strip下头一个位置
}
// 红色滤镜
function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
  }
  return pixels;
}
// 抖音效果
function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i+=4) {
    pixels.data[i - 50] = pixels.data[i + 0]; // RED
    pixels.data[i + 50] = pixels.data[i + 1]; // GREEN
    pixels.data[i - 75] = pixels.data[i + 2]; // Blue
  }
  return pixels;
}
// 绿幕滤镜
function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}

getVideo() // 开启摄像头录制

video.addEventListener('canplay', paintToCanvas)