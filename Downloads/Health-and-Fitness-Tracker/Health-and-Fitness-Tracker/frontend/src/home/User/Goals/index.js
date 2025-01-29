import React from 'react';
import { Card } from 'react-bootstrap';

const WorkoutThumbnail = ({ fitnessGoal, intensity }) => {
  const workoutData = {
    'Weight Loss': {
      beginner: [
        { id: 1, title: 'Weight Loss - Beginner 1', duration: '15 min', videoId: 'UNgUVmefuZ0' },
        { id: 2, title: 'Weight Loss - Beginner 2', duration: '25 min', videoId: 'cbKkB3POqaY' },
      ],
      intense: [
        { id: 3, title: 'Weight Loss - Intense 1', duration: '15 min', videoId: 'J212vz33gU4' },
        { id: 4, title: 'Weight Loss - Intense 2', duration: '30 min', videoId: 'kg5hXfcVm6g' },
      ],
    },
    'Bodybuilding': {
      beginner: [
        { id: 5, title: 'Bodybuilding - Beginner 1', duration: '20 min', videoId: 'Sou12pLJFCc' },
        { id: 6, title: 'Bodybuilding - Beginner 2', duration: '25 min', videoId: '47Dt93KB3T4' },
      ],
      intense: [
        { id: 7, title: 'Bodybuilding - Intense 1', duration: '40 min', videoId: 'l0gDqsSUtWo' },
        { id: 8, title: 'Bodybuilding - Intense 2', duration: '50 min', videoId: '5S19yI-NdUk' },
      ],
    },
    'Cardiovascular Fitness': {
      beginner: [
        { id: 9, title: 'Cardio - Beginner 1', duration: '15 min', videoId: 'z7PGuInGMZ4' },
        { id: 10, title: 'Cardio - Beginner 2', duration: '25 min', videoId: 'cZyHgKtK75A' },
      ],
      intense: [
        { id: 11, title: 'Cardio - Intense 1', duration: '35 min', videoId: 'kZDvg92tTMc' },
        { id: 12, title: 'Cardio - Intense 2', duration: '45 min', videoId: 'v3SGmJPDNVw' },
      ],
    },
    'Overall Health and Wellness': {
      beginner: [
        { id: 13, title: 'Wellness - Beginner 1', duration: '20 min', videoId: '149Iac5fmoE' },
        { id: 14, title: 'Wellness - Beginner 2', duration: '30 min', videoId: 'm756Gz8de4M' },
      ],
      intense: [
        { id: 15, title: 'Wellness - Intense 1', duration: '40 min', videoId: 'M6i5ZhPXudw' },
        { id: 16, title: 'Wellness - Intense 2', duration: '50 min', videoId: 'KNxIQAp-1yU' },
      ],
    },
  };

  const selectedWorkouts =
    workoutData[fitnessGoal] && workoutData[fitnessGoal][intensity]
      ? workoutData[fitnessGoal][intensity]
      : [];

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {selectedWorkouts.map((workout) => (
        <Card key={workout.id} style={{ width: '18rem', margin: '10px' }}>
          <iframe
            width="100%"
            height="150"
            src={`https://www.youtube.com/embed/${workout.videoId}`}
            title={workout.title}
            frameBorder="0"
            allowFullScreen
          ></iframe>
          <Card.Body>
            <Card.Title>{workout.title}</Card.Title>
            <Card.Text>{workout.duration}</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default WorkoutThumbnail;
