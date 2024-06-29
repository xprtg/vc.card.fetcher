export function removeQueryStringFromUrl(url: string): string {
    const index = url.indexOf('.png');
    if (index !== -1) {
        return url.substring(0, index + 4);
    }
    return url;
}
