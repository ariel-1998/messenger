class UrlImageOptimize {
  generateIconImageUrl = jest.fn().mockReturnValue("iconUrl");
  generateProfileCardUrl = jest.fn().mockReturnValue("profileUrl");
}

export const urlImageOptimize = new UrlImageOptimize();
