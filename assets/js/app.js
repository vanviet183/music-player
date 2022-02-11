var $ = document.querySelector.bind(document)
var $$ = document.querySelectorAll.bind(document)

const player = $('.player')
const cd = $('.cd')
const heading = $('header h2')
const cdThumb = $('.cd--thumb')
const audio = $('.audio')
const playBtn = $('.btn--play')
const progress = $('#progress')
const playlist = $('.playlist')
const nextBtn = $('.btn--next')
const prevBtn = $('.btn--prev')
const ramdomBtn = $('.btn--ramdom')
const repeatBtn = $('.btn--repeat')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRamdom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Comethru',
            singer: 'Jeremy Zucker',
            path: '/assets/audio/comethru.mp3',
            image: '/assets/img/comthru.jpg'
        },
        {
            name: 'At My Worst',
            singer: 'Pink Weak',
            path: '/assets/audio/atmyworst.mp3',
            image: '/assets/img/atmyworst.jpg'
        },
        {
            name: 'Bad Liar',
            singer: 'Imagine Dragons',
            path: '/assets/audio/badliar.mp3',
            image: '/assets/img/badliar.jpg'
        },
        {
            name: 'Dance Monkey',
            singer: 'Tone and I',
            path: '/assets/audio/dancemonkey.mp3',
            image: '/assets/img/dancemonkey.jpg'
        },
        {
            name: 'Believer',
            singer: 'Imagine Dragons',
            path: '/assets/audio/believer.mp3',
            image: '/assets/img/believer.jpeg'
        },
        {
            name: 'Đường Tôi Chở Em Về',
            singer: 'buitruonglinh x Freak D',
            path: '/assets/audio/duongtoichoemve.mp3',
            image: '/assets/img/duongtoichoemve.jpg'
        },
        {
            name: 'Memories',
            singer: 'Maroon 5',
            path: '/assets/audio/memories.mp3',
            image: '/assets/img/memories.jpg'
        },
        {
            name: 'Past Live',
            singer: 'sapientdream',
            path: '/assets/audio/pastlive.mp3',
            image: '/assets/img/pastlive.jpg'
        },
        {
            name: 'That Girl',
            singer: 'Olly Murs',
            path: '/assets/audio/thatgirl.mp3',
            image: '/assets/img/thatgirl.jpg'
        }
    ],

    // Return current song
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    // Xử lí event
    handleEvent: function() {
        const _this = this

        // Xử lí Cd quay
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000, // 10s
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        // Xử lí trượt playlist
        const cdWidth = cd.offsetWidth 
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop 

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // Xử lí click Play
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        // Player đang play
        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        } 

        //Player đang pause
        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        } 

        // Tiến độ bài hát
        audio.ontimeupdate = function() {
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }
        }

        // Xử lí khi tua
        progress.oninput = function(e) {
            const seekTime = audio.duration * e.target.value / 100;
            audio.currentTime = seekTime
        }

        // Xử lí khi next song
        nextBtn.onclick = function() {
            if(_this.isRamdom) {
                _this.ramdomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render();
            _this.scrollToActiveSong();
        }

        // Xử lí khi prev song
        prevBtn.onclick = function() {
            if(_this.isRamdom) {
                _this.ramdomSong()
            } else {
                _this.prevSong()
            }
            audio.play() 
            _this.render();
            _this.scrollToActiveSong();
        }

        // Xử lí khi bật tắt ramdom
        ramdomBtn.onclick = function() {
            _this.isRamdom = !_this.isRamdom
            ramdomBtn.classList.toggle('active', _this.isRamdom)
        }

        // Xử lí khi ended song
        audio.onended = function() {
            if(_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }

        // Xử lí khi repeat song 
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active', _this.isRepeat) 
        }

        // Xử lí khi click playlist song
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')) {
                // Xử lí khi click song in playlist
                if(songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                // Xử lí khi click option
                if(e.target.closest('.option')) {

                }
            }
        }
    },

    // Next song
    nextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    // Prev song
    prevSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0 ) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    // Play ramdom song
    ramdomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    // Into view current song
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            })
        }, 500);
    },

    // Render song
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">
                            ${song.name}
                        </h3>
                        <p class="author">
                            ${song.singer}
                        </p>                        
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },

    // Reset current song
    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },

    // Container
    start: function() {
        // Định nghĩa các thuộc tính cho object
        this.defineProperties()

        // Xử lí lắng nghe các sự kiện
        this.handleEvent()

        // Tải bài hát đầu tiên
        this.loadCurrentSong()

        // Render playlist
        this.render();
    }
}

app.start();