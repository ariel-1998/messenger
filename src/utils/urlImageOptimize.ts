class UrlImageOptimize {
  private iconWidth = 35;
  private iconHeight = 35;
  private cardWidth = 300;
  private cardHeight = 200;
  private defaultUrl =
    "http://res.cloudinary.com/dnlv6fy3z/image/upload/v1718276606/hyhe3h69womcfeqw1kjs.png";

  private replaceUrl = (url: string, width: number, height: number) =>
    url.replace("/upload/", `/upload/w_${width},h_${height}/`);

  generateIconImageUrl = (url?: string) =>
    this.replaceUrl(url || this.defaultUrl, this.iconWidth, this.iconHeight);

  generateProfileCardUrl = (url?: string) =>
    this.replaceUrl(url || this.defaultUrl, this.cardWidth, this.cardHeight);
}

export const urlImageOptimize = new UrlImageOptimize();
