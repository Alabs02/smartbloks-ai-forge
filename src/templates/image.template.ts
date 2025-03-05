import { ContentTransformerInput } from "@/models";
import { ChatPromptTemplate, FewShotChatMessagePromptTemplate } from "@langchain/core/prompts";

const imageExamples = [
  {
    input: JSON.stringify({
      siteName: "Tech Haven",
      keywords: ["smartphone", "6.5-inch display", "128GB storage"],
      altText: "A sleek smartphone with a large display and high storage capacity."
    }),
    output:
      "Generate an ultra-realistic image of a cutting-edge smartphone with a stunning 6.5-inch display, showcasing vibrant colors and a modern design. The phone should be placed on a premium tech background, emphasizing innovation and high storage capacity."
  },
  {
    input: JSON.stringify({
      siteName: "QuickFix Plumbing",
      keywords: ["24/7 plumbing services", "downtown"],
      altText: "A professional plumber fixing a sink in an urban apartment."
    }),
    output:
      "Create a detailed image of a skilled plumber working on a sink repair in a modern downtown apartment. The scene should reflect reliability and professionalism, with clear branding for QuickFix Plumbing."
  },
  {
    input: JSON.stringify({
      siteName: "Culinary Delights",
      keywords: ["cooking workshop", "weekend event"],
      altText: "A group of people learning to cook in a warm, inviting kitchen."
    }),
    output:
      "Generate an inviting scene of a hands-on cooking workshop, where participants are joyfully preparing gourmet dishes under the guidance of a chef. The atmosphere should be warm and engaging, filled with fresh ingredients and vibrant kitchenware."
  },
  {
    input: JSON.stringify({
      siteName: "EcoLiving Blog",
      keywords: ["energy efficiency", "home improvement"],
      altText: "A modern eco-friendly home with solar panels and smart energy solutions."
    }),
    output:
      "Create a high-quality image of an energy-efficient home featuring solar panels, smart thermostats, and green architecture. The house should be bathed in natural sunlight, symbolizing sustainability and innovation."
  },
  {
    input: JSON.stringify({
      siteName: "Fashion Fiesta",
      keywords: ["summer dresses", "latest collection"],
      altText: "A model wearing a stylish summer dress in a breezy outdoor setting."
    }),
    output:
      "Generate an elegant fashion image of a model wearing a flowy summer dress in a sunlit outdoor setting, surrounded by flowers or a scenic beach backdrop. The vibe should be trendy, vibrant, and Instagram-worthy."
  },
  {
    input: JSON.stringify({
      siteName: "SkillUp Academy",
      keywords: ["online course", "digital marketing"],
      altText: "A person studying digital marketing on a laptop with a virtual classroom in the background."
    }),
    output:
      "Design a futuristic workspace where a motivated learner is engaged in a digital marketing course on their laptop. A virtual classroom with interactive charts and marketing analytics should be subtly integrated into the scene."
  },
  {
    input: JSON.stringify({
      siteName: "FitLife Gym",
      keywords: ["30-day fitness challenge", "fitness program"],
      altText: "A determined person lifting weights in a gym with a challenge banner in the background."
    }),
    output:
      "Illustrate an inspiring fitness scene where a determined individual is actively participating in a 30-day challenge at FitLife Gym. The environment should be energetic, with motivational elements like a leaderboard and challenge banners."
  }
];

const imageExamplePrompt = ChatPromptTemplate.fromMessages([
  ["human", "Site Name: {siteName}\nKeywords: {keywords}\nAlt Text: {altText}"],
  ["ai", "{output}"]
]);

const imageFewShotPrompt = new FewShotChatMessagePromptTemplate({
  examples: imageExamples,
  examplePrompt: imageExamplePrompt,
  inputVariables: ["siteName", "keywords", "altText"],
  suffix: "Site Name: {siteName}\nKeywords: {keywords}\nAlt Text: {altText}"
});

export async function createFinalImagePrompt(input: Omit<ContentTransformerInput, "html"> & { altText?: string }): Promise<string> {
  const { altText, siteName, keywords } = input;
  const finalPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are an AI Designer and UI/UX expert trained in generating high-quality, detailed image prompts for AI-generated images. Your task is to create visually rich and compelling prompts based on the given keywords and alt text. Ensure the image is engaging, relevant, and aligns with the site's theme and audience expectations."
    ],
    ...(await imageFewShotPrompt.formatMessages({
      siteName,
      keywords,
      altText: altText || "A sample AI-generated image concept."
    })),
    ["human", "Site Name: {siteName}\nKeywords: {keywords}\nAlt Text: {altText}"]
  ]);

  const formattedPrompt = await finalPrompt.format({
    siteName,
    keywords,
    altText: altText || "A sample AI-generated image concept."
  });

  return formattedPrompt;
}

export const imageGenerationPrompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are an AI assistant that retrieves high-quality, relevant images from Dribbble, Behance, or Google. Based on the provided image description, you will find a visually appropriate image and return only its direct URL. Your response must be a valid, accessible image URL with no additional text."
  ],
  ["human", `{imagePrompt}`]
]);
