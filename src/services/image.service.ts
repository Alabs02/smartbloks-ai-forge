import axios from "axios";
import { SERVER } from "@/config";

export class ImageSearchService {
  private UNSPLASH_ACCESS_KEY = SERVER.UNSPLASH_ACCESS_KEY;
  private UNSPLASH_API_URL = "https://api.unsplash.com/search/photos";

  constructor() {
    if (!this.UNSPLASH_ACCESS_KEY) {
      throw new Error("Unsplash API Key is missing in the environment variables.");
    }
  }

  async fetchImageUrl(query: string): Promise<string | null> {
    try {
      const response = await axios.get(this.UNSPLASH_API_URL, {
        params: {
          query,
          client_id: this.UNSPLASH_ACCESS_KEY,
          per_page: 1
        }
      });

      return response.data?.results?.[0]?.urls?.regular || null;
    } catch (error) {
      console.error("Error fetching image from Unsplash:", error);
      return null;
    }
  }
}
