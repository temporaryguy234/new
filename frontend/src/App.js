import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Input } from './components/ui/input';
import { Slider } from './components/ui/slider';
import { Badge } from './components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { Textarea } from './components/ui/textarea';
import { useToast } from './hooks/use-toast';
import { Toaster } from './components/ui/toaster';
import Lottie from 'lottie-react';
import {
  Search,
  Upload,
  FolderOpen,
  BookOpen,
  User,
  Play,
  Pause,
  RotateCcw,
  Download,
  Settings,
  Sparkles,
  Plus,
  Globe
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Sidebar = ({ activeTab, setActiveTab }) => {
  const sidebarItems = [
    { id: 'explore', label: 'Explore', icon: Globe },
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'upload', label: 'Upload', icon: Upload },
    { id: 'projects', label: 'My Projects', icon: FolderOpen },
    { id: 'exports', label: 'Exports', icon: Download },
    { id: 'brand', label: 'Brand Kits', icon: Settings }
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">MotionEdit</h1>
        </div>
      </div>
      
      <nav className="p-4">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left mb-1 transition-colors ${
                activeTab === item.id
                  ? 'bg-orange-100 text-orange-700 border-r-2 border-orange-500'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
      <div className="absolute bottom-6 left-4 right-4">
        <div className="flex items-center space-x-2 p-2">
          <User className="w-8 h-8 bg-gray-200 rounded-full p-1" />
          <div>
            <p className="text-sm font-medium">Demo User</p>
            <p className="text-xs text-gray-500">demo@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ExploreTab = ({ onOpenEditor }) => (
  <div className="max-w-4xl mx-auto">
    <div className="text-center py-16">
      <Badge className="bg-orange-100 text-orange-700 mb-4">New: Natural Language Editing</Badge>
      <h1 className="text-5xl font-bold text-gray-900 mb-4">
        Your Motion Graphics
      </h1>
      <h2 className="text-5xl font-bold text-orange-500 mb-6">
        Template Library
      </h2>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Browse and customize professional templates for YouTube, TikTok, and Instagram in minutes. No design experience required.
      </p>
      
      <div className="flex justify-center space-x-4 mb-16">
        <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg">
          Browse Templates →
        </Button>
        <Button variant="outline" size="lg" className="px-8 py-3 rounded-lg">
          Watch Demo
        </Button>
      </div>
    </div>
    
    <div className="grid grid-cols-4 gap-8 text-center mb-16">
      <div>
        <User className="w-12 h-12 text-orange-500 mx-auto mb-2" />
        <h3 className="text-2xl font-bold text-gray-900">10K+</h3>
        <p className="text-gray-600">Active Creators</p>
      </div>
      <div>
        <BookOpen className="w-12 h-12 text-blue-500 mx-auto mb-2" />
        <h3 className="text-2xl font-bold text-gray-900">500+</h3>
        <p className="text-gray-600">Templates</p>
      </div>
      <div>
        <Globe className="w-12 h-12 text-green-500 mx-auto mb-2" />
        <h3 className="text-2xl font-bold text-gray-900">95%</h3>
        <p className="text-gray-600">Time Saved</p>
      </div>
      <div>
        <Settings className="w-12 h-12 text-purple-500 mx-auto mb-2" />
        <h3 className="text-2xl font-bold text-gray-900">2 Min</h3>
        <p className="text-gray-600">Avg. Edit Time</p>
      </div>
    </div>
    
    <div className="text-center">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">Featured Templates</h3>
      <p className="text-gray-600 mb-8">Handpicked templates to get you started</p>
      <Button variant="outline" className="px-6 py-2 rounded-lg">
        View All Templates →
      </Button>
    </div>
  </div>
);

const LibraryTab = ({ animations, onOpenEditor, onDeleteAnimation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredAnimations = animations.filter(anim => 
    anim.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Template Library</h2>
        <p className="text-gray-600 mb-4">Browse and edit motion graphics templates</p>
        
        <div className="flex space-x-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            Search
          </Button>
        </div>
      </div>
      
      {filteredAnimations.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600 mb-6">Try adjusting your search or category filter</p>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            Upload Templates
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAnimations.map((animation) => (
            <Card key={animation.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  {animation.animationData ? (
                    <Lottie 
                      animationData={animation.animationData} 
                      loop={true}
                      style={{ width: '100%', height: '100%' }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                      <Play className="w-12 h-12 text-orange-500" />
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 truncate">{animation.name}</h3>
                <p className="text-sm text-gray-600 mb-3">Motion Template</p>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => onOpenEditor(animation)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onDeleteAnimation(animation.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const UploadTab = ({ onUploadAnimation }) => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid Lottie URL",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch animation');
      
      const animationData = await response.json();
      const name = `Animation ${Date.now()}`;
      
      await onUploadAnimation({ url, name, animationData });
      
      toast({
        title: "Success",
        description: "Animation uploaded successfully!"
      });
      setUrl('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload animation. Please check the URL.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Animation</h2>
        <p className="text-gray-600">Import Lottie files via URL to add to your library</p>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lottie Animation URL
              </label>
              <Input
                placeholder="https://lottie.host/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-1">
                Example: https://lottie.host/04d4df15-8ce7-44cd-ba10-26887e7da660/yxw7R5qwgE.json
              </p>
            </div>
            
            <Button 
              onClick={handleUpload} 
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isLoading ? 'Uploading...' : 'Upload Animation'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Quick Upload</h3>
        <p className="text-sm text-blue-700 mb-3">Try this sample animation:</p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setUrl('https://lottie.host/04d4df15-8ce7-44cd-ba10-26887e7da660/yxw7R5qwgE.json')}
        >
          Use Sample URL
        </Button>
      </div>
    </div>
  );
};

const Editor = ({ animation, onClose, onSave, onSaveAsProject }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState([1]);
  const [size, setSize] = useState([100]);
  const [rotation, setRotation] = useState([0]);
  const [opacity, setOpacity] = useState([100]);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAnimationData, setCurrentAnimationData] = useState(animation.animationData);
  const [originalAnimationData, setOriginalAnimationData] = useState(animation.originalData || animation.animationData);
  const [animationKey, setAnimationKey] = useState(0);
  const [lottieRef, setLottieRef] = useState(null);
  const { toast } = useToast();

  // Reset animation to original
  const handleReset = () => {
    console.log('🔥 RESETTING ANIMATION');
    setCurrentAnimationData(originalAnimationData);
    setAnimationKey(prev => prev + 1);
    setSpeed([1]);
    setSize([100]);
    setRotation([0]);
    setOpacity([100]);
    toast({
      title: "✅ Reset",
      description: "Animation reset to original"
    });
  };

  // Handle speed changes - FIXED
  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    console.log('🔥 SPEED CHANGE:', newSpeed[0]);
    
    // Create new animation data with modified frame rate
    if (currentAnimationData) {
      const modifiedData = { ...currentAnimationData };
      modifiedData.fr = (modifiedData.fr || 24) * newSpeed[0]; // Modify frame rate
      setCurrentAnimationData(modifiedData);
      setAnimationKey(prev => prev + 1);
    }
  };

  // Handle size changes - FIXED
  const handleSizeChange = (newSize) => {
    setSize(newSize);
    console.log('🔥 SIZE CHANGE:', newSize[0]);
    
    if (currentAnimationData) {
      const scaleMultiplier = newSize[0] / 100;
      const modifiedData = JSON.parse(JSON.stringify(currentAnimationData)); // Deep copy
      
      // Scale the entire animation
      if (modifiedData.w) modifiedData.w *= scaleMultiplier;
      if (modifiedData.h) modifiedData.h *= scaleMultiplier;
      
      // Scale all layers
      if (modifiedData.layers) {
        modifiedData.layers.forEach(layer => {
          if (layer.ks && layer.ks.s && layer.ks.s.k) {
            if (Array.isArray(layer.ks.s.k)) {
              layer.ks.s.k[0] *= scaleMultiplier;
              layer.ks.s.k[1] *= scaleMultiplier;
            }
          }
        });
      }
      
      setCurrentAnimationData(modifiedData);
      setAnimationKey(prev => prev + 1);
    }
  };

  // Handle play/pause
  const handlePlayPause = () => {
    const newPlaying = !isPlaying;
    setIsPlaying(newPlaying);
  };

  const handleSaveAsProject = async () => {
    try {
      const projectData = {
        name: `${animation.name} - Project ${Date.now()}`,
        templateId: animation.id,
        animationData: currentAnimationData,
        settings: { speed: speed[0], size: size[0], rotation: rotation[0], opacity: opacity[0] }
      };
      
      await onSaveAsProject(projectData);
      toast({
        title: "✅ Project Saved",
        description: "Your project has been saved to My Projects!"
      });
    } catch (error) {
      toast({
        title: "❌ Error",
        description: "Failed to save project.",
        variant: "destructive"
      });
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await axios.post(`${API}/export`, {
        animationData: currentAnimationData,
        format: format,
        animationId: animation.id
      });
      
      if (response.data.success) {
        if (format === 'json') {
          // Download JSON file
          const blob = new Blob([JSON.stringify(response.data.data, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = response.data.filename;
          a.click();
          URL.revokeObjectURL(url);
        }
        
        toast({
          title: "✅ Export Success",
          description: response.data.message || `Exported as ${format.toUpperCase()}`
        });
      }
    } catch (error) {
      toast({
        title: "❌ Export Failed",
        description: "Failed to export animation",
        variant: "destructive"
      });
    }
  };

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) return;
    
    setIsProcessing(true);
    try {
      console.log('🔥 SENDING AI REQUEST:', {
        prompt,
        currentData: currentAnimationData
      });
      
      const response = await axios.post(`${API}/animations/edit`, {
        animationData: currentAnimationData,
        prompt: prompt,
        animationId: animation.id
      });
      
      console.log('🔥 AI RESPONSE RECEIVED:', response.data);
      
      if (response.data.success && response.data.animationData) {
        console.log('🔥 UPDATING ANIMATION DATA');
        console.log('Old data:', JSON.stringify(currentAnimationData).substring(0, 200));
        console.log('New data:', JSON.stringify(response.data.animationData).substring(0, 200));
        
        // FORCE UPDATE
        setCurrentAnimationData(response.data.animationData);
        setAnimationKey(prev => prev + 1);
        
        // Force a complete re-render after a small delay
        setTimeout(() => {
          setAnimationKey(prev => prev + 1);
        }, 100);
        
        toast({
          title: "✅ AI Success",
          description: `Command "${prompt}" applied successfully!`
        });
        setPrompt('');
      } else {
        console.log('🔥 AI RESPONSE NOT SUCCESSFUL:', response.data);
        toast({
          title: "⚠️ No Changes",
          description: "AI processed but no changes detected",
          variant: "default"
        });
        setPrompt('');
      }
    } catch (error) {
      console.error('🔥 AI ERROR:', error);
      toast({
        title: "❌ Error",
        description: `Failed: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
    if (!prompt.trim()) return;
    
    setIsProcessing(true);
    try {
      console.log('🔥 SENDING AI REQUEST:', {
        prompt,
        currentData: currentAnimationData
      });
      
      const response = await axios.post(`${API}/animations/edit`, {
        animationData: currentAnimationData,
        prompt: prompt,
        animationId: animation.id
      });
      
      console.log('🔥 AI RESPONSE RECEIVED:', response.data);
      
      if (response.data.success && response.data.animationData) {
        console.log('🔥 UPDATING ANIMATION DATA');
        console.log('Old data:', JSON.stringify(currentAnimationData).substring(0, 200));
        console.log('New data:', JSON.stringify(response.data.animationData).substring(0, 200));
        
        // FORCE UPDATE
        setCurrentAnimationData(response.data.animationData);
        setAnimationKey(prev => prev + 1);
        
        // Force a complete re-render after a small delay
        setTimeout(() => {
          setAnimationKey(prev => prev + 1);
        }, 100);
        
        toast({
          title: "✅ AI Success",
          description: `Command "${prompt}" applied successfully!`
        });
        setPrompt('');
      } else {
        console.log('🔥 AI RESPONSE NOT SUCCESSFUL:', response.data);
        toast({
          title: "⚠️ No Changes",
          description: "AI processed but no changes detected",
          variant: "default"
        });
        setPrompt('');
      }
    } catch (error) {
      console.error('🔥 AI ERROR:', error);
      toast({
        title: "❌ Error",
        description: `Failed: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    try {
      await onSave({
        ...animation,
        animationData: currentAnimationData,
        settings: { speed: speed[0], size: size[0], rotation: rotation[0], opacity: opacity[0] }
      });
      toast({
        title: "Success",
        description: "Project saved successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project.",
        variant: "destructive"
      });
    }
  };

  const handleExport = async (format) => {
    toast({
      title: "Export Started",
      description: `Exporting animation as ${format.toUpperCase()}...`
    });
    // Export functionality will be implemented here
  };

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onClose}>
            ← Back
          </Button>
          <h1 className="text-lg font-semibold">{animation.name}</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button onClick={handleReset} variant="outline" className="bg-gray-500 hover:bg-gray-600 text-white">
            Reset
          </Button>
          <Button onClick={handleSaveAsProject} className="bg-green-500 hover:bg-green-600 text-white">
            Save as Project
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                Export
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Animation</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Button onClick={() => handleExport('mp4')} className="w-full">
                  Export as MP4
                </Button>
                <Button onClick={() => handleExport('gif')} className="w-full">
                  Export as GIF
                </Button>
                <Button onClick={() => handleExport('json')} className="w-full">
                  Export as JSON
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="ghost">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Main Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Playback Controls */}
          <div className="h-16 border-b border-gray-200 flex items-center justify-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePlayPause}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <span className="text-sm text-gray-600">Speed: {speed[0]}x</span>
            <div className="w-24">
              <Slider
                value={speed}
                onValueChange={handleSpeedChange}
                max={3}
                min={0.1}
                step={0.1}
              />
            </div>
          </div>

          {/* Animation Preview */}
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div 
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              style={{
                transform: `scale(${size[0] / 100}) rotate(${rotation[0]}deg)`,
                opacity: opacity[0] / 100
              }}
            >
              {currentAnimationData && (
                <Lottie
                  key={animationKey}
                  animationData={currentAnimationData}
                  loop={true}
                  autoplay={isPlaying}
                  style={{ width: 400, height: 400 }}
                  lottieRef={(instance) => {
                    console.log('🔥 LOTTIE REF SET:', instance);
                    if (instance) {
                      setLottieRef(instance);
                      console.log('🔥 LOTTIE METHODS:', Object.keys(instance));
                      
                      // Try to set initial speed
                      setTimeout(() => {
                        if (speed[0] !== 1) {
                          try {
                            if (typeof instance.setSpeed === 'function') {
                              instance.setSpeed(speed[0]);
                            } else if (instance.setPlaybackRate) {
                              instance.setPlaybackRate(speed[0]);
                            }
                          } catch (e) {
                            console.error('🔥 INITIAL SPEED ERROR:', e);
                          }
                        }
                      }, 100);
                    }
                  }}
                />
              )}
            </div>
          </div>

          {/* AI Prompt Box */}
          <div className="h-32 border-t border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold text-gray-900">AI Editor</h3>
            </div>
            <div className="flex space-x-2">
              <Textarea
                placeholder="Try specific commands like: 'change green color to blue', 'replace 2019 with 2024', 'make the animation 50% bigger', 'change the text to Hello World'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 resize-none"
                rows={2}
              />
              <Button
                onClick={handlePromptSubmit}
                disabled={isProcessing || !prompt.trim()}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6"
              >
                {isProcessing ? 'Processing...' : 'Apply'}
              </Button>
            </div>
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-80 border-l border-gray-200 p-6 bg-white">
          <h3 className="font-semibold text-gray-900 mb-4">Properties</h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Canvas</label>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-600">Background Color</label>
                  <input type="color" className="w-full h-8 rounded border" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Width</label>
                  <input type="number" value="298" className="w-full px-2 py-1 border rounded text-sm" />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Height</label>
                  <input type="number" value="304" className="w-full px-2 py-1 border rounded text-sm" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Animation</label>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Playback Speed</label>
                  <Slider
                    value={speed}
                    onValueChange={handleSpeedChange}
                    max={3}
                    min={0.1}
                    step={0.1}
                    className="mb-1"
                  />
                  <div className="text-right text-xs text-gray-500">{speed[0]}x</div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Size</label>
                  <Slider
                    value={size}
                    onValueChange={handleSizeChange}
                    max={200}
                    min={10}
                    step={5}
                    className="mb-1"
                  />
                  <div className="text-right text-xs text-gray-500">{size[0]}%</div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Rotation</label>
                  <Slider
                    value={rotation}
                    onValueChange={setRotation}
                    max={360}
                    min={-360}
                    step={1}
                    className="mb-1"
                  />
                  <div className="text-right text-xs text-gray-500">{rotation[0]}°</div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-2 block">Opacity</label>
                  <Slider
                    value={opacity}
                    onValueChange={setOpacity}
                    max={100}
                    min={0}
                    step={1}
                    className="mb-1"
                  />
                  <div className="text-right text-xs text-gray-500">{opacity[0]}%</div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Template Info</label>
              <div className="text-sm text-gray-600 space-y-1">
                <p>ID: {animation.id.substring(0, 8)}...</p>
                <p>Category: Motion Graphics</p>
                <p>Tags: imported, lottie</p>
                <p>Dimensions: 298×304</p>
                <p>Frame Rate: 24fps</p>
                <p>Layers: 4</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState('explore');
  const [animations, setAnimations] = useState([]);
  const [selectedAnimation, setSelectedAnimation] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Load animations from API
  useEffect(() => {
    const loadAnimations = async () => {
      try {
        const response = await axios.get(`${API}/animations`);
        setAnimations(response.data);
      } catch (error) {
        console.error('Failed to load animations:', error);
      }
    };
    loadAnimations();
  }, []);

  const handleUploadAnimation = async (animationData) => {
    try {
      const response = await axios.post(`${API}/animations`, animationData);
      setAnimations(prev => [...prev, response.data]);
      setActiveTab('library');
    } catch (error) {
      console.error('Failed to upload animation:', error);
      throw error;
    }
  };

  const handleDeleteAnimation = async (id) => {
    try {
      await axios.delete(`${API}/animations/${id}`);
      setAnimations(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('Failed to delete animation:', error);
    }
  };

  const handleOpenEditor = (animation) => {
    setSelectedAnimation(animation);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedAnimation(null);
  };

  const handleSaveProject = async (updatedAnimation) => {
    try {
      await axios.put(`${API}/animations/${updatedAnimation.id}`, updatedAnimation);
      setAnimations(prev => prev.map(a => a.id === updatedAnimation.id ? updatedAnimation : a));
    } catch (error) {
      console.error('Failed to save project:', error);
      throw error;
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'explore':
        return <ExploreTab onOpenEditor={handleOpenEditor} />;
      case 'library':
        return (
          <LibraryTab
            animations={animations}
            onOpenEditor={handleOpenEditor}
            onDeleteAnimation={handleDeleteAnimation}
          />
        );
      case 'upload':
        return <UploadTab onUploadAnimation={handleUploadAnimation} />;
      case 'projects':
        return <div className="text-center py-16 text-gray-500">My Projects - Coming Soon</div>;
      case 'exports':
        return <div className="text-center py-16 text-gray-500">Exports - Coming Soon</div>;
      case 'brand':
        return <div className="text-center py-16 text-gray-500">Brand Kits - Coming Soon</div>;
      default:
        return <ExploreTab onOpenEditor={handleOpenEditor} />;
    }
  };

  if (isEditorOpen && selectedAnimation) {
    return (
      <Editor
        animation={selectedAnimation}
        onClose={handleCloseEditor}
        onSave={handleSaveProject}
      />
    );
  }

  return (
    <div className="App bg-gray-50 min-h-screen">
      <BrowserRouter>
        <div className="flex">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="ml-64 flex-1 p-8">
            {renderContent()}
          </main>
        </div>
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;