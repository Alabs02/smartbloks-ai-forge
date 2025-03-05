import { IsBoolean, IsObject, IsString } from "class-validator";

export class ContentTransformerResponse {
  @IsString()
  message!: string;

  @IsBoolean()
  isSuccessful!: boolean;

  @IsObject()
  result!: { html: string };
}

export const ContentTransformerDoc = {
  ContentTransformerResponse,
  transformOptions: {
    summary: "Transform HTML Content",
    description: "Optimizes HTML for SEO, accessibility, and user experience.",
    tags: ["Content Transformer"],
    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/TransformContentDto" },
          example: {
            html: "<section class='hero'><img src='https://tinyurl.com/3e8ze4py' alt='Logo' class='logo'><p>Discover innovative solutions and explore our latest projects.</p><a href='#'>Learn More</a></section>",
            siteName: "AU Consultancy",
            keywords: ["Bespoke Solutions", "Radical in Approach", "Your unique perspective"]
          }
        }
      }
    },
    responses: {
      "200": {
        description: "HTML successfully transformed",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ContentTransformerResponse" },
            example: {
              message: "HTML successfully optimized for SEO, accessibility, and user experience.",
              isSuccessful: true,
              result: {
                html: `<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Discover the best smart gadgets, tech reviews, and latest devices at TechGear. Step into the future with our premium collection.">
    <meta name="keywords" content="smart gadgets, tech reviews, latest devices">
    <title>TechGear - Your Source for Smart Gadgets and Tech Reviews</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>Welcome to TechGear</h1>
        <p>Discover the best smart gadgets and stay ahead with our tech reviews and the latest devices.</p>
        <button type="button" class="cta-button" aria-label="Shop Now at TechGear">Shop Now</button>
    </header>
    <main>
        <section>
            <h2>Stay Ahead with Tech Insights</h2>
            <p>Explore the latest technology trends, expert analyses, and industry updates to stay informed and ahead.</p>
            <a href="/blog" class="cta-button">Read More</a>
        </section>
        <section>
            <img src="image.jpg" alt="NextGen Software Interface - Boost Productivity">
            <p>Maximize efficiency with NextGen Software—AI-powered tools for smarter workflows.</p>
            <a href="/features" class="learn-more">Explore Features</a>
        </section>
        <section>
            <h2>Discover Premium Footwear at Elite Footwear</h2>
            <p>Step into comfort and style with our top-quality collection.</p>
            <button type="button" class="cta-button" aria-label="Shop Now at Elite Footwear">Shop Now</button>
        </section>
        <form aria-label="Sign Up for EasyForms">
            <label for="email">Enter your email:</label>
            <input type="email" id="email" placeholder="Your email address" required>
            <button type="submit" class="cta-button">Get Started</button>
        </form>
    </main>
    <footer>
        <p>© 2023 TechGear. All rights reserved.</p>
    </footer>
</body>
</html>`
              }
            }
          }
        }
      },
      "400": {
        description: "Invalid input",
        content: {
          "application/json": {
            schema: { type: "object", properties: { message: { type: "string" } } }
          }
        }
      }
    }
  }
};
