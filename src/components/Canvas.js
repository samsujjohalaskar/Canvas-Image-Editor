class Canvas {
  constructor(
    canvasElement,
    { backgroundColor, selectedImage, templateData, captionText, ctaText }
  ) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext("2d");
    this.backgroundColor = backgroundColor;
    this.selectedImage = selectedImage;
    this.templateData = templateData;
    this.captionText = captionText;
    this.ctaText = ctaText;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  async renderCanvas() {
    this.clearCanvas();
    this.renderBackground();
    this.renderDesignPattern();
    this.renderMask();
    this.renderMaskStroke();
    this.renderCaption();
    this.renderCTA();
    if (this.selectedImage) {
      try {
        await this.renderSelectedImage();
      } catch (error) {
        console.error("Error rendering image:", error);
      }
    }
  }

  renderBackground() {
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderDesignPattern() {
    const { urls } = this.templateData;
    if (urls && urls.design_pattern) {
      this.loadAndRenderImage(
        urls.design_pattern,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
    }
  }

  renderMask() {
    const { urls, image_mask } = this.templateData;
    if (urls && urls.mask) {
      this.loadAndCompositeImage(
        urls.mask,
        image_mask.x - 56,
        image_mask.y - 441
      );
    }
  }

  renderMaskStroke() {
    const { urls, image_mask } = this.templateData;
    if (urls && urls.stroke) {
      const strokeX = image_mask.x - 56;
      const strokeY = image_mask.y - 441;
      const strokeWidth = image_mask.width + 112;
      const strokeHeight = image_mask.height + 477;
      this.loadAndRenderImage(
        urls.stroke,
        strokeX,
        strokeY,
        strokeWidth,
        strokeHeight
      );
    }
  }

  renderCaption() {
    const { text_color, font_size, alignment, max_characters_per_line } =
      this.templateData.caption;
    this.ctx.fillStyle = text_color;
    this.ctx.font = `${font_size}px Arial`;
    this.ctx.textAlign = alignment;
    this.wrapText(
      this.captionText,
      this.templateData.caption.position.x,
      this.templateData.caption.position.y,
      max_characters_per_line,
      font_size
    );
  }

  renderCTA() {
    const { text_color, background_color } = this.templateData.cta;
    const paddingX = 20;
    const paddingY = 20;
    const borderRadius = 10;
    const fontSize = 35;
    const lineHeight = fontSize * 1.2; // line height for vertical centering
    const text = this.ctaText;

    this.ctx.font = `${fontSize}px Arial`;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";

    const textWidth = this.ctx.measureText(text).width;
    const textHeight = lineHeight;

    // calculate the position and dimensions of the background rectangle
    const rectX = this.templateData.cta.position.x - textWidth / 2 - paddingX;
    const rectY = this.templateData.cta.position.y - textHeight / 2 - paddingY;
    const rectWidth = textWidth + 2 * paddingX;
    const rectHeight = textHeight + 2 * paddingY;

    // background rectangle with border-radius
    if (text.trim() !== "") {
      this.ctx.fillStyle = background_color;
      this.roundRect(rectX, rectY, rectWidth, rectHeight, borderRadius);
    }

    this.ctx.fillStyle = text_color;
    this.ctx.fillText(
      text,
      this.templateData.cta.position.x,
      this.templateData.cta.position.y
    );
  }

  roundRect(x, y, width, height, radius) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.arcTo(x + width, y, x + width, y + height, radius);
    this.ctx.arcTo(x + width, y + height, x, y + height, radius);
    this.ctx.arcTo(x, y + height, x, y, radius);
    this.ctx.arcTo(x, y, x + width, y, radius);
    this.ctx.closePath();
    this.ctx.fill();
  }

  async renderSelectedImage() {
    const { urls, image_mask } = this.templateData;
    const { x, y, width, height } = image_mask;
    if (urls.mask) {
      const image = await this.loadImage(this.selectedImage);
      this.ctx.drawImage(image, x, y, width, height);
    }
  }

  wrapText(text, x, y, maxWidth, lineHeight) {
    const words = text.split(" ");
    let line = "";
    let yPos = y;
    words.forEach((word) => {
      const testLine = line + word + " ";
      const metrics = this.ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && line !== "") {
        this.ctx.fillText(line, x, yPos);
        line = word + " ";
        yPos += lineHeight;
      } else {
        line = testLine;
      }
    });
    this.ctx.fillText(line, x, yPos);
  }

  async loadAndRenderImage(url, x, y, width = null, height = null) {
    const image = await this.loadImage(url);
    if (width && height) {
      this.ctx.drawImage(image, x, y, width, height);
    } else {
      this.ctx.drawImage(image, x, y);
    }
  }

  async loadAndCompositeImage(url, x, y) {
    const image = await this.loadImage(url);
    this.ctx.drawImage(image, x, y);
  }

  loadImage(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });
  }
}

export default Canvas;
