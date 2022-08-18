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
const $$ = document.querySelectorAll.bind(document);
const playList = $('.playlist');
const CDThumb = $('.CD__thumb img');
const CD = $('.CD__thumb');
const dashSong = $('.dashboard__songName');
const audio = $('#audio');
const playBtn = $('.nav__play .play-i');
const pauseBtn = $('.nav__play .playing-i');
const nextBtn = $('.nav__next');
const prevBtn = $('.nav__prev');
const randomBtn = $('.nav__shuffle');
const replayBtn = $('.nav__replay');
const progress = $('#progress');
const volume = $('#volume');
const volumeBtn = $('#volume__icon');
const playStatus = $('.dashboard i');
var latestVolume = 0;
const app = {
    currentIndex: 0,
    songs: [
        {
            name: 'Nàng Thơ',
            path: './assets/music/song1.mp3',
            thumb: './assets/img/song1.jpg',
            singer: 'Hoàng Dũng'
        },
        {
            name: 'Xin lỗi vì đã yêu nhau',
            path: './assets/music/song2.mp3',
            thumb: './assets/img/song2.jpg',
            singer: 'Hoài Lâm'
        },
        {
            name: 'An Coong Piano',
            path: './assets/music/song3.mp3',
            thumb: './assets/img/song3.jpg',
            singer: 'An Coong'
        },
        {
            name: 'Nàng Thơ',
            path: './assets/music/song1.mp3',
            thumb: './assets/img/song1.jpg',
            singer: 'Hoàng Dũng'
        },
        {
            name: 'Xin lỗi vì đã yêu nhau',
            path: './assets/music/song2.mp3',
            thumb: './assets/img/song2.jpg',
            singer: 'Hoài Lâm'
        },
        {
            name: 'An Coong Piano',
            path: './assets/music/song3.mp3',
            thumb: './assets/img/song3.jpg',
            singer: 'An Coong'
        },
        {
            name: 'Nàng Thơ',
            path: './assets/music/song1.mp3',
            thumb: './assets/img/song1.jpg',
            singer: 'Hoàng Dũng'
        },
        {
            name: 'Xin lỗi vì đã yêu nhau',
            path: './assets/music/song2.mp3',
            thumb: './assets/img/song2.jpg',
            singer: 'Hoài Lâm'
        },
        {
            name: 'An Coong Piano',
            path: './assets/music/song3.mp3',
            thumb: './assets/img/song3.jpg',
            singer: 'An Coong'
        }
    ],
    render: function(){
        var htmls = '';
        var index = 0;
        app.songs.forEach(function(song){ 
            htmls += `<div class="playlist__item" id="song${index}">
            <div class="item__avt">
                <img src="${song.thumb}" alt="">
            </div>
            <div class="item__body">
                <h3 class="item__song">${song.name}</h3>
                <i class="item__singer">${song.singer}</i>
            </div>
            <div class="item__option">
                <i class="fa-solid fa-ellipsis"></i>
            </div>
        </div>      
        `;
        index ++;
        })
        // htmls.join('');
        // console.log(htmls);
        playList.innerHTML = htmls
    },
    loadSong: function() {
        CDThumb.src = this.songs[this.currentIndex].thumb;
        dashSong.innerText = this.songs[this.currentIndex].name;
        audio.src = this.songs[this.currentIndex].path;
    },
    start: function(){
        app.render();//load data ra playlist
        app.loadSong();//load bài hiện tại ra player
        app.eventHandler(); //xử lý bắt các event
    },
    eventHandler: function(){
        //xử lý khi nhấn play
        playBtn.onclick = function(){
            audio.play();
        }
        pauseBtn.onclick = function() {
            audio.pause();
        }
        //xử lý khi đang play
        audio.onplay = function() {
            $('.play-i').style.display = 'none';
            $('.playing-i').style.display = 'block';
            $('.playing-i').classList.add('active');
            CDAnimate.play(); 
            playStatus.innerText = "Now Playing";  
            //xử lý input range progress
            //xử lý khi tgian thay đổi -> value đổi theo
            audio.ontimeupdate = function() {
                var ratio = audio.currentTime/audio.duration;
                progress.value = ratio == NaN? 0: ratio*100;
                // console.log(ratio*100);
            }
            //xử lý khi tua
            progress.onchange = function() {
                audio.currentTime = progress.value*audio.duration/100;
                audio.play();
            }
        }
        //xử lý khi đang pause 
        audio.onpause = function() {
            $('.playing-i').style.display = 'none';
            $('.play-i').style.display = 'block';
            $('.play-i').classList.add('active');
            CDAnimate.pause();
            playStatus.innerText = "Click play to enjoy!";  
                //xử lý auto next bài
            if(audio.ended) {
                if(isReplay == true){
                    audio.currentTime = 0;
                    audio.play();
                }else {
                    nextBtn.click();
                }
        }
        }
        //xử lý xoay CD
        // => xử lý trong onplay() và onpause()
        var CDAnimate = CD.animate([  //para 1 là array chứa obj, para2 là object
            {
                transform: 'rotate(0deg)',
            },
            {
                transform: 'rotate(360deg)',
            }
        ],{
            duration: 10000,
            iterations: Infinity,
        })
        CDAnimate.pause();
        //xử lý next
        nextBtn.onclick = function() {
            $(`#song${app.currentIndex}`).classList.remove('active');

            if(isRandom == true) {
                do {
                    var randomIndex = Math.floor(Math.random()*(app.songs.length-1));
                } while (app.currentIndex == randomIndex)
                app.currentIndex = randomIndex;
            }
            app.currentIndex += 1; //hoặc app.currentIndex cũng dc
            app.loadSong();
            audio.play();
            $(`#song${app.currentIndex}`).classList.add('active');
      
        }
        //xử lý prev
        prevBtn.onclick = function() {
            $(`#song${app.currentIndex}`).classList.remove('active');

            if(isRandom == true) {
                do {
                    var randomIndex = Math.floor(Math.random()*(app.songs.length-1));
                } while (app.currentIndex == randomIndex)
                app.currentIndex = randomIndex;
            }
            app.currentIndex -= 1; //hoặc app.currentIndex cũng dc
            app.loadSong();
            audio.play();
            $(`#song${app.currentIndex}`).classList.add('active');
        }
        //xử lý random
        var isRandom = false;
        randomBtn.onclick = function() {
            randomBtn.classList.toggle('active');
            isRandom = true;
            do {
                var randomIndex = Math.floor(Math.random()*(app.songs.length-1));
            } while (app.currentIndex == randomIndex)
        }
        //xử lý replay
        var isReplay = false;
        replayBtn.onclick = function() {
            replayBtn.classList.toggle('active');
            isReplay = isReplay==false?true:false;
        }
        //xử lý volume
        volume.onchange = function() {
            console.log(volume.value)
            audio.volume = volume.value;
            latestVolume = audio.volume;
        }
        //xử lý nút volume 
        var isMute = false;
        volumeBtn.onclick = function() {
            if(isMute == false) {
                audio.volume = 0;
                console.log(latestVolume)
                volumeBtn.classList.remove('fa-volume-high',);
                volumeBtn.classList.add('fa-volume-xmark');   
                isMute = true;
                console.log(volumeBtn.classList)
            }else {
                audio.volume = latestVolume;
                volumeBtn.classList.remove('fa-volume-xmark');
                volumeBtn.classList.add('fa-volume-high');
                isMute = false;
            }
        }
 
    }
}

app.start();
var playListItem = $$('.playlist__item');
console.log(playListItem)
//xử lý click on song to play
//phải đem xuống dưới vì render xong rồi mới load đc danh sách playlist__item
playListItem.forEach(function(item) {
    if(app.currentIndex == parseInt(item.id.slice('song'.length,item.id.length))){
        item.classList.add('active');
    }
    item.onclick = function(e) {
        $(`#song${app.currentIndex}`).classList.remove('active');
        //đặt tên id thì k được đặt bằng số
        //khi đặt bằng số querySelector sẽ k ra được element
        app.currentIndex = parseInt(item.id.slice('song'.length,item.id.length));
        app.loadSong();
        audio.play();
        item.classList.add('active');
    }
})
audio.volume = 0.2;