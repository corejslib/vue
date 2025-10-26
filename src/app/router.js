export default class Router {
    #app;
    #path;
    #searchParams;

    constructor ( app ) {
        this.#app = app;

        // window.onhashchange = this.reload.bind( this );

        try {
            const url = new URL( globalThis.location.hash.slice( 1 ), "http://local/" );

            this.#path = url.pathname;
            this.#searchParams = url.searchParams;
        }
        catch {
            this.#path = "/";
            this.#searchParams = new URLSearchParams();

            this.reload( "/" );
        }
    }

    // properties
    get app () {
        return this.#app;
    }

    get path () {
        return this.#path;
    }

    get searchParams () {
        return this.#searchParams;
    }

    // public
    async reload ( url, { replace, silent } = {} ) {
        const baseUrl = new URL( "http://local/" );

        baseUrl.pathname = this.#path;
        baseUrl.search = this.#searchParams;

        url = new URL( url, baseUrl );

        const hash = url.pathname + url.search;

        this.#setHash( hash, { replace, silent } );

        await this.#app.reload();
    }

    // private
    #setHash ( hash, { replace, silent } = {} ) {
        if ( !hash.startsWith( "#" ) ) {
            hash = "#" + hash;
        }

        if ( replace ) {
            if ( silent && globalThis.history.replaceState ) {
                globalThis.history.replaceState( null, null, hash );
            }
            else {
                globalThis.location.replace( hash );
            }
        }
        else {
            if ( silent && globalThis.history.pushState ) {
                globalThis.history.pushState( null, null, hash );
            }
            else {
                globalThis.location.hash = hash;
            }
        }
    }
}
