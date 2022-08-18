/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play/ Pause/ Seek
 * 4. CD rotate
 * 5. Next/ Prev
 * 6. Random
 * 7. Next/ Repeat when ended
 * 8. Active song
 * 9. Sroll active song into view
 * 10. play song when click
 */
const $ = document.querySelector.bind(document);
//gán vầy để lấy element cho gọn ví dụ $('.player')
const $$ = document.querySelectorAll.bind(document);
// $$ là dùng selectorAll
function convertToAngle(matrix) {
    var values = matrix.split('(')[1],
       values = values.split(')')[0],
       values = values.split(',');

   var sin = values[1]; // 0.5

   return Math.round(Math.asin(sin) * (180/Math.PI));
}
const dashboardSong = $('.dashboard__song');
const CDThumb = $('.CD__thumb img');
const audio = $('#audio');
const playButton = $('.nav__play');
const randomBtn = $('.nav__shuffle');
console.log(randomBtn);
const  app = {
    currentIndex: 0,
    songs: [ 
        {
            name: 'Nàng Thơ',
            singer: 'Hoàng Dũng',
            path:'./assets/music/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Xin Lỗi Vì Đã Yêu Nhau',
            singer: 'Hoài Lâm',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'Yêu em dại khờ Piano',
            singer: 'An Coong',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Nàng Thơ',
            singer: 'Hoàng Dũng',
            path:'./assets/music/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Xin Lỗi Vì Đã Yêu Nhau',
            singer: 'Hoài Lâm',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'Yêu em dại khờ Piano',
            singer: 'An Coong',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },
        {
            name: 'Nàng Thơ',
            singer: 'Hoàng Dũng',
            path:'./assets/music/song1.mp3',
            image: './assets/img/song1.jpg'
        },
        {
            name: 'Xin Lỗi Vì Đã Yêu Nhau',
            singer: 'Hoài Lâm',
            path: './assets/music/song2.mp3',
            image: './assets/img/song2.jpg'
        },
        {
            name: 'Yêu em dại khờ Piano',
            singer: 'An Coong',
            path: './assets/music/song3.mp3',
            image: './assets/img/song3.jpg'
        },
    ],
    render: function() {
        var index = 0;
        const htmls = this.songs.map(song =>{
            index ++;
            return `
                <div class="playlist__item" id = "song${index}">
                    <div class="playlist__thumb">
                        <img src="${song.image}" alt="">
                    </div>
                    <div class="playlist__song">
                        <h4 class="song__name">
                            ${song.name}
                        </h4>
                        <p class="song__artist">
                            ${song.singer}
                        </p>
                    </div>
                    <div class="playlist__option">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>
            `
        });
        $('.playlist').innerHTML = htmls.join('');
    },
    handleEvents: function(){ //xử lý các sự kiện trong web này
        const cd = $('.CD');
        const cdHeight = cd.offsetHeight;
        //xử lý nút shuffle
        isRandom = false;
        randomBtn.onclick = function() {
            if(isRandom == false) {
                randomBtn.classList.add('active');
                isRandom = true;
            } else {
                randomBtn.classList.remove('active');
                isRandom = false;
            }
        }
        
        //xong playback fát nhạc

        //xử lý quay/dừng CD-thumb 
        //ĐỂ Ở TRÊN ĐẦU TIÊN MỚI QUAY, CHƯA BIẾT TẠI SAO
        var CDAnimate = $('.CD__thumb').animate([
            {
                transform: 'rotate(360deg)'
            }],
            {
                duration: 10000, //quay 10s = 10.000 ms
                iterations: Infinity //lặp lại: vô hạn
            });
        CDAnimate.pause();
        document.onscroll = function(){ //xử lý scrollTop
            var scrollValue = (window.scrollY || document.documentElement.scrollTop)
            var newHeight = cdHeight - scrollValue;
            $('.CD').style.height = newHeight<3?0:newHeight+'px';
            $('.CD').style.width = newHeight<3?0:newHeight+'px';
            $('.CD').style.opacity = newHeight/cdHeight;
        } //xong phần xử lý scroll phóng to thu nhỏ CD
        
        //xử lý nút repeat;
        var isRepeat = false;
        $('.nav__repeat').onclick = function() {
            if (isRepeat == false) {
                $('.nav__repeat').classList.add('active');
                isRepeat = true;
            }
            else {
                $('.nav__repeat').classList.remove('active');
                isRepeat = false;
            }
        }
        
        //xử lý next
           //tạo hàm
        function nextSong(){
            $(`#song${app.currentIndex + 1}`).classList.remove('active1');
            if (isRandom == true) {
                app.currentIndex = shuffleRandom(app.currentIndex, app.songs)
            }
            else {
               app.currentIndex = (app.currentIndex == app.songs.length-1)?0: app.currentIndex + 1;
            }
            app.loadCurrentSong();
            audio.play();
            $('.nav__play').classList.add('playing');
        }
        //tạo function random
        function shuffleRandom(current, dataArr=[]) {
            do {
                var res = Math.floor(Math.random()*dataArr.length);
            } while (res === current);
            return res;
        }
       $('.nav__next').onclick = function(){
        //    console.log(app.currentIndex, app.songs.length)
            nextSong();
        }
        var current = 0;
        //xử lý tua audio
        $('#progress').onchange = () => {
            audio.currentTime = $('#progress').value/100 * audio.duration;
            audio.ontimeupdate = () => {
                current = 100*(audio.currentTime/audio.duration);
                // $('#progress').setAttribute('value',current);
                // sử dụng setAttribute sẽ chỉ gán 1 lần duy nhất
                // không update liên tục cho range thay đổi value
                $('#progress').value = current;
            }
        }
    //xử lý range progressing
        audio.ontimeupdate = () => {
            current = 100*(audio.currentTime/audio.duration);
            // $('#progress').setAttribute('value',current);
            //tư tự như trên
            $('#progress').value = current;

        }
     //xử lý Prev
  
        //lắng nghe sự kiện click 
        $('.nav__prev').onclick = function(){
            $(`#song${app.currentIndex + 1}`).classList.remove('active1');
            if(isRandom == true) {
                app.currentIndex = shuffleRandom(app.currentIndex, app.songs);
            }
            else {
                app.currentIndex = app.currentIndex == 0?app.songs.length-1: app.currentIndex - 1;
            }
            app.loadCurrentSong();
            audio.play();
            $('.nav__play').classList.add('playing');       
        }
         // count = 1;


        //xử lý khi click play
        var isPlay = false;
        playButton.onclick = function(){
            if (!isPlay) {
                audio.play();
            }else {
                //xử lý khi click pause
                audio.pause();
            }
        }
        audio.onplay = function(){
            //xử lý nút play/pause
            isPlay = true;
            $(`#song${app.currentIndex + 1}`).classList.add('active1');
            $('.nav__play').classList.add('playing');
            CDAnimate.play();
        }
      
        var rotate;
        audio.onpause = function() {
            isPlay = false;
            $('.nav__play').classList.remove('playing');
            CDAnimate.pause();
            //xử lý auto next 
            if(audio.ended) {
                $(`#song${app.currentIndex + 1}`).classList.remove('active1');
                if(isRepeat == true) {
                    audio.currentTime = 0;
                    audio.play();
                }else {
                    nextSong()
                }
            }
            
        }           
      
},
    defineProperties: function(){
        Object.defineProperty(this,'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    // getSong: function() {
    //     return this.songs[this.currentIndex];
    // },
    loadCurrentSong: function() {
        dashboardSong.innerText = app.currentSong.name;
        CDThumb.src = app.currentSong.image;
        audio.src = app.currentSong.path;
    },
    start: function() { //start này để gọi các phương thức
        //ĐỊnh nghĩa các thuộc tính cho Object
        this.defineProperties();
        // lắng nghe/ xử lý các sự kiện DOM events
        this.handleEvents();
        
        //tải thông tin bài hát đầu tiên vào UI
        // console.log(this.getSong());
        this.loadCurrentSong();
        //render playlist
        this.render()
    }
}
app.start();
//xây dựng render ra UI
var dog = {};
Object.defineProperty(dog,'name',{
    value: 'con chó Shiba',

})
console.log(dog);
//xử lý click vào playback phát nhạc
const playList = $$('.playlist__item');
console.log(playList)
playList.forEach(item => {
    item.onclick = function(event){
        $(`#song${app.currentIndex+1}`).classList.remove('active1');
        index = item.id.slice('song'.length, item.id.length);
        index = parseInt(index);
        app.currentIndex = index - 1;
        app.loadCurrentSong();
        audio.play();
    }
});
