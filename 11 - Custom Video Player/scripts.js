// 获取页面上的标签
const video = document.querySelector('.player__video') // 播放器
const togglePlayButton = document.querySelector('.player__button.toggle') // 播放暂停按钮
const sliders = document.querySelectorAll('.player__slider') // 音量及播放速度按钮
const skipButtons = document.querySelectorAll('[data-skip]') // 快进及快退
// 进度条
const progress = document.querySelector('.progress')
const progressBar = document.querySelector('.progress__filled')

// 实现功能

// 播放暂停
function togglePlay() {
  const method = video.paused ? 'play' : 'pause'
  video[method]()
}
// 根据播放状态更改播放按钮图标
function updateButton(){
  const icon = video.paused ? '►' : '❚ ❚'
  togglePlayButton.textContent = icon
}

// 控制音量和播放速度
function handleRangeUpdate() {
  video[this.name] = this.value
}

// 快进快退
function skip() {
  video.currentTime += parseFloat(this.dataset.skip)
}

// 通过进度条控制播放时间
function scrub(e) { // 控制播放时间
  const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration
  video.currentTime = scrubTime
}

function handleProgress() { // 同步播放条进度
  const percent = (video.currentTime / video.duration) * 100
  progressBar.style.flexBasis = `${percent}%`
}

// 给标签注册事件，将功能与标签绑定

// 播放暂停
video.addEventListener('click', togglePlay)
togglePlayButton.addEventListener('click', togglePlay)
video.addEventListener('play', updateButton)
video.addEventListener('pause', updateButton)

// 调节音量和播放速度
sliders.forEach(slider => slider.addEventListener('change', handleRangeUpdate))
sliders.forEach(slider => slider.addEventListener('mousemove', handleRangeUpdate))

// 快进快退
skipButtons.forEach(skipButton => skipButton.addEventListener('click', skip))

// 控制进度条
progress.addEventListener('click', scrub)
video.addEventListener('timeupdate', handleProgress)
let scrubMouseDown = false // 记录鼠标是否摁下的标识
progress.addEventListener('mousedown', () => scrubMouseDown = true) // 更改标识
progress.addEventListener('mousemove', (e) => scrubMouseDown && scrub(e)) // 移动进度条时更改播放进度
progress.addEventListener('mouseup', () => scrubMouseDown = false) // 更改标识