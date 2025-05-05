import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { tiktokUrlSchema, downloadOptionsSchema } from "../shared/schema";
import { getTikTokVideoInfo, processTikTokVideo } from "./tiktok";
import path from "path";
import fs from "fs";

export async function registerRoutes(app: Express): Promise<Server> {
  // TikTok Video Info Route
  app.post("/api/tiktok/info", async (req: Request, res: Response) => {
    try {
      // Validate request body
      const validatedData = tiktokUrlSchema.parse(req.body);
      
      // Get TikTok video info
      const videoData = await getTikTokVideoInfo(validatedData.url);
      
      res.json(videoData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          details: error.errors 
        });
      }
      
      console.error("Error processing TikTok video:", error);
      
      if (error instanceof Error) {
        return res.status(500).json({ 
          message: "Failed to process TikTok video", 
          details: error.message 
        });
      }
      
      res.status(500).json({ 
        message: "An unknown error occurred" 
      });
    }
  });
  
  // TikTok Video Download Route
  app.get("/api/tiktok/download", async (req: Request, res: Response) => {
    try {
      // Validate query parameters
      const validatedData = downloadOptionsSchema.parse({
        videoId: req.query.videoId,
        format: req.query.format,
        quality: req.query.quality
      });
      
      // Process the video with the selected format and quality
      const { filePath, fileName } = await processTikTokVideo(
        validatedData.videoId,
        validatedData.format,
        validatedData.quality
      );
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "Video file not found" });
      }
      
      // Set appropriate headers for the response
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      
      // Set content type based on format
      switch (validatedData.format) {
        case "mp4":
          res.setHeader("Content-Type", "video/mp4");
          break;
        case "mp3":
          res.setHeader("Content-Type", "audio/mpeg");
          break;
        case "webm":
          res.setHeader("Content-Type", "video/webm");
          break;
      }
      
      // Stream the file to the client
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
      
      // Handle errors during file streaming
      fileStream.on("error", (error) => {
        console.error("Error streaming file:", error);
        if (!res.headersSent) {
          res.status(500).json({ message: "Error streaming file" });
        }
      });
      
      // Files will be cleaned up by the scheduled cleanup process
      // No need to delete immediately after streaming
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid request parameters", 
          details: error.errors 
        });
      }
      
      console.error("Error processing video download:", error);
      
      if (error instanceof Error) {
        return res.status(500).json({ 
          message: "Failed to process video download", 
          details: error.message 
        });
      }
      
      res.status(500).json({ 
        message: "An unknown error occurred" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
