import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

const yogaPoses = [
  { value: "adho_mukha_svanasana", label: "Adho Mukha Svanasana" },
  { value: "alonasana", label: "Alonasana" },
  { value: "anjaneyasana", label: "Anjaneyasana" },
  // Add more poses as needed
];

const Index = () => {
  const { toast } = useToast();
  const [selectedPose, setSelectedPose] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamRef.current = stream;
      setIsRecording(true);
      toast({
        title: "Camera Started",
        description: "Your camera feed is now active.",
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not access camera. Please check permissions.",
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setDuration(0);
      toast({
        title: "Recording Stopped",
        description: "Your session has been ended.",
      });
    }
  };

  const handlePoseSelect = (value: string) => {
    setSelectedPose(value);
    toast({
      title: "Pose Selected",
      description: `Selected pose: ${yogaPoses.find(pose => pose.value === value)?.label}`,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Yoga Pose Validator</h1>
          <p className="text-gray-600">Select a pose and start practicing</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 space-y-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                Select Yoga Pose
              </label>
              <Select onValueChange={handlePoseSelect} value={selectedPose}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a pose" />
                </SelectTrigger>
                <SelectContent>
                  {yogaPoses.map((pose) => (
                    <SelectItem key={pose.value} value={pose.value}>
                      {pose.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={startCamera}
                disabled={!selectedPose || isRecording}
                className="flex-1"
              >
                Start
              </Button>
              <Button
                onClick={stopCamera}
                disabled={!isRecording}
                variant="destructive"
                className="flex-1"
              >
                Stop
              </Button>
            </div>

            {isRecording && (
              <div className="text-center">
                <p className="text-2xl font-semibold text-gray-700">
                  Duration: {formatTime(duration)}
                </p>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;