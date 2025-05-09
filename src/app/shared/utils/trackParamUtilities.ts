export const TRACK_PARAMS ={
    combine(url?: string | null, 
        source?: string | null, 
        sourceId?: number | null): string
    {
        url ??= '';

        const hasParam = url?.includes("?");
        const paramToJoin = (hasParam ? "&" : "?") + 
                [
                    source ? `source=${source}` : null, 
                    sourceId ? `sourceId=${sourceId}` : null
                ]
            .filter(s => s)        
            .join('&');

        url += paramToJoin;

        return url;
    }
}