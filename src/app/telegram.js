class TelegramBot {
    #app;
    #id;
    #type;

    constructor ( app, { id, type } ) {
        this.#app = app;
        this.#id = id;
        this.#type = type;
    }

    // properties
    get app () {
        return this.#app;
    }

    get id () {
        return this.#id;
    }

    get type () {
        return this.#type;
    }
}

class TelegramBotUser {
    #bot;
    #id;
    #username;

    constructor ( bot, { id, username } ) {
        this.#bot = bot;
        this.#id = id;
        this.#username = username;
    }

    // properties
    get app () {
        return this.#bot.app;
    }

    get bot () {
        return this.#bot;
    }

    get id () {
        return this.#id;
    }

    get username () {
        return this.#username;
    }
}

export default class {
    #app;
    #bot;
    #user;
    #webAppType;
    #data;
    #token;

    constructor ( app, data ) {
        this.#app = app;

        this.#bot = new TelegramBot( this.#app, {
            "id": data.telegramBotId,
            "type": data.telegramBotType,
        } );

        this.#user = new TelegramBotUser( this.#bot, globalThis.Telegram.WebApp.initDataUnsafe.user );

        this.#webAppType = data.webAppType;
        this.#data = data.data;
    }

    // static
    static async new ( app ) {
        if ( app.router.path !== "/telegram-webapp" ) return;

        // await import( /* webpackIgnore: true */ "https://telegram.org/js/telegram-web-app.js" );

        const script = document.createElement( "SCRIPT" );
        script.setAttribute( "src", "https://telegram.org/js/telegram-web-app.js" );
        script.setAttribute( "async", "" );
        script.setAttribute( "defer", "" );
        document.body.append( script );

        await new Promise( resolve => {
            script.onload = resolve;
        } );

        if ( !globalThis.Telegram.WebApp.initData ) return;

        // decode init data
        try {
            var data = JSON.parse( app.router.searchParams.get( "data" ) );
        }
        catch {}

        // init data is not valid
        if ( !data ) {
            globalThis.Telegram.WebApp.close();

            return;
        }

        return new this( app, data );
    }

    // properties
    get app () {
        return this.#app;
    }

    get bot () {
        return this.#bot;
    }

    get user () {
        return this.#user;
    }

    get webAppType () {
        return this.#webAppType;
    }

    get data () {
        return this.#data;
    }

    get token () {
        if ( this.#token === undefined ) {
            this.#token = null;

            if ( globalThis.Telegram.WebApp.initData ) {
                this.#token = encodeURIComponent( "telegram:" +
                        JSON.stringify( {
                            "telegram_bot_id": this.bot.id,
                            "telegram_webapp_init_data": globalThis.Telegram.WebApp.initData,
                        } ) );
            }
        }

        return this.#token;
    }

    get platform () {
        return globalThis.Telegram.WebApp.platform;
    }

    get isExpanded () {
        return globalThis.Telegram.WebApp.isExpanded;
    }

    get isClosingConfirmationEnabled () {
        return globalThis.Telegram.WebApp.isClosingConfirmationEnabled;
    }

    get isVerticalSwipesEnabled () {
        return globalThis.Telegram.WebApp.isVerticalSwipesEnabled;
    }

    get backButton () {
        return globalThis.Telegram.WebApp.backButton;
    }

    get mainButton () {
        return globalThis.Telegram.WebApp.mainButton;
    }

    get settingsButton () {
        return globalThis.Telegram.WebApp.settingsButton;
    }

    // public
    ready () {
        globalThis.Telegram.WebApp.ready();
    }

    expand () {
        globalThis.Telegram.WebApp.expand();
    }

    close () {
        globalThis.Telegram.WebApp.close();
    }

    openLink ( url, { tryInstantView } = {} ) {
        globalThis.Telegram.WebApp.openLink( url, { "try_instant_view": tryInstantView } );
    }

    openTelegramLink ( url ) {
        globalThis.Telegram.WebApp.openTelegramLink( url );
    }

    async openInvoice ( url ) {
        return new Promise( resolve => globalThis.Telegram.WebApp.openInvoice( url, resolve ) );
    }

    async requestContact () {
        return new Promise( resolve => globalThis.Telegram.WebApp.requestContact( resolve ) );
    }

    setClosingConfirmationEnabled ( value ) {
        if ( value ) {
            globalThis.Telegram.WebApp.enableClosingConfirmation();
        }
        else {
            globalThis.Telegram.WebApp.disableClosingConfirmation();
        }
    }

    setVerticalSwipesEnabled ( value ) {
        if ( value ) {
            globalThis.Telegram.WebApp.enableVerticalSwipes();
        }
        else {
            globalThis.Telegram.WebApp.disableVerticalSwipes();
        }
    }
}
