import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { tiktokUrlSchema, downloadOptionsSchema, insertDownloadHistorySchema } from "../shared/schema";
import { getTikTokVideoInfo, processTikTokVideo } from "./tiktok";
import path from "path";
import fs from "fs";
import { db } from "./db";
import { downloadsHistory } from "../shared/schema";

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
      
      // Additional required parameters for download history
      const videoUrl = req.query.videoUrl as string;
      const thumbnailUrl = req.query.thumbnailUrl as string;
      const title = req.query.title as string;
      const author = req.query.author as string;
      
      if (!videoUrl || !thumbnailUrl || !title || !author) {
        return res.status(400).json({ message: "Missing required video details" });
      }
      
      // Extract watermark and caption options from query parameters
      const watermarkOptions = req.query.watermark === 'true' ? {
        enabled: true,
        text: req.query.watermarkText as string,
        position: req.query.watermarkPosition as string
      } : undefined;

      const captionOptions = req.query.caption === 'true' ? {
        enabled: true,
        text: req.query.captionText as string,
        duration: req.query.captionDuration ? parseInt(req.query.captionDuration as string) : 5
      } : undefined;

      // Process the video with the selected format and quality
      const { filePath, fileName, fileSize } = await processTikTokVideo(
        validatedData.videoId,
        validatedData.format,
        validatedData.quality,
        watermarkOptions,
        captionOptions
      );
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "Video file not found" });
      }
      
      // Record download in history before sending response
      try {
        await db.insert(downloadsHistory).values({
          videoId: validatedData.videoId,
          videoUrl,
          thumbnailUrl,
          title,
          author,
          format: validatedData.format,
          quality: validatedData.quality,
          fileSize: fileSize || 0,
          ipAddress: req.ip || '127.0.0.1',
          userAgent: req.get('User-Agent') || 'Unknown'
        });
      } catch (dbError) {
        console.error("Failed to record download history:", dbError);
        // Continue with download even if recording history fails
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
      
      // Get file size and set Content-Length header for progress tracking
      const stats = fs.statSync(filePath);
      res.setHeader("Content-Length", stats.size);
      
      // Stream the file to the client
      const fileStream = fs.createReadStream(filePath);
      
      // Handle errors during file streaming
      fileStream.on("error", (error) => {
        console.error("Error streaming file:", error);
        if (!res.headersSent) {
          res.status(500).json({ message: "Error streaming file" });
        }
      });
      
      // Clean up file stream on response end
      res.on('close', () => {
        fileStream.destroy();
      });
      
      fileStream.pipe(res);
      
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
  
  // Get Recent Downloads
  app.get("/api/downloads/recent", async (req: Request, res: Response) => {
    try {
      // Get limit from query params, default to 10
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Get recent downloads from database (order by most recent)
      const recentDownloads = await db.query.downloadsHistory.findMany({
        orderBy: (downloads, { desc }) => [desc(downloads.downloadedAt)],
        limit
      });
      
      res.json(recentDownloads);
    } catch (error) {
      console.error("Error fetching recent downloads:", error);
      
      if (error instanceof Error) {
        return res.status(500).json({ 
          message: "Failed to fetch recent downloads", 
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
