import { isPlainObject } from "#core/utils";

export * from "#core/utils";

export function copyToClipboard ( str ) {
    const el = document.createElement( "textarea" );

    el.value = str;

    document.body.append( el );

    el.select();
    document.execCommand( "copy" );

    el.remove();
}

export function clickUrl ( url ) {
    if ( typeof url === "string" ) url = new URL( url );

    const el = document.createElement( "a" );

    el.setAttribute( "target", "_blank" );
    el.setAttribute( "href", url.href );

    el.style.display = "none";
    document.body.append( el );

    el.click();

    el.remove();
}

export async function saveAs ( url ) {
    var filename;

    // plain object
    if ( isPlainObject( url ) ) {
        let content, type;

        ( { url, filename, content, type } = url );

        if ( !url ) {
            url = new Blob( [ content ], { type } );
        }
    }

    // string
    if ( typeof url === "string" ) {
        url = new URL( url, globalThis.location.href );
    }

    // URL
    if ( url instanceof URL ) {

        // data: url
        if ( url.protocol === "data:" ) {
            if ( url.search ) {
                url = new URL( url );

                filename = url.searchParams.get( "filename" );

                url.search = "";
            }
        }
    }

    // Response
    else if ( url instanceof Response ) {
        url = URL.createObjectURL( await url.blob() );

        // XXX parse content-disposition
    }

    // Blob
    else if ( url instanceof Blob ) {
        url = URL.createObjectURL( url );
    }

    const el = document.createElement( "a" );

    el.setAttribute( "href", url );
    el.setAttribute( "download", filename );
    el.setAttribute( "target", "_blank" );

    el.style.display = "none";
    document.body.append( el );

    // download
    el.click();

    // cleanup
    el.remove();
    URL.revokeObjectURL( url );
}

export async function alert ( message, { title } = {} ) {
    if ( title ) message = `${ title }\n\n${ message }`;

    alert( message );
}

export async function confirm ( message, { title } = {} ) {
    if ( title ) message = `${ title }\n\n${ message }`;

    return confirm( message );
}

export function toast ( msg, timeout ) {
    if ( Ext.isObject( msg ) ) msg = msg.statusText ?? msg + "";

    console.log( msg );
}

export function labelError ( text ) {
    return `<span style="background-color:red;color:white">&nbsp;${ text }&nbsp;</span>`;
}
