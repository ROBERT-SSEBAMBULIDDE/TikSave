import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FAIcon } from '@/components/ui/fa-icon';
import { VideoData, VideoQuality } from '@/lib/types';

interface VideoPlayerProps {
  videoData: VideoData;
  quality: VideoQuality;
}

export function VideoPlayer({ videoData, quality }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isControlsVisible, setIsControlsVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const progressTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Initialize video
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.volume = volume;
      
      const handleLoadedMetadata = () => {
        setDuration(video.duration);
        setIsLoading(false);
      };
      
      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime);
        setProgress((video.currentTime / video.duration) * 100);
      };
      
      const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
        if (video) {
          video.currentTime = 0;
        }
      };
      
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('ended', handleEnded);
      
      return () => {
        video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('ended', handleEnded);
      };
    }
  }, [volume]);
  
  // Auto-hide controls after inactivity
  useEffect(() => {
    if (isControlsVisible && isPlaying) {
      if (progressTimeout.current) {
        clearTimeout(progressTimeout.current);
      }
      
      progressTimeout.current = setTimeout(() => {
        setIsControlsVisible(false);
      }, 3000);
    }
    
    return () => {
      if (progressTimeout.current) {
        clearTimeout(progressTimeout.current);
      }
    };
  }, [isControlsVisible, isPlaying]);
  
  // Handle fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // Play/Pause toggle
  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play();
      setIsPlaying(true);
    }
  };
  
  // Show controls on mouse move
  const handleMouseMove = () => {
    setIsControlsVisible(true);
  };
  
  // Update volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };
  
  // Seek to position
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };
  
  // Format time display (mm:ss)
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!videoContainerRef.current) return;
    
    if (!document.fullscreenElement) {
      videoContainerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };
  
  return (
    <div 
      ref={videoContainerRef}
      className="relative rounded-lg overflow-hidden bg-black w-full aspect-[9/16]"
      onMouseMove={handleMouseMove}
    >
      {/* Video Thumbnail (shown before playing) */}
      {!isPlaying && (
        <div className="absolute inset-0 z-10">
          <img 
            src={videoData.thumbnailUrl} 
            alt={videoData.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <Button
              onClick={togglePlayPause}
              className="bg-blue-600 hover:bg-blue-700 text-white w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-lg"
            >
              <FAIcon icon="play" className="text-xl ml-1" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        src={`/api/tiktok/download?videoId=${videoData.id}&format=mp4&quality=${quality}`}
        onClick={togglePlayPause}
        playsInline
      />
      
      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
      
      {/* Video Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3 transition-opacity duration-300 z-20 ${
          isControlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <div className="mb-2 flex items-center">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-400 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        {/* Controls Row */}
        <div className="flex items-center justify-between">
          {/* Left Controls */}
          <div className="flex items-center space-x-3">
            <Button
              onClick={togglePlayPause}
              variant="ghost"
              className="text-white h-8 w-8 p-0 rounded-full"
            >
              <FAIcon icon={isPlaying ? 'pause' : 'play'} />
            </Button>
            
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                className="text-white h-8 w-8 p-0 rounded-full"
                onClick={() => {
                  setVolume(v => (v === 0 ? 0.5 : 0));
                  if (videoRef.current) {
                    videoRef.current.volume = volume === 0 ? 0.5 : 0;
                  }
                }}
              >
                <FAIcon 
                  icon={
                    volume === 0 
                      ? 'volume-mute' 
                      : volume < 0.5 
                        ? 'volume-down'
                        : 'volume-up'
                  } 
                />
              </Button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-gray-400 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <span className="text-white text-xs">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          
          {/* Right Controls */}
          <div>
            <Button
              onClick={toggleFullscreen}
              variant="ghost"
              className="text-white h-8 w-8 p-0 rounded-full"
            >
              <FAIcon icon={isFullscreen ? 'compress' : 'expand'} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
