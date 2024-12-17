const API_URL = 'http://localhost:5000';

export const sendPoseData = async (poseData: any) => {
  try {
    const response = await fetch(`${API_URL}/validate-pose`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(poseData),
    });
    return await response.json();
  } catch (error) {
    console.error('Error sending pose data:', error);
    throw error;
  }
};