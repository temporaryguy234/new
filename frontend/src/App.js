import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
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
  Download,
  Settings,
  Sparkles,
  Globe,
  RotateCw
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

const ExploreTab = () => (
  <div className="max-w-4xl mx-auto">
    <div className="text-center py-16">
      <Badge className="bg-orange-100 text-orange-700 mb-4">New: AI-Powered Editing</Badge>
      <h1 className="text-5xl font-bold text-gray-900 mb-4">Your Motion Graphics</h1>
      <h2 className="text-5xl font-bold text-orange-500 mb-6">Template Library</h2>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Create and edit professional motion graphics with AI. Change colors, replace text, modify animations instantly with natural language.
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
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">Search</Button>
        </div>
      </div>
      
      {filteredAnimations.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600 mb-6">Upload Lottie templates to get started</p>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">Upload Templates</Button>
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
                <p className="text-sm text-gray-600 mb-3">Template</p>
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

const MyProjectsTab = ({ projects, onOpenProject, onDeleteProject }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProjects = projects.filter(proj => 
    proj.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Projects</h2>
        <p className="text-gray-600 mb-4">Your saved motion graphics projects</p>
        
        <div className="flex space-x-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">Search</Button>
        </div>
      </div>
      
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects yet</h3>
          <p className="text-gray-600 mb-6">Create your first project by editing a template</p>
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">Browse Templates</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="cursor-pointer hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                  {project.animationData ? (
                    <Lottie 
                      animationData={project.animationData} 
                      loop={true}
                      style={{ width: '100%', height: '100%' }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
                      <Play className="w-12 h-12 text-green-500" />
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 truncate">{project.name}</h3>
                <p className="text-sm text-gray-600 mb-3">Project</p>
                <div className="flex space-x-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => onOpenProject(project)}
                  >
                    Edit
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onDeleteProject(project.id)}
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
      const name = `Template ${Date.now()}`;
      
      await onUploadAnimation({ url, name, animationData });
      
      toast({
        title: "Success",
        description: "Template uploaded successfully!"
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Template</h2>
        <p className="text-gray-600">Import Lottie files via URL to add to your template library</p>
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
            </div>
            
            <Button 
              onClick={handleUpload} 
              disabled={isLoading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isLoading ? 'Uploading...' : 'Upload Template'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Sample Templates</h3>
        <p className="text-sm text-blue-700 mb-3">Try these sample animations:</p>
        <div className="space-y-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setUrl('https://lottie.host/04d4df15-8ce7-44cd-ba10-26887e7da660/yxw7R5qwgE.json')}
            className="w-full text-left"
          >
            Green Clover Animation
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setUrl('https://lottie.host/40c82ba8-6b3d-4e56-a959-61eb10c21375/0LhZiiaGbT.json')}
            className="w-full text-left"
          >
            Chart Animation
          </Button>
        </div>
      </div>
    </div>
  );
};

const Editor = ({ animation, onClose, onSaveAsProject, isProject = false }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState([1]);
  const [size, setSize] = useState([100]);
  const [rotation, setRotation] = useState([0]);
  const [opacity, setOpacity] = useState([100]);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAnimationData, setCurrentAnimationData] = useState(animation.animationData);
  const [originalAnimationData] = useState(JSON.parse(JSON.stringify(animation.animationData)));
  const [animationKey, setAnimationKey] = useState(0);
  const [lottieRef, setLottieRef] = useState(null);
  const { toast } = useToast();

  // Reset animation to original
  const handleReset = () => {
    console.log('🔄 RESETTING TO ORIGINAL');
    setCurrentAnimationData(JSON.parse(JSON.stringify(originalAnimationData)));
    setAnimationKey(prev => prev + 1);
    setSpeed([1]);
    setSize([100]);
    setRotation([0]);
    setOpacity([100]);
    setPrompt('');
    toast({
      title: "✅ Reset Complete",
      description: "Animation reset to original template"
    });
  };

  // Handle speed changes - affects playback
  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
    if (lottieRef && lottieRef.setSpeed) {
      lottieRef.setSpeed(newSpeed[0]);
    }
  };

  // Handle play/pause
  const handlePlayPause = () => {
    const newPlaying = !isPlaying;
    setIsPlaying(newPlaying);
    if (lottieRef) {
      if (newPlaying) {
        lottieRef.play();
      } else {
        lottieRef.pause();
      }
    }
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
        description: "Export failed. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handlePromptSubmit = async () => {
    if (!prompt.trim()) return;
    
    setIsProcessing(true);
    console.log('🚀 SENDING AI REQUEST:', prompt);
    
    try {
      const response = await axios.post(`${API}/animations/edit`, {
        animationData: currentAnimationData,
        prompt: prompt.trim(),
        animationId: animation.id
      });
      
      console.log('🎯 AI RESPONSE:', response.data);
      
      if (response.data.success && response.data.animationData) {
        console.log('✅ APPLYING AI CHANGES');
        setCurrentAnimationData(response.data.animationData);
        setAnimationKey(prev => prev + 1);
        
        toast({
          title: "✅ AI Success",
          description: `"${prompt}" applied successfully!`
        });
        setPrompt('');
      } else {
        console.log('⚠️ NO CHANGES DETECTED');
        toast({
          title: "⚠️ No Changes",
          description: "AI processed but couldn't make changes. Try a different command.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('❌ AI ERROR:', error);
      toast({
        title: "❌ AI Error",
        description: `Failed to process: ${error.response?.data?.detail || error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onClose}>← Back</Button>
          <h1 className="text-lg font-semibold">{animation.name}</h1>
          <Badge variant="outline">{isProject ? 'Project' : 'Template'}</Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button onClick={handleReset} variant="outline" className="bg-gray-500 hover:bg-gray-600 text-white">
            <RotateCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          {!isProject && (
            <Button onClick={handleSaveAsProject} className="bg-green-500 hover:bg-green-600 text-white">
              Save as Project
            </Button>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">Export</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Animation</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Button onClick={() => handleExport('mp4')} className="w-full">Export as MP4</Button>
                <Button onClick={() => handleExport('gif')} className="w-full">Export as GIF</Button>
                <Button onClick={() => handleExport('json')} className="w-full">Export as JSON</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Main Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Playback Controls */}
          <div className="h-16 border-b border-gray-200 flex items-center justify-center space-x-4">
            <Button variant="ghost" size="sm" onClick={handlePlayPause}>
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

          {/* Animation Preview - FIXED SIZE CONTAINER */}
          <div className="flex-1 flex items-center justify-center bg-gray-50 p-8">
            <div className="w-96 h-96 bg-white rounded-lg shadow-lg flex items-center justify-center overflow-hidden">
              {currentAnimationData && (
                <div 
                  style={{
                    transform: `scale(${size[0] / 100}) rotate(${rotation[0]}deg)`,
                    opacity: opacity[0] / 100,
                    maxWidth: '100%',
                    maxHeight: '100%'
                  }}
                >
                  <Lottie
                    key={animationKey}
                    animationData={currentAnimationData}
                    loop={true}
                    autoplay={isPlaying}
                    style={{ width: 350, height: 350 }}
                    lottieRef={setLottieRef}
                  />
                </div>
              )}
            </div>
          </div>

          {/* AI Prompt Box */}
          <div className="h-40 border-t border-gray-200 p-6 bg-gradient-to-r from-orange-50 to-red-50">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold text-gray-900">AI Editor</h3>
              <Badge className="bg-orange-100 text-orange-700">✨ Powered by Gemini</Badge>
            </div>
            <div className="flex space-x-3">
              <Textarea
                placeholder="Try: 'delete Longs', 'change green clover to blue', 'replace Longs with Hello', 'make text bigger', 'change clover color to red'"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="flex-1 resize-none bg-white"
                rows={3}
              />
              <Button
                onClick={handlePromptSubmit}
                disabled={isProcessing || !prompt.trim()}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 self-start"
              >
                {isProcessing ? 'Processing...' : 'Apply AI'}
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
                  <label className="text-sm text-gray-600">Width: 350px</label>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Height: 350px</label>
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
                  <label className="text-sm text-gray-600 mb-2 block">Size Scale</label>
                  <Slider
                    value={size}
                    onValueChange={setSize}
                    max={150}
                    min={25}
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
                <p>ID: {animation.id?.substring(0, 8)}...</p>
                <p>Type: {isProject ? 'Project' : 'Template'}</p>
                <p>Frame Rate: {Math.round(currentAnimationData?.fr || 24)}fps</p>
                <p>Layers: {currentAnimationData?.layers?.length || 0}</p>
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
  const [projects, setProjects] = useState([]);
  const [selectedAnimation, setSelectedAnimation] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(false);

  // Load animations and projects
  useEffect(() => {
    const loadData = async () => {
      try {
        const [animationsRes, projectsRes] = await Promise.all([
          axios.get(`${API}/animations`),
          axios.get(`${API}/projects`).catch(() => ({ data: [] }))
        ]);
        setAnimations(animationsRes.data);
        setProjects(projectsRes.data);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    loadData();
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

  const handleSaveAsProject = async (projectData) => {
    try {
      const response = await axios.post(`${API}/projects`, projectData);
      setProjects(prev => [...prev, response.data]);
      setActiveTab('projects');
    } catch (error) {
      console.error('Failed to save project:', error);
      throw error;
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      await axios.delete(`${API}/projects/${id}`);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleOpenEditor = (animation, isProject = false) => {
    setSelectedAnimation(animation);
    setEditingProject(isProject);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedAnimation(null);
    setEditingProject(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'explore':
        return <ExploreTab />;
      case 'library':
        return (
          <LibraryTab
            animations={animations}
            onOpenEditor={(anim) => handleOpenEditor(anim, false)}
            onDeleteAnimation={handleDeleteAnimation}
          />
        );
      case 'upload':
        return <UploadTab onUploadAnimation={handleUploadAnimation} />;
      case 'projects':
        return (
          <MyProjectsTab
            projects={projects}
            onOpenProject={(proj) => handleOpenEditor(proj, true)}
            onDeleteProject={handleDeleteProject}
          />
        );
      case 'exports':
        return <div className="text-center py-16 text-gray-500">Exports - Coming Soon</div>;
      case 'brand':
        return <div className="text-center py-16 text-gray-500">Brand Kits - Coming Soon</div>;
      default:
        return <ExploreTab />;
    }
  };

  if (isEditorOpen && selectedAnimation) {
    return (
      <Editor
        animation={selectedAnimation}
        onClose={handleCloseEditor}
        onSaveAsProject={handleSaveAsProject}
        isProject={editingProject}
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