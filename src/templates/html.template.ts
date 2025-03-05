import { ContentTransformerInput } from "@/models";
import { ChatPromptTemplate, FewShotChatMessagePromptTemplate } from "@langchain/core/prompts";

const examples = [
  {
    input: JSON.stringify({
      html: `<h1>Welcome to Our Store</h1><p>We sell the best shoes.</p><button>Buy Now</button>`,
      siteName: "Elite Footwear",
      keywords: ["best shoes", "footwear store", "buy shoes"]
    }),
    output: `<header>
      <h1>Discover Premium Footwear at Elite Footwear</h1>
      <p>Step into comfort and style with our top-quality collection.</p>
      <button type="button" class="cta-button" aria-label="Shop Now at Elite Footwear">Shop Now</button>
    </header> <!-- Enhanced headline, improved copy, and optimized CTA for conversion -->`
  },
  {
    input: JSON.stringify({
      html: `<img src="image.jpg"><p>Our software makes life easier.</p>`,
      siteName: "NextGen Software",
      keywords: ["productivity software", "AI-powered tools"]
    }),
    output: `<section>
      <img src="image.jpg" alt="NextGen Software Interface - Boost Productivity">
      <p>Maximize efficiency with NextGen Software—AI-powered tools for smarter workflows.</p>
      <a href="/features" class="learn-more">Explore Features</a>
    </section> <!-- Added alt text, stronger copy, and a clear CTA for engagement -->`
  },
  {
    input: JSON.stringify({
      html: `<form><input type="text"><button>Submit</button></form>`,
      siteName: "EasyForms",
      keywords: ["form builder", "online forms"]
    }),
    output: `<form aria-label="Sign Up for EasyForms">
      <label for="email">Enter your email:</label>
      <input type="email" id="email" placeholder="Your email address">
      <button type="submit" class="cta-button">Get Started</button>
    </form> <!-- Improved form semantics, accessibility, and CTA language -->`
  },
  {
    input: JSON.stringify({
      html: `<h2>Our Blog</h2><p>We write about tech.</p>`,
      siteName: "Tech Insights",
      keywords: ["tech blog", "latest technology news"]
    }),
    output: `<section>
      <h2>Stay Ahead with Tech Insights</h2>
      <p>Explore the latest technology trends, expert analyses, and industry updates.</p>
      <a href="/blog" class="cta-button">Read More</a>
    </section> <!-- Made the heading engaging, refined the description, and added a CTA -->`
  }
];

const examplePrompt = ChatPromptTemplate.fromMessages([
  ["human", "HTML: {html}\nSite Name: {siteName}\nKeywords: {keywords}"],
  ["ai", "{output}"]
]);

const fewShotPrompt = new FewShotChatMessagePromptTemplate({
  examples,
  examplePrompt,
  inputVariables: ["html", "siteName", "keywords"],
  suffix: "HTML: {html}\nSite Name: {siteName}\nKeywords: {keywords}"
});

export async function createFinalHtmlPrompt(input: ContentTransformerInput) {
  const { html, siteName, keywords } = input;

  const finalPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are an expert in frontend development, SEO, and UX/UI best practices. Your task is to refine the provided HTML to enhance accessibility, semantic structure, search engine optimization user-friendly copy and powerful CTAs. Ensure proper ARIA roles, improve readability, and optimize for conversions while preserving the intent of the original content."
    ],
    ...(await fewShotPrompt.formatMessages({ html, siteName, keywords })),
    ["human", "HTML: {html}\nSite Name: {siteName}\nKeywords: {keywords}"]
  ]);

  return finalPrompt.format({ html, siteName, keywords });
}
