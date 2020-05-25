if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js', {
        scope: '.'
    })
    .then(function(registration) {
        console.log('Registration successful, scope is:', registration.scope);
    })
    .catch(function(error) {
        console.log('Service worker registration failed, error:', error);
    });
}

const app = new Vue({
    el: "#app",
    data: {
        abjad: "",
        prev_abjad: "",
        is_installed: true,
        install_prompt: "",
        show_info: 0,
        show_setting: 0,
        lang: 'id',
        mode: {
            uppercase: 1,
            lowercase: 0,
            digit: 0,
            color: 1,
            help_line: 1
        },
        current_mode: 'uppercase'
    },
    mounted(){
        if (localStorage.mode) {
            this.mode = JSON.parse(localStorage.mode);
        }
        this.refresh();
    },
    watch: {
        'mode': {
            handler() {
                localStorage.mode = JSON.stringify(this.mode);
            },
            deep: true
        }
    },
    computed: {
        selected_mode: function(){
            selected_mode = [];
            if(this.mode.uppercase) {
                selected_mode.push("uppercase");
            }
            if(this.mode.lowercase) {
                selected_mode.push("lowercase");
            }
            if(this.mode.digit) {
                selected_mode.push("digit");
            }
            return selected_mode;
        }
    },
    methods: {
        refresh(){
            new_abjad = this.generate_abjad();
            while(new_abjad == this.abjad){
                new_abjad = this.generate_abjad();
            }
            this.abjad = new_abjad;
            this.set_color();
        },
        set_color(){
            if(this.mode.color) {
                document.getElementById("abjad").style.color = this.random_color();
            } else {
                document.getElementById("abjad").style.color = "#333";
            }
        },
        generate_abjad(){
            mode = this.selected_mode[Math.floor(Math.random() * this.selected_mode.length)];
            
            if(!mode) {
                this.mode.uppercase = 1;
                mode = "uppercase";
            }
            
            this.current_mode = mode;

            switch (mode) {
                case 'lowercase':
                    min = 97;
                    max = 122;
                    code = Math.floor(Math.random() * (max - min + 1)) + min;
                    break;
                case 'digit':
                    code = Math.floor(Math.random() * 10) + 1;
                    break;
                default:
                    min = 65;
                    max = 90;
                    code = Math.floor(Math.random() * (max - min + 1)) + min;
                    break;
            }

            return mode == "digit" ? code : String.fromCharCode(code);
        },
        random_color(){
            return `hsla(${~~(360 * Math.random())},70%,70%,0.9)`
        },
        play(){
            if (this.current_mode == "digit") {
                char = this.abjad;
            } else {
                char = this.abjad.toUpperCase();
            }

            let audio = new Audio(`sound/${this.lang}/${char}.mp3`);
            audio.play();
        },
        install(){
            this.install_prompt.prompt();
            this.install_prompt.userChoice.then((choice_result) => {
                if (choice_result.outcome === 'accepted') {
                    this.is_installed = true;
                } else {
                    this.is_installed = false;
                }
            })
        },
        open_info(){
            this.show_info = !this.show_info;
        },
        close_info(){
            this.show_info = 0;
        },
        open_setting(){
            this.show_setting = !this.show_setting;
        },
        close_setting(){
            this.show_setting = 0;
        }
    }
})

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    app.install_prompt = e;
    app.is_installed = false;
});

const is_ios = () => {
    const user_agent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(user_agent);
};

const is_in_standalone_mode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

if(is_ios() && !is_in_standalone_mode()) {
    app.is_installed = 0;
}